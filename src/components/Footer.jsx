import React from 'react';
import { BRANDING } from '../config/branding';

export default function Footer() {
  const projectLeaderName = typeof BRANDING.team?.projectLeader === 'object' 
    ? BRANDING.team.projectLeader.name 
    : (BRANDING.team?.projectLeader || 'dr. Novia Dwi Anggraini');

  const qcDesignerName = typeof BRANDING.team?.qcEngineerAndDesigner === 'object' 
    ? BRANDING.team.qcEngineerAndDesigner.name 
    : (BRANDING.team?.qcEngineerAndDesigner || 'Asyraf Hadi');

  return (
    <footer className="mt-8 border-t border-blue-500/30 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white py-3 px-4 text-xs font-mono">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-[10px] sm:text-xs">
          <span>📧 contact@sentra.health</span>
          <span className="text-blue-300">|</span>
          <span>📞 Hotline: +62 21 5589 55488</span>
        </div>

        <div className="flex items-center justify-center gap-2 text-[10px] sm:text-[11px] text-blue-100">
          <span>Leader: <strong className="text-white font-bold">{projectLeaderName}</strong></span>
          <span className="text-blue-300">|</span>
          <span>QC & Design: <strong className="text-white font-bold">{qcDesignerName}</strong></span>
        </div>
      </div>
    </footer>
  );
}
