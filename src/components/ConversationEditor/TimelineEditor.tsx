'use client';

import React, { useState } from 'react';
import {
  TimelineItem,
  Participant,
  MessageItem,
  SystemEventItem,
} from '@/types/conversation';
import { MessageEditorItem } from './MessageEditorItem';
import { SystemEventEditorItem } from './SystemEventEditorItem';
import { Plus, BellRing, CheckSquare, Square, Check } from 'lucide-react';

interface TimelineEditorProps {
  timeline: TimelineItem[];
  participants: Participant[];
  povParticipantId: string;
  selectedItemIds: string[];
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
  const [rangeFrom, setRangeFrom] = useState(1);
  const [rangeTo, setRangeTo] = useState(timeline.length || 1);
  const [showRangeSelector, setShowRangeSelector] = useState(false);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
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
    setShowRangeSelector(false);
  };

  return (
    <div className="space-y-3">
      {/* Timeline Controls / Selection toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">
            Timeline ({timeline.length} items)
          </span>
          {selectedItemIds.length > 0 && (
            <span className="text-[11px] bg-blue-900/60 text-blue-300 border border-blue-700/60 px-2 py-0.5 rounded-full font-medium">
              {selectedItemIds.length} selected
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <button
            type="button"
            onClick={onSelectAll}
            className="text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800 flex items-center gap-1 text-[11px]"
          >
            <CheckSquare className="w-3.5 h-3.5" /> All
          </button>
          <button
            type="button"
            onClick={onDeselectAll}
            className="text-slate-400 hover:text-slate-200 px-2 py-1 rounded hover:bg-slate-800 flex items-center gap-1 text-[11px]"
          >
            <Square className="w-3.5 h-3.5" /> None
          </button>
          <button
            type="button"
            onClick={() => {
              setRangeTo(timeline.length || 1);
              setShowRangeSelector(!showRangeSelector);
            }}
            className="text-blue-400 hover:text-blue-300 px-2 py-1 rounded hover:bg-slate-800 text-[11px] font-medium"
          >
            Range Crop...
          </button>
        </div>
      </div>

      {/* Quick Range Selection Sub-bar */}
      {showRangeSelector && (
        <form
          onSubmit={handleApplyRange}
          className="flex items-center gap-2 bg-slate-800 p-2.5 rounded-lg border border-slate-700 text-xs"
        >
          <span className="text-slate-300 font-medium">Select Range:</span>
          <span className="text-slate-400">From #</span>
          <input
            type="number"
            min={1}
            max={timeline.length}
            value={rangeFrom}
            onChange={(e) => setRangeFrom(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="w-14 bg-slate-900 text-white rounded px-2 py-1 border border-slate-700 text-center"
          />
          <span className="text-slate-400">To #</span>
          <input
            type="number"
            min={1}
            max={timeline.length}
            value={rangeTo}
            onChange={(e) => setRangeTo(Math.min(timeline.length, parseInt(e.target.value, 10) || 1))}
            className="w-14 bg-slate-900 text-white rounded px-2 py-1 border border-slate-700 text-center"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-3 py-1 rounded flex items-center gap-1"
          >
            <Check className="w-3.5 h-3.5" /> Apply
          </button>
        </form>
      )}

      {/* Message and Event Rows */}
      <div className="space-y-3">
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

      {/* Prominent "+ Add Message" and "+ Add System Event" Buttons at the Bottom */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
        <button
          type="button"
          onClick={() => onAddMessage()}
          className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-semibold text-sm shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <Plus className="w-5 h-5" />
          Add Message
        </button>

        <button
          type="button"
          onClick={() => onAddSystemEvent()}
          className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-[0.99] text-amber-300 font-medium text-sm border border-slate-700 flex items-center justify-center gap-2 transition-all focus:outline-none"
        >
          <BellRing className="w-4 h-4" />
          Add System Event
        </button>
      </div>
    </div>
  );
}
