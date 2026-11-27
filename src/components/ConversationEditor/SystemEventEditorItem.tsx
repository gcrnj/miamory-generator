'use client';

import React, { useState } from 'react';
import { SystemEventItem, Participant, SystemEventType } from '@/types/conversation';
import { Trash2, Copy, ArrowUp, ArrowDown, GripVertical, BellRing, Calendar } from 'lucide-react';

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

const EVENT_TYPE_PRESETS: Record<SystemEventType, (p1: string, p2: string) => string> = {
  participant_added: (p1, p2) => `${p1} added ${p2} to the group.`,
  participant_left: (p1) => `${p1} left the group.`,
  name_changed: (p1) => `${p1} changed the group name.`,
  photo_changed: (p1) => `${p1} changed the group photo.`,
  custom: () => '',
};

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
  const [showDateField, setShowDateField] = useState(Boolean(event.dateDivider));

  const handleTypeChange = (type: SystemEventType) => {
    const p1 = participants[0]?.name || 'Maria';
    const p2 = participants[1]?.name || 'Gabo';
    const preset = EVENT_TYPE_PRESETS[type](p1, p2);
    onUpdate(event.id, { eventType: type, text: preset || event.text });
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      className={`group relative rounded-xl border transition-all ${
        isSelectedForExport
          ? 'border-amber-500/60 bg-amber-950/10'
          : 'border-slate-800/60 bg-slate-900/30 hover:border-slate-700'
      }`}
    >
      {/* Optional Date Divider above */}
      {event.dateDivider && (
        <div className="flex items-center gap-1.5 px-3 pt-2 pb-1">
          <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
          <input
            type="text"
            value={event.dateDivider}
            onChange={(e) => onUpdate(event.id, { dateDivider: e.target.value || undefined })}
            placeholder="Date separator"
            className="flex-1 bg-transparent text-amber-300 text-[11px] font-semibold focus:outline-none border-b border-amber-800/40 pb-0.5"
          />
          <button
            type="button"
            onClick={() => { onUpdate(event.id, { dateDivider: undefined }); setShowDateField(false); }}
            className="text-slate-600 hover:text-rose-400 text-[11px]"
          >✕</button>
        </div>
      )}

      <div className="p-2.5">
        {/* Row 1: Drag + checkbox + event badge + type selector + actions */}
        <div className="flex items-center gap-2 mb-2">
          <div className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 shrink-0">
            <GripVertical className="w-3.5 h-3.5" />
          </div>

          <input
            type="checkbox"
            checked={isSelectedForExport}
            onChange={() => onToggleSelect(event.id)}
            className="w-3.5 h-3.5 rounded border-slate-600 bg-slate-800 text-amber-500 focus:ring-0 cursor-pointer shrink-0"
          />

          <span className="text-[10px] font-mono text-slate-600 w-4 shrink-0 select-none">
            {index + 1}
          </span>

          {/* System Event badge */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-950/50 border border-amber-800/50 px-1.5 py-0.5 rounded shrink-0">
              <BellRing className="w-2.5 h-2.5" /> Event
            </span>
            <select
              value={event.eventType}
              onChange={(e) => handleTypeChange(e.target.value as SystemEventType)}
              className="flex-1 min-w-0 bg-transparent text-slate-300 text-[12px] focus:outline-none cursor-pointer appearance-none"
            >
              <option value="participant_added" className="bg-slate-800">Participant Added</option>
              <option value="participant_left" className="bg-slate-800">Participant Left</option>
              <option value="name_changed" className="bg-slate-800">Name Changed</option>
              <option value="photo_changed" className="bg-slate-800">Photo Changed</option>
              <option value="custom" className="bg-slate-800">Custom Event</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-0.5 shrink-0 text-slate-600">
            <button type="button" onClick={() => onMoveUp(event.id)} disabled={index === 0}
              className="p-1 hover:text-slate-200 disabled:opacity-20 transition-colors">
              <ArrowUp className="w-3 h-3" />
            </button>
            <button type="button" onClick={() => onMoveDown(event.id)} disabled={index === totalItems - 1}
              className="p-1 hover:text-slate-200 disabled:opacity-20 transition-colors">
              <ArrowDown className="w-3 h-3" />
            </button>
            <button type="button" onClick={() => onDuplicate(event.id)}
              className="p-1 hover:text-amber-400 transition-colors">
              <Copy className="w-3 h-3" />
            </button>
            <button type="button" onClick={() => onDelete(event.id)}
              className="p-1 hover:text-rose-400 transition-colors">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Row 2: Event text */}
        <input
          type="text"
          value={event.text}
          onChange={(e) => onUpdate(event.id, { text: e.target.value })}
          placeholder="e.g. Maria Isabella Santos added Tita Letty to the group."
          className="w-full bg-slate-950/80 text-amber-200/80 text-[13px] rounded-lg px-3 py-2 border border-slate-700/60 focus:outline-none focus:ring-1 focus:ring-amber-600/60 placeholder:text-slate-600"
        />

        {/* Row 3: Footer */}
        <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-slate-600">
          <div>
            {!event.dateDivider && (
              <button
                type="button"
                onClick={() => { setShowDateField(true); onUpdate(event.id, { dateDivider: 'Today' }); }}
                className="hover:text-amber-400 transition-colors flex items-center gap-0.5"
              >
                <Calendar className="w-2.5 h-2.5" /> Date separator
              </button>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => onAddMessageBelow(index)}
              className="hover:text-slate-200 px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors">
              ↓ Msg
            </button>
            <button type="button" onClick={() => onAddSystemEventBelow(index)}
              className="hover:text-amber-400 px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors">
              ↓ Evt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
