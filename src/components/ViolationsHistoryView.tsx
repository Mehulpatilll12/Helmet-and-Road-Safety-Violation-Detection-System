import React, { useState, useMemo } from 'react';
import { ViolationRecord, ViolationType, ViolationStatus } from '../types';
import { updateViolationRecord, deleteViolationRecord } from '../services/api';
import { Search, Filter, ShieldAlert, Eye, Trash2, CheckCircle2, XCircle, FileText, Download } from 'lucide-react';

interface ViolationsHistoryViewProps {
  violations: ViolationRecord[];
  onSelectViolation: (record: ViolationRecord) => void;
  onOpenChallan: (record: ViolationRecord) => void;
  onUpdateRecord: (updated: ViolationRecord) => void;
  onDeleteRecord: (id: string) => void;
}

export const ViolationsHistoryView: React.FC<ViolationsHistoryViewProps> = ({
  violations,
  onSelectViolation,
  onOpenChallan,
  onUpdateRecord,
  onDeleteRecord,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Filtered violations
  const filteredViolations = useMemo(() => {
    return violations.filter((v) => {
      // Search by vehicle number or violation ID or title
      const matchesSearch =
        !searchQuery ||
        v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.violationTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.location.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by type
      const matchesType = typeFilter === 'ALL' || v.violationType === typeFilter;

      // Filter by status
      const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;

      // Filter by date
      const matchesDate = !selectedDate || v.date === selectedDate;

      return matchesSearch && matchesType && matchesStatus && matchesDate;
    });
  }, [violations, searchQuery, typeFilter, statusFilter, selectedDate]);

  // Handle Verify Quick Action
  const handleVerify = async (record: ViolationRecord) => {
    const updated = await updateViolationRecord(record.id, {
      status: 'VERIFIED',
      officerRemarks: 'Manually confirmed and verified by traffic officer.',
    });
    if (updated) {
      onUpdateRecord(updated);
    } else {
      onUpdateRecord({ ...record, status: 'VERIFIED' });
    }
  };

  // Handle Dismiss Quick Action
  const handleDismiss = async (record: ViolationRecord) => {
    const updated = await updateViolationRecord(record.id, {
      status: 'DISMISSED',
      officerRemarks: 'Dismissed upon review as false trigger.',
    });
    if (updated) {
      onUpdateRecord(updated);
    } else {
      onUpdateRecord({ ...record, status: 'DISMISSED' });
    }
  };

  // Handle Delete
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this violation record?')) {
      await deleteViolationRecord(id);
      onDeleteRecord(id);
    }
  };

  // Export filtered violations to CSV
  const handleExportCSV = () => {
    const headers = ['Violation ID', 'Type', 'Vehicle Plate', 'Confidence', 'Date', 'Time', 'Fine Amount', 'Status', 'Location'];
    const rows = filteredViolations.map((v) => [
      v.id,
      v.violationType,
      v.vehicleNumber,
      `${Math.round(v.confidence * 100)}%`,
      v.date,
      v.time,
      v.fineAmount,
      v.status,
      `"${v.location.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `traffic_violations_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            Violation Records & Evidence Registry
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit, verify, edit OCR license plates, and dispatch e-Challan legal notifications
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          Export Filtered Records (CSV)
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vehicle plate (e.g. MH12, DL01)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Violation Types</option>
              <option value="NO_HELMET">No Helmet (Sec 129)</option>
              <option value="TRIPLE_RIDING">Triple Riding (Sec 128)</option>
              <option value="MOBILE_USAGE">Mobile Device Use (Sec 184c)</option>
              <option value="WRONG_SIDE">Wrong-Side Driving</option>
              <option value="SIGNAL_VIOLATION">Traffic Signal Violation</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">All Review Statuses</option>
              <option value="PENDING_REVIEW">Pending Review</option>
              <option value="VERIFIED">Verified Infractions</option>
              <option value="DISMISSED">Dismissed / False Trigger</option>
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

        </div>

        {/* Active Filters Clear link */}
        {(searchQuery || typeFilter !== 'ALL' || statusFilter !== 'ALL' || selectedDate) && (
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Showing {filteredViolations.length} matching records</span>
            <button
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('ALL');
                setStatusFilter('ALL');
                setSelectedDate('');
              }}
              className="text-amber-400 hover:text-amber-300 font-medium"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Violations Table */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-3 pl-2">ID</th>
                <th className="pb-3">TIMESTAMP</th>
                <th className="pb-3">VEHICLE PLATE (OCR)</th>
                <th className="pb-3">VIOLATION TYPE</th>
                <th className="pb-3">CONFIDENCE</th>
                <th className="pb-3">LOCATION / SOURCE</th>
                <th className="pb-3">FINE</th>
                <th className="pb-3">STATUS</th>
                <th className="pb-3 text-right pr-2">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredViolations.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500">
                    No violation records match the active search criteria.
                  </td>
                </tr>
              ) : (
                filteredViolations.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-3 pl-2 font-mono font-semibold text-slate-300">
                      {v.id}
                    </td>

                    <td className="py-3 font-mono text-slate-400 tabular-nums">
                      <div>{v.date}</div>
                      <div className="text-[10px] text-slate-500">{v.time}</div>
                    </td>

                    <td className="py-3">
                      <span className="font-mono font-bold text-amber-300 bg-slate-950 px-2 py-1 rounded border border-slate-800 inline-block tracking-wider">
                        {v.vehicleNumber}
                      </span>
                    </td>

                    <td className="py-3">
                      <div className={`font-semibold ${
                        v.violationType === 'NO_HELMET' ? 'text-red-400' :
                        v.violationType === 'TRIPLE_RIDING' ? 'text-amber-400' : 'text-orange-400'
                      }`}>
                        {v.violationTitle}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{v.legalSection}</div>
                    </td>

                    <td className="py-3 font-mono text-slate-300 tabular-nums">
                      {Math.round(v.confidence * 100)}%
                    </td>

                    <td className="py-3 text-slate-400">
                      <div className="truncate max-w-[150px]">{v.location}</div>
                      <div className="text-[10px] font-mono text-slate-500">{v.source}</div>
                    </td>

                    <td className="py-3 font-mono font-semibold text-emerald-400 tabular-nums">
                      ₹{v.fineAmount}
                    </td>

                    <td className="py-3">
                      <span className={`text-[11px] font-mono font-semibold ${
                        v.status === 'VERIFIED' ? 'text-emerald-400' :
                        v.status === 'PENDING_REVIEW' ? 'text-amber-400' : 'text-slate-500'
                      }`}>
                        {v.status === 'VERIFIED' ? 'VERIFIED' :
                         v.status === 'PENDING_REVIEW' ? 'PENDING' : 'DISMISSED'}
                      </span>
                    </td>

                    <td className="py-3 text-right pr-2">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Evidence button */}
                        <button
                          onClick={() => onSelectViolation(v)}
                          title="View Evidence Snapshot & Analysis"
                          className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* e-Challan button */}
                        <button
                          onClick={() => onOpenChallan(v)}
                          title="Print / Issue Official e-Challan Notice"
                          className="p-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        {/* Verify Quick Button */}
                        {v.status !== 'VERIFIED' && (
                          <button
                            onClick={() => handleVerify(v)}
                            title="Verify Violation"
                            className="p-1.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Dismiss Quick Button */}
                        {v.status !== 'DISMISSED' && (
                          <button
                            onClick={() => handleDismiss(v)}
                            title="Dismiss Violation"
                            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Delete button */}
                        <button
                          onClick={() => handleDelete(v.id)}
                          title="Delete Record"
                          className="p-1.5 rounded bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
