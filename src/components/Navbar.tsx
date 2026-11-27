'use client';

import React from 'react';
import { Undo2, Redo2, RefreshCw, FilePlus2, Eye, Edit3, Heart } from 'lucide-react';

interface NavbarProps {
  canUndo: boolean;
  canRedo: boolean;
  activeMobileTab: 'editor' | 'preview';
  onUndo: () => void;
  onRedo: () => void;
  onResetToSample: () => void;
  onClearConversation: () => void;
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
  setActiveMobileTab,
}: NavbarProps) {
  const handleClear = () => {
    if (window.confirm('Are you sure you want to start a new blank conversation?')) {
      onClearConversation();
    }
  };

  const handleResetSample = () => {
    if (window.confirm('Reset conversation to the wedding sample?')) {
      onResetToSample();
    }
  };

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-4 flex items-center justify-between shrink-0 select-none sticky top-0 z-40">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-pink-900/40">
          <Heart className="w-4 h-4 fill-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
            Miamory <span className="font-normal text-slate-400">Generator</span>
          </h1>
          <p className="text-[10px] text-slate-500 hidden sm:block">
            Realistic Facebook Conversation Studio
          </p>
        </div>
      </div>

      {/* Undo / Redo & Presets */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Undo (Ctrl/Cmd+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Redo (Ctrl/Cmd+Shift+Z)"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

        <button
          type="button"
          onClick={handleResetSample}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
          title="Reload funny wedding sample conversation"
        >
          <RefreshCw className="w-3.5 h-3.5 text-pink-400" />
          Load Wedding Sample
        </button>

        <button
          type="button"
          onClick={handleClear}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
          title="Clear all messages"
        >
          <FilePlus2 className="w-3.5 h-3.5 text-blue-400" />
          New Chat
        </button>

        {/* Mobile Tab Switcher */}
        <div className="flex lg:hidden bg-slate-900 p-0.5 rounded-lg border border-slate-800 ml-1">
          <button
            type="button"
            onClick={() => setActiveMobileTab('editor')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeMobileTab === 'editor'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Editor
          </button>
          <button
            type="button"
            onClick={() => setActiveMobileTab('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeMobileTab === 'preview'
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
        </div>
      </div>
    </header>
  );
}
