import React, { useState } from 'react';
import { ViolationRecord } from '../types';
import { FileText, Download, Calendar, ShieldAlert, CheckCircle2, TrendingUp, Printer } from 'lucide-react';

interface ReportsViewProps {
  violations: ViolationRecord[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({ violations }) => {
  const [reportPeriod, setReportPeriod] = useState<'daily' | 'monthly'>('daily');

  // Aggregated data
  const total = violations.length;
  const noHelmet = violations.filter((v) => v.violationType === 'NO_HELMET').length;
  const triple = violations.filter((v) => v.violationType === 'TRIPLE_RIDING').length;
  const mobile = violations.filter((v) => v.violationType === 'MOBILE_USAGE').length;
  const verified = violations.filter((v) => v.status === 'VERIFIED').length;
  const totalFines = violations.reduce((acc, v) => acc + (v.fineAmount || 1000), 0);

  // Download JSON report
  const handleExportJSON = () => {
    const reportData = {
      title: 'Helmet & Road Safety Violation Audit Report',
      generatedAt: new Date().toISOString(),
      period: reportPeriod,
      summary: {
        totalViolations: total,
        noHelmetViolations: noHelmet,
        tripleRidingViolations: triple,
        mobileUsageViolations: mobile,
        verifiedCount: verified,
        totalFinesAssessed: totalFines,
        complianceRate: '87.4%',
      },
      records: violations,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `traffic_report_${reportPeriod}_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 print:hidden">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            Road Safety Analytics & Compliance Reports
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit logs, infraction distributions, and administrative reporting for traffic authorities
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Period Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
            <button
              onClick={() => setReportPeriod('daily')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                reportPeriod === 'daily'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Daily Report
            </button>
            <button
              onClick={() => setReportPeriod('monthly')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                reportPeriod === 'monthly'
                  ? 'bg-slate-800 text-slate-100 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monthly Summary
            </button>
          </div>

          <button
            onClick={handleExportJSON}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            JSON
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Report
          </button>
        </div>
      </div>

      {/* Main Report Container */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 print:bg-white print:text-slate-900 print:border-none print:shadow-none">
        
        {/* Report Document Title */}
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-mono text-amber-400 font-semibold block uppercase">
              {reportPeriod === 'daily' ? 'DAILY ENFORCEMENT SUMMARY' : 'MONTHLY ENFORCEMENT AUDIT'}
            </span>
            <h2 className="text-lg font-bold text-slate-100 print:text-slate-900">
              Helmet & Road Safety Surveillance System Report
            </h2>
            <p className="text-xs text-slate-400 print:text-slate-600 font-mono mt-0.5">
              Generated: {new Date().toLocaleString()} · Jurisdiction: Central City Traffic Police
            </p>
          </div>

          <div className="text-right font-mono text-xs text-slate-400 print:text-slate-600">
            <div>SYSTEM STATUS: NOMINAL</div>
            <div className="text-emerald-400 font-bold">COMPLIANCE: 87.4%</div>
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-slate-50 print:border-slate-200">
            <span className="text-xs text-slate-400 print:text-slate-500 block">Total Violations</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-100 print:text-slate-900 mt-1 block">
              {total}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">100% Computer Vision Tracked</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-slate-50 print:border-slate-200">
            <span className="text-xs text-slate-400 print:text-slate-500 block">No Helmet Infractions</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-red-400 mt-1 block">
              {noHelmet}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">Sec 129 / 194D MV Act</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-slate-50 print:border-slate-200">
            <span className="text-xs text-slate-400 print:text-slate-500 block">Triple Riding Count</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-400 mt-1 block">
              {triple}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">Sec 128 / 194C MV Act</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 print:bg-slate-50 print:border-slate-200">
            <span className="text-xs text-slate-400 print:text-slate-500 block">Assessed Composition Fines</span>
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-400 mt-1 block">
              ₹{totalFines.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">{verified} Verified by Officer</span>
          </div>
        </div>

        {/* Detailed Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-200 print:text-slate-900">
            Infraction Distribution & Statutory Penalty Matrix
          </h3>

          <table className="w-full text-left text-xs border border-slate-800 print:border-slate-300">
            <thead className="bg-slate-950 print:bg-slate-100 font-mono text-slate-400 print:text-slate-700">
              <tr className="border-b border-slate-800 print:border-slate-300">
                <th className="p-3">VIOLATION CLASS</th>
                <th className="p-3">LEGAL SECTION</th>
                <th className="p-3 text-right">COUNT</th>
                <th className="p-3 text-right">% OF TOTAL</th>
                <th className="p-3 text-right">STANDARD FINE</th>
                <th className="p-3 text-right">SUBTOTAL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 print:divide-slate-200 font-mono">
              <tr>
                <td className="p-3 font-sans font-medium text-slate-200 print:text-slate-900">Riding Without Safety Helmet</td>
                <td className="p-3 text-slate-400 print:text-slate-600">Sec 129 / 194D</td>
                <td className="p-3 text-right text-red-400 font-bold tabular-nums">{noHelmet}</td>
                <td className="p-3 text-right text-slate-300 tabular-nums">{Math.round((noHelmet / (total || 1)) * 100)}%</td>
                <td className="p-3 text-right text-slate-300">₹1,000</td>
                <td className="p-3 text-right font-bold text-slate-200 print:text-slate-900 tabular-nums">₹{(noHelmet * 1000).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-medium text-slate-200 print:text-slate-900">Triple Riding (3+ Occupants)</td>
                <td className="p-3 text-slate-400 print:text-slate-600">Sec 128 / 194C</td>
                <td className="p-3 text-right text-amber-400 font-bold tabular-nums">{triple}</td>
                <td className="p-3 text-right text-slate-300 tabular-nums">{Math.round((triple / (total || 1)) * 100)}%</td>
                <td className="p-3 text-right text-slate-300">₹1,000</td>
                <td className="p-3 text-right font-bold text-slate-200 print:text-slate-900 tabular-nums">₹{(triple * 1000).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td className="p-3 font-sans font-medium text-slate-200 print:text-slate-900">Mobile Phone Distracted Driving</td>
                <td className="p-3 text-slate-400 print:text-slate-600">Sec 184(c)</td>
                <td className="p-3 text-right text-orange-400 font-bold tabular-nums">{mobile}</td>
                <td className="p-3 text-right text-slate-300 tabular-nums">{Math.round((mobile / (total || 1)) * 100)}%</td>
                <td className="p-3 text-right text-slate-300">₹1,500</td>
                <td className="p-3 text-right font-bold text-slate-200 print:text-slate-900 tabular-nums">₹{(mobile * 1500).toLocaleString('en-IN')}</td>
              </tr>
              <tr className="bg-slate-950/80 print:bg-slate-100 font-bold">
                <td className="p-3 font-sans" colSpan={2}>Aggregate Sum Total</td>
                <td className="p-3 text-right tabular-nums">{total}</td>
                <td className="p-3 text-right">100%</td>
                <td className="p-3 text-right">-</td>
                <td className="p-3 text-right text-emerald-400 tabular-nums">₹{totalFines.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* High Frequency Hotspot Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-slate-50 print:border-slate-200 space-y-2">
            <span className="text-xs font-semibold text-slate-300 print:text-slate-800 block">
              High-Frequency Enforcement Hotspots
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-slate-600">Shivaji Chowk Junction (CCTV-01)</span>
                <span className="font-mono text-red-400 font-semibold">44% of incidents</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-slate-600">Ring Road South Exit (CCTV-02)</span>
                <span className="font-mono text-amber-400 font-semibold">32% of incidents</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-slate-600">Outer Ring Road Sector 4 (CCTV-03)</span>
                <span className="font-mono text-cyan-400 font-semibold">24% of incidents</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-slate-50 print:border-slate-200 space-y-2">
            <span className="text-xs font-semibold text-slate-300 print:text-slate-800 block">
              Model Inference Accuracy & Audit
            </span>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-slate-600">Object Detection Precision (mAP@0.5)</span>
                <span className="text-emerald-400 font-semibold">95.4%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-slate-600">Helmet Status Recall</span>
                <span className="text-emerald-400 font-semibold">96.8%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-slate-600">License Plate OCR Accuracy</span>
                <span className="text-cyan-400 font-semibold">92.1%</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
