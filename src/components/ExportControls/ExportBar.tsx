'use client';

import React, { useState } from 'react';
import { CheckCircle, Download, Loader2 } from 'lucide-react';
import { ExportSettings } from '@/types/conversation';
import { capturePreviewPng } from './capturePreviewPng';

interface ExportBarProps {
  exportSettings: ExportSettings;
  previewRef: React.RefObject<HTMLDivElement | null>;
  groupName: string;
}

export function ExportBar({ exportSettings, previewRef, groupName }: ExportBarProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleSaveImage = async () => {
    const preview = previewRef.current;
    if (!preview) return;

    try {
      setIsExporting(true);
      setExportSuccess(false);
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
    } catch (error) {
      console.error('Failed to save preview image', error);
      alert('Could not generate image. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="shrink-0 border-t border-slate-800 bg-slate-900/80 p-3">
      <button
        type="button"
        onClick={handleSaveImage}
        disabled={isExporting}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition-colors hover:bg-emerald-500 disabled:cursor-wait disabled:opacity-60"
      >
        {isExporting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving image…
          </span>
        ) : exportSuccess ? (
          <span className="flex items-center justify-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Image saved
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Download className="h-4 w-4" />
            Save image
          </span>
        )}
      </button>
    </div>
  );
}
