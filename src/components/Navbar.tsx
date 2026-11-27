'use client';

import React from 'react';
import { Undo2, Redo2, RefreshCw, FilePlus2, Eye, Edit3, Heart, FileSpreadsheet, ChevronDown } from 'lucide-react';

interface NavbarProps {
  canUndo: boolean;
  canRedo: boolean;
  activeMobileTab: 'editor' | 'preview';
  onUndo: () => void;
  onRedo: () => void;
  onResetToSample: () => void;
  onClearConversation: () => void;
  onOpenCsvModal: () => void;
  setActiveMobileTab: (tab: 'editor' | 'preview') => void;
}

export function Navbar({
  canUndo,
  canRedo,
  activeMobileTab,
  onUndo,
  onRedo,
  onResetToSample,
  onClearConversation,
  onOpenCsvModal,
  setActiveMobileTab,
}: NavbarProps) {
  const handleClear = () => {
    if (window.confirm('Start a new blank conversation? Your draft will be cleared.')) {
      onClearConversation();
    }
  };

  const handleResetSample = () => {
    if (window.confirm('Reset to the wedding sample conversation?')) {
      onResetToSample();
    }
  };

  return (
    <header className="h-12 border-b border-slate-800/80 bg-[#0C0E14] px-3 md:px-4 flex items-center justify-between shrink-0 select-none z-40 relative">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500 via-rose-500 to-red-600 flex items-center justify-center text-white shadow-sm shadow-pink-900/50">
          <Heart className="w-3.5 h-3.5 fill-white" />
        </div>
        <div className="leading-none">
          <div className="text-[13px] font-bold tracking-tight text-white">
            Miamory <span className="font-normal text-slate-400 text-[12px]">Conversation Generator</span>
          </div>
        </div>
      </div>

      {/* Center action strip */}
      <div className="flex items-center gap-1">
        {/* Undo / Redo */}
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-25 transition-colors"
          title="Undo (Cmd/Ctrl+Z)"
        >
          <Undo2 className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-25 transition-colors"
          title="Redo (Cmd/Ctrl+Shift+Z)"
        >
          <Redo2 className="w-3.5 h-3.5" />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1.5 hidden sm:block" />

        {/* CSV Template Button */}
        <button
          type="button"
          onClick={onOpenCsvModal}
          className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 text-[12px] font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 rounded-lg transition-all gap-1.5"
          title="CSV Import / Export / Template"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>CSV</span>
        </button>

        {/* Load Sample */}
        <button
          type="button"
          onClick={handleResetSample}
          className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 text-[12px] font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 rounded-lg transition-all"
          title="Load wedding sample conversation"
        >
          <RefreshCw className="w-3.5 h-3.5 text-pink-400 shrink-0" />
          <span className="hidden md:inline">Sample</span>
        </button>

        {/* New Conversation */}
        <button
          type="button"
          onClick={handleClear}
          className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 text-[12px] font-medium text-slate-300 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 rounded-lg transition-all"
          title="New blank conversation"
        >
          <FilePlus2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="hidden md:inline">New</span>
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1.5 hidden sm:block" />

        {/* Mobile Tab Switcher */}
        <div className="flex lg:hidden bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60">
          <button
            type="button"
            onClick={() => setActiveMobileTab('editor')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
              activeMobileTab === 'editor'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-3 h-3" /> Edit
          </button>
          <button
            type="button"
            onClick={() => setActiveMobileTab('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
              activeMobileTab === 'preview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3 h-3" /> View
          </button>
        </div>
      </div>
    </header>
  );
}
