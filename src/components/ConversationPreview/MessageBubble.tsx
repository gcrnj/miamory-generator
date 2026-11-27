'use client';

import React, { useState } from 'react';
import { MessageItem, Participant } from '@/types/conversation';
import { MessageReaction } from './MessageReaction';
import { getInitials } from '@/utils/timeUtils';

interface MessageBubbleProps {
  message: MessageItem;
  sender?: Participant;
  isPov: boolean;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
  chatThemeColor?: string;
  showReactionRow?: boolean;
  showTimestamps?: boolean;
  showPovAvatar?: boolean;
}

export function MessageBubble({
  message,
  sender,
  isPov,
  isFirstInGroup,
  isLastInGroup,
  chatThemeColor = '#0A7CFF',
  showReactionRow = true,
  showTimestamps = true,
  showPovAvatar = false,
}: MessageBubbleProps) {
  const [imageError, setImageError] = useState(false);

  const senderName = sender?.name || 'Unknown';
  const senderColor = sender?.nameColor || '#F472B6';
  const avatarColor = sender?.avatarColor || '#64748B';
  const initials = getInitials(senderName);

  // Grouping corner classes
  let bubbleCornerClasses = '';
  if (isPov) {
    if (isFirstInGroup && isLastInGroup) {
      bubbleCornerClasses = 'rounded-2xl rounded-br-sm';
    } else if (isFirstInGroup) {
      bubbleCornerClasses = 'rounded-2xl rounded-br-md';
    } else if (isLastInGroup) {
      bubbleCornerClasses = 'rounded-2xl rounded-tr-md rounded-br-sm';
    } else {
      bubbleCornerClasses = 'rounded-2xl rounded-tr-md rounded-br-md';
    }
  } else {
    if (isFirstInGroup && isLastInGroup) {
      bubbleCornerClasses = 'rounded-2xl rounded-bl-sm';
    } else if (isFirstInGroup) {
      bubbleCornerClasses = 'rounded-2xl rounded-bl-md';
    } else if (isLastInGroup) {
      bubbleCornerClasses = 'rounded-2xl rounded-tl-md rounded-bl-sm';
    } else {
      bubbleCornerClasses = 'rounded-2xl rounded-tl-md rounded-bl-md';
    }
  }

  return (
    <div className={`flex flex-col my-1 w-full ${isPov ? 'items-end' : 'items-start'}`}>
      <div className={`flex items-start gap-2 max-w-[85%] ${isPov ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Incoming messages always show their sender avatar; the POV avatar is optional. */}
        {(!isPov || showPovAvatar) && (
          <div className="w-8 h-8 shrink-0 select-none">
            {sender?.avatarUrl && !imageError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={sender.avatarUrl}
                alt={senderName}
                onError={() => setImageError(true)}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10 shadow-sm"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-sm ring-1 ring-white/10"
                style={{ backgroundColor: avatarColor }}
                title={`${senderName} (${sender?.role || 'Member'})`}
              >
                {initials}
              </div>
            )}
          </div>
        )}

        {/* Message Content Container */}
        <div className={`flex flex-col ${isPov ? 'items-end' : 'items-start'} min-w-0`}>
          {/* Sender Name (Non-POV, first message in group only) */}
          {!isPov && isFirstInGroup && (
            <div className="flex items-center gap-1.5 mb-1 pl-1">
              <span
                className="text-[12px] font-semibold tracking-wide drop-shadow-xs"
                style={{ color: senderColor }}
              >
                {senderName}
              </span>
              {sender?.role && (
                <span className="text-[10px] text-gray-400 font-normal">
                  • {sender.role}
                </span>
              )}
            </div>
          )}

          {/* Actual Message Bubble */}
          <div
            className={`px-3.5 py-2 text-[14px] leading-relaxed break-words shadow-sm transition-all ${bubbleCornerClasses} ${
              isPov
                ? 'text-white'
                : 'bg-[#333946] text-[#F3F4F6] border border-white/5'
            }`}
            style={{
              backgroundColor: isPov ? chatThemeColor : '#333946',
            }}
          >
            <p className="whitespace-pre-wrap select-text">{message.text || ' '}</p>

            {/* Bubble Footer: Timestamp */}
            {showTimestamps && message.showTimestamp !== false && (
              <div
                className={`flex items-center gap-1 text-[10px] mt-1 select-none ${
                  isPov ? 'justify-end text-white/70' : 'justify-end text-gray-400'
                }`}
              >
                <span>{message.timestamp}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* REACTIONS: STRICTLY BELOW the message bubble, visually separated! */}
      {showReactionRow && message.reactions && message.reactions.length > 0 && (
        <MessageReaction reactions={message.reactions} isPov={isPov} />
      )}
    </div>
  );
}
