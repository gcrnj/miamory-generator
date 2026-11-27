'use client';

import React, { useState } from 'react';
import { Participant } from '@/types/conversation';
import { UserPlus, Trash2, Edit2, Check, X, Users } from 'lucide-react';
import { getInitials } from '@/utils/timeUtils';

interface ParticipantManagerProps {
  participants: Participant[];
  onAddParticipant: (name: string, role: string) => void;
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddParticipant(newName, newRole || 'Guest');
    setNewName('');
    setNewRole('');
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
            Characters & Participants ({participants.length})
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs text-blue-400 hover:text-blue-300 font-medium"
        >
          {isOpen ? 'Close Manager' : 'Manage Characters'}
        </button>
      </div>

      {/* Quick horizontal avatar pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-thin">
        {participants.map((p) => (
          <div
            key={p.id}
            className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-slate-800/90 border border-slate-700/60 shrink-0 text-xs"
            title={`${p.name} (${p.role})`}
          >
            <span
              className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
              style={{ backgroundColor: p.avatarColor || '#64748B' }}
            >
              {getInitials(p.name)}
            </span>
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
          {/* Add Form */}
          <form onSubmit={handleAdd} className="flex flex-wrap items-center gap-2 bg-slate-800/70 p-2.5 rounded-lg border border-slate-700/50">
            <input
              type="text"
              placeholder="Character Name (e.g. Ninang Lolit)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 min-w-[140px] bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Role (e.g. Wedding Coordinator)"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-36 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded border border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newName.trim()}
              className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-medium px-3 py-1.5 rounded flex items-center gap-1 transition-colors shrink-0"
            >
              <UserPlus className="w-3.5 h-3.5" /> Add
            </button>
          </form>

          {/* List for Editing */}
          <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
            {participants.map((p) => {
              const isEditing = editingId === p.id;
              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-slate-800/50 border border-slate-800 hover:border-slate-700 text-xs"
                >
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
                        className="w-32 bg-slate-900 text-white text-xs px-2 py-1 rounded border border-slate-700"
                      />
                      <button
                        type="button"
                        onClick={() => saveEdit(p.id)}
                        className="text-emerald-400 hover:text-emerald-300 p-1"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="text-slate-400 hover:text-slate-300 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                          style={{ backgroundColor: p.avatarColor || '#64748B' }}
                        >
                          {getInitials(p.name)}
                        </span>
                        <span className="font-semibold text-slate-200 truncate">
                          {p.name}
                        </span>
                        <span className="text-slate-400 text-[11px] truncate">
                          ({p.role})
                        </span>
                        {p.isCustom && (
                          <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.2 rounded">
                            Custom
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <input
                          type="color"
                          value={p.nameColor || p.avatarColor || '#EC4899'}
                          onChange={(e) =>
                            onUpdateParticipant(p.id, {
                              nameColor: e.target.value,
                              avatarColor: e.target.value,
                            })
                          }
                          className="w-5 h-5 rounded border-0 bg-transparent cursor-pointer"
                          title="Change Color"
                        />
                        <button
                          type="button"
                          onClick={() => startEdit(p)}
                          className="p-1 text-slate-400 hover:text-white"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {p.isCustom && (
                          <button
                            type="button"
                            onClick={() => onDeleteParticipant(p.id)}
                            className="p-1 text-rose-400 hover:text-rose-300"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
