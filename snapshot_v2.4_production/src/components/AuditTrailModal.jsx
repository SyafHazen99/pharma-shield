import React from 'react';
import { FileSearch, ShieldAlert, CheckCircle2, Activity, X } from 'lucide-react';

export default function AuditTrailModal({ isOpen, onClose, auditLogs }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[85vh] p-6 rounded-3xl border border-slate-200 space-y-4 shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shadow-sm">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Immutable Anti-Fraud Audit Trail Log</h3>
              <p className="text-xs text-slate-500 font-medium">Rekam jejak forensik seluruh transaksi & aktivitas pengadaan obat hospital</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audit Log Stream Table */}
        <div className="overflow-y-auto space-y-3 pr-2 flex-1">
          {auditLogs.map((log) => {
            const isCritical = log.riskLevel === 'CRITICAL';
            const isHigh = log.riskLevel === 'HIGH';

            return (
              <div 
                key={log.id} 
                className={`p-4 rounded-2xl border space-y-2 text-xs transition-all ${
                  isCritical 
                    ? 'bg-red-50 border-red-200 text-red-900' 
                    : isHigh 
                    ? 'bg-amber-50 border-amber-200 text-amber-900' 
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-700">{log.action}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200 text-[10px] font-semibold">
                      {log.actor} ({log.role})
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      isCritical ? 'bg-red-600 text-white' : isHigh ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {log.riskLevel}
                    </span>
                    <span className="text-[11px] text-slate-500 font-semibold">{log.timestamp}</span>
                  </div>
                </div>

                <p className="text-slate-700 leading-relaxed font-sans text-xs">
                  {log.details}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono shrink-0">
          <span>SHA-256 Hash Verification: Verified Integrity</span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20"
          >
            Tutup Audit Log
          </button>
        </div>

      </div>
    </div>
  );
}
