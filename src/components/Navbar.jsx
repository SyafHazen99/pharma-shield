import React, { useState } from 'react';
import { 
  ShieldAlert, 
  UserCheck, 
  LogOut, 
  ChevronDown,
  FileSpreadsheet,
  Zap,
  Stethoscope
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
  openGoogleSheetsModal,
  criticalAlertCount
}) {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const roleInfo = ROLES[activeRole] || ROLES.DIRECTOR;

  return (
    <header className="sticky top-0 z-40 font-sans shadow-sm bg-white border-b border-slate-200">
      
      {/* Main Single-Row Navbar (Logo + Title on Left, Live WIB Clock on Right) */}
      <nav className="px-3 sm:px-4 py-2 flex items-center justify-between gap-2 max-w-full relative z-30">
        
        {/* Left: Official RSIA Logo & System Title */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Official RSIA Melinda Logo */}
          <img 
            src={BRANDING.logoUrl} 
            alt="SENTRA Healthcare AI Logo" 
            className="h-7 sm:h-8 md:h-9 w-auto object-contain shrink-0" 
          />

          {/* System Title */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1">
              <h1 className="text-xs sm:text-sm font-extrabold tracking-tight text-slate-900 leading-none whitespace-nowrap">
                {BRANDING.appName}
              </h1>
              <span className="px-1.5 py-0.2 rounded-full text-[8px] font-mono bg-blue-50 text-blue-700 border border-blue-200 font-bold whitespace-nowrap">
                v2.4
              </span>
            </div>
            <p className="text-[9px] text-slate-500 font-medium leading-tight mt-0.5 hidden md:block">
              {BRANDING.organization}
            </p>
          </div>
        </div>

        {/* Right: Prominent Live WIB Clock & Desktop Controls */}
        <div className="flex items-center gap-1.5 shrink-0 font-sans text-xs">
          
          {/* Prominent Bright Live WIB Clock (ALWAYS VISIBLE on Mobile & Desktop!) */}
          <div className="shrink-0">
            <LiveWibClock />
          </div>

          {/* Desktop-Only User Profile Chip & Role Switcher */}
          <div className="hidden lg:flex items-center gap-1.5 p-1 px-2.5 rounded-lg bg-slate-50 border border-slate-200 shrink-0">
            <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold shrink-0">
              <Stethoscope className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="font-extrabold text-slate-900 text-[11px] whitespace-nowrap">
              {currentUser?.name || 'dr. Novia Dwi Anggraini'}
            </div>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800 border border-blue-200 whitespace-nowrap shrink-0">
              {roleInfo.roomScope === 'ALL' ? 'Super Admin' : (roleInfo.roomScope || 'Gudang')}
            </span>
          </div>

          {/* Desktop Role Switcher Dropdown */}
          <div className="relative shrink-0 hidden lg:block">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all whitespace-nowrap shadow-sm"
              title="Pilih Wewenang & Filter Ruangan RS"
            >
              <UserCheck className="w-3.5 h-3.5 text-white shrink-0" />
              <span>Role Switcher</span>
              <ChevronDown className="w-3 h-3 shrink-0" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl border border-slate-200 shadow-2xl p-2 z-50 animate-in fade-in zoom-in duration-150">
                <div className="px-2.5 py-1.5 text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                  <span>Pilih Wewenang Ruangan RS</span>
                  <span className="text-emerald-600">Active</span>
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
                      className={`w-full text-left px-2.5 py-2 rounded-lg text-[11px] font-bold flex items-center justify-between transition-all mt-1 ${
                        isSelected ? 'bg-blue-600 text-white shadow-md' : 'text-slate-700 hover:bg-blue-50'
                      }`}
                    >
                      <div>
                        <div>{r.name}</div>
                        <div className={`text-[9px] font-mono font-normal ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
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

          {/* Desktop Quick Actions */}
          <button
            onClick={openGoogleSheetsModal}
            className="hidden lg:flex px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold items-center gap-1 transition-all shadow-sm whitespace-nowrap shrink-0"
            title="Sinkronisasi Otomatis Google Sheets dr. Novia"
          >
            <Zap className="w-3.5 h-3.5 text-white shrink-0" />
            <span>Sheets Sync</span>
          </button>

          <button
            onClick={openExcelModal}
            className="hidden lg:flex px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[11px] font-bold items-center gap-1 transition-all shadow-sm whitespace-nowrap shrink-0"
            title="Import Spreadsheet Excel (.xlsx) dr. Novia Dwi Anggraini"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Excel</span>
          </button>

          <button
            onClick={openAuditLog}
            className="hidden lg:flex px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-lg text-[11px] font-bold items-center gap-1 relative whitespace-nowrap shrink-0"
            title="Buka Audit Log Real-Time"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Audit</span>
            {criticalAlertCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse absolute -top-0.5 -right-0.5 border border-white" />
            )}
          </button>

          <button
            onClick={onLogout}
            className="hidden lg:flex p-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold transition-all items-center justify-center shrink-0"
            title="Keluar dari Sistem"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>

        </div>

      </nav>
    </header>
  );
}
