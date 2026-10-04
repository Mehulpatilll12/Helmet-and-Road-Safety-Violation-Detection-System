import React, { useState } from 'react';
import { ViolationRecord } from '../types';
import { updateViolationRecord } from '../services/api';
import { X, ShieldAlert, CheckCircle2, Download, FileText, Check, AlertTriangle } from 'lucide-react';

interface EvidenceModalProps {
  violation: ViolationRecord | null;
  onClose: () => void;
  onUpdateRecord: (updated: ViolationRecord) => void;
  onOpenChallan: (record: ViolationRecord) => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  violation,
  onClose,
  onUpdateRecord,
  onOpenChallan,
}) => {
  if (!violation) return null;

  const [editedPlate, setEditedPlate] = useState<string>(violation.vehicleNumber);
  const [editedRemarks, setEditedRemarks] = useState<string>(violation.officerRemarks || '');
  const [editedStatus, setEditedStatus] = useState<ViolationRecord['status']>(violation.status);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      const updated = await updateViolationRecord(violation.id, {
        vehicleNumber: editedPlate,
        officerRemarks: editedRemarks,
        status: editedStatus,
      });

      if (updated) {
        onUpdateRecord(updated);
      } else {
        onUpdateRecord({
          ...violation,
          vehicleNumber: editedPlate,
          officerRemarks: editedRemarks,
          status: editedStatus,
        });
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to update record:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.download = `evidence_${violation.id}_${violation.vehicleNumber}.jpg`;
    link.href = violation.evidenceImage;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Violation Evidence Review · {violation.id}
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Captured {violation.date} {violation.time} via {violation.source}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Evidence Image (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <span className="text-xs font-semibold text-slate-300 block">
              Forensic Evidence Snapshot (Annotated Computer Vision Detections)
            </span>

            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
              <img
                src={violation.evidenceImage}
                alt={`Evidence for ${violation.id}`}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Location: {violation.location}</span>
              <button
                onClick={handleDownloadImage}
                className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                Download Original File
              </button>
            </div>
          </div>

          {/* Right Column: Violation Details & Verification Form (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Infraction Summary Card */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Infraction Particulars</span>
                <span className="text-[11px] font-mono text-red-400">
                  {Math.round(violation.confidence * 100)}% Confidence
                </span>
              </div>

              <div className="text-sm font-bold text-red-400">
                {violation.violationTitle}
              </div>

              <div className="text-xs text-slate-400 leading-relaxed">
                {violation.legalSection} · Statutory Penalty: ₹{violation.fineAmount}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">RIDERS DETECTED</span>
                  <span className="text-slate-200 font-semibold">{violation.riderCount} Occupant(s)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">HELMET VERIFIED</span>
                  <span className={violation.helmetDetected ? 'text-emerald-400' : 'text-red-400'}>
                    {violation.helmetDetected ? 'YES' : 'NO'}
                  </span>
                </div>
              </div>
            </div>

            {/* Officer Edit Form */}
            <div className="space-y-3">
              
              {/* Vehicle Number (with OCR correction ability) */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Vehicle Registration (OCR Extracted / Correctable)
                </label>
                <input
                  type="text"
                  value={editedPlate}
                  onChange={(e) => setEditedPlate(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono font-bold text-amber-300 tracking-wider focus:outline-none focus:border-amber-500 uppercase"
                />
              </div>

              {/* Status Picker */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Review & Audit Status
                </label>
                <select
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="PENDING_REVIEW">Pending Review</option>
                  <option value="VERIFIED">Verified Infraction (Approved for Challan)</option>
                  <option value="DISMISSED">Dismissed (False Positive / Inconclusive)</option>
                </select>
              </div>

              {/* Officer Remarks */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Officer Examination Remarks
                </label>
                <textarea
                  rows={2}
                  value={editedRemarks}
                  onChange={(e) => setEditedRemarks(e.target.value)}
                  placeholder="Add officer verification notes..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-slate-950" />
                    Changes Saved Successfully!
                  </>
                ) : (
                  <>Save Record Updates</>
                )}
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenChallan(violation);
                }}
                className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                Generate & Print Official e-Challan Notice
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
