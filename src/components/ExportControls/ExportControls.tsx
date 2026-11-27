'use client';

import React, { useState } from 'react';
import { ExportSettings, TimelineItem } from '@/types/conversation';
import { Download, Sliders, CheckCircle, Loader2 } from 'lucide-react';
import { capturePreviewPng } from './capturePreviewPng';

interface ExportControlsProps {
  exportSettings: ExportSettings;
  onUpdateExportSettings: (updates: Partial<ExportSettings>) => void;
  previewRef: React.RefObject<HTMLDivElement | null>;
  groupName: string;
  totalItems: number;
}

export function ExportControls({
  exportSettings,
  onUpdateExportSettings,
  previewRef,
  groupName,
  totalItems,
}: ExportControlsProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleDownloadPng = async () => {
    const preview = previewRef.current;
    if (!preview) return;

    try {
      setIsExporting(true);
      setExportSuccess(false);

      // Brief delay to allow any pending DOM updates / layouts to settle
      await new Promise((resolve) => setTimeout(resolve, 150));

      const dataUrl = await capturePreviewPng(
        preview,
        exportSettings.pixelRatio,
      );

      const cleanGroupName = (groupName || 'miamory-chat')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      const link = document.createElement('a');
      link.download = `${cleanGroupName}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export image', err);
      alert('Could not generate image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const selectedCount = exportSettings.selectedItemIds.length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Export & Crop Options
          </h3>
        </div>

        {/* Resolution selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Quality:</span>
          <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
            <button
              type="button"
              onClick={() => onUpdateExportSettings({ pixelRatio: 2 })}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                exportSettings.pixelRatio === 2
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              2x (Retina)
            </button>
            <button
              type="button"
              onClick={() => onUpdateExportSettings({ pixelRatio: 3 })}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                exportSettings.pixelRatio === 3
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3x (Ultra HD)
            </button>
          </div>
        </div>
      </div>

      {/* Scope Toggles: All vs Selected */}
      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-400 font-medium">Export Scope:</span>
        <button
          type="button"
          onClick={() => onUpdateExportSettings({ selectedOnly: false })}
          className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
            !exportSettings.selectedOnly
              ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
          }`}
        >
          Entire Conversation ({totalItems} items)
        </button>
        <button
          type="button"
          onClick={() => onUpdateExportSettings({ selectedOnly: true })}
          className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
            exportSettings.selectedOnly
              ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
          }`}
        >
          Selected Only ({selectedCount})
        </button>
      </div>

      {/* Component Toggles: Header, Sender Names, Reactions, System Events, Timestamps */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-xs">
        <label className="flex items-center gap-2 bg-slate-800/60 p-2 rounded border border-slate-800 hover:border-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={exportSettings.includeHeader}
            onChange={(e) => onUpdateExportSettings({ includeHeader: e.target.checked })}
            className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
          />
          <span className="text-slate-300">Header</span>
        </label>

        <label className="flex items-center gap-2 bg-slate-800/60 p-2 rounded border border-slate-800 hover:border-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={exportSettings.includeSenderNames}
            onChange={(e) => onUpdateExportSettings({ includeSenderNames: e.target.checked })}
            className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
          />
          <span className="text-slate-300">Sender Names</span>
        </label>

        <label className="flex items-center gap-2 bg-slate-800/60 p-2 rounded border border-slate-800 hover:border-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={exportSettings.includeReactions}
            onChange={(e) => onUpdateExportSettings({ includeReactions: e.target.checked })}
            className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
          />
          <span className="text-slate-300">Reactions</span>
        </label>

        <label className="flex items-center gap-2 bg-slate-800/60 p-2 rounded border border-slate-800 hover:border-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={exportSettings.includeSystemEvents}
            onChange={(e) => onUpdateExportSettings({ includeSystemEvents: e.target.checked })}
            className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
          />
          <span className="text-slate-300">System Events</span>
        </label>

        <label className="flex items-center gap-2 bg-slate-800/60 p-2 rounded border border-slate-800 hover:border-slate-700 cursor-pointer">
          <input
            type="checkbox"
            checked={exportSettings.includeTimestamps}
            onChange={(e) => onUpdateExportSettings({ includeTimestamps: e.target.checked })}
            className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
          />
          <span className="text-slate-300">Timestamps</span>
        </label>
      </div>

      {/* Prominent Export Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleDownloadPng}
          disabled={isExporting}
          className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-semibold text-sm shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating High-Res PNG...
            </>
          ) : exportSuccess ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-200" />
              Downloaded PNG!
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download Conversation PNG
            </>
          )}
        </button>
      </div>
    </div>
  );
}
