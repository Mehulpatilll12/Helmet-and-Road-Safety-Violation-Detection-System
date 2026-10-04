import React, { useState } from 'react';
import { ShieldAlert, KeyRound, User, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  onSuccess: (role: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  onSuccess,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [username, setUsername] = useState<string>('officer402');
  const [password, setPassword] = useState<string>('traffic2026');
  const [selectedRole, setSelectedRole] = useState<string>('Traffic Officer #402');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setErrorMsg('Please enter a username or badge ID');
      return;
    }
    setErrorMsg(null);
    onSuccess(selectedRole);
  };

  const handleQuickDemoAccess = (role: string) => {
    setSelectedRole(role);
    onSuccess(role);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 items-center justify-center text-amber-400 mb-1">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            Traffic Police Surveillance Access
          </h2>
          <p className="text-xs text-slate-400">
            RoadWatch AI · Helmet & Road Safety Enforcement Terminal
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-950/50 border border-red-800/60 text-red-300 text-xs text-center">
            {errorMsg}
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Badge ID / Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="officer402"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Security Passcode
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Terminal Access Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              <option value="Traffic Officer #402">Traffic Officer (Monitoring & e-Challan)</option>
              <option value="System Administrator">System Administrator (Full Privileges)</option>
              <option value="Road Safety Analyst">Road Safety Analyst (Read & Reports)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            Authenticate & Open Surveillance Terminal
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click All-Access / Demo Preset Buttons */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <span className="text-[11px] font-mono text-slate-500 block text-center uppercase tracking-wider">
            Quick Authorized Terminal Access
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleQuickDemoAccess('Traffic Officer #402')}
              className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors text-center"
            >
              Officer Access
            </button>
            <button
              onClick={() => handleQuickDemoAccess('System Administrator')}
              className="p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors text-center"
            >
              Administrator
            </button>
          </div>
        </div>

        {/* /all-access notice */}
        <div className="text-[10px] text-slate-500 text-center font-mono">
          Route /all-access direct authorization supported
        </div>

      </div>
    </div>
  );
};
