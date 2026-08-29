import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-blue-500/30 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white py-3 px-3 text-xs font-mono">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center space-y-1.5 text-center">
        
        {/* Line 1: Contact & Hotline */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] sm:text-xs">
          <span className="whitespace-nowrap">📧 contact@sentra.health.ai</span>
          <span className="text-blue-300 hidden sm:inline">|</span>
          <span className="whitespace-nowrap">📞 Hotline: +62 21 333 444</span>
        </div>

        {/* Line 2: Team Leadership */}
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] sm:text-xs text-blue-100">
          <span className="whitespace-nowrap">Leader: <strong className="text-white font-bold">dr. Novia Dwi Anggraini</strong></span>
          <span className="text-blue-300 hidden sm:inline">|</span>
          <span className="whitespace-nowrap">QC & Design: <strong className="text-white font-bold">Asyraf Hadi</strong></span>
        </div>

      </div>
    </footer>
  );
}
