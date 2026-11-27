"use client";

import React, { useState } from "react";
import { ConversationSettings, Participant } from "@/types/conversation";
import { getInitials } from "@/utils/timeUtils";
import { ChevronDown, ChevronUp, Clock, Palette, Upload } from "lucide-react";

interface ConversationSettingsPanelProps {
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
}: ConversationSettingsPanelProps) {
  const [showMore, setShowMore] = useState(false);

  const povParticipant = participants.find(
    (p) => p.id === settings.povParticipantId,
  );

  return (
    <div className="border-b border-slate-800/80 bg-slate-950">
      {/* ─── Main Row: Group name + POV ─── */}
      <div className="flex items-stretch gap-0 divide-x divide-slate-800/80">
        {/* Group Name */}
        <div className="flex-1 px-3 py-2.5 flex flex-col justify-center min-w-0">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1 block">
            Group Name
          </label>
          <input
            type="text"
            value={settings.groupName}
            onChange={(e) => onUpdateSettings({ groupName: e.target.value })}
            placeholder="Santos-Bautista Wedding Entourage 💍"
            className="w-full bg-transparent text-slate-100 text-[13px] font-medium placeholder:text-slate-600 focus:outline-none focus:text-white transition-colors truncate"
          />
        </div>

        {/* POV Selector */}
        <div className="shrink-0 px-3 py-2.5 flex flex-col justify-center min-w-0 max-w-[200px]">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1 block">
            Viewing As
          </label>
          <div className="flex items-center gap-1.5">
            {/* Mini avatar of POV */}
            <div className="relative shrink-0">
              {povParticipant?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={povParticipant.avatarUrl}
                  alt={povParticipant.name}
                  className="w-5 h-5 rounded-full object-cover ring-1 ring-white/10"
                />
              ) : (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                  style={{
                    backgroundColor: povParticipant?.avatarColor || "#64748B",
                  }}
                >
                  {povParticipant ? getInitials(povParticipant.name) : "?"}
                </div>
              )}
              {/* Blue dot = POV indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-blue-500 rounded-full border border-slate-950" />
            </div>
            <select
              value={settings.povParticipantId}
              onChange={(e) =>
                onUpdateSettings({ povParticipantId: e.target.value })
              }
              className="bg-transparent text-slate-200 text-[13px] font-medium focus:outline-none cursor-pointer truncate max-w-[140px] appearance-none"
            >
              {participants.map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                  className="bg-slate-800 text-white"
                >
                  {p.name.split(" ")[0]}{" "}
                  {p.name.includes('"')
                    ? p.name.match(/"([^"]+)"/)?.[0] || ""
                    : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Width + More toggle */}
        <div className="shrink-0 px-3 py-2.5 flex flex-col justify-center gap-1.5">
          <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 block">
            Width
          </label>
          <div className="flex items-center gap-1.5">
            <select
              value={settings.previewWidth}
              onChange={(e) =>
                onUpdateSettings({ previewWidth: Number(e.target.value) })
              }
              className="bg-slate-800 text-slate-200 text-[12px] border border-slate-700 rounded px-2 py-1 focus:outline-none appearance-none"
            >
              <option value={375}>375 — Compact</option>
              <option value={420}>420 — Standard</option>
              <option value={480}>480 — Medium</option>
              <option value={540}>540 — FB Feed</option>
              <option value={600}>600 — Wide</option>
            </select>
            <button
              type="button"
              onClick={() => setShowMore(!showMore)}
              className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              title="More settings"
            >
              {showMore ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Expanded settings ─── */}
      {showMore && (
        <div className="px-3 pb-3 pt-2 border-t border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* Group Avatar */}
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
              Group Avatar
            </label>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ring-1 ring-white/10 shrink-0"
                style={{
                  backgroundColor: settings.groupAvatarColor || "#E11D48",
                }}
              >
                {settings.groupAvatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={settings.groupAvatarUrl}
                    alt="group"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  settings.groupAvatarInitials || "GC"
                )}
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex gap-1">
                  <input
                    type="text"
                    maxLength={3}
                    value={settings.groupAvatarInitials || ""}
                    onChange={(e) =>
                      onUpdateSettings({
                        groupAvatarInitials: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-10 bg-slate-800 text-white text-xs rounded px-1.5 py-1 border border-slate-700 uppercase font-bold text-center"
                    placeholder="SB"
                  />
                  <input
                    type="color"
                    value={settings.groupAvatarColor || "#E11D48"}
                    onChange={(e) =>
                      onUpdateSettings({ groupAvatarColor: e.target.value })
                    }
                    className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
                  />
                  <label
                    className="cursor-pointer text-slate-400 hover:text-white p-1"
                    title="Upload group photo"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === "string") {
                              onUpdateSettings({
                                groupAvatarUrl: reader.result,
                              });
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
                      onClick={() =>
                        onUpdateSettings({ groupAvatarUrl: undefined })
                      }
                      className="text-[10px] text-slate-500 hover:text-rose-400 self-center"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Viewing As Avatar */}
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
              Viewing As Avatar
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.includePovAvatar ?? false}
                onChange={(e) =>
                  onUpdateSettings({ includePovAvatar: e.target.checked })
                }
                className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
              />
              Show avatar on sent messages
            </label>
          </div>

          {/* Group Subtitle */}
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
              Subtitle
            </label>
            <input
              type="text"
              value={settings.groupDescription || ""}
              onChange={(e) =>
                onUpdateSettings({ groupDescription: e.target.value })
              }
              placeholder="e.g. 8 participants"
              className="w-full bg-slate-800 text-white text-[12px] rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Bubble Color */}
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block flex items-center gap-1">
              <Palette className="w-3 h-3 text-pink-400" /> Bubble Color
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={settings.chatThemeColor || "#0A7CFF"}
                onChange={(e) =>
                  onUpdateSettings({ chatThemeColor: e.target.value })
                }
                className="w-7 h-7 rounded border-0 bg-transparent cursor-pointer"
              />
              <div className="flex gap-1">
                {["#0A7CFF", "#25D366", "#8B5CF6", "#EC4899", "#F97316"].map(
                  (c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => onUpdateSettings({ chatThemeColor: c })}
                      className={`w-4 h-4 rounded-full ring-1 transition-transform hover:scale-125 ${
                        settings.chatThemeColor === c
                          ? "ring-white scale-110"
                          : "ring-white/20"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Auto Timestamps */}
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-400" /> Auto Timestamps
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={settings.startTimestamp}
                onChange={(e) =>
                  onUpdateSettings({ startTimestamp: e.target.value })
                }
                placeholder="9:41 AM"
                className="w-16 bg-slate-800 text-white text-[12px] rounded px-2 py-1.5 border border-slate-700 text-center"
              />
              <select
                value={settings.autoTimestampIntervalMinutes}
                onChange={(e) =>
                  onUpdateSettings({
                    autoTimestampIntervalMinutes: Number(e.target.value),
                  })
                }
                className="bg-slate-800 text-[12px] text-white rounded px-1.5 py-1.5 border border-slate-700"
              >
                <option value={1}>+1m</option>
                <option value={2}>+2m</option>
                <option value={3}>+3m</option>
                <option value={5}>+5m</option>
                <option value={10}>+10m</option>
              </select>
              <button
                type="button"
                onClick={onAutoGenerateTimestamps}
                className="bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-semibold px-2 py-1.5 rounded transition-colors whitespace-nowrap"
                title="Apply auto timestamps to all messages"
              >
                Sync All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
