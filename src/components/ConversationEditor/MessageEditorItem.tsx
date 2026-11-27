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
  Sparkles,
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
  // Drag and drop props
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
}

const COMMON_EMOJIS = ['😂', '❤️', '👍', '😭', '😡', '😮', '🙏', '🥂', '🎉', '💍', '🤦‍♂️', '🥰'];

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
  const [customEmoji, setCustomEmoji] = useState('');
  const [showDateDividerInput, setShowDateDividerInput] = useState(Boolean(message.dateDivider));

  const isPov = message.senderId === povParticipantId;
  const currentSender = participants.find((p) => p.id === message.senderId);

  const handleAddCustomEmoji = (e: React.FormEvent) => {
    e.preventDefault();
    if (customEmoji.trim()) {
      onToggleReaction(message.id, customEmoji.trim());
      setCustomEmoji('');
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={(e) => onDrop(e, index)}
      className={`group relative bg-slate-900 border rounded-xl p-3 transition-all ${
        isSelectedForExport
          ? 'border-blue-500/80 ring-1 ring-blue-500/40 bg-slate-900/90'
          : 'border-slate-800 hover:border-slate-700/80'
      }`}
    >
      {/* Top Bar of the Message Row */}
      <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800/80">
        <div className="flex items-center gap-2 min-w-0">
          {/* Drag Handle */}
          <div
            className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-slate-300 p-0.5"
            title="Drag to reorder"
          >
            <GripVertical className="w-4 h-4" />
          </div>

          {/* Selection Checkbox (for selective export / crop) */}
          <input
            type="checkbox"
            checked={isSelectedForExport}
            onChange={() => onToggleSelect(message.id)}
            title="Select for range / partial export"
            className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-0 cursor-pointer"
          />

          <span className="text-[11px] font-mono text-slate-500 font-semibold w-5">
            #{index + 1}
          </span>

          {/* Sender Dropdown */}
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="w-3.5 h-3.5 rounded-full shrink-0"
              style={{ backgroundColor: currentSender?.avatarColor || '#64748B' }}
            />
            <select
              value={message.senderId}
              onChange={(e) => onUpdate(message.id, { senderId: e.target.value })}
              className={`text-xs font-semibold rounded px-2 py-1 border bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 max-w-[170px] truncate ${
                isPov
                  ? 'text-blue-400 border-blue-500/40'
                  : 'text-slate-200 border-slate-700'
              }`}
            >
              {participants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.role}) {p.id === povParticipantId ? '★ POV' : ''}
                </option>
              ))}
            </select>
            {isPov && (
              <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-1.5 py-0.5 rounded font-medium">
                Right Bubble
              </span>
            )}
          </div>
        </div>

        {/* Row Quick Action Buttons */}
        <div className="flex items-center gap-1 text-slate-400">
          <button
            type="button"
            onClick={() => onMoveUp(message.id)}
            disabled={index === 0}
            className="p-1 hover:text-white disabled:opacity-30 transition-colors"
            title="Move Up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onMoveDown(message.id)}
            disabled={index === totalItems - 1}
            className="p-1 hover:text-white disabled:opacity-30 transition-colors"
            title="Move Down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDuplicate(message.id)}
            className="p-1 hover:text-amber-400 transition-colors"
            title="Duplicate Message"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(message.id)}
            className="p-1 hover:text-rose-400 transition-colors"
            title="Delete Message"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Optional Date Divider Input */}
      {showDateDividerInput && (
        <div className="mb-2 flex items-center gap-2 bg-slate-800/40 px-2 py-1 rounded border border-slate-800">
          <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="text-[11px] text-slate-400 shrink-0">Date Divider:</span>
          <input
            type="text"
            value={message.dateDivider || ''}
            onChange={(e) => onUpdate(message.id, { dateDivider: e.target.value })}
            placeholder="e.g. Today, Yesterday, Saturday, Nov 28"
            className="flex-1 bg-slate-900 text-white text-xs px-2 py-0.5 rounded border border-slate-700"
          />
          <button
            type="button"
            onClick={() => {
              onUpdate(message.id, { dateDivider: undefined });
              setShowDateDividerInput(false);
            }}
            className="text-[11px] text-slate-500 hover:text-rose-400"
          >
            Remove
          </button>
        </div>
      )}

      {/* Main Message Text Input */}
      <div className="mb-2.5">
        <textarea
          rows={2}
          value={message.text}
          onChange={(e) => onUpdate(message.id, { text: e.target.value })}
          placeholder="Type message text... (supports Filipino, English, Taglish, line breaks, emojis)"
          className="w-full bg-slate-950/70 text-slate-100 text-sm rounded-lg p-2.5 border border-slate-700/80 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y placeholder:text-slate-500 font-normal leading-relaxed"
        />
      </div>

      {/* Reactions Row (VISUALLY SEPARATE, strictly below message) */}
      <div className="mb-2 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 mr-1">
          <Smile className="w-3 h-3 text-amber-400" />
          Reactions:
        </span>

        {message.reactions &&
          message.reactions.map((rx) => (
            <div
              key={rx.id}
              className="inline-flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700 text-slate-200"
            >
              <span>{rx.emoji}</span>
              <input
                type="number"
                min={1}
                max={99}
                value={rx.count}
                onChange={(e) =>
                  onUpdateReactionCount(message.id, rx.id, parseInt(e.target.value, 10) || 1)
                }
                className="w-8 bg-slate-900 text-white text-[11px] text-center rounded border border-slate-700 p-0.5"
              />
              <button
                type="button"
                onClick={() => onRemoveReaction(message.id, rx.id)}
                className="text-slate-500 hover:text-rose-400 ml-0.5"
                title="Remove reaction"
              >
                ×
              </button>
            </div>
          ))}

        {/* Quick Emoji Toggles */}
        <div className="relative inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700 flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" /> Reaction
          </button>

          {showEmojiPicker && (
            <div className="absolute top-7 left-0 z-30 bg-slate-800 border border-slate-700 rounded-lg p-2 shadow-xl flex flex-col gap-2 min-w-[220px]">
              <div className="flex flex-wrap gap-1.5">
                {COMMON_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      onToggleReaction(message.id, emoji);
                      setShowEmojiPicker(false);
                    }}
                    className="text-base p-1 hover:bg-slate-700 rounded transition-transform hover:scale-125"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <form onSubmit={handleAddCustomEmoji} className="flex gap-1 pt-1 border-t border-slate-700">
                <input
                  type="text"
                  maxLength={4}
                  placeholder="Custom emoji"
                  value={customEmoji}
                  onChange={(e) => setCustomEmoji(e.target.value)}
                  className="flex-1 bg-slate-900 text-white text-xs px-2 py-1 rounded border border-slate-700"
                />
                <button
                  type="submit"
                  disabled={!customEmoji.trim()}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-2 py-1 rounded"
                >
                  Add
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar: Timestamp, Toggle Visibility, Add Row Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={message.timestamp}
            onChange={(e) => onUpdate(message.id, { timestamp: e.target.value })}
            placeholder="9:41 AM"
            className="w-20 bg-slate-950 text-slate-200 text-xs px-2 py-0.5 rounded border border-slate-700 text-center"
          />

          <button
            type="button"
            onClick={() => onUpdate(message.id, { showTimestamp: message.showTimestamp === false })}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] ${
              message.showTimestamp !== false
                ? 'text-emerald-400 bg-emerald-950/40'
                : 'text-slate-500 bg-slate-800'
            }`}
            title="Toggle timestamp visibility"
          >
            {message.showTimestamp !== false ? (
              <>
                <Eye className="w-3 h-3" /> Time On
              </>
            ) : (
              <>
                <EyeOff className="w-3 h-3" /> Time Off
              </>
            )}
          </button>

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

        {/* Add Above / Below Shortcuts */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onAddMessageAbove(index)}
            className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700/60"
            title="Add message directly above this one"
          >
            + Above
          </button>
          <button
            type="button"
            onClick={() => onAddMessageBelow(index)}
            className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700/60"
            title="Add message directly below this one"
          >
            + Below
          </button>
          <button
            type="button"
            onClick={() => onAddSystemEventBelow(index)}
            className="text-[11px] bg-slate-800 hover:bg-slate-700 text-amber-300/80 px-2 py-0.5 rounded border border-slate-700/60"
            title="Add system event below"
          >
            + Event
          </button>
        </div>
      </div>
    </div>
  );
}
