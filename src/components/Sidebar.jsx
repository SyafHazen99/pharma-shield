import React, { useState } from 'react';
import { 
  BarChart3, 
  Boxes, 
  FileEdit, 
  CheckSquare, 
  ShoppingBag, 
  ScanLine, 
  RotateCcw, 
  Receipt,
  Lock,
  ShieldAlert,
  Menu,
  X,
  ChevronRight,
  UserCheck,
  Zap,
  FileSpreadsheet,
  LogOut
} from 'lucide-react';
import { ROLES, isStageAuthorized } from '../config/rbac';

const ALL_STAGES = [
  { id: 0, title: 'Executive BI Dashboard', subtitle: 'Overview & KPI Metrics', icon: BarChart3 },
  { id: 1, title: 'Monitoring Stok', subtitle: 'PIC: Apoteker Gudang', icon: Boxes },
  { id: 2, title: 'Purchase Request', subtitle: 'PIC: Kepala Farmasi', icon: FileEdit },
  { id: 3, title: 'Approval PR', subtitle: 'PIC: Direktur / Keuangan', icon: CheckSquare },
  { id: 4, title: 'Purchase Order', subtitle: 'PIC: Tim Purchasing', icon: ShoppingBag },
  { id: 5, title: 'Goods Receipt', subtitle: 'PIC: Apoteker Gudang', icon: ScanLine },
  { id: 6, title: 'Stock Update', subtitle: 'PIC: Kepala Farmasi', icon: RotateCcw },
  { id: 7, title: 'Invoice & Pay', subtitle: 'PIC: Keuangan', icon: Receipt },
];

export default function Sidebar({ 
  activeStage, 
  setActiveStage, 
  activeRole, 
  setActiveRole,
  currentUser, 
  pendingCounts,
  openAuditLog,
  openExcelModal,
  openGoogleSheetsModal,
  onLogout
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentRoleConfig = ROLES[activeRole] || ROLES.DIRECTOR;
  const isSuperAdmin = currentUser?.role === 'DIRECTOR' || activeRole === 'DIRECTOR' || activeRole === 'DIREKTUR_FERDI';

  const visibleStages = isSuperAdmin 
    ? ALL_STAGES 
    : ALL_STAGES.filter(stage => isStageAuthorized(activeRole, stage.id));

  const activeStageObj = ALL_STAGES.find(s => s.id === activeStage) || ALL_STAGES[0];

  const handleStageSelect = (stageId) => {
    setActiveStage(stageId);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* PERFECT FIXED MOBILE TOP NAVIGATION BAR (Fixed pinned at top-0 left-0 right-0 z-50 at all times!) */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-3.5 py-2.5 flex items-center justify-between shadow-md fixed top-0 left-0 right-0 z-50 font-sans max-w-full overflow-hidden">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center justify-center font-bold shadow-md shadow-blue-500/20 active:scale-95 shrink-0"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="min-w-0">
            <div className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider truncate">Tahapan Aktif</div>
            <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1 min-w-0">
              <span className="truncate">{activeStageObj.title}</span>
              <ChevronRight className="w-3 h-3 text-blue-600 shrink-0" />
            </div>
          </div>
        </div>

        <button
          onClick={() => setMobileMenuOpen(true)}
          className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap shrink-0"
        >
          {visibleStages.length} Tahapan
        </button>
      </div>

      {/* MOBILE SLIDE-OVER DRAWER BACKDROP */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* SIDEBAR CONTAINER (Desktop Fixed + Mobile Slide-Over Drawer) */}
      <aside className={`
        fixed lg:static top-0 left-0 bottom-0 z-50 lg:z-auto
        w-80 lg:w-72 bg-white border-r border-slate-200 p-4 sm:p-5 
        flex flex-col justify-between shrink-0 space-y-6 shadow-2xl lg:shadow-sm font-sans
        transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-100px)] lg:max-h-none">
          
          {/* Mobile Drawer Header with Close Button */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 lg:hidden">
            <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Menu & Kontrol Sistem</span>
            </div>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Extra System Controls (Sync, Import, Audit, Logout) */}
          <div className="lg:hidden p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Aksi Cepat Mobile</div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  openGoogleSheetsModal && openGoogleSheetsModal();
                  setMobileMenuOpen(false);
                }}
                className="px-2.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Sheets Sync</span>
              </button>

              <button
                onClick={() => {
                  openExcelModal && openExcelModal();
                  setMobileMenuOpen(false);
                }}
                className="px-2.5 py-2 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Import Excel</span>
              </button>

              <button
                onClick={() => {
                  openAuditLog && openAuditLog();
                  setMobileMenuOpen(false);
                }}
                className="px-2.5 py-2 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
                <span>Audit Logs</span>
              </button>

              <button
                onClick={() => {
                  onLogout && onLogout();
                  setMobileMenuOpen(false);
                }}
                className="px-2.5 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Active Role RBAC Status Header */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80 space-y-2 font-sans overflow-hidden">
            <div className="flex items-center justify-between gap-1 text-slate-600">
              <span className="flex items-center gap-1.5 font-bold text-blue-700 text-xs shrink-0">
                <Lock className="w-3.5 h-3.5 text-blue-600" /> RBAC Enforced
              </span>
              <span className="text-[9px] bg-blue-600 text-white px-2 py-0.5 rounded-lg font-mono font-bold tracking-tight whitespace-nowrap shrink-0 shadow-sm">
                dr. Novia Pipeline
              </span>
            </div>
            <div className="text-slate-900 font-extrabold text-sm pt-0.5">{currentRoleConfig.name}</div>
            <div className="text-[11px] text-slate-600 leading-relaxed font-sans font-medium">
              {currentRoleConfig.description}
            </div>
          </div>

          {/* Pipeline Title */}
          <div className="px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Tahapan Diberikan ({visibleStages.length})
            </h2>
          </div>

          {/* RBAC Filtered Menu List */}
          <nav className="space-y-1.5">
            {visibleStages.map((stage) => {
              const Icon = stage.icon;
              const isActive = activeStage === stage.id;
              const badgeCount = pendingCounts[stage.id];

              return (
                <button
                  key={stage.id}
                  onClick={() => handleStageSelect(stage.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-200 text-left font-sans ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 font-bold'
                      : 'text-slate-700 hover:bg-blue-50/80 hover:text-blue-700 border border-transparent font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-none flex items-center gap-1">
                        {stage.title}
                      </div>
                      <div className={`text-[10px] font-mono mt-1 ${isActive ? 'text-blue-100' : 'text-slate-400'}`}>
                        {stage.subtitle}
                      </div>
                    </div>
                  </div>

                  {badgeCount > 0 && (
                    <span className={`px-2.5 py-0.5 text-[10px] font-extrabold font-mono rounded-full ${
                      isActive ? 'bg-white text-blue-700' : 'bg-blue-600 text-white'
                    }`}>
                      {badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* RBAC Info Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs font-sans">
          <div className="flex items-center gap-1.5 text-slate-800 font-bold">
            <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" /> Restriksi Akses RBAC Active
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            Tahapan wewenang dibatasi sesuai peranan aktif staff RS.
          </p>
        </div>

      </aside>
    </>
  );
}
