import React from 'react';
import { ShieldAlert, Video, Eye, FileText, Bell, Camera, UserCheck } from 'lucide-react';

export type NavTab = 'dashboard' | 'studio' | 'live' | 'violations' | 'reports';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingViolationsCount: number;
  userRole: string;
  onToggleRole: () => void;
  onSimulateAlert: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  pendingViolationsCount,
  userRole,
  onToggleRole,
  onSimulateAlert,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:border-amber-400/60 transition-colors">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-slate-100 flex items-center gap-1.5">
              RoadWatch AI
              <span className="text-[11px] font-mono text-amber-400 font-semibold tracking-normal px-1.5 py-0.5 rounded bg-amber-950/50 border border-amber-800/40">
                TRAFFIC SURVEILLANCE
              </span>
            </span>
          </div>
        </button>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'dashboard'
                ? 'bg-slate-800 text-slate-100 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Eye className="w-4 h-4" />
            Dashboard
          </button>

          <button
            onClick={() => onSelectTab('studio')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'studio'
                ? 'bg-slate-800 text-slate-100 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Video className="w-4 h-4" />
            Detection Studio
          </button>

          <button
            onClick={() => onSelectTab('live')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'live'
                ? 'bg-slate-800 text-slate-100 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Camera className="w-4 h-4" />
            Live Camera
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-pulse ml-0.5" />
          </button>

          <button
            onClick={() => onSelectTab('violations')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'violations'
                ? 'bg-slate-800 text-slate-100 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Violations
            {pendingViolationsCount > 0 && (
              <span className="ml-1 text-[11px] font-mono font-semibold px-1.5 py-0.2 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                {pendingViolationsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onSelectTab('reports')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              currentTab === 'reports'
                ? 'bg-slate-800 text-slate-100 border border-slate-700'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            Reports & Challan
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onSimulateAlert}
            title="Trigger simulated live violation alert for demonstration"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-amber-300 bg-amber-950/40 border border-amber-800/60 hover:bg-amber-900/50 rounded-md transition-colors"
          >
            <Bell className="w-3.5 h-3.5" />
            Simulate Alert
          </button>

          <button
            onClick={onToggleRole}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded-md bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>{userRole}</span>
          </button>
        </div>

      </div>

      {/* Mobile nav bar row */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800/80 px-2 py-2 overflow-x-auto text-xs bg-slate-950">
        <button
          onClick={() => onSelectTab('dashboard')}
          className={`px-2.5 py-1 rounded ${currentTab === 'dashboard' ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => onSelectTab('studio')}
          className={`px-2.5 py-1 rounded ${currentTab === 'studio' ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}
        >
          Studio
        </button>
        <button
          onClick={() => onSelectTab('live')}
          className={`px-2.5 py-1 rounded ${currentTab === 'live' ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}
        >
          Live Feed
        </button>
        <button
          onClick={() => onSelectTab('violations')}
          className={`px-2.5 py-1 rounded ${currentTab === 'violations' ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}
        >
          Violations ({pendingViolationsCount})
        </button>
        <button
          onClick={() => onSelectTab('reports')}
          className={`px-2.5 py-1 rounded ${currentTab === 'reports' ? 'text-amber-400 font-semibold' : 'text-slate-400'}`}
        >
          Reports
        </button>
      </div>
    </header>
  );
};
