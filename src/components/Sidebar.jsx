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
  ChevronRight
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

export default function Sidebar({ activeStage, setActiveStage, activeRole, currentUser, pendingCounts }) {
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
      {/* MOBILE TOP NAVIGATION BAR (Visible only on mobile/tablet < lg) */}
      <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm sticky top-[41px] z-30 font-sans">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all border border-blue-200 flex items-center justify-center font-bold"
            aria-label="Toggle Mobile Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div>
            <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Tahapan Aktif</div>
            <div className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
              <span>{activeStageObj.title}</span>
              <ChevronRight className="w-3 h-3 text-blue-600" />
            </div>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-blue-100 text-blue-800 border border-blue-200 whitespace-nowrap">
          {visibleStages.length} Tahapan
        </span>
      </div>

      {/* MOBILE SLIDE-OVER DRAWER BACKDROP */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
        />
      )}

      {/* SIDEBAR CONTAINER (Desktop Fixed + Mobile Slide-Over Drawer) */}
      <aside className={`
        fixed lg:static top-0 left-0 bottom-0 z-50 lg:z-auto
        w-80 lg:w-72 bg-white border-r border-slate-200 p-5 
        flex flex-col justify-between shrink-0 space-y-6 shadow-2xl lg:shadow-sm font-sans
        transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-120px)] lg:max-h-none">
          
          {/* Mobile Drawer Header with Close Button */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 lg:hidden">
            <span className="text-xs font-extrabold text-slate-900 font-sans">Menu Navigasi Tahapan</span>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
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
