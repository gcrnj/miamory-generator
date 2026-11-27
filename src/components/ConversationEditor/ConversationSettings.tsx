'use client';

import React, { useState } from 'react';
import { ConversationSettings, Participant } from '@/types/conversation';
import { Settings, Users, Sparkles, Clock, Palette, ChevronDown, ChevronUp } from 'lucide-react';

interface ConversationSettingsProps {
  settings: ConversationSettings;
  participants: Participant[];
  onUpdateSettings: (updates: Partial<ConversationSettings>) => void;
  onAutoGenerateTimestamps: () => void;
}

export function ConversationSettingsPanel({
  settings,
  participants,
  onUpdateSettings,
  onAutoGenerateTimestamps,
}: ConversationSettingsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm mb-4">
      {/* Top Main Controls: POV Owner & Group Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* POV Owner */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            Conversation POV (Viewer)
          </label>
          <div className="relative">
            <select
              value={settings.povParticipantId}
              onChange={(e) => onUpdateSettings({ povParticipantId: e.target.value })}
              className="w-full bg-slate-800 text-white text-sm rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              {participants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.role}) {p.id === settings.povParticipantId ? '★ (Right Bubble)' : ''}
                </option>
              ))}
            </select>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Messages from this person appear on the <strong>right</strong> in blue. Others appear on the left.
          </p>
        </div>

        {/* Group Name */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Group Chat Name
          </label>
          <input
            type="text"
            value={settings.groupName}
            onChange={(e) => onUpdateSettings({ groupName: e.target.value })}
            placeholder="e.g. Santos-Bautista Wedding Entourage 💍"
            className="w-full bg-slate-800 text-white text-sm rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Displayed at the top of the conversation header.
          </p>
        </div>
      </div>

      {/* Toggle More Header & Timestamp Settings */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 focus:outline-none"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" /> Hide advanced settings (Avatar, width, auto-time)
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" /> Show advanced settings (Avatar, width, auto-time)
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Width:</span>
          <select
            value={settings.previewWidth}
            onChange={(e) => onUpdateSettings({ previewWidth: Number(e.target.value) })}
            className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded px-2 py-1 focus:outline-none"
          >
            <option value={375}>375px (Compact)</option>
            <option value={420}>420px (Phone Standard)</option>
            <option value={480}>480px (Medium)</option>
            <option value={540}>540px (FB Feed)</option>
            <option value={600}>600px (Wide)</option>
          </select>
        </div>
      </div>

      {/* Advanced Settings Drawer */}
      {isExpanded && (
        <div className="mt-3.5 pt-3.5 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {/* Group Avatar Initials, Color & Upload */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Group Avatar (Initials or Photo)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                maxLength={3}
                value={settings.groupAvatarInitials || ''}
                onChange={(e) => onUpdateSettings({ groupAvatarInitials: e.target.value })}
                className="w-14 bg-slate-800 text-white text-xs rounded px-2 py-1.5 border border-slate-700 uppercase font-bold text-center"
                title="Initials"
              />
              <input
                type="color"
                value={settings.groupAvatarColor || '#E11D48'}
                onChange={(e) => onUpdateSettings({ groupAvatarColor: e.target.value })}
                className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                title="Avatar Background Color"
              />
              <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-2.5 py-1.5 rounded border border-slate-700 transition-colors">
                Photo
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === 'string') {
                          onUpdateSettings({ groupAvatarUrl: reader.result });
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              {settings.groupAvatarUrl && (
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ groupAvatarUrl: undefined })}
                  className="text-slate-500 hover:text-rose-400 text-xs"
                  title="Remove group photo"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Group Description / Subtitle */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Group Description / Subtitle
            </label>
            <input
              type="text"
              value={settings.groupDescription || ''}
              onChange={(e) => onUpdateSettings({ groupDescription: e.target.value })}
              placeholder="e.g. 8 participants or custom subtitle"
              className="w-full bg-slate-800 text-white text-xs rounded px-2.5 py-1.5 border border-slate-700"
            />
          </div>

          {/* POV Theme Color */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
              <Palette className="w-3 h-3 text-pink-400" /> POV Bubble Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.chatThemeColor || '#0A7CFF'}
                onChange={(e) => onUpdateSettings({ chatThemeColor: e.target.value })}
                className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
              />
              <div className="flex gap-1.5">
                {['#0A7CFF', '#0084FF', '#25D366', '#8B5CF6', '#EC4899'].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => onUpdateSettings({ chatThemeColor: c })}
                    className="w-5 h-5 rounded-full ring-1 ring-white/20 transition-transform hover:scale-110"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Auto Timestamp Interval */}
          <div className="sm:col-span-2 md:col-span-3 bg-slate-800/60 p-3 rounded-lg flex flex-wrap items-center justify-between gap-3 border border-slate-700/50">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-medium text-slate-200">
                  Auto Timestamp Generator:
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Starts at {settings.startTimestamp}, increments by {settings.autoTimestampIntervalMinutes} mins
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={settings.startTimestamp}
                onChange={(e) => onUpdateSettings({ startTimestamp: e.target.value })}
                placeholder="9:41 AM"
                className="w-20 bg-slate-900 text-white text-xs rounded px-2 py-1 border border-slate-700 text-center"
              />
              <select
                value={settings.autoTimestampIntervalMinutes}
                onChange={(e) =>
                  onUpdateSettings({ autoTimestampIntervalMinutes: Number(e.target.value) })
                }
                className="bg-slate-900 text-xs text-white rounded px-2 py-1 border border-slate-700"
              >
                <option value={1}>+1 min</option>
                <option value={2}>+2 mins</option>
                <option value={3}>+3 mins</option>
                <option value={5}>+5 mins</option>
                <option value={10}>+10 mins</option>
              </select>

              <button
                type="button"
                onClick={onAutoGenerateTimestamps}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-2.5 py-1 rounded transition-colors"
              >
                Sync All Timestamps
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
