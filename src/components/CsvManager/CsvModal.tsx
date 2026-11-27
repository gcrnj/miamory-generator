"use client";

import React, { useState, useRef } from "react";
import {
  FileSpreadsheet,
  Download,
  Upload,
  Copy,
  Check,
  X,
  FileText,
  AlertCircle,
  PlusCircle,
  RefreshCw,
} from "lucide-react";
import {
  generateCsvTemplate,
  exportTimelineToCsv,
  downloadCsvFile,
  parseCsvToTimeline,
} from "@/utils/csvUtils";
import { TimelineItem, Participant } from "@/types/conversation";

interface CsvModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeline: TimelineItem[];
  participants: Participant[];
  groupName: string;
  onImportTimeline: (
    newTimeline: TimelineItem[],
    newParticipants: Participant[],
    mode: "replace" | "append",
  ) => void;
}

export function CsvModal({
  isOpen,
  onClose,
  timeline,
  participants,
  groupName,
  onImportTimeline,
}: CsvModalProps) {
  const [activeTab, setActiveTab] = useState<"template" | "import" | "export">(
    "template",
  );
  const [csvInput, setCsvInput] = useState("");
  const [importMode, setImportMode] = useState<"replace" | "append">("replace");
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [parseResult, setParseResult] = useState<{
    messageCount: number;
    eventCount: number;
    newCharactersCount: number;
    error?: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const templateCsv = generateCsvTemplate();

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    downloadCsvFile(templateCsv, "miamory-conversation-template.csv");
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(templateCsv);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  const handleExportCurrent = () => {
    const csvData = exportTimelineToCsv(timeline, participants);
    const cleanName = (groupName || "conversation")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    downloadCsvFile(csvData, `${cleanName}-${Date.now()}.csv`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        setCsvInput(text);
        validateCsvText(text);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const validateCsvText = (text: string) => {
    if (!text.trim()) {
      setParseResult(null);
      return;
    }

    try {
      const {
        timeline: parsedTimeline,
        newParticipants,
        errors,
      } = parseCsvToTimeline(text, participants);

      if (errors.length > 0) {
        setParseResult({
          messageCount: 0,
          eventCount: 0,
          newCharactersCount: 0,
          error: errors[0],
        });
        return;
      }

      const msgs = parsedTimeline.filter((it) => it.type === "message").length;
      const evts = parsedTimeline.filter((it) => it.type === "system").length;

      setParseResult({
        messageCount: msgs,
        eventCount: evts,
        newCharactersCount: newParticipants.length,
      });
    } catch (e: any) {
      setParseResult({
        messageCount: 0,
        eventCount: 0,
        newCharactersCount: 0,
        error: e?.message || "Invalid CSV syntax",
      });
    }
  };

  const handleApplyImport = () => {
    if (!csvInput.trim()) return;

    const { timeline: parsedTimeline, newParticipants } = parseCsvToTimeline(
      csvInput,
      participants,
    );

    if (parsedTimeline.length === 0) {
      alert("No valid conversation rows found in the CSV.");
      return;
    }

    onImportTimeline(parsedTimeline, newParticipants, importMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                CSV Spreadsheet Manager
              </h2>
              <p className="text-xs text-slate-400">
                Compose dialogues in Excel / Google Sheets and import seamlessly
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-5 pt-3 border-b border-slate-800/80 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("template")}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === "template"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Download className="w-3.5 h-3.5" /> CSV Template
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("import")}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === "import"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Import CSV
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("export")}
            className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === "export"
                ? "border-emerald-500 text-emerald-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Export Current Chat
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {/* TAB 1: CSV TEMPLATE */}
          {activeTab === "template" && (
            <div className="space-y-4">
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 text-xs text-slate-300 space-y-2">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  Official Miamory CSV Format Guide
                </p>
                <p className="text-slate-400 leading-relaxed">
                  Use this CSV structure to draft Facebook group conversations
                  in Google Sheets or Excel:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                    <span className="text-emerald-400 font-bold block">
                      type
                    </span>
                    <span className="text-slate-400">message or system</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                    <span className="text-blue-400 font-bold block">
                      sender
                    </span>
                    <span className="text-slate-400">
                      Character name / Actor
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                    <span className="text-amber-400 font-bold block">text</span>
                    <span className="text-slate-400">
                      Dialogue or notification
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                    <span className="text-purple-400 font-bold block">
                      timestamp
                    </span>
                    <span className="text-slate-400">
                      e.g. 9:41 AM (or blank)
                    </span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                    <span className="text-pink-400 font-bold block">
                      reactions
                    </span>
                    <span className="text-slate-400">e.g. ❤️:3, 😂:2</span>
                  </div>
                  <div className="bg-slate-900/80 p-2 rounded border border-slate-800">
                    <span className="text-cyan-400 font-bold block">
                      date_divider
                    </span>
                    <span className="text-slate-400">
                      e.g. Today, Yesterday
                    </span>
                  </div>
                </div>
              </div>

              {/* Template Code Preview */}
              <div>
                <div className="flex items-center justify-between mb-1.5 text-xs text-slate-400">
                  <span>Template Preview (Ready for Copy / Download):</span>
                  <button
                    type="button"
                    onClick={handleCopyTemplate}
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    {copiedTemplate ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy Raw CSV
                      </>
                    )}
                  </button>
                </div>
                <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48 leading-relaxed select-text">
                  {templateCsv}
                </pre>
              </div>

              {/* Download Action */}
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download miamory-conversation-template.csv
              </button>
            </div>
          )}

          {/* TAB 2: IMPORT CSV */}
          {activeTab === "import" && (
            <div className="space-y-4">
              {/* File upload bar */}
              <div className="flex items-center justify-between gap-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/60">
                <div>
                  <span className="text-xs font-semibold text-white block">
                    Upload CSV File
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Select a .csv file exported from Excel or Google Sheets
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-emerald-400" /> Browse
                  File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,text/csv"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>

              {/* Paste Textarea */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Or Paste CSV / Spreadsheet Content Here:
                </label>
                <textarea
                  rows={6}
                  value={csvInput}
                  onChange={(e) => {
                    setCsvInput(e.target.value);
                    validateCsvText(e.target.value);
                  }}
                  placeholder="type,sender,text,timestamp,reactions,date_divider&#10;message,Maria,Hello everyone!,9:41 AM,❤️:2,Today"
                  className="w-full bg-slate-950 font-mono text-xs text-slate-200 p-3 rounded-xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-y leading-relaxed"
                />
              </div>

              {/* Parse Preview Status */}
              {parseResult && (
                <div
                  className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
                    parseResult.error
                      ? "bg-rose-950/40 border-rose-800/60 text-rose-300"
                      : "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
                  }`}
                >
                  {parseResult.error ? (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>{parseResult.error}</span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-semibold">
                        Parsed Successfully:
                      </span>
                      <span>💬 {parseResult.messageCount} Messages</span>
                      <span>🔔 {parseResult.eventCount} System Events</span>
                      {parseResult.newCharactersCount > 0 && (
                        <span>
                          ✨ {parseResult.newCharactersCount} New Characters
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Import Options & Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400">Import Mode:</span>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === "replace"}
                      onChange={() => setImportMode("replace")}
                      className="text-emerald-500 focus:ring-0"
                    />
                    Replace All
                  </label>
                  <label className="inline-flex items-center gap-1.5 cursor-pointer text-slate-300 ml-2">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importMode === "append"}
                      onChange={() => setImportMode("append")}
                      className="text-emerald-500 focus:ring-0"
                    />
                    Append to Bottom
                  </label>
                </div>

                <button
                  type="button"
                  onClick={handleApplyImport}
                  disabled={!csvInput.trim() || Boolean(parseResult?.error)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-950/40"
                >
                  <Check className="w-4 h-4" />
                  Apply CSV to Conversation
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: EXPORT CURRENT CONVERSATION */}
          {activeTab === "export" && (
            <div className="space-y-4">
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 text-xs text-slate-300 space-y-2">
                <p className="font-semibold text-white">
                  Export Active Conversation ({timeline.length} items)
                </p>
                <p className="text-slate-400 leading-relaxed">
                  Exporting creates a standard CSV file matching our template
                  format. You can open it in Excel, Google Sheets, or share it
                  with other scriptwriters.
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportCurrent}
                disabled={timeline.length === 0}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-950/40 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Current Conversation as .CSV
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
