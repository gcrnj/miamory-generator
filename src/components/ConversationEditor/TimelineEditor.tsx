'use client';

import React, { useState } from 'react';
import { TimelineItem, Participant, MessageItem, SystemEventItem } from '@/types/conversation';
import { MessageEditorItem } from './MessageEditorItem';
import { SystemEventEditorItem } from './SystemEventEditorItem';
import { Plus, BellRing, CheckSquare, Square, Check, Scissors } from 'lucide-react';

interface TimelineEditorProps {
  timeline: TimelineItem[];
  participants: Participant[];
  povParticipantId: string;
  selectedItemIds: string[];
  onOpenCsvModal?: () => void;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onSelectRange: (startIndex: number, endIndex: number) => void;
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

export function TimelineEditor({
  timeline,
  participants,
  povParticipantId,
  selectedItemIds,
  onOpenCsvModal,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onSelectRange,
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
}: TimelineEditorProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showRangePicker, setShowRangePicker] = useState(false);
  const [rangeFrom, setRangeFrom] = useState(1);
  const [rangeTo, setRangeTo] = useState(Math.max(1, timeline.length));

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
      onReorderItems(draggedIndex, targetIndex);
    }
    setDraggedIndex(null);
  };

  const handleApplyRange = (e: React.FormEvent) => {
    e.preventDefault();
    const start = Math.max(0, rangeFrom - 1);
    const end = Math.min(timeline.length - 1, rangeTo - 1);
    onSelectRange(start, end);
    setShowRangePicker(false);
  };

  const selectedCount = selectedItemIds.length;

  return (
    <div>
      {/* ─── Sticky Timeline Toolbar ─── */}
      <div className="flex items-center justify-between gap-2 px-1 py-2 mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
            Timeline
          </span>
          <span className="text-[11px] text-slate-600">{timeline.length} items</span>
          {selectedCount > 0 && (
            <span className="text-[10px] bg-blue-900/60 text-blue-300 border border-blue-800/50 px-1.5 py-0.5 rounded-full font-semibold">
              {selectedCount} selected
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-[11px]">
          <button
            type="button"
            onClick={onSelectAll}
            className="text-slate-500 hover:text-slate-200 px-1.5 py-0.5 rounded hover:bg-slate-800 flex items-center gap-0.5 transition-colors"
            title="Select all items"
          >
            <CheckSquare className="w-3 h-3" /> All
          </button>
          <button
            type="button"
            onClick={onDeselectAll}
            className="text-slate-500 hover:text-slate-200 px-1.5 py-0.5 rounded hover:bg-slate-800 flex items-center gap-0.5 transition-colors"
            title="Deselect all"
          >
            <Square className="w-3 h-3" /> None
          </button>
          <button
            type="button"
            onClick={() => { setRangeTo(Math.max(1, timeline.length)); setShowRangePicker(!showRangePicker); }}
            className="text-slate-500 hover:text-blue-400 px-1.5 py-0.5 rounded hover:bg-slate-800 flex items-center gap-0.5 transition-colors"
            title="Select a range of items"
          >
            <Scissors className="w-3 h-3" /> Range
          </button>
        </div>
      </div>

      {/* Range Picker */}
      {showRangePicker && (
        <form
          onSubmit={handleApplyRange}
          className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700/80 mb-3 text-xs"
        >
          <span className="text-slate-300 font-semibold">Crop Range</span>
          <span className="text-slate-500">From</span>
          <input
            type="number" min={1} max={timeline.length} value={rangeFrom}
            onChange={(e) => setRangeFrom(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="w-12 bg-slate-900 text-white rounded px-1.5 py-1 border border-slate-700 text-center"
          />
          <span className="text-slate-500">to</span>
          <input
            type="number" min={1} max={timeline.length} value={rangeTo}
            onChange={(e) => setRangeTo(Math.min(timeline.length, parseInt(e.target.value, 10) || 1))}
            className="w-12 bg-slate-900 text-white rounded px-1.5 py-1 border border-slate-700 text-center"
          />
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-3 py-1 rounded flex items-center gap-1 transition-colors">
            <Check className="w-3 h-3" /> Apply
          </button>
          <button type="button" onClick={() => setShowRangePicker(false)} className="text-slate-500 hover:text-slate-200 ml-auto">
            ✕
          </button>
        </form>
      )}

      {/* ─── Timeline Items ─── */}
      <div className="space-y-2">
        {timeline.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
            <span className="text-2xl mb-2">💬</span>
            <p className="text-sm font-medium text-slate-400">No messages yet</p>
            <p className="text-xs text-slate-500 mt-0.5">Click "Add Message" below to start</p>
          </div>
        )}

        {timeline.map((item, index) => {
          const isSelected = selectedItemIds.includes(item.id);

          if (item.type === 'system') {
            return (
              <SystemEventEditorItem
                key={item.id}
                event={item as SystemEventItem}
                index={index}
                totalItems={timeline.length}
                participants={participants}
                isSelectedForExport={isSelected}
                onToggleSelect={onToggleSelect}
                onUpdate={onUpdateItem}
                onDuplicate={onDuplicateItem}
                onDelete={onDeleteItem}
                onMoveUp={(id) => onMoveItem(id, 'up')}
                onMoveDown={(id) => onMoveItem(id, 'down')}
                onAddMessageBelow={(idx) => onAddMessage(idx)}
                onAddSystemEventBelow={(idx) => onAddSystemEvent(idx)}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            );
          }

          return (
            <MessageEditorItem
              key={item.id}
              message={item as MessageItem}
              index={index}
              totalItems={timeline.length}
              participants={participants}
              povParticipantId={povParticipantId}
              isSelectedForExport={isSelected}
              onToggleSelect={onToggleSelect}
              onUpdate={onUpdateItem}
              onDuplicate={onDuplicateItem}
              onDelete={onDeleteItem}
              onMoveUp={(id) => onMoveItem(id, 'up')}
              onMoveDown={(id) => onMoveItem(id, 'down')}
              onAddMessageAbove={(idx) => onAddMessage(idx - 1)}
              onAddMessageBelow={(idx) => onAddMessage(idx)}
              onAddSystemEventBelow={(idx) => onAddSystemEvent(idx)}
              onToggleReaction={onToggleReaction}
              onRemoveReaction={onRemoveReaction}
              onUpdateReactionCount={onUpdateReactionCount}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          );
        })}
      </div>

      {/* ─── Add Buttons ─── */}
      <div className="flex gap-2 mt-4">
        <button
          type="button"
          onClick={() => onAddMessage()}
          className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-semibold text-[13px] flex items-center justify-center gap-2 shadow-md shadow-blue-900/30 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <Plus className="w-4 h-4" />
          Add Message
        </button>
        <button
          type="button"
          onClick={() => onAddSystemEvent()}
          className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.99] text-amber-300 font-medium text-[13px] border border-slate-700 flex items-center justify-center gap-2 transition-all focus:outline-none"
        >
          <BellRing className="w-4 h-4" />
          <span className="hidden sm:inline">System Event</span>
        </button>
      </div>
    </div>
  );
}
