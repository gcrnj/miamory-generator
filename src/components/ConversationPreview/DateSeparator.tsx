'use client';

import React from 'react';

interface DateSeparatorProps {
  date: string;
}

export function DateSeparator({ date }: DateSeparatorProps) {
  if (!date) return null;

  return (
    <div className="flex justify-center my-3.5 select-none">
      <div className="text-[11px] font-semibold text-[#8E97A4] uppercase tracking-wider bg-[#1E222A]/75 px-3 py-0.5 rounded-full border border-white/5">
        {date}
      </div>
    </div>
  );
}
