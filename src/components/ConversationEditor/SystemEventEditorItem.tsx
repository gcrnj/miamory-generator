'use client';

import React, { useState } from 'react';
import { SystemEventItem, Participant, SystemEventType } from '@/types/conversation';
import {
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  GripVertical,
  Calendar,
  BellRing,
  Plus,
} from 'lucide-react';

interface SystemEventEditorItemProps {
  event: SystemEventItem;
  index: number;
  totalItems: number;
  participants: Participant[];
  isSelectedForExport: boolean;
  onToggleSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<SystemEventItem>) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onAddMessageBelow: (index: number) => void;
  onAddSystemEventBelow: (index: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
}

export function SystemEventEditorItem({
  event,
  index,
  totalItems,
  participants,
  isSelectedForExport,
  onToggleSelect,
  onUpdate,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddMessageBelow,
  onAddSystemEventBelow,
  onDragStart,
  onDragOver,
  onDrop,
}: SystemEventEditorItemProps) {
  const [showDateDividerInput, setShowDateDividerInput] = useState(Boolean(event.dateDivider));

  // Quick preset helper when eventType changes
  const handleTypeChange = (type: SystemEventType) => {
    let presetText = event.text;
    const p1 = participants[0]?.name || 'Maria';
    const p2 = participants[1]?.name || 'Gabo';

    if (type === 'participant_added') {
      presetText = `${p1} added ${p2} to the group.`;
    } else if (type === 'participant_left') {
      presetText = `${p2} left the group.`;
    } else if (type === 'name_changed') {
      presetText = `${p1} changed the group name to "Final Guest List NO MORE ADDITIONS".`;
    } else if (type === 'photo_changed') {
      presetText = `${p1} changed the group photo.`;
    }

    onUpdate(event.id, { eventType: type, text: presetText });
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      className={`group relative bg-slate-900/80 border rounded-xl p-3 transition-all ${
        isSelectedForExport
          ? 'border-amber-500/80 ring-1 ring-amber-500/40 bg-slate-900/95'
          : 'border-slate-800/90 hover:border-slate-700/80'
      }`}
    >
      {/* Top Bar of the System Event Row */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 p-0.5"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          <input
            type="checkbox"
            checked={isSelectedForExport}
            onChange={() => onToggleSelect(event.id)}
            title="Select for range / partial export"
            className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0 cursor-pointer"
          />

          <span className="text-[11px] font-mono text-slate-500 font-semibold w-5">
            #{index + 1}
          </span>

          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/50">
            <BellRing className="w-3 h-3" /> System Event
          </span>

          {/* Event Type Dropdown */}
          <select
            value={event.eventType}
            onChange={(e) => handleTypeChange(e.target.value as SystemEventType)}
            className="text-xs bg-slate-800 text-slate-200 border border-slate-700 rounded px-2 py-1 focus:outline-none"
          >
            <option value="participant_added">Participant Added</option>
            <option value="participant_left">Participant Left</option>
            <option value="name_changed">Group Name Changed</option>
            <option value="photo_changed">Group Photo Changed</option>
            <option value="custom">Custom Event</option>
          </select>
        </div>

        {/* Row Action Buttons */}
        <div className="flex items-center gap-1 text-slate-400">
          <button
            type="button"
            onClick={() => onMoveUp(event.id)}
            disabled={index === 0}
            className="p-1 hover:text-white disabled:opacity-30 transition-colors"
            title="Move Up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onMoveDown(event.id)}
            disabled={index === totalItems - 1}
            className="p-1 hover:text-white disabled:opacity-30 transition-colors"
            title="Move Down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDuplicate(event.id)}
            className="p-1 hover:text-amber-400 transition-colors"
            title="Duplicate Event"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(event.id)}
            className="p-1 hover:text-rose-400 transition-colors"
            title="Delete Event"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Date Divider (if active) */}
      {showDateDividerInput && (
        <div className="mb-2 flex items-center gap-2 bg-slate-800/40 px-2 py-1 rounded border border-slate-800">
          <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-[11px] text-slate-400 shrink-0">Date Divider:</span>
          <input
            type="text"
            value={event.dateDivider || ''}
            onChange={(e) => onUpdate(event.id, { dateDivider: e.target.value })}
            placeholder="e.g. Today, Yesterday"
            className="flex-1 bg-slate-900 text-white text-xs px-2 py-0.5 rounded border border-slate-700"
          />
          <button
            type="button"
            onClick={() => {
              onUpdate(event.id, { dateDivider: undefined });
              setShowDateDividerInput(false);
            }}
            className="text-[11px] text-slate-500 hover:text-rose-400"
          >
            Remove
          </button>
        </div>
      )}

      {/* Event Message Input */}
      <div className="mb-2">
        <input
          type="text"
          value={event.text}
          onChange={(e) => onUpdate(event.id, { text: e.target.value })}
          placeholder="e.g. Maria Isabella Santos added Tita Letty to the group."
          className="w-full bg-slate-950/80 text-amber-200/90 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-amber-500"
        />
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <div>
          {!showDateDividerInput && (
            <button
              type="button"
              onClick={() => setShowDateDividerInput(true)}
              className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1"
            >
              <Calendar className="w-3 h-3" /> + Date Divider
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onAddMessageBelow(index)}
            className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
          >
            + Message Below
          </button>
          <button
            type="button"
            onClick={() => onAddSystemEventBelow(index)}
            className="text-[11px] bg-slate-800 hover:bg-slate-700 text-amber-300/80 px-2 py-0.5 rounded border border-slate-700"
          >
            + Event Below
          </button>
        </div>
      </div>
    </div>
  );
}
