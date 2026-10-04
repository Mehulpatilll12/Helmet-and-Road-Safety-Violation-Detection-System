import React, { useState, useRef, useEffect } from 'react';
import { ViolationRecord } from '../types';
import { createViolationRecord } from '../services/api';
import { Camera, Video, ShieldAlert, CheckCircle2, AlertTriangle, Volume2, VolumeX, RefreshCw, Radio, CameraOff } from 'lucide-react';

interface LiveCameraViewProps {
  onViolationCreated: (record: ViolationRecord) => void;
  onOpenChallan: (record: ViolationRecord) => void;
}

export const LiveCameraView: React.FC<LiveCameraViewProps> = ({
  onViolationCreated,
  onOpenChallan,
}) => {
  const [feedMode, setFeedMode] = useState<'webcam' | 'cctv1' | 'cctv2'>('cctv1');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [autoRecord, setAutoRecord] = useState<boolean>(true);
  const [fps, setFps] = useState<number>(30);
  const [liveViolationAlert, setLiveViolationAlert] = useState<{
    type: string;
    vehicle: string;
    confidence: number;
    time: string;
  } | null>({
    type: 'NO_HELMET',
    vehicle: 'MH12AB1234',
    confidence: 0.96,
    time: 'Live',
  });
  const [recentLiveCaptures, setRecentLiveCaptures] = useState<ViolationRecord[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Play audio alert tone using Web Audio API
  const playAlertSiren = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {
      // AudioContext unavailable or blocked
    }
  };

  // Start webcam if mode is webcam
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (feedMode === 'webcam') {
      navigator.mediaDevices
        ?.getUserMedia({ video: { width: 960, height: 540 } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.play();
          }
          setCameraError(null);
        })
        .catch((err) => {
          console.warn('Webcam access error:', err);
          setCameraError('Webcam access was denied or device not found. You can switch to simulated CCTV feeds.');
        });
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
      setCameraError(null);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [feedMode]);

  // Live Canvas Rendering & Bounding Box Overlay Loop
  useEffect(() => {
    let tick = 0;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 960;
    canvas.height = 540;

    const renderLoop = () => {
      tick++;

      // If in webcam mode and video is ready, draw video frame
      if (feedMode === 'webcam' && videoRef.current && videoRef.current.readyState >= 2) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      } else {
        // Draw simulated CCTV background
        // Sky/City background
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, feedMode === 'cctv1' ? '#1e293b' : '#0f172a');
        grad.addColorStop(1, '#090d16');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Road surface
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, 300, canvas.width, 240);

        // Road lane markings
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 4;
        ctx.setLineDash([30, 25]);
        const offset = (tick * 4) % 55;
        ctx.lineDashOffset = -offset;
        ctx.beginPath();
        ctx.moveTo(0, 420);
        ctx.lineTo(canvas.width, 420);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.lineDashOffset = 0;

        // Street lamp posts
        ctx.fillStyle = '#64748b';
        ctx.fillRect(100, 160, 12, 140);
        ctx.fillRect(800, 160, 12, 140);

        // Animated Traffic Simulation Objects
        const bikeX = 200 + ((tick * 3) % (canvas.width + 200)) - 100;
        
        // Motorcycle wheels
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(bikeX, 420, 38, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(bikeX + 160, 420, 38, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Chassis
        ctx.fillStyle = feedMode === 'cctv1' ? '#dc2626' : '#2563eb';
        ctx.beginPath();
        ctx.moveTo(bikeX, 420);
        ctx.lineTo(bikeX + 80, 420);
        ctx.lineTo(bikeX + 140, 370);
        ctx.lineTo(bikeX + 60, 360);
        ctx.closePath();
        ctx.fill();

        // Rider (barehead in CCTV 1, helmet in CCTV 2)
        const hasHelmet = feedMode === 'cctv2';
        // Torso
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(bikeX + 60, 270, 40, 90);
        // Head / Helmet
        ctx.fillStyle = hasHelmet ? '#0f172a' : '#fed7aa';
        ctx.beginPath();
        ctx.arc(bikeX + 80, 240, 22, 0, Math.PI * 2);
        ctx.fill();
        if (hasHelmet) {
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 3;
          ctx.stroke();
        }

        // License plate on moving bike
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(bikeX - 35, 410, 65, 20);
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(feedMode === 'cctv1' ? 'MH12AB1234' : 'TN09BD9012', bikeX - 32, 424);
      }

      // Live Detection Bounding Box Overlays
      // Vehicle Box (Cyan)
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.strokeRect(260, 180, 440, 280);
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(260, 158, 150, 22);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('TARGET: MOTORCYCLE [96%]', 266, 173);

      // Head Box (Red if violation, Green if helmet)
      const isHelmetCompliant = feedMode === 'cctv2';
      ctx.strokeStyle = isHelmetCompliant ? '#10b981' : '#ef4444';
      ctx.lineWidth = 3;
      ctx.strokeRect(440, 200, 90, 95);
      
      ctx.fillStyle = isHelmetCompliant ? '#10b981' : '#ef4444';
      ctx.fillRect(440, 176, isHelmetCompliant ? 130 : 100, 24);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(isHelmetCompliant ? 'HELMET DETECTED' : 'NO HELMET [96%]', 446, 192);

      // License Plate Box (Yellow)
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(360, 390, 140, 45);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(360, 436, 140, 20);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('OCR: MH12AB1234', 368, 450);

      // HUD Telemetry Overlays
      // Top Left: Camera node, Date, Time, FPS
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(15, 15, 340, 40);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '12px monospace';
      const camLabel = feedMode === 'webcam' ? 'LIVE WEBCAM STREAM' : feedMode === 'cctv1' ? 'CCTV-01 · SHIVAJI CHOWK' : 'CCTV-02 · RING ROAD EXP';
      ctx.fillText(`${camLabel} · 30 FPS`, 25, 32);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px monospace';
      ctx.fillText(`REC · ${new Date().toLocaleTimeString()} · INFERENCE: 18ms`, 25, 47);

      // Top Right: Live Status Indicator
      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1;
      ctx.fillRect(canvas.width - 150, 15, 135, 30);
      ctx.strokeRect(canvas.width - 150, 15, 135, 30);
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('● LIVE MONITORING', canvas.width - 140, 34);

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [feedMode]);

  // Capture current live frame as violation evidence
  const handleCaptureEvidence = async () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const evidenceImage = canvas.toDataURL('image/jpeg', 0.9);

    playAlertSiren();

    const newRecord = await createViolationRecord({
      violationType: feedMode === 'cctv2' ? 'MOBILE_USAGE' : 'NO_HELMET',
      violationTitle: feedMode === 'cctv2' ? 'Distracted Mobile Driving' : 'Riding Without Safety Helmet',
      vehicleNumber: feedMode === 'cctv2' ? 'TN09BD9012' : 'MH12AB1234',
      confidence: 0.95,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toTimeString().slice(0, 8),
      evidenceImage,
      source: feedMode === 'webcam' ? 'LIVE_CAMERA' : feedMode === 'cctv1' ? 'CCTV_NODE_01' : 'CCTV_NODE_02',
      riderCount: 1,
      helmetDetected: feedMode === 'cctv2',
      fineAmount: 1000,
      legalSection: 'Section 129 / 194D Motor Vehicles Act',
      location: feedMode === 'webcam' ? 'Live Patrol Camera Unit' : feedMode === 'cctv1' ? 'Shivaji Chowk Junction' : 'Ring Road South',
    });

    onViolationCreated(newRecord);
    setRecentLiveCaptures((prev) => [newRecord, ...prev.slice(0, 3)]);
    setLiveViolationAlert({
      type: newRecord.violationType,
      vehicle: newRecord.vehicleNumber,
      confidence: 0.96,
      time: newRecord.time,
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Feed Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            Real-time Live Camera Surveillance
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-red-400 bg-red-950/70 border border-red-800/60 px-2 py-0.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              LIVE
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Continuous deep learning frame inference running at 30 FPS with automated violation trigger
          </p>
        </div>

        {/* Source Selector */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setFeedMode('cctv1')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                feedMode === 'cctv1'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              CCTV-01 (Junction)
            </button>
            <button
              onClick={() => setFeedMode('cctv2')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                feedMode === 'cctv2'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              CCTV-02 (Expressway)
            </button>
            <button
              onClick={() => setFeedMode('webcam')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                feedMode === 'webcam'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              Webcam
            </button>
          </div>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute Alert Siren' : 'Enable Alert Siren'}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>
        </div>
      </div>

      {/* Main Viewport & Real-time Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Canvas Viewport (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col">
            
            {/* Viewport Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
              <span className="font-mono text-slate-300 flex items-center gap-2">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                ACTIVE SURVEILLANCE FEED: {feedMode.toUpperCase()}
              </span>

              <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
                <span>FPS: 30</span>
                <span>·</span>
                <span>LATENCY: 18ms</span>
                <span>·</span>
                <span>RES: 960×540</span>
              </div>
            </div>

            {/* Canvas Container */}
            <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-800">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain"
              />

              {/* Hidden video element used to capture webcam stream */}
              <video
                ref={videoRef}
                playsInline
                muted
                className="hidden"
              />

              {/* Error overlay for webcam */}
              {cameraError && feedMode === 'webcam' && (
                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm p-6 flex flex-col items-center justify-center text-center gap-3">
                  <CameraOff className="w-10 h-10 text-slate-500" />
                  <span className="text-sm font-semibold text-slate-200">Camera Feed Unavailable</span>
                  <p className="text-xs text-slate-400 max-w-sm">{cameraError}</p>
                  <button
                    onClick={() => setFeedMode('cctv1')}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors mt-2"
                  >
                    Switch to CCTV-01 Simulation Feed
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Live Controls Row */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                  <input
                    type="checkbox"
                    checked={autoRecord}
                    onChange={(e) => setAutoRecord(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-amber-500 focus:ring-0"
                  />
                  <span>Auto-save high confidence infractions</span>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCaptureEvidence}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold flex items-center gap-2 transition-colors shadow-sm"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Capture Violation Snapshot
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Live Detection Alert & Recent Snapshots (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Active Live Alert Box */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Active Live Detection</span>
              <span className="text-[11px] font-mono text-red-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                TRIGGER ACTIVE
              </span>
            </div>

            {liveViolationAlert ? (
              <div className="p-3.5 rounded-lg bg-red-950/60 border border-red-800/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-red-300">
                    VIOLATION: NO HELMET
                  </span>
                  <span className="text-[11px] font-mono text-red-400">
                    96% Confidence
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-slate-950/80">
                    <span className="text-[10px] text-slate-500 block">PLATE NUMBER</span>
                    <span className="text-amber-300 font-bold">MH12AB1234</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950/80">
                    <span className="text-[10px] text-slate-500 block">RULE VIOLATION</span>
                    <span className="text-slate-200">Sec 129 MV Act</span>
                  </div>
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Location: Shivaji Chowk (Lane 2)</span>
                  <button
                    onClick={handleCaptureEvidence}
                    className="text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    Save & Issue Challan →
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-slate-950 text-center text-xs text-slate-400">
                Monitoring live stream... No active violations in field.
              </div>
            )}
          </div>

          {/* Recent Live Captures */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-300 block">
              Recent Live Captures (Current Session)
            </span>

            {recentLiveCaptures.length === 0 ? (
              <div className="p-4 rounded-lg bg-slate-950 text-center text-xs text-slate-500">
                Click "Capture Violation Snapshot" to log evidence from the live feed.
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentLiveCaptures.map((cap) => (
                  <div
                    key={cap.id}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-mono font-bold text-amber-300">{cap.vehicleNumber}</div>
                      <div className="text-[11px] text-slate-400">{cap.violationTitle}</div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">{cap.time} · {cap.id}</div>
                    </div>
                    <button
                      onClick={() => onOpenChallan(cap)}
                      className="px-2 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                    >
                      e-Challan
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};
