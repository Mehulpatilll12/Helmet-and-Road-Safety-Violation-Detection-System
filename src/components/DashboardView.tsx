import React from 'react';
import { ViolationRecord } from '../types';
import { ShieldAlert, Users, PhoneOff, Car, Clock, ChevronRight, Activity, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface DashboardViewProps {
  violations: ViolationRecord[];
  onSelectViolation: (record: ViolationRecord) => void;
  onNavigateTab: (tab: 'studio' | 'live' | 'violations' | 'reports') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  violations,
  onSelectViolation,
  onNavigateTab,
}) => {
  // Aggregate statistics
  const totalViolations = violations.length;
  const noHelmetCount = violations.filter((v) => v.violationType === 'NO_HELMET').length;
  const tripleRidingCount = violations.filter((v) => v.violationType === 'TRIPLE_RIDING').length;
  const mobileUsageCount = violations.filter((v) => v.violationType === 'MOBILE_USAGE').length;
  const verifiedCount = violations.filter((v) => v.status === 'VERIFIED').length;
  const pendingCount = violations.filter((v) => v.status === 'PENDING_REVIEW').length;
  
  // Total fines calculated
  const totalFines = violations.reduce((acc, curr) => acc + (curr.fineAmount || 1000), 0);

  // Hourly distribution data (mock hourly aggregated from surveillance)
  const hourlyData = [
    { hour: '07:00', count: 4, helmet: 2, triple: 1, mobile: 1 },
    { hour: '08:00', count: 9, helmet: 6, triple: 2, mobile: 1 },
    { hour: '09:00', count: 14, helmet: 10, triple: 3, mobile: 1 },
    { hour: '10:00', count: 11, helmet: 7, triple: 2, mobile: 2 },
    { hour: '11:00', count: 7, helmet: 4, triple: 1, mobile: 2 },
    { hour: '12:00', count: 5, helmet: 3, triple: 1, mobile: 1 },
    { hour: '14:00', count: 6, helmet: 4, triple: 2, mobile: 0 },
    { hour: '16:00', count: 8, helmet: 5, triple: 1, mobile: 2 },
    { hour: '17:00', count: 13, helmet: 8, triple: 3, mobile: 2 },
    { hour: '18:00', count: 16, helmet: 11, triple: 3, mobile: 2 },
    { hour: '19:00', count: 10, helmet: 6, triple: 2, mobile: 2 },
  ];
  const maxHourly = Math.max(...hourlyData.map((d) => d.count), 1);

  // 7-day trend
  const sevenDayTrend = [
    { day: 'Mon', count: 32, rate: '86.2%' },
    { day: 'Tue', count: 28, rate: '88.1%' },
    { day: 'Wed', count: 35, rate: '84.9%' },
    { day: 'Thu', count: 24, rate: '90.2%' },
    { day: 'Fri', count: 41, rate: '82.4%' },
    { day: 'Sat', count: 39, rate: '83.7%' },
    { day: 'Today', count: totalViolations, rate: '87.5%' },
  ];

  const recentViolations = violations.slice(0, 5);

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Surveillance Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
            Traffic Monitoring & Violation Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Active CCTV Nodes: 4 online · Deep Learning CV Inference active · ISO 39001 Road Safety compliant
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('studio')}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center gap-1.5 transition-colors shadow-sm"
          >
            Launch Detection Studio
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigateTab('live')}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Activity className="w-3.5 h-3.5 text-red-400" />
            Live Camera Feed
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* KPI 1: Total Violations */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Violations</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-100">
              {totalViolations}
            </span>
            <div className="text-[11px] text-slate-500 mt-1">
              <span>{pendingCount} Pending Review</span>
            </div>
          </div>
        </div>

        {/* KPI 2: No Helmet Violations */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">No Helmet</span>
            <div className="w-2 h-2 rounded-full bg-red-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-red-400">
              {noHelmetCount}
            </span>
            <div className="text-[11px] text-slate-500 mt-1">
              <span>Sec 129 MV Act</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Triple Riding */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Triple Riding</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-400">
              {tripleRidingCount}
            </span>
            <div className="text-[11px] text-slate-500 mt-1">
              <span>Sec 128 MV Act</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Mobile Usage */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Mobile Phone</span>
            <PhoneOff className="w-4 h-4 text-orange-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-orange-400">
              {mobileUsageCount}
            </span>
            <div className="text-[11px] text-slate-500 mt-1">
              <span>Sec 184(c) Act</span>
            </div>
          </div>
        </div>

        {/* KPI 5: Total Vehicles Tracked */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Vehicles Tracked</span>
            <Car className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-cyan-400">
              1,248
            </span>
            <div className="text-[11px] text-slate-500 mt-1">
              <span>87.4% Helmet Compliance</span>
            </div>
          </div>
        </div>

        {/* KPI 6: Fines Assessed */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Challan Fines</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-400">
              ₹{totalFines.toLocaleString('en-IN')}
            </span>
            <div className="text-[11px] text-slate-500 mt-1">
              <span>{verifiedCount} Verified</span>
            </div>
          </div>
        </div>

      </div>

      {/* Analytics Row: Hourly Density & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Hourly Violation Histogram */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-100">Hourly Violation Density</h2>
                <p className="text-xs text-slate-400 mt-0.5">Surveillance detection frequency across day intervals</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-red-500" /> No Helmet
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Triple
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-orange-500" /> Phone
                </span>
              </div>
            </div>

            {/* Bar Chart Container */}
            <div className="mt-6 h-48 flex items-end justify-between gap-2 pt-4 border-b border-slate-800">
              {hourlyData.map((slot) => {
                const heightPct = Math.round((slot.count / maxHourly) * 100);
                const helmetPct = Math.round((slot.helmet / slot.count) * 100) || 0;
                const triplePct = Math.round((slot.triple / slot.count) * 100) || 0;
                const mobilePct = 100 - helmetPct - triplePct;

                return (
                  <div key={slot.hour} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                    {/* Hover Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity absolute -top-12 z-20 bg-slate-950 text-slate-200 border border-slate-700 rounded px-2 py-1 text-[11px] font-mono whitespace-nowrap shadow-xl">
                      {slot.hour}: {slot.count} violations (H:{slot.helmet} T:{slot.triple} M:{slot.mobile})
                    </div>
                    {/* Stacked Bar */}
                    <div
                      style={{ height: `${Math.max(heightPct, 8)}%` }}
                      className="w-full max-w-[32px] rounded-t-sm overflow-hidden flex flex-col justify-end bg-slate-800 group-hover:brightness-110 transition-all"
                    >
                      <div style={{ height: `${helmetPct}%` }} className="w-full bg-red-500/90" />
                      <div style={{ height: `${triplePct}%` }} className="w-full bg-amber-500/90" />
                      <div style={{ height: `${mobilePct}%` }} className="w-full bg-orange-500/90" />
                    </div>
                    <span className="text-[11px] font-mono text-slate-500">{slot.hour.slice(0, 2)}h</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Peak Incident Period: 17:00 - 19:00 (Rush hour commute)</span>
            <span className="font-mono text-amber-400">Max: 16 incidents/hr</span>
          </div>
        </div>

        {/* Violation Breakdown & 7-Day Trend */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-100">Violations By Category</h2>
            <p className="text-xs text-slate-400 mt-0.5">Distribution breakdown of recorded infractions</p>

            <div className="mt-5 space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">Riding Without Safety Helmet</span>
                  <span className="font-mono tabular-nums text-red-400 font-semibold">{noHelmetCount} ({Math.round((noHelmetCount / (totalViolations || 1)) * 100)}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${Math.round((noHelmetCount / (totalViolations || 1)) * 100)}%` }}
                    className="h-full bg-red-500 rounded-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">Triple Riding (3+ Occupants)</span>
                  <span className="font-mono tabular-nums text-amber-400 font-semibold">{tripleRidingCount} ({Math.round((tripleRidingCount / (totalViolations || 1)) * 100)}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${Math.round((tripleRidingCount / (totalViolations || 1)) * 100)}%` }}
                    className="h-full bg-amber-500 rounded-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">Mobile Phone Distraction</span>
                  <span className="font-mono tabular-nums text-orange-400 font-semibold">{mobileUsageCount} ({Math.round((mobileUsageCount / (totalViolations || 1)) * 100)}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${Math.round((mobileUsageCount / (totalViolations || 1)) * 100)}%` }}
                    className="h-full bg-orange-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <span className="text-xs font-medium text-slate-400">7-Day Compliance History</span>
            <div className="grid grid-cols-7 gap-1 mt-2 text-center">
              {sevenDayTrend.map((t) => (
                <div key={t.day} className="p-1 rounded bg-slate-800/60">
                  <div className="text-[10px] text-slate-400">{t.day}</div>
                  <div className="text-[11px] font-mono font-semibold text-slate-200 mt-0.5">{t.rate}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* CCTV Nodes & Recent Violations Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CCTV Camera Infrastructure Status */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-100">Surveillance Nodes</h2>
              <p className="text-xs text-slate-400">Networked traffic monitoring junctions</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              4 / 4 ONLINE
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
              <div>
                <div className="font-medium text-slate-200">CCTV-01 · Shivaji Chowk Junction</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">FPS: 30 · Model: YOLOv8+OCR · 1080p</div>
              </div>
              <span className="text-emerald-400 font-mono">LIVE</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
              <div>
                <div className="font-medium text-slate-200">CCTV-02 · Ring Road South Exit</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">FPS: 30 · Model: YOLOv8+OCR · 1080p</div>
              </div>
              <span className="text-emerald-400 font-mono">LIVE</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
              <div>
                <div className="font-medium text-slate-200">CCTV-03 · Outer Ring Rd Sector 4</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">FPS: 25 · Optical Zoom 4X · 2K</div>
              </div>
              <span className="text-emerald-400 font-mono">LIVE</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
              <div>
                <div className="font-medium text-slate-200">CCTV-04 · Airport Expressway Overpass</div>
                <div className="text-[11px] text-slate-500 font-mono mt-0.5">FPS: 30 · Night Vision Active · 1080p</div>
              </div>
              <span className="text-emerald-400 font-mono">LIVE</span>
            </div>
          </div>
        </div>

        {/* Recent Violations Feed */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-slate-100">Recent Violation Detections</h2>
                <p className="text-xs text-slate-400">Latest flagged vehicles awaiting officer confirmation</p>
              </div>
              <button
                onClick={() => onNavigateTab('violations')}
                className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
              >
                View Complete Log ({totalViolations})
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="pb-2.5 pl-1">VIOLATION ID</th>
                    <th className="pb-2.5">VIOLATION TYPE</th>
                    <th className="pb-2.5">VEHICLE PLATE</th>
                    <th className="pb-2.5">CONFIDENCE</th>
                    <th className="pb-2.5">TIMESTAMP</th>
                    <th className="pb-2.5">STATUS</th>
                    <th className="pb-2.5 text-right pr-1">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentViolations.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-800/40 transition-colors group">
                      <td className="py-2.5 pl-1 font-mono text-slate-400 font-semibold">{v.id}</td>
                      <td className="py-2.5">
                        <span className={`font-medium ${
                          v.violationType === 'NO_HELMET' ? 'text-red-400' :
                          v.violationType === 'TRIPLE_RIDING' ? 'text-amber-400' : 'text-orange-400'
                        }`}>
                          {v.violationTitle.split('(')[0]}
                        </span>
                      </td>
                      <td className="py-2.5">
                        <span className="font-mono font-bold text-amber-300 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                          {v.vehicleNumber}
                        </span>
                      </td>
                      <td className="py-2.5 font-mono text-slate-300 tabular-nums">
                        {Math.round(v.confidence * 100)}%
                      </td>
                      <td className="py-2.5 font-mono text-slate-400 tabular-nums">
                        {v.time} · {v.date}
                      </td>
                      <td className="py-2.5">
                        <span className={`text-[11px] font-mono font-semibold ${
                          v.status === 'VERIFIED' ? 'text-emerald-400' :
                          v.status === 'PENDING_REVIEW' ? 'text-amber-400' : 'text-slate-500'
                        }`}>
                          {v.status === 'VERIFIED' ? 'VERIFIED' :
                           v.status === 'PENDING_REVIEW' ? 'PENDING' : 'DISMISSED'}
                        </span>
                      </td>
                      <td className="py-2.5 text-right pr-1">
                        <button
                          onClick={() => onSelectViolation(v)}
                          className="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                        >
                          Evidence
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Automated polling active every 5s
            </span>
            <span>Total fine backlog: ₹{totalFines.toLocaleString('en-IN')}</span>
          </div>
        </div>

      </div>

    </div>
  );
};
