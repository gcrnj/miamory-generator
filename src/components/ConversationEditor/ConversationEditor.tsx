'use client';

import React from 'react';
import {
  ConversationSettings,
  ExportSettings,
  Participant,
  TimelineItem,
  MessageItem,
  SystemEventItem,
} from '@/types/conversation';
import { ConversationSettingsPanel } from './ConversationSettings';
import { ParticipantManager } from './ParticipantManager';
import { TimelineEditor } from './TimelineEditor';
import { ExportControls } from '../ExportControls/ExportControls';

interface ConversationEditorProps {
  settings: ConversationSettings;
  participants: Participant[];
  timeline: TimelineItem[];
  exportSettings: ExportSettings;
  previewRef: React.RefObject<HTMLDivElement | null>;
  onOpenCsvModal?: () => void;
  onUpdateSettings: (updates: Partial<ConversationSettings>) => void;
  onUpdateExportSettings: (updates: Partial<ExportSettings>) => void;
  onAutoGenerateTimestamps: () => void;
  onAddParticipant: (name: string, role: string, avatarUrl?: string) => void;
  onUpdateParticipant: (id: string, updates: Partial<Participant>) => void;
  onDeleteParticipant: (id: string) => void;
  onAddMessage: (afterIndex?: number) => void;
  onAddSystemEvent: (afterIndex?: number) => void;
  onUpdateItem: (id: string, updates: Partial<MessageItem> | Partial<SystemEventItem>) => void;
  onDuplicateItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onMoveItem: (id: string, direction: 'up' | 'down') => void;
  onReorderItems: (startIndex: number, endIndex: number) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
  onRemoveReaction: (messageId: string, reactionId: string) => void;
  onUpdateReactionCount: (messageId: string, reactionId: string, count: number) => void;
}

export function ConversationEditor({
  settings,
  participants,
  timeline,
  exportSettings,
  previewRef,
  onOpenCsvModal,
  onUpdateSettings,
  onUpdateExportSettings,
  onAutoGenerateTimestamps,
  onAddParticipant,
  onUpdateParticipant,
  onDeleteParticipant,
  onAddMessage,
  onAddSystemEvent,
  onUpdateItem,
  onDuplicateItem,
  onDeleteItem,
  onMoveItem,
  onReorderItems,
  onToggleReaction,
  onRemoveReaction,
  onUpdateReactionCount,
}: ConversationEditorProps) {
  // Selection helpers
  const handleToggleSelect = (id: string) => {
    const isCurrentlySelected = exportSettings.selectedItemIds.includes(id);
    const updated = isCurrentlySelected
      ? exportSettings.selectedItemIds.filter((itemId) => itemId !== id)
      : [...exportSettings.selectedItemIds, id];

    onUpdateExportSettings({
      selectedItemIds: updated,
      // If user starts selecting individual items, toggle selectedOnly to true
      selectedOnly: updated.length > 0,
    });
  };

  const handleSelectAll = () => {
    onUpdateExportSettings({
      selectedItemIds: timeline.map((item) => item.id),
      selectedOnly: false,
    });
  };

  const handleDeselectAll = () => {
    onUpdateExportSettings({
      selectedItemIds: [],
      selectedOnly: false,
    });
  };

  const handleSelectRange = (startIndex: number, endIndex: number) => {
    const slice = timeline.slice(startIndex, endIndex + 1).map((item) => item.id);
    onUpdateExportSettings({
      selectedItemIds: slice,
      selectedOnly: true,
    });
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto px-4 py-5 md:px-6 space-y-4">
      {/* 1. Header & POV Settings */}
      <ConversationSettingsPanel
        settings={settings}
        participants={participants}
        onUpdateSettings={onUpdateSettings}
        onAutoGenerateTimestamps={onAutoGenerateTimestamps}
      />

      {/* 2. Character & Participant Management */}
      <ParticipantManager
        participants={participants}
        onAddParticipant={onAddParticipant}
        onUpdateParticipant={onUpdateParticipant}
        onDeleteParticipant={onDeleteParticipant}
      />

      {/* 3. Export & Crop Options */}
      <ExportControls
        exportSettings={exportSettings}
        onUpdateExportSettings={onUpdateExportSettings}
        previewRef={previewRef}
        groupName={settings.groupName}
        totalItems={timeline.length}
      />

      {/* 4. Timeline Message & Event List */}
      <TimelineEditor
        timeline={timeline}
        participants={participants}
        povParticipantId={settings.povParticipantId}
        selectedItemIds={exportSettings.selectedItemIds}
        onOpenCsvModal={onOpenCsvModal}
        onToggleSelect={handleToggleSelect}
        onSelectAll={handleSelectAll}
        onDeselectAll={handleDeselectAll}
        onSelectRange={handleSelectRange}
        onAddMessage={onAddMessage}
        onAddSystemEvent={onAddSystemEvent}
        onUpdateItem={onUpdateItem}
        onDuplicateItem={onDuplicateItem}
        onDeleteItem={onDeleteItem}
        onMoveItem={onMoveItem}
        onReorderItems={onReorderItems}
        onToggleReaction={onToggleReaction}
        onRemoveReaction={onRemoveReaction}
        onUpdateReactionCount={onUpdateReactionCount}
      />
    </div>
  );
}
