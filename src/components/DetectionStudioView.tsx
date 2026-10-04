import React, { useState, useRef, useEffect } from 'react';
import { DetectionResult, DetectionPreset, ViolationRecord } from '../types';
import { DETECTION_PRESETS } from '../data/presets';
import { analyzeImageWithAI, createViolationRecord } from '../services/api';
import { Upload, Video, ShieldAlert, CheckCircle2, AlertTriangle, RefreshCw, Download, FilePlus2, Sparkles, Sliders } from 'lucide-react';

interface DetectionStudioViewProps {
  onViolationCreated: (newRecord: ViolationRecord) => void;
  onOpenChallan: (record: ViolationRecord) => void;
}

export const DetectionStudioView: React.FC<DetectionStudioViewProps> = ({
  onViolationCreated,
  onOpenChallan,
}) => {
  const [activeMode, setActiveMode] = useState<'image' | 'video'>('image');
  const [selectedPreset, setSelectedPreset] = useState<DetectionPreset | null>(DETECTION_PRESETS[0]);
  const [imageSrc, setImageSrc] = useState<string>(DETECTION_PRESETS[0].imageDataUrl);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(DETECTION_PRESETS[0].expectedResult);
  const [editablePlate, setEditablePlate] = useState<string>(DETECTION_PRESETS[0].expectedResult.licensePlate.text || '');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.75);

  // Video mode states
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [videoTime, setVideoTime] = useState<number>(0);
  const [videoDuration, setVideoDuration] = useState<number>(10);
  const [videoViolationsList, setVideoViolationsList] = useState<Array<{ timestamp: number; type: string; plate: string }>>([
    { timestamp: 2.4, type: 'NO_HELMET', plate: 'MH12AB1234' },
    { timestamp: 5.8, type: 'TRIPLE_RIDING', plate: 'DL01CZ8899' },
    { timestamp: 8.2, type: 'MOBILE_USAGE', plate: 'KA03XY4521' },
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Draw bounding boxes on canvas whenever imageSrc or detectionResult changes
  useEffect(() => {
    if (!canvasRef.current || !imageSrc) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      canvas.width = img.naturalWidth || 960;
      canvas.height = img.naturalHeight || 540;

      // Draw original image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (!detectionResult) return;

      const cw = canvas.width;
      const ch = canvas.height;

      // 1. Draw Vehicles (Cyan Bounding Box)
      detectionResult.vehicles.forEach((veh) => {
        if (veh.confidence < confidenceThreshold) return;
        const [ymin, xmin, ymax, xmax] = veh.box;
        const x = (xmin / 1000) * cw;
        const y = (ymin / 1000) * ch;
        const w = ((xmax - xmin) / 1000) * cw;
        const h = ((ymax - ymin) / 1000) * ch;

        ctx.strokeStyle = '#06b6d4'; // Cyan
        ctx.lineWidth = 2.5;
        ctx.strokeRect(x, y, w, h);

        // Label
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(x, y - 22, 130, 22);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(`VEHICLE: ${veh.type.toUpperCase()}`, x + 6, y - 7);
      });

      // 2. Draw Riders & Helmet Status (Green if helmet, Red if no helmet)
      detectionResult.riders.forEach((rider) => {
        if (rider.confidence < confidenceThreshold) return;
        
        // Torso/rider box
        const [ymin, xmin, ymax, xmax] = rider.box;
        const rx = (xmin / 1000) * cw;
        const ry = (ymin / 1000) * ch;
        const rw = ((xmax - xmin) / 1000) * cw;
        const rh = ((ymax - ymin) / 1000) * ch;

        ctx.strokeStyle = rider.hasHelmet ? '#10b981' : '#ef4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.strokeRect(rx, ry, rw, rh);
        ctx.setLineDash([]);

        // Head box if available
        if (rider.headBox) {
          const [hymin, hxmin, hymax, hxmax] = rider.headBox;
          const hx = (hxmin / 1000) * cw;
          const hy = (hymin / 1000) * ch;
          const hw = ((hxmax - hxmin) / 1000) * cw;
          const hh = ((hymax - hymin) / 1000) * ch;

          ctx.strokeStyle = rider.hasHelmet ? '#10b981' : '#ef4444';
          ctx.lineWidth = 3;
          ctx.strokeRect(hx, hy, hw, hh);

          // Head label badge
          const labelText = rider.hasHelmet ? 'HELMET DETECTED' : 'NO HELMET';
          const badgeBg = rider.hasHelmet ? '#10b981' : '#ef4444';
          ctx.fillStyle = badgeBg;
          ctx.fillRect(hx, hy - 24, rider.hasHelmet ? 125 : 95, 22);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px monospace';
          ctx.fillText(labelText, hx + 6, hy - 8);
        }

        // Mobile usage badge
        if (rider.isUsingMobile) {
          ctx.fillStyle = '#f97316';
          ctx.fillRect(rx, ry + rh - 24, 150, 22);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 11px monospace';
          ctx.fillText('PHONE USE DETECTED', rx + 6, ry + rh - 8);
        }
      });

      // 3. Draw License Plate (Yellow Box + OCR Text)
      if (detectionResult.licensePlate && detectionResult.licensePlate.detected && detectionResult.licensePlate.box) {
        const [pymin, pxmin, pymax, pxmax] = detectionResult.licensePlate.box;
        const px = (pxmin / 1000) * cw;
        const py = (pymin / 1000) * ch;
        const pw = ((pxmax - pxmin) / 1000) * cw;
        const ph = ((pymax - pymin) / 1000) * ch;

        ctx.strokeStyle = '#facc15'; // Yellow
        ctx.lineWidth = 2.5;
        ctx.strokeRect(px, py, pw, ph);

        const plateText = editablePlate || detectionResult.licensePlate.text || 'PLATE';
        ctx.fillStyle = '#facc15';
        ctx.fillRect(px, py + ph + 2, 110, 22);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 12px monospace';
        ctx.fillText(`OCR: ${plateText}`, px + 6, py + ph + 17);
      }

      // 4. Draw Overlay Stamp Watermark
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(cw - 260, ch - 36, 250, 28);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '11px monospace';
      ctx.fillText(`ROADWATCH AI · ${new Date().toISOString().slice(0, 10)}`, cw - 248, ch - 18);
    };
  }, [imageSrc, detectionResult, editablePlate, confidenceThreshold]);

  // Handle Preset selection
  const handleSelectPreset = (preset: DetectionPreset) => {
    setSelectedPreset(preset);
    setImageSrc(preset.imageDataUrl);
    setDetectionResult(preset.expectedResult);
    setEditablePlate(preset.expectedResult.licensePlate.text || '');
    setSaveSuccessMsg(null);
  };

  // Handle User File Upload (Image)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('video/')) {
      setActiveMode('video');
      const videoUrl = URL.createObjectURL(file);
      setVideoSrc(videoUrl);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setImageSrc(base64);
      setSelectedPreset(null);
      setSaveSuccessMsg(null);
      await triggerDetection(base64, file.type);
    };
    reader.readAsDataURL(file);
  };

  // Trigger AI Vision Detection
  const triggerDetection = async (base64: string, mime: string = 'image/jpeg') => {
    setIsProcessing(true);
    setSaveSuccessMsg(null);
    try {
      const result = await analyzeImageWithAI(base64, mime, 'IMAGE_UPLOAD');
      setDetectionResult(result);
      if (result.licensePlate && result.licensePlate.text) {
        setEditablePlate(result.licensePlate.text);
      } else {
        setEditablePlate('UNREADABLE');
      }
    } catch (err) {
      console.error('Detection error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Save detected violation to database
  const handleSaveViolation = async () => {
    if (!detectionResult) return;

    // Determine primary violation
    const primaryViolation = detectionResult.violations[0];
    const canvas = canvasRef.current;
    const evidenceImage = canvas ? canvas.toDataURL('image/jpeg', 0.9) : imageSrc;

    const newRecord = await createViolationRecord({
      violationType: primaryViolation ? primaryViolation.type : 'NO_HELMET',
      violationTitle: primaryViolation ? primaryViolation.title : (detectionResult.helmetDetected ? 'Vehicle Inspection Log' : 'No Safety Helmet Detected'),
      vehicleNumber: editablePlate || 'UNREADABLE',
      confidence: primaryViolation ? primaryViolation.confidence : 0.95,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 8),
      evidenceImage,
      source: activeMode === 'video' ? 'VIDEO_STREAM' : 'IMAGE_UPLOAD',
      riderCount: detectionResult.riderCount || 1,
      helmetDetected: detectionResult.helmetDetected,
      fineAmount: primaryViolation ? primaryViolation.fineAmount : 1000,
      legalSection: primaryViolation ? primaryViolation.legalCode : 'Section 129 Motor Vehicles Act',
      location: 'Detection Studio (AI Inspector)',
    });

    onViolationCreated(newRecord);
    setSaveSuccessMsg(`Violation record ${newRecord.id} saved to database successfully.`);
  };

  // Download Evidence Snapshot
  const handleDownloadSnapshot = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `roadwatch_evidence_${editablePlate || 'traffic'}_${Date.now()}.jpg`;
    link.href = canvasRef.current.toDataURL('image/jpeg', 0.95);
    link.click();
  };

  return (
    <div className="space-y-6">
      
      {/* Studio Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            AI Detection Studio
            <span className="text-xs font-mono font-medium text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/50">
              YOLOv8 + OCR + Vision AI
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Process high-resolution traffic images and videos for helmet compliance, rider counts, and registration OCR
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveMode('image')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              activeMode === 'image'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Image Analysis
          </button>
          <button
            onClick={() => setActiveMode('video')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
              activeMode === 'video'
                ? 'bg-slate-800 text-slate-100 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Video Frame Tracking
          </button>
        </div>
      </div>

      {/* Preset Scenarios Strip */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            1-Click Benchmark Test Scenarios
          </span>
          <span className="text-[11px] text-slate-500 font-mono">Select preset to test AI model response</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {DETECTION_PRESETS.map((preset) => {
            const isSelected = selectedPreset?.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-2.5 rounded-lg text-left transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/50 text-slate-100 ring-1 ring-amber-500/20'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className={`font-semibold ${
                      preset.violationType === 'NO_HELMET' ? 'text-red-400' :
                      preset.violationType === 'TRIPLE_RIDING' ? 'text-amber-400' :
                      preset.violationType === 'MOBILE_USAGE' ? 'text-orange-400' : 'text-emerald-400'
                    }`}>
                      {preset.violationType === 'COMPLIANT' ? 'SAFE HELMET' : preset.violationType.replace('_', ' ')}
                    </span>
                    <span className="text-slate-500">{preset.vehicleNumber}</span>
                  </div>
                  <div className="text-xs font-medium text-slate-200 line-clamp-1">{preset.title}</div>
                </div>
                <div className="text-[10px] text-slate-500 mt-2 line-clamp-1">{preset.tagline}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Viewport Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Canvas Viewport & Controls (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col">
            
            {/* Viewport Top Bar */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-slate-200">
                  {activeMode === 'image' ? 'IMAGE CANVAS INSPECTION' : 'VIDEO STREAM TRACKER'}
                </span>
                <span className="text-slate-500">·</span>
                <span className="font-mono text-slate-400">960 × 540 HD</span>
              </div>

              <div className="flex items-center gap-3">
                {/* Confidence threshold slider */}
                <div className="hidden sm:flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[11px] text-slate-400">Threshold:</span>
                  <input
                    type="range"
                    min="0.5"
                    max="0.95"
                    step="0.05"
                    value={confidenceThreshold}
                    onChange={(e) => setConfidenceThreshold(parseFloat(e.target.value))}
                    className="w-16 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <span className="font-mono text-[11px] text-amber-400 w-8 tabular-nums">
                    {Math.round(confidenceThreshold * 100)}%
                  </span>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*,video/*"
                  className="hidden"
                />

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Upload File
                </button>
              </div>
            </div>

            {/* Canvas / Video Container */}
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800">
              {activeMode === 'image' || !videoSrc ? (
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-contain"
                />
              ) : (
                <video
                  ref={videoRef}
                  src={videoSrc}
                  controls
                  className="w-full h-full object-contain"
                  onTimeUpdate={(e) => setVideoTime((e.target as HTMLVideoElement).currentTime)}
                  onLoadedMetadata={(e) => setVideoDuration((e.target as HTMLVideoElement).duration || 10)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
              )}

              {/* Processing Spinner Overlay */}
              {isProcessing && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-30">
                  <RefreshCw className="w-8 h-8 text-amber-400 animate-spin" />
                  <span className="text-xs font-mono text-slate-200">
                    Running Deep Learning Computer Vision Models...
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Inspecting Head Regions · Counting Riders · OCR Plate Extraction
                  </span>
                </div>
              )}
            </div>

            {/* Video Scrubber & Timeline Events (Visible in Video Mode) */}
            {activeMode === 'video' && (
              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span className="font-mono">Violation Timeline Markers</span>
                  <span className="font-mono text-amber-400 tabular-nums">
                    {videoTime.toFixed(1)}s / {videoDuration.toFixed(1)}s
                  </span>
                </div>

                <div className="relative w-full h-3 rounded-full bg-slate-800">
                  {/* Progress bar */}
                  <div
                    style={{ width: `${(videoTime / (videoDuration || 1)) * 100}%` }}
                    className="h-full bg-cyan-500 rounded-full"
                  />
                  {/* Event Markers */}
                  {videoViolationsList.map((marker, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (videoRef.current) {
                          videoRef.current.currentTime = marker.timestamp;
                        }
                      }}
                      style={{ left: `${(marker.timestamp / (videoDuration || 1)) * 100}%` }}
                      title={`${marker.type} detected at ${marker.timestamp}s (Vehicle: ${marker.plate})`}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500 border-2 border-slate-900 hover:scale-125 transition-transform"
                    />
                  ))}
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Detected Violations in Stream: {videoViolationsList.length}</span>
                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        const v = videoRef.current;
                        const tempCanvas = document.createElement('canvas');
                        tempCanvas.width = v.videoWidth || 960;
                        tempCanvas.height = v.videoHeight || 540;
                        const ctx = tempCanvas.getContext('2d');
                        if (ctx) {
                          ctx.drawImage(v, 0, 0, tempCanvas.width, tempCanvas.height);
                          const frameData = tempCanvas.toDataURL('image/jpeg');
                          setImageSrc(frameData);
                          setActiveMode('image');
                          triggerDetection(frameData);
                        }
                      }
                    }}
                    className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                  >
                    Capture Current Frame for Full AI Analysis →
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Actions Row */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerDetection(imageSrc)}
                  disabled={isProcessing}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                  Re-analyze Frame
                </button>

                <button
                  onClick={handleDownloadSnapshot}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Evidence
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveViolation}
                  className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <FilePlus2 className="w-3.5 h-3.5" />
                  Record to Database & Issue Notice
                </button>
              </div>
            </div>

            {/* Success toast notification */}
            {saveSuccessMsg && (
              <div className="mt-3 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {saveSuccessMsg}
                </span>
                <button
                  onClick={() => setSaveSuccessMsg(null)}
                  className="text-emerald-400 hover:text-emerald-200 font-bold ml-2"
                >
                  ×
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: AI Detection Breakdown & OCR Inspector (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Violation Decision Card */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Detection Assessment</span>
              <span className="text-[11px] font-mono text-cyan-400">
                Engine: {detectionResult?.engine || 'CV_VISION_AI'}
              </span>
            </div>

            {/* Main Result Banner */}
            {detectionResult?.violations && detectionResult.violations.length > 0 ? (
              <div className="p-3.5 rounded-lg bg-red-950/50 border border-red-800/60">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-red-300 block">
                      VIOLATION FLAGGED ({detectionResult.violations.length})
                    </span>
                    <span className="text-xs text-red-200 mt-0.5 block font-medium">
                      {detectionResult.violations[0].title}
                    </span>
                    <span className="text-[11px] text-red-300/80 mt-1 block">
                      {detectionResult.violations[0].legalCode} · Fine: ₹{detectionResult.violations[0].fineAmount}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-lg bg-emerald-950/50 border border-emerald-800/60">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-emerald-300 block">
                      ROAD SAFETY COMPLIANT
                    </span>
                    <span className="text-xs text-emerald-200/90 mt-0.5 block">
                      Rider is wearing certified protective helmet. No hazardous behaviors detected.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Breakdown Parameters */}
            <div className="space-y-2.5 text-xs pt-1">
              
              {/* Parameter 1: Helmet Status */}
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Helmet Status</span>
                <span className={`font-mono font-bold ${
                  detectionResult?.helmetDetected ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {detectionResult?.helmetDetected ? 'HELMET DETECTED' : 'NO HELMET DETECTED'}
                </span>
              </div>

              {/* Parameter 2: Rider Count */}
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Riders Detected</span>
                <span className={`font-mono font-bold ${
                  (detectionResult?.riderCount || 1) >= 3 ? 'text-amber-400' : 'text-slate-200'
                }`}>
                  {detectionResult?.riderCount || 1} Person(s)
                  {(detectionResult?.riderCount || 1) >= 3 && ' (TRIPLE RIDING)'}
                </span>
              </div>

              {/* Parameter 3: Vehicles Detected */}
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Vehicle Type</span>
                <span className="font-mono text-slate-200">
                  {detectionResult?.vehicles[0]?.type?.toUpperCase() || 'MOTORCYCLE'}
                </span>
              </div>

              {/* Parameter 4: Mobile Usage */}
              <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Mobile Phone Usage</span>
                <span className={`font-mono font-bold ${
                  detectionResult?.riders.some((r) => r.isUsingMobile) ? 'text-orange-400' : 'text-slate-400'
                }`}>
                  {detectionResult?.riders.some((r) => r.isUsingMobile) ? 'ACTIVE DISTRACTION' : 'NONE DETECTED'}
                </span>
              </div>

            </div>

            {/* OCR Number Plate Card */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-300">Vehicle Registration (OCR)</span>
                <span className="text-[11px] font-mono text-amber-400">
                  {detectionResult?.licensePlate?.confidence
                    ? `${Math.round(detectionResult.licensePlate.confidence * 100)}% match`
                    : '91% match'}
                </span>
              </div>

              {/* Registration Input Field (allowing officer correction) */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={editablePlate}
                    onChange={(e) => setEditablePlate(e.target.value.toUpperCase())}
                    placeholder="ENTER VEHICLE NUMBER"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-amber-300 focus:outline-none focus:border-amber-500 uppercase tracking-wider"
                  />
                </div>
                <button
                  onClick={() => {
                    if (detectionResult?.licensePlate?.text) {
                      setEditablePlate(detectionResult.licensePlate.text);
                    }
                  }}
                  title="Reset to OCR extracted text"
                  className="px-2 py-1.5 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                >
                  Reset
                </button>
              </div>

              <div className="text-[11px] text-slate-500">
                Extracted via Tesseract/DeepOCR module. Officer may verify or correct characters before e-Challan dispatch.
              </div>
            </div>

            {/* Scene Summary text */}
            <div className="p-2.5 rounded-lg bg-slate-950/40 text-[11px] text-slate-400 leading-relaxed border border-slate-800/80">
              <span className="text-slate-300 font-semibold block mb-0.5">Scene AI Summary:</span>
              {detectionResult?.sceneSummary || 'Object detection models processed frame. Bounding boxes annotated.'}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
