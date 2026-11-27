'use client';

import React, { useState } from 'react';
import { MessageItem, Participant } from '@/types/conversation';
import {
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Plus,
  Smile,
  Clock,
  Eye,
  EyeOff,
  GripVertical,
  Calendar,
} from 'lucide-react';
import { getInitials } from '@/utils/timeUtils';

interface MessageEditorItemProps {
  message: MessageItem;
  index: number;
  totalItems: number;
  participants: Participant[];
  povParticipantId: string;
  isSelectedForExport: boolean;
  onToggleSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<MessageItem>) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onAddMessageAbove: (index: number) => void;
  onAddMessageBelow: (index: number) => void;
  onAddSystemEventBelow: (index: number) => void;
  onToggleReaction: (messageId: string, emoji: string) => void;
  onRemoveReaction: (messageId: string, reactionId: string) => void;
  onUpdateReactionCount: (messageId: string, reactionId: string, count: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
}

const QUICK_EMOJIS = ['😂', '❤️', '👍', '😭', '😡', '😮', '🙏', '🎉', '🥰', '💍', '🤦‍♂️', '🥂'];

export function MessageEditorItem({
  message,
  index,
  totalItems,
  participants,
  povParticipantId,
  isSelectedForExport,
  onToggleSelect,
  onUpdate,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onAddMessageAbove,
  onAddMessageBelow,
  onAddSystemEventBelow,
  onToggleReaction,
  onRemoveReaction,
  onUpdateReactionCount,
  onDragStart,
  onDragOver,
  onDrop,
}: MessageEditorItemProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showDateField, setShowDateField] = useState(Boolean(message.dateDivider));
  const [customEmoji, setCustomEmoji] = useState('');

  const isPov = message.senderId === povParticipantId;
  const sender = participants.find((p) => p.id === message.senderId);

  const handleAddCustomEmoji = (e: React.FormEvent) => {
    e.preventDefault();
    if (customEmoji.trim()) {
      onToggleReaction(message.id, customEmoji.trim());
      setCustomEmoji('');
      setShowEmojiPicker(false);
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      className={`group relative rounded-xl border transition-all ${
        isSelectedForExport
          ? 'border-blue-500/60 bg-blue-950/10'
          : 'border-slate-800/80 bg-slate-900/50 hover:border-slate-700'
      }`}
    >
      {/* Optional Date Divider pill above card */}
      {message.dateDivider && (
        <div className="flex items-center gap-1.5 px-3 pt-2 pb-1">
          <Calendar className="w-3 h-3 text-amber-400 shrink-0" />
          <input
            type="text"
            value={message.dateDivider}
            onChange={(e) => onUpdate(message.id, { dateDivider: e.target.value || undefined })}
            placeholder="Date separator (e.g. Today, Nov 28)"
            className="flex-1 bg-transparent text-amber-300 text-[11px] font-semibold focus:outline-none placeholder:text-slate-500 border-b border-amber-800/40 pb-0.5"
          />
          <button
            type="button"
            onClick={() => { onUpdate(message.id, { dateDivider: undefined }); setShowDateField(false); }}
            className="text-slate-600 hover:text-rose-400 text-[11px]"
          >✕</button>
        </div>
      )}

      {/* ── Main Card Layout ── */}
      <div className="p-2.5">
        {/* Row 1: Drag + Checkbox + Sender + Actions */}
        <div className="flex items-center gap-2 mb-2">
          {/* Drag handle */}
          <div
            className="cursor-grab active:cursor-grabbing text-slate-600 hover:text-slate-400 transition-colors shrink-0"
            title="Drag to reorder"
          >
            <GripVertical className="w-3.5 h-3.5" />
          </div>

          {/* Export checkbox */}
          <input
            type="checkbox"
            checked={isSelectedForExport}
            onChange={() => onToggleSelect(message.id)}
            className="w-3.5 h-3.5 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-0 cursor-pointer shrink-0"
            title="Select for partial export"
          />

          {/* Number label */}
          <span className="text-[10px] font-mono text-slate-600 w-4 shrink-0 select-none">
            {index + 1}
          </span>

          {/* Sender mini-avatar + dropdown */}
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            {sender?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={sender.avatarUrl}
                alt={sender.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-white/10 shrink-0"
              />
            ) : (
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                style={{ backgroundColor: sender?.avatarColor || '#64748B' }}
              >
                {sender ? getInitials(sender.name) : '?'}
              </div>
            )}

            <select
              value={message.senderId}
              onChange={(e) => onUpdate(message.id, { senderId: e.target.value })}
              className={`flex-1 min-w-0 bg-transparent text-[13px] font-semibold focus:outline-none cursor-pointer truncate appearance-none ${
                isPov ? 'text-blue-400' : 'text-slate-200'
              }`}
            >
              {participants.map((p) => (
                <option key={p.id} value={p.id} className="bg-slate-800 text-white text-sm font-normal">
                  {p.name}{p.id === povParticipantId ? ' ★' : ''}
                </option>
              ))}
            </select>

            {isPov && (
              <span className="text-[10px] text-blue-400 bg-blue-950/60 border border-blue-800/60 px-1.5 py-0.5 rounded font-medium shrink-0">
                Right
              </span>
            )}
          </div>

          {/* Action buttons — always visible on hover */}
          <div className="flex items-center gap-0.5 shrink-0 text-slate-600">
            <button type="button" onClick={() => onMoveUp(message.id)} disabled={index === 0}
              className="p-1 hover:text-slate-200 disabled:opacity-20 transition-colors" title="Move Up">
              <ArrowUp className="w-3 h-3" />
            </button>
            <button type="button" onClick={() => onMoveDown(message.id)} disabled={index === totalItems - 1}
              className="p-1 hover:text-slate-200 disabled:opacity-20 transition-colors" title="Move Down">
              <ArrowDown className="w-3 h-3" />
            </button>
            <button type="button" onClick={() => onDuplicate(message.id)}
              className="p-1 hover:text-amber-400 transition-colors" title="Duplicate">
              <Copy className="w-3 h-3" />
            </button>
            <button type="button" onClick={() => onDelete(message.id)}
              className="p-1 hover:text-rose-400 transition-colors" title="Delete">
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Row 2: Message textarea */}
        <textarea
          rows={2}
          value={message.text}
          onChange={(e) => onUpdate(message.id, { text: e.target.value })}
          placeholder="Type message text…"
          className="w-full bg-slate-950/80 text-slate-100 text-[13px] rounded-lg px-3 py-2 border border-slate-700/60 focus:outline-none focus:ring-1 focus:ring-blue-500/70 resize-y placeholder:text-slate-600 leading-relaxed"
        />

        {/* Row 3: Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1">
            {message.reactions.map((rx) => (
              <div key={rx.id} className="inline-flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700/80 text-slate-200 text-[12px]">
                <span>{rx.emoji}</span>
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={rx.count}
                  onChange={(e) => onUpdateReactionCount(message.id, rx.id, parseInt(e.target.value, 10) || 1)}
                  className="w-7 bg-transparent text-[11px] text-center text-slate-300 focus:outline-none"
                />
                <button type="button" onClick={() => onRemoveReaction(message.id, rx.id)}
                  className="text-slate-600 hover:text-rose-400 leading-none">×</button>
              </div>
            ))}
          </div>
        )}

        {/* Row 4: Footer — Timestamp + controls */}
        <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            {/* Timestamp input */}
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <input
                type="text"
                value={message.timestamp}
                onChange={(e) => onUpdate(message.id, { timestamp: e.target.value })}
                placeholder="9:41 AM"
                className="w-16 bg-transparent text-slate-300 text-[12px] focus:outline-none border-b border-slate-700 text-center"
              />
            </div>

            {/* Show/hide timestamp */}
            <button
              type="button"
              onClick={() => onUpdate(message.id, { showTimestamp: message.showTimestamp === false })}
              className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] transition-colors ${
                message.showTimestamp !== false ? 'text-emerald-500' : 'text-slate-600'
              }`}
              title="Toggle timestamp visibility"
            >
              {message.showTimestamp !== false ? <Eye className="w-2.5 h-2.5" /> : <EyeOff className="w-2.5 h-2.5" />}
              <span>{message.showTimestamp !== false ? 'Time' : 'Hidden'}</span>
            </button>

            {/* Date divider toggle */}
            {!message.dateDivider && (
              <button
                type="button"
                onClick={() => { setShowDateField(true); onUpdate(message.id, { dateDivider: 'Today' }); }}
                className="text-slate-600 hover:text-amber-400 transition-colors flex items-center gap-0.5"
                title="Add date separator before this message"
              >
                <Calendar className="w-2.5 h-2.5" />
                <span>Date</span>
              </button>
            )}

            {/* Add reaction */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-slate-600 hover:text-amber-400 transition-colors flex items-center gap-0.5"
                title="Add reaction"
              >
                <Smile className="w-2.5 h-2.5" />
                <span>React</span>
              </button>

              {showEmojiPicker && (
                <div className="absolute bottom-6 left-0 z-30 bg-slate-800 border border-slate-700 rounded-xl p-2.5 shadow-2xl min-w-[220px]">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {QUICK_EMOJIS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => { onToggleReaction(message.id, emoji); setShowEmojiPicker(false); }}
                        className="text-base p-1 hover:bg-slate-700 rounded transition-transform hover:scale-125"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                  <form onSubmit={handleAddCustomEmoji} className="flex gap-1 pt-1.5 border-t border-slate-700">
                    <input
                      type="text"
                      maxLength={4}
                      placeholder="Custom emoji…"
                      value={customEmoji}
                      onChange={(e) => setCustomEmoji(e.target.value)}
                      className="flex-1 bg-slate-900 text-white text-xs px-2 py-1 rounded border border-slate-700 focus:outline-none"
                    />
                    <button type="submit" disabled={!customEmoji.trim()}
                      className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs px-2 py-1 rounded transition-colors">
                      Add
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Quick insert row buttons */}
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => onAddMessageAbove(index)}
              className="text-slate-600 hover:text-slate-200 px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors"
              title="Insert message above">↑ Msg</button>
            <button type="button" onClick={() => onAddMessageBelow(index)}
              className="text-slate-600 hover:text-slate-200 px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors"
              title="Insert message below">↓ Msg</button>
            <button type="button" onClick={() => onAddSystemEventBelow(index)}
              className="text-slate-600 hover:text-amber-400 px-1.5 py-0.5 rounded hover:bg-slate-800 transition-colors"
              title="Insert system event below">↓ Evt</button>
          </div>
        </div>
      </div>
    </div>
  );
}
