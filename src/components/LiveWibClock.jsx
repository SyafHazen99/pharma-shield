import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function LiveWibClock({ className = '' }) {
  const [timeStr, setTimeStr] = useState('');
  const [shortTimeStr, setShortTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      
      // Full time with seconds (hh:mm:ss)
      const timeFormatted = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(now);

      // Short time for mobile (hh:mm)
      const shortTimeFormatted = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(now);

      const dateFormatted = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(now);

      setTimeStr(timeFormatted);
      setShortTimeStr(shortTimeFormatted);
      setDateStr(dateFormatted);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-blue-50/90 border border-blue-200 font-mono text-[10px] sm:text-xs shadow-sm whitespace-nowrap shrink-0 max-w-full overflow-hidden ${className}`}>
      <Clock className="w-3 sm:w-4 h-3 sm:h-4 text-blue-600 animate-pulse shrink-0" />
      <div className="flex items-center gap-1 sm:gap-2 whitespace-nowrap min-w-0">
        
        {/* Full time for Desktop, Short time for Mobile */}
        <span className="hidden sm:inline font-extrabold text-blue-700 tracking-wider text-xs font-mono whitespace-nowrap">
          {timeStr} WIB
        </span>
        <span className="inline sm:hidden font-extrabold text-blue-700 text-[10px] font-mono whitespace-nowrap">
          {shortTimeStr} WIB
        </span>

        {/* Date string hidden on small mobile, visible on sm and up */}
        <span className="hidden sm:inline text-blue-400 font-bold">•</span>
        <span className="hidden sm:inline text-slate-600 text-[11px] font-mono font-medium whitespace-nowrap">
          {dateStr}
        </span>

      </div>
    </div>
  );
}
