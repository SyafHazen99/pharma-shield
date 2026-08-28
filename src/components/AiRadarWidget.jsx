import React from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Wifi, 
  Radio, 
  Lock, 
  Sparkles
} from 'lucide-react';

export default function AiRadarWidget() {
  return (
    <div className="p-5 rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50/80 via-white to-slate-50 shadow-md shadow-blue-500/5 relative overflow-hidden space-y-4 font-sans">
      
      {/* Background Animated Radar Scan Grid Effect */}
      <div className="absolute top-0 right-0 w-64 h-full bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08)_0,transparent_70%)] pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        
        {/* Radar Left Brand Info */}
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-2xl bg-blue-600 border border-blue-400 flex items-center justify-center shrink-0 shadow-md shadow-blue-500/20 overflow-hidden">
            {/* Smooth GPU CSS Keyframe Radar Sweep (Zero React State Rerender Loop) */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-transparent origin-center animate-spin" style={{ animationDuration: '4s' }}></div>
            <Radio className="w-6 h-6 text-white relative z-10 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-slate-900 font-sans flex items-center gap-2">
                SENTRA AI Anti-Fraud Radar <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold flex items-center gap-1 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
                ACTIVE MONITOR
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Continuous Zero-Trust Computer Vision & Procurement Fraud Scanning
            </p>
          </div>
        </div>

        {/* Live Metrics Grid (Pure Zero-Leak Static Specs) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
          
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-0.5">
            <span className="text-slate-500 text-[10px] block flex items-center gap-1 font-sans font-medium">
              <ShieldCheck className="w-3 h-3 text-blue-600" /> System Integrity
            </span>
            <strong className="text-blue-700 font-bold text-sm font-mono">99.8% Valid</strong>
          </div>

          <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-0.5">
            <span className="text-slate-500 text-[10px] block flex items-center gap-1 font-sans font-medium">
              <Activity className="w-3 h-3 text-emerald-600" /> OCR Frame Audits
            </span>
            <strong className="text-emerald-700 font-bold text-sm font-mono">14.820</strong>
          </div>

          <div className="p-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-0.5 col-span-2 sm:col-span-1">
            <span className="text-slate-500 text-[10px] block flex items-center gap-1 font-sans font-medium">
              <Wifi className="w-3 h-3 text-blue-600" /> SATUSEHAT Sync
            </span>
            <strong className="text-slate-800 font-bold text-xs flex items-center gap-1 font-mono">
              <Lock className="w-3 h-3 text-emerald-600" /> Encrypted
            </strong>
          </div>

        </div>

      </div>

    </div>
  );
}
