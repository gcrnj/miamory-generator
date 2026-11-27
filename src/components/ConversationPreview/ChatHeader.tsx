'use client';

import React from 'react';
import { ConversationSettings, Participant } from '@/types/conversation';
import { ChevronLeft, Phone, Video, Info } from 'lucide-react';

interface ChatHeaderProps {
  settings: ConversationSettings;
  participants: Participant[];
}

export function ChatHeader({ settings, participants }: ChatHeaderProps) {
  const participantCount = participants.length;
  const participantNamesSummary = participants
    .slice(0, 3)
    .map((p) => p.name.split(' ')[0])
    .join(', ');

  const subtitle =
    settings.groupDescription ||
    (participantCount > 3
      ? `${participantNamesSummary}, and ${participantCount - 3} others`
      : participantNamesSummary);

  return (
    <div
      className="flex items-center justify-between px-3.5 py-3 border-b border-white/10 select-none"
      style={{ backgroundColor: '#242832' }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          type="button"
          tabIndex={-1}
          className="text-blue-400 hover:text-blue-300 transition-colors p-0.5 -ml-1 focus:outline-none"
          title="Back"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Group Avatar */}
        <div className="relative shrink-0">
          {settings.groupAvatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.groupAvatarUrl}
              alt={settings.groupName}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-inner ring-1 ring-white/10"
              style={{ backgroundColor: settings.groupAvatarColor || '#E11D48' }}
            >
              {settings.groupAvatarInitials || 'GC'}
            </div>
          )}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-[#242832]" />
        </div>

        {/* Group Info */}
        <div className="min-w-0 flex flex-col justify-center">
          <h2 className="text-white font-semibold text-[15px] leading-tight truncate">
            {settings.groupName}
          </h2>
          <p className="text-[#9BA1A6] text-xs leading-tight truncate mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-3.5 text-[#38BDF8] shrink-0 pl-2">
        <Phone className="w-4 h-4 cursor-default opacity-85 hover:opacity-100 transition-opacity" />
        <Video className="w-5 h-5 cursor-default opacity-85 hover:opacity-100 transition-opacity" />
        <Info className="w-4 h-4 cursor-default opacity-85 hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
