'use client';

import React, { useRef, useState } from 'react';
import { useConversationState } from '@/hooks/useConversationState';
import { Navbar } from '@/components/Navbar';
import { ConversationEditor } from '@/components/ConversationEditor/ConversationEditor';
import { ConversationPreview } from '@/components/ConversationPreview/ConversationPreview';
import { CsvModal } from '@/components/CsvManager/CsvModal';

export default function Home() {
  const {
    participants,
    settings,
    timeline,
    exportSettings,
    canUndo,
    canRedo,
    undo,
    redo,
    setSettings,
    setExportSettings,
    addMessage,
    addSystemEvent,
    updateItem,
    duplicateItem,
    deleteItem,
    moveItem,
    reorderItems,
    autoGenerateTimestamps,
    toggleReaction,
    removeReaction,
    updateReactionCount,
    addParticipant,
    updateParticipant,
    deleteParticipant,
    resetToSample,
    clearConversation,
    importCsvTimeline,
  } = useConversationState();

  const previewRef = useRef<HTMLDivElement | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<'editor' | 'preview'>('editor');
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Top Navbar */}
      <Navbar
        canUndo={canUndo}
        canRedo={canRedo}
        activeMobileTab={activeMobileTab}
        onUndo={undo}
        onRedo={redo}
        onResetToSample={resetToSample}
        onClearConversation={clearConversation}
        onOpenCsvModal={() => setIsCsvModalOpen(true)}
        setActiveMobileTab={setActiveMobileTab}
      />

      {/* Main Workspace (Two-Panel Layout) */}
      <main className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* LEFT PANEL: Conversation Editor */}
        <section
          className={`lg:col-span-6 xl:col-span-7 h-full flex flex-col bg-slate-950 border-r border-slate-800 overflow-hidden ${
            activeMobileTab === 'editor' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <ConversationEditor
            settings={settings}
            participants={participants}
            timeline={timeline}
            exportSettings={exportSettings}
            previewRef={previewRef}
            onOpenCsvModal={() => setIsCsvModalOpen(true)}
            onUpdateSettings={(updates) => setSettings((prev) => ({ ...prev, ...updates }))}
            onUpdateExportSettings={(updates) =>
              setExportSettings((prev) => ({ ...prev, ...updates }))
            }
            onAutoGenerateTimestamps={() => autoGenerateTimestamps()}
            onAddParticipant={addParticipant}
            onUpdateParticipant={updateParticipant}
            onDeleteParticipant={deleteParticipant}
            onAddMessage={addMessage}
            onAddSystemEvent={addSystemEvent}
            onUpdateItem={updateItem}
            onDuplicateItem={duplicateItem}
            onDeleteItem={deleteItem}
            onMoveItem={moveItem}
            onReorderItems={reorderItems}
            onToggleReaction={toggleReaction}
            onRemoveReaction={removeReaction}
            onUpdateReactionCount={updateReactionCount}
          />
        </section>

        {/* RIGHT PANEL: Live Preview */}
        <section
          className={`lg:col-span-6 xl:col-span-5 h-full flex flex-col bg-[#16181F] overflow-hidden ${
            activeMobileTab === 'preview' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Subtle panel header for Live Preview */}
          <div className="h-10 px-4 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
            <span className="font-medium text-slate-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Conversation Preview
            </span>
            <span className="text-[11px] text-slate-500">
              {settings.previewWidth}px • #242832
            </span>
          </div>

          {/* Scrollable preview area — canvas grows to full height so export captures everything */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <ConversationPreview
              timeline={timeline}
              settings={settings}
              participants={participants}
              exportSettings={exportSettings}
              previewRef={previewRef}
            />
          </div>

          {/* Sticky Export Bar */}
          <ExportBar
            exportSettings={exportSettings}
            onUpdateExportSettings={(updates) =>
              setExportSettings((prev) => ({ ...prev, ...updates }))
            }
            previewRef={previewRef}
            groupName={settings.groupName}
            totalItems={timeline.length}
          />
        </section>
      </main>

      {/* CSV Manager Modal */}
      <CsvModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        timeline={timeline}
        participants={participants}
        groupName={settings.groupName}
        onImportTimeline={importCsvTimeline}
      />
    </div>
  );
}
