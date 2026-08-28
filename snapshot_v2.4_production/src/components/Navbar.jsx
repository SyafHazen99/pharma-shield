import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Brain, 
  UserCheck, 
  LogOut, 
  Info, 
  X, 
  Building2,
  Lock,
  ChevronDown,
  FileSpreadsheet
} from 'lucide-react';
import { BRANDING } from '../config/branding';
import { ROLES } from '../config/rbac';
import LiveWibClock from './LiveWibClock';

export default function Navbar({ 
  activeRole, 
  setActiveRole, 
  currentUser,
  onLogout,
  openAuditLog, 
  openExcelModal,
  criticalAlertCount 
}) {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const roleInfo = ROLES[activeRole] || ROLES.DIRECTOR;
  const isDirectorUser = currentUser?.role === 'DIRECTOR';

  const projectLeaderName = typeof BRANDING.team?.projectLeader === 'object' 
    ? BRANDING.team.projectLeader.name 
    : (BRANDING.team?.projectLeader || 'dr. Novia Dwi Anggraini');

  const qcDesignerName = typeof BRANDING.team?.qcEngineerAndDesigner === 'object' 
    ? BRANDING.team.qcEngineerAndDesigner.name 
    : (BRANDING.team?.qcEngineerAndDesigner || 'Asyraf Hadi');

  return (
    <>
      {/* Top Clinical Header Bar matching reference image */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white px-6 py-1.5 text-xs font-mono flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            📧 contact@sentra.health
          </span>
          <span className="hidden sm:inline text-blue-200">|</span>
          <span className="hidden sm:inline">
            📞 Emergency Hotline: +62 21 5589 55488
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-blue-100 text-[11px]">Leader: <strong className="text-white">{projectLeaderName}</strong></span>
          <span className="text-blue-200">|</span>
          <span className="text-blue-100 text-[11px]">QC Engineer & Design: <strong className="text-white">{qcDesignerName}</strong></span>
        </div>
      </div>

      <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-3 sticky top-0 z-40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md shadow-blue-500/5 font-sans">
        
        {/* Left: Branding & App Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-600/30 shrink-0">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-extrabold tracking-tight text-slate-900 font-sans">
                {BRANDING.appName}
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                v{BRANDING.version}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-sans font-medium">
              {BRANDING.organization} • Anti-Fraud Hospital System
            </p>
          </div>
        </div>

        {/* Center: Live WIB Clock & Authenticated Staff Profile */}
        <div className="flex items-center gap-3">
          
          {/* Real-Time Ticking WIB Clock Widget */}
          <div className="hidden sm:block">
            <LiveWibClock />
          </div>

          {/* Authenticated Staff User Pill */}
          <div className="flex items-center gap-2.5 p-1.5 px-3 rounded-2xl bg-slate-50 border border-slate-200 font-sans text-xs">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150'}
              alt="Staff Avatar"
              className="w-8 h-8 rounded-xl object-cover border border-blue-500/40"
            />
            <div className="text-left leading-tight hidden md:block">
              <div className="font-bold text-slate-900 text-xs">{currentUser?.name || 'Staff User'}</div>
              <div className="text-[10px] text-slate-500 truncate max-w-[160px] font-mono">{currentUser?.email}</div>
            </div>

            <span className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              {roleInfo.name}
            </span>
          </div>

          {/* Quick Role Switcher Dropdown - STRICTLY RESTRICTED TO DIRECTOR ONLY */}
          {isDirectorUser ? (
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className="p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                title="Super Admin Role Switcher"
              >
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span className="hidden sm:inline">Super Admin Switcher</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in duration-150">
                  <div className="px-3 py-2 text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Pilih Wewenang RS (RBAC Active)
                  </div>
                  {Object.keys(ROLES).map((roleKey) => {
                    const r = ROLES[roleKey];
                    const isSelected = activeRole === roleKey;
                    return (
                      <button
                        key={roleKey}
                        onClick={() => {
                          setActiveRole(roleKey);
                          setShowRoleDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-2xl text-xs font-sans font-bold flex items-center justify-between transition-all mt-1 ${
                          isSelected ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:bg-blue-50'
                        }`}
                      >
                        <div>
                          <div>{r.name}</div>
                          <div className={`text-[10px] font-mono font-normal ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                            {r.roleTitle}
                          </div>
                        </div>
                        {isSelected && <span className="text-xs">✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="p-2 bg-slate-100 rounded-2xl text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Role Enforced
            </div>
          )}

          {/* Import Excel Button */}
          <button
            onClick={openExcelModal}
            className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-2xl text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-sm"
            title="Import Spreadsheet Excel (.xlsx) dr. Novia Dwi Anggraini"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="hidden md:inline">Import Excel (.xlsx)</span>
          </button>

          {/* Global Audit Log Inspector Trigger */}
          <button
            onClick={openAuditLog}
            className="p-2.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all relative"
            title="Buka Audit Log Real-Time"
          >
            <ShieldAlert className="w-4 h-4 text-blue-600" />
            <span className="hidden md:inline font-mono">Audit Log</span>
            {criticalAlertCount > 0 && (
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse absolute -top-1 -right-1 border-2 border-white" />
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="p-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-2xl text-xs font-bold transition-all flex items-center gap-1"
            title="Keluar dari Sistem"
          >
            <LogOut className="w-4 h-4" />
          </button>

        </div>

      </nav>
    </>
  );
}
