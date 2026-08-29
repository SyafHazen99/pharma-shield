import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-8 border-t border-blue-500/30 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white py-3 px-4 text-xs font-mono text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center space-y-1.5 leading-relaxed">
        
        {/* Baris 1: Email + Hotline */}
        <div className="w-full flex items-center justify-center gap-2 text-[11px] sm:text-xs">
          <span>📧 contact@sentra.health.ai</span>
          <span className="text-blue-300">|</span>
          <span>📞 Hotline: +62 21 333 444</span>
        </div>

        {/* Baris 2: Nama Leader & QC */}
        <div className="w-full flex items-center justify-center gap-2 text-[11px] sm:text-xs text-blue-100">
          <span>Leader: <strong className="text-white font-bold">dr. Novia Dwi Anggraini</strong></span>
          <span className="text-blue-300">|</span>
          <span>QC & Design: <strong className="text-white font-bold">Asyraf Hadi</strong></span>
        </div>

      </div>
    </footer>
  );
}
