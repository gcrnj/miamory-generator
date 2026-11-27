'use client';

import React, { useMemo } from 'react';
import {
  ConversationSettings,
  ExportSettings,
  Participant,
  TimelineItem,
  MessageItem,
  SystemEventItem,
} from '@/types/conversation';
import { ChatHeader } from './ChatHeader';
import { MessageBubble } from './MessageBubble';
import { SystemNotification } from './SystemNotification';
import { DateSeparator } from './DateSeparator';

interface ConversationPreviewProps {
  timeline: TimelineItem[];
  settings: ConversationSettings;
  participants: Participant[];
  exportSettings: ExportSettings;
  previewRef: React.RefObject<HTMLDivElement | null>;
  isExporting?: boolean;
}

export function ConversationPreview({
  timeline,
  settings,
  participants,
  exportSettings,
  previewRef,
  isExporting = false,
}: ConversationPreviewProps) {
  const participantsMap = useMemo(() => {
    const map = new Map<string, Participant>();
    participants.forEach((p) => map.set(p.id, p));
    return map;
  }, [participants]);

  // Filter items based on selection export mode
  const filteredTimeline = useMemo(() => {
    let items = timeline;

    if (exportSettings.selectedOnly && exportSettings.selectedItemIds.length > 0) {
      items = items.filter((item) => exportSettings.selectedItemIds.includes(item.id));
    }

    if (!exportSettings.includeSystemEvents) {
      items = items.filter((item) => item.type !== 'system');
    }

    return items;
  }, [timeline, exportSettings]);

  return (
    <div className="flex flex-col items-center justify-start w-full p-4 md:p-6">
      {/* Container with exact background color #242832 */}
      <div
        ref={previewRef}
        id="miamory-preview-canvas"
        className="w-full h-[640px] max-h-[calc(100vh-7rem)] min-h-[360px] relative flex flex-col overflow-hidden shadow-2xl rounded-2xl border border-white/10 transition-all duration-200"
        style={{
          maxWidth: `${settings.previewWidth || 420}px`,
          backgroundColor: '#242832', // EXACT REQUIRED BACKGROUND COLOR
          color: '#F3F4F6',
        }}
      >
        {/* Optional Chat Header */}
        {exportSettings.includeHeader && (
          <ChatHeader settings={settings} participants={participants} />
        )}

        {/* Conversation Body */}
        <div
          data-preview-scroll-viewport
          className="flex-1 min-h-0 overflow-y-auto p-3.5"
        >
          <div data-preview-scroll-content className="min-h-full flex flex-col space-y-1">
            {filteredTimeline.length === 0 ? (
              <div className="flex flex-col items-center justify-center my-auto py-16 text-center text-gray-500">
                <span className="text-3xl mb-2">💬</span>
                <p className="text-sm font-medium">No messages to display</p>
                <p className="text-xs text-gray-400 mt-1">
                  Add messages or load the sample from the editor.
                </p>
              </div>
            ) : (
              filteredTimeline.map((item, index) => {
                // Date divider
                const showDateDivider = item.dateDivider;

                if (item.type === 'system') {
                  const sysEvent = item as SystemEventItem;
                  return (
                    <React.Fragment key={sysEvent.id}>
                      {showDateDivider && <DateSeparator date={item.dateDivider!} />}
                      <SystemNotification event={sysEvent} />
                    </React.Fragment>
                  );
                }

                const msg = item as MessageItem;
                const isPov = msg.senderId === settings.povParticipantId;
                const sender = participantsMap.get(msg.senderId);

                // Check consecutive sender grouping
                const prevItem = index > 0 ? filteredTimeline[index - 1] : null;
                const nextItem =
                  index < filteredTimeline.length - 1 ? filteredTimeline[index + 1] : null;

                const isPrevSameSender =
                  prevItem &&
                  prevItem.type === 'message' &&
                  (prevItem as MessageItem).senderId === msg.senderId &&
                  !msg.dateDivider;

                const isNextSameSender =
                  nextItem &&
                  nextItem.type === 'message' &&
                  (nextItem as MessageItem).senderId === msg.senderId &&
                  !(nextItem as MessageItem).dateDivider;

                const isFirstInGroup = !isPrevSameSender;
                const isLastInGroup = !isNextSameSender;

                return (
                  <React.Fragment key={msg.id}>
                    {showDateDivider && <DateSeparator date={msg.dateDivider!} />}
                    <MessageBubble
                      message={msg}
                      sender={sender}
                      isPov={isPov}
                      isFirstInGroup={isFirstInGroup}
                      isLastInGroup={isLastInGroup}
                      chatThemeColor={settings.chatThemeColor}
                      showReactionRow={exportSettings.includeReactions}
                      showTimestamps={exportSettings.includeTimestamps}
                      showPovAvatar={settings.includePovAvatar}
                    />
                  </React.Fragment>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
