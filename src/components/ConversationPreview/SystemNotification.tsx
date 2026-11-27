'use client';

import React from 'react';
import { SystemEventItem } from '@/types/conversation';

interface SystemNotificationProps {
  event: SystemEventItem;
}

export function SystemNotification({ event }: SystemNotificationProps) {
  return (
    <div className="flex justify-center my-2.5 px-4 select-none">
      <div className="inline-flex items-center justify-center max-w-[90%] text-center text-xs text-[#9DA7B3] bg-[#2C323E]/80 backdrop-blur-sm px-3.5 py-1 rounded-full border border-white/5 shadow-xs">
        <span>{event.text}</span>
      </div>
    </div>
  );
}
