'use client';

import React from 'react';
import { ReactionItem } from '@/types/conversation';

interface MessageReactionProps {
  reactions: ReactionItem[];
  isPov: boolean;
  showAvatar?: boolean;
}

export function MessageReaction({
  reactions,
  isPov,
  showAvatar = !isPov,
}: MessageReactionProps) {
  if (!reactions || reactions.length === 0) return null;

  return (
    <div
      className={`flex items-center gap-1.5 mt-1 select-none flex-wrap ${
        isPov
          ? `justify-end ${showAvatar ? 'pr-11' : 'pr-1'}`
          : 'justify-start pl-11'
      }`}
      data-testid="message-reactions-row"
    >
      {reactions.map((rx) => (
        <div
          key={rx.id}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[#1A1D24] text-white/90 border border-white/15 shadow-sm hover:scale-105 transition-transform"
        >
          <span className="text-sm leading-none">{rx.emoji}</span>
          {rx.count > 1 && (
            <span className="text-[11px] font-medium text-slate-300 leading-none">
              {rx.count}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
