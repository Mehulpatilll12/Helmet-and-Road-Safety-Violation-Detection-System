import React from 'react';
import { ViolationRecord } from '../types';
import { X, Printer, ShieldCheck, QrCode } from 'lucide-react';

interface ChallanModalProps {
  violation: ViolationRecord | null;
  onClose: () => void;
}

export const ChallanModal: React.FC<ChallanModalProps> = ({ violation, onClose }) => {
  if (!violation) return null;

  const handlePrint = () => {
    window.print();
  };

  const challanNo = `ECH-${violation.date.replace(/-/g, '')}-${violation.id.replace('VIO-', '')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white text-slate-900 shadow-2xl overflow-hidden my-8 print:m-0 print:w-full print:shadow-none print:max-w-none">
        
        {/* Top Control Header (Hidden in Print) */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-100 border-b border-slate-200 print:hidden">
          <span className="text-xs font-semibold text-slate-600 font-mono">
            OFFICIAL ELECTRONIC TRAFFIC VIOLATION NOTICE (E-CHALLAN)
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Notice Paper Content */}
        <div className="p-8 space-y-6 text-slate-900">
          
          {/* Government / Department Header */}
          <div className="text-center border-b pb-4 border-slate-300">
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-7 h-7" />
              </div>
            </div>
            <h1 className="text-lg font-black tracking-wider uppercase">
              TRAFFIC SURVEILLANCE & ENFORCEMENT BRANCH
            </h1>
            <p className="text-xs text-slate-600">
              Department of Road Safety & Traffic Police Surveillance Administration
            </p>
            <div className="inline-block mt-2 px-3 py-0.5 rounded bg-red-100 text-red-800 text-xs font-bold tracking-widest uppercase border border-red-200">
              ELECTRONIC VIOLATION NOTICE (E-CHALLAN)
            </div>
          </div>

          {/* Challan Meta Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono">
            <div>
              <span className="text-slate-500 text-[10px] block">CHALLAN NUMBER</span>
              <span className="font-bold text-slate-900">{challanNo}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">VIOLATION ID</span>
              <span className="font-bold text-slate-900">{violation.id}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">DATE & TIME</span>
              <span className="font-bold text-slate-900">{violation.date} {violation.time}</span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">CCTV NODE</span>
              <span className="font-bold text-slate-900">{violation.source}</span>
            </div>
          </div>

          {/* Vehicle & Violation Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-lg border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Vehicle Details
              </span>
              <div className="text-xl font-black font-mono tracking-wider text-slate-900 bg-amber-50 border border-amber-200 p-2 rounded text-center">
                {violation.vehicleNumber}
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <div><span className="font-medium">Class:</span> Two-Wheeler / Motorized Cycle</div>
                <div><span className="font-medium">Jurisdiction:</span> Traffic Monitoring Division 01</div>
                <div><span className="font-medium">Incident Location:</span> {violation.location}</div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Violation Allegation
              </span>
              <div className="text-sm font-bold text-red-600">
                {violation.violationTitle}
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <div><span className="font-medium">Statutory Clause:</span> {violation.legalSection}</div>
                <div><span className="font-medium">Detection Confidence:</span> {Math.round(violation.confidence * 100)}% (Automated CV)</div>
                <div><span className="font-medium">Review Status:</span> {violation.status}</div>
              </div>
            </div>

          </div>

          {/* Photographic Evidence Attachment */}
          <div className="p-4 rounded-lg border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Photographic Evidence Frame
            </span>
            <div className="w-full aspect-video max-h-56 rounded bg-slate-900 overflow-hidden flex items-center justify-center">
              <img
                src={violation.evidenceImage}
                alt="Challan Evidence"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-[11px] text-slate-500 italic text-center">
              Image recorded automatically via Deep Learning Object Detection Network. Unaltered digital record.
            </p>
          </div>

          {/* Penalty & Payment Summary */}
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-500 block">TOTAL PENALTY AMOUNT DUE</span>
              <span className="text-2xl font-black font-mono text-slate-900">
                ₹{violation.fineAmount.toLocaleString('en-IN')}/-
              </span>
              <span className="text-[11px] text-slate-500 block">
                To be remitted within 15 calendar days of dispatch.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded border border-slate-300">
                <QrCode className="w-12 h-12 text-slate-900" />
              </div>
              <div className="text-[10px] text-slate-600 font-mono">
                <div>SCAN TO VERIFY</div>
                <div>OR REMIT ONLINE</div>
                <div className="font-bold text-slate-900">echallan.gov.in</div>
              </div>
            </div>
          </div>

          {/* Legal Footnote */}
          <div className="text-[11px] text-slate-500 leading-relaxed border-t pt-4 border-slate-200">
            <p>
              Under provisions of Section 133 / 134 of the Motor Vehicles Act, the registered owner is directed to pay the prescribed composition fee or file a formal representation before the Competent Appellate Authority within 15 days from service of this notice. Failure to respond may attract legal action including vehicle registration suspension.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
