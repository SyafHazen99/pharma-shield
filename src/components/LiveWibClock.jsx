import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export default function LiveWibClock({ className = '' }) {
  const [timeStr, setTimeStr] = useState('');
  const [dateStr, setDateStr] = useState('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      
      // Real-time WIB Asia/Jakarta formatting
      const timeFormatted = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(now);

      const dateFormatted = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(now);

      setTimeStr(timeFormatted);
      setDateStr(dateFormatted);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/90 border border-blue-200 font-mono text-xs shadow-sm whitespace-nowrap shrink-0 ${className}`}>
      <Clock className="w-4 h-4 text-blue-600 animate-pulse shrink-0" />
      <div className="flex items-center gap-2 whitespace-nowrap">
        <span className="font-extrabold text-blue-700 tracking-wider text-xs font-mono whitespace-nowrap">
          {timeStr} WIB
        </span>
        <span className="text-blue-400 font-bold">•</span>
        <span className="text-slate-600 text-[11px] font-mono font-medium whitespace-nowrap">
          {dateStr}
        </span>
      </div>
    </div>
  );
}
