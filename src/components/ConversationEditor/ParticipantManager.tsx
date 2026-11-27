'use client';

import React, { useState, useRef } from 'react';
import { Participant } from '@/types/conversation';
import {
  UserPlus,
  Trash2,
  Edit2,
  Check,
  X,
  Users,
  Upload,
  Image as ImageIcon,
  RotateCcw,
} from 'lucide-react';
import { getInitials } from '@/utils/timeUtils';

interface ParticipantManagerProps {
  participants: Participant[];
  onAddParticipant: (name: string, role: string, avatarUrl?: string) => void;
  onUpdateParticipant: (id: string, updates: Partial<Participant>) => void;
  onDeleteParticipant: (id: string) => void;
}

export function ParticipantManager({
  participants,
  onAddParticipant,
  onUpdateParticipant,
  onDeleteParticipant,
}: ParticipantManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newAvatarUrl, setNewAvatarUrl] = useState<string | undefined>(undefined);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');

  const newAvatarInputRef = useRef<HTMLInputElement | null>(null);
  const participantFileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onComplete: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onComplete(reader.result);
      }
    };
    reader.readAsDataURL(file);
    // Reset input so the same file can be re-uploaded if desired
    e.target.value = '';
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddParticipant(newName, newRole || 'Guest', newAvatarUrl);
    setNewName('');
    setNewRole('');
    setNewAvatarUrl(undefined);
  };

  const startEdit = (p: Participant) => {
    setEditingId(p.id);
    setEditName(p.name);
    setEditRole(p.role);
  };

  const saveEdit = (id: string) => {
    if (editName.trim()) {
      onUpdateParticipant(id, { name: editName.trim(), role: editRole.trim() });
    }
    setEditingId(null);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 mb-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Characters & Avatars ({participants.length})
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs text-blue-400 hover:text-blue-300 font-medium"
        >
          {isOpen ? 'Close Manager' : 'Manage Avatars & Characters'}
        </button>
      </div>

      {/* Quick horizontal avatar pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-thin">
        {participants.map((p) => (
          <div
            key={p.id}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-800/90 border border-slate-700/60 shrink-0 text-xs"
            title={`${p.name} (${p.role})`}
          >
            {p.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.avatarUrl}
                alt={p.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-white/10 shrink-0"
              />
            ) : (
              <span
                className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                style={{ backgroundColor: p.avatarColor || '#64748B' }}
              >
                {getInitials(p.name)}
              </span>
            )}
            <span className="font-medium text-slate-200 truncate max-w-[100px]">
              {p.name.split(' ')[0]}
            </span>
            <span className="text-[10px] text-slate-400 truncate max-w-[70px]">
              {p.role}
            </span>
          </div>
        ))}
      </div>

      {/* Expanded Manager Panel */}
      {isOpen && (
        <div className="mt-3 pt-3 border-t border-slate-800 space-y-3">
          {/* Add Character Form */}
          <form
            onSubmit={handleAdd}
            className="flex flex-wrap items-center gap-2 bg-slate-800/70 p-2.5 rounded-lg border border-slate-700/50"
          >
            {/* New Character Avatar Preview / Upload */}
            <div className="relative shrink-0">
              {newAvatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={newAvatarUrl}
                  alt="New Character Avatar"
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => newAvatarInputRef.current?.click()}
                  className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-600 transition-colors"
                  title="Upload avatar image"
                >
                  <Upload className="w-3.5 h-3.5" />
                </button>
              )}
              <input
                ref={newAvatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  handleFileChange(e, (dataUrl) => setNewAvatarUrl(dataUrl))
                }
              />
            </div>

            <input
              type="text"
              placeholder="Character Name (e.g. Ninang Lolit)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 min-w-[130px] bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Role (e.g. Wedding Coordinator)"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-32 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newName.trim()}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded flex items-center gap-1 transition-colors shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" /> Add
            </button>
          </form>

          {/* List for Editing & Avatar Management */}
          <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
            {participants.map((p) => {
              const isEditing = editingId === p.id;
              const hasCustomOrPresetAvatar = Boolean(p.avatarUrl);
              const isOverridden =
                p.defaultAvatarUrl && p.avatarUrl && p.avatarUrl !== p.defaultAvatarUrl;

              return (
                <div
                  key={p.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-800/50 border border-slate-800 hover:border-slate-700 text-xs"
                >
                  {/* Left: Avatar Thumbnail + Name & Role */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* Clickable Avatar Thumbnail */}
                    <div className="relative group shrink-0">
                      {p.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.avatarUrl}
                          alt={p.name}
                          className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
                        />
                      ) : (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ring-1 ring-white/10"
                          style={{ backgroundColor: p.avatarColor || '#64748B' }}
                        >
                          {getInitials(p.name)}
                        </div>
                      )}

                      {/* Quick hover upload overlay */}
                      <button
                        type="button"
                        onClick={() => participantFileRefs.current[p.id]?.click()}
                        className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                        title="Upload/Change Avatar"
                      >
                        <Upload className="w-3.5 h-3.5" />
                      </button>

                      {/* Hidden File Input for this participant */}
                      <input
                        ref={(el) => {
                          participantFileRefs.current[p.id] = el;
                        }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileChange(e, (dataUrl) =>
                            onUpdateParticipant(p.id, { avatarUrl: dataUrl })
                          )
                        }
                      />
                    </div>

                    {isEditing ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="flex-1 bg-slate-900 text-white text-xs px-2 py-1 rounded border border-slate-700"
                        />
                        <input
                          type="text"
                          value={editRole}
                          onChange={(e) => setEditRole(e.target.value)}
                          className="w-28 bg-slate-900 text-white text-xs px-2 py-1 rounded border border-slate-700"
                        />
                        <button
                          type="button"
                          onClick={() => saveEdit(p.id)}
                          className="text-emerald-400 hover:text-emerald-300 p-1"
                          title="Save"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="text-slate-400 hover:text-slate-300 p-1"
                          title="Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-200 truncate">
                            {p.name}
                          </span>
                          {p.isCustom && (
                            <span className="text-[9px] bg-purple-950 text-purple-300 border border-purple-800 px-1 rounded">
                              Custom
                            </span>
                          )}
                        </div>
                        <span className="text-slate-400 text-[11px] block truncate">
                          {p.role}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Right: Avatar Actions (Upload, Reset, Remove) + Edit/Delete */}
                  <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                    {/* Upload Avatar Button */}
                    <button
                      type="button"
                      onClick={() => participantFileRefs.current[p.id]?.click()}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium flex items-center gap-1 border border-slate-700 transition-colors"
                      title="Upload custom image for this character"
                    >
                      <Upload className="w-3 h-3 text-blue-400" />
                      {hasCustomOrPresetAvatar ? 'Change' : 'Upload'}
                    </button>

                    {/* Reset to Preset / Default /public/characters/ image */}
                    {p.defaultAvatarUrl && p.avatarUrl !== p.defaultAvatarUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateParticipant(p.id, { avatarUrl: p.defaultAvatarUrl })
                        }
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-medium flex items-center gap-1 border border-slate-700 transition-colors"
                        title="Restore default character photo from /public/characters/"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset
                      </button>
                    )}

                    {/* Remove image (use initials avatar) */}
                    {p.avatarUrl && (
                      <button
                        type="button"
                        onClick={() => onUpdateParticipant(p.id, { avatarUrl: '' })}
                        className="px-1.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-300 text-[11px] border border-slate-700 transition-colors"
                        title="Remove photo and use initials avatar"
                      >
                        Initials
                      </button>
                    )}

                    {/* Color picker */}
                    <input
                      type="color"
                      value={p.nameColor || p.avatarColor || '#EC4899'}
                      onChange={(e) =>
                        onUpdateParticipant(p.id, {
                          nameColor: e.target.value,
                          avatarColor: e.target.value,
                        })
                      }
                      className="w-5 h-5 rounded border-0 bg-transparent cursor-pointer ml-1"
                      title="Change Name & Avatar Color"
                    />

                    {/* Edit button */}
                    {!isEditing && (
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="p-1 text-slate-400 hover:text-white transition-colors"
                        title="Edit Name & Role"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Delete custom character button */}
                    {p.isCustom && (
                      <button
                        type="button"
                        onClick={() => onDeleteParticipant(p.id)}
                        className="p-1 text-rose-400 hover:text-rose-300 transition-colors"
                        title="Delete Character"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
