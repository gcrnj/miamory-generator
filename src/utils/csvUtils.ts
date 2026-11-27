import {
  TimelineItem,
  Participant,
  MessageItem,
  SystemEventItem,
  ReactionItem,
} from "@/types/conversation";
import { addMinutesToTimeString } from "./timeUtils";

export const CSV_HEADERS = [
  "type",
  "sender",
  "text",
  "timestamp",
  "reactions",
  "date_divider",
];

// RFC 4180 compliant CSV cell escaper
export function escapeCsvCell(value: string | undefined | null): string {
  if (value === undefined || value === null) return "";
  const str = String(value);
  if (
    str.includes(",") ||
    str.includes('"') ||
    str.includes("\n") ||
    str.includes("\r")
  ) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Generate the official CSV template with comments and realistic wedding sample data
export function generateCsvTemplate(): string {
  const rows = [
    CSV_HEADERS.join(","),
    'system,"Maria","Maria added Tita Letty to the group.","","",Today',
    'message,"Maria","Good morning everyone! Sending the final reception seating arrangement today. Please strictly no more last-minute additions po 🙏","9:41 AM","❤️:3, 🙏:2",',
    'message,"Gabo ""Gabo"" Bautista","Yes please po, 150 pax na yung venue max limit! Super siksik na if we add more.","9:42 AM","👍:1",',
    'message,"Tita Letty","Hija @Maria! Pwede bang isingit si Tito Boyet and his 4 kids galing Canada? Kararating lang nila kagabi, nakakahiya naman kung hindi invite!","9:44 AM","😭:2, 😂:1",',
    'message,"Elena Reyes","Letty naman... Sabi ko na nga ba e 😂 Saan natin uupuin sila Boyet? Sa stage?","9:45 AM","😂:4",',
    'message,"Tita Vicky","Kung kasama si Boyet, dapat kasama rin si Mareng Susan! Ninang siya ni Gabo sa binyag!","9:47 AM","🤦‍♂️:2",',
    'system,"Gabo ""Gabo"" Bautista","Gabo ""Gabo"" Bautista left the group.","","",',
    'message,"Maria","GABOOOO BUMALIK KA DITO 😭😭😭","9:48 AM","😂:5",',
    'system,"Maria","Maria added Gabo ""Gabo"" Bautista to the group.","","",',
    'message,"Corazon ""Cora"" Mendoza","Mga Tita, relax! Nag-order na ako ng 2 extra lechon para walang magtampo. Kasya tayong lahat!","9:50 AM","❤️:6, 🎉:4",',
    'message,"Maria","Aww thank you Mom Cora! Best mother-in-law ever! 💕 Love you all!","9:51 AM","🥰:3",',
  ];

  return rows.join("\r\n");
}

// Export current conversation items to CSV format
export function exportTimelineToCsv(
  timeline: TimelineItem[],
  participants: Participant[],
): string {
  const pMap = new Map<string, Participant>();
  participants.forEach((p) => pMap.set(p.id, p));

  const rows: string[] = [CSV_HEADERS.join(",")];

  for (const item of timeline) {
    if (item.type === "system") {
      const sys = item as SystemEventItem;
      const actor = sys.actorId ? pMap.get(sys.actorId)?.name || "" : "";
      rows.push(
        [
          "system",
          escapeCsvCell(actor),
          escapeCsvCell(sys.text),
          escapeCsvCell(sys.timestamp || ""),
          "",
          escapeCsvCell(sys.dateDivider || ""),
        ].join(","),
      );
    } else {
      const msg = item as MessageItem;
      const sender = pMap.get(msg.senderId)?.name || "Unknown";
      const reactionsStr = msg.reactions
        ? msg.reactions.map((r) => `${r.emoji}:${r.count}`).join(", ")
        : "";

      rows.push(
        [
          "message",
          escapeCsvCell(sender),
          escapeCsvCell(msg.text),
          escapeCsvCell(msg.timestamp || ""),
          escapeCsvCell(reactionsStr),
          escapeCsvCell(msg.dateDivider || ""),
        ].join(","),
      );
    }
  }

  return rows.join("\r\n");
}

// Download string content as a CSV file in browser
export function downloadCsvFile(
  content: string,
  filename = "miamory-conversation.csv",
) {
  const blob = new Blob(["\uFEFF" + content], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// RFC 4180 CSV parser supporting newlines inside quotes, double quotes, and commas
export function parseCsvRows(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let insideQuotes = false;

  const text = csvText.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      currentRow.push(currentField);
      currentField = "";
    } else if (char === "\n" && !insideQuotes) {
      currentRow.push(currentField);
      // Only push non-empty rows
      if (currentRow.some((field) => field.trim().length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = "";
    } else {
      currentField += char;
    }
  }

  // Final field/row if any
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some((field) => field.trim().length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

// Parse reactions string e.g. "❤️:3, 😂:2" or "❤️, 👍"
export function parseReactionsString(rxStr: string): ReactionItem[] {
  if (!rxStr || !rxStr.trim()) return [];

  const parts = rxStr
    .split(/[,+]/)
    .map((p) => p.trim())
    .filter(Boolean);
  const reactions: ReactionItem[] = [];

  for (const part of parts) {
    const colonIdx = part.lastIndexOf(":");
    let emoji = part;
    let count = 1;

    if (colonIdx > 0) {
      emoji = part.slice(0, colonIdx).trim();
      const parsedCount = parseInt(part.slice(colonIdx + 1).trim(), 10);
      if (!isNaN(parsedCount) && parsedCount > 0) {
        count = parsedCount;
      }
    }

    if (emoji) {
      reactions.push({
        id: `rx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        emoji,
        count,
      });
    }
  }

  return reactions;
}

// Parse full CSV into TimelineItems and discover/create any new participants
export function parseCsvToTimeline(
  csvText: string,
  existingParticipants: Participant[],
  defaultStartTimestamp = "9:41 AM",
  intervalMinutes = 2,
): {
  timeline: TimelineItem[];
  newParticipants: Participant[];
  errors: string[];
} {
  const rows = parseCsvRows(csvText);
  const errors: string[] = [];

  if (rows.length === 0) {
    return {
      timeline: [],
      newParticipants: [],
      errors: ["CSV content is empty."],
    };
  }

  // Detect header row
  const firstRow = rows[0].map((c) => c.trim().toLowerCase());
  const hasHeader =
    firstRow.includes("sender") ||
    firstRow.includes("type") ||
    firstRow.includes("message") ||
    firstRow.includes("text");

  const dataRows = hasHeader ? rows.slice(1) : rows;

  // Header column index mapping
  let typeIdx = 0;
  let senderIdx = 1;
  let textIdx = 2;
  let timeIdx = 3;
  let rxIdx = 4;
  let dateDividerIdx = 5;

  if (hasHeader) {
    typeIdx = firstRow.findIndex((h) => h === "type");
    senderIdx = firstRow.findIndex(
      (h) => h === "sender" || h === "sender_or_actor" || h === "character",
    );
    textIdx = firstRow.findIndex(
      (h) => h === "text" || h === "message" || h === "message_or_event_text",
    );
    timeIdx = firstRow.findIndex((h) => h === "timestamp" || h === "time");
    rxIdx = firstRow.findIndex((h) => h === "reactions" || h === "reaction");
    dateDividerIdx = firstRow.findIndex(
      (h) => h === "date_divider" || h === "date",
    );

    // Fallbacks if not explicitly matching
    if (typeIdx === -1) typeIdx = 0;
    if (senderIdx === -1) senderIdx = 1;
    if (textIdx === -1) textIdx = 2;
    if (timeIdx === -1) timeIdx = 3;
    if (rxIdx === -1) rxIdx = 4;
    if (dateDividerIdx === -1) dateDividerIdx = 5;
  }

  const participantsList = [...existingParticipants];
  const newParticipants: Participant[] = [];

  // Match helper: matches name or nickname (e.g. "Gabo" matches "Gabo 'Gabo' Bautista")
  const findOrCreateParticipant = (nameRaw: string): Participant => {
    const raw = nameRaw.trim();
    if (!raw) return participantsList[0];

    const cleanRaw = raw.toLowerCase().replace(/["']/g, "");

    const found = participantsList.find((p) => {
      const pClean = p.name.toLowerCase().replace(/["']/g, "");
      return (
        pClean === cleanRaw ||
        pClean.includes(cleanRaw) ||
        cleanRaw.includes(pClean)
      );
    });

    if (found) return found;

    // Create a new participant
    const colors = [
      "#EC4899",
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#8B5CF6",
      "#06B6D4",
      "#F97316",
    ];
    const color = colors[participantsList.length % colors.length];

    const newP: Participant = {
      id: `char-csv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: raw,
      role: "Participant",
      isCustom: true,
      avatarColor: color,
      nameColor: color,
    };

    participantsList.push(newP);
    newParticipants.push(newP);
    return newP;
  };

  let currentTime = defaultStartTimestamp;
  const timeline: TimelineItem[] = [];

  dataRows.forEach((row, rowIdx) => {
    const rawType = (row[typeIdx] || "").trim().toLowerCase();
    const rawSender = (row[senderIdx] || "").trim();
    const rawText = (row[textIdx] || "").trim();
    const rawTime = (row[timeIdx] || "").trim();
    const rawReactions = (row[rxIdx] || "").trim();
    const rawDateDivider = (row[dateDividerIdx] || "").trim();

    // If completely empty row, skip
    if (!rawType && !rawSender && !rawText) return;

    // Determine type: message or system
    const isSystem =
      rawType === "system" ||
      rawType === "event" ||
      (!rawSender && rawText) ||
      rawText.toLowerCase().includes("added") ||
      rawText.toLowerCase().includes("left the group") ||
      rawText.toLowerCase().includes("changed the group");

    if (isSystem) {
      const actor = rawSender ? findOrCreateParticipant(rawSender) : undefined;
      let eventType: SystemEventItem["eventType"] = "custom";
      const textLower = rawText.toLowerCase();

      if (textLower.includes("added") || textLower.includes("joined")) {
        eventType = "participant_added";
      } else if (textLower.includes("left")) {
        eventType = "participant_left";
      } else if (textLower.includes("name")) {
        eventType = "name_changed";
      } else if (textLower.includes("photo")) {
        eventType = "photo_changed";
      }

      timeline.push({
        id: `evt-csv-${Date.now()}-${rowIdx}-${Math.random().toString(36).slice(2, 5)}`,
        type: "system",
        eventType,
        actorId: actor?.id,
        text: rawText || "Group event occurred.",
        timestamp: rawTime || undefined,
        dateDivider: rawDateDivider || undefined,
      });
    } else {
      const sender = findOrCreateParticipant(rawSender || "Maria");
      const timeToUse = rawTime || currentTime;

      // Advance time for next auto timestamp
      currentTime = addMinutesToTimeString(timeToUse, intervalMinutes);

      const reactions = parseReactionsString(rawReactions);

      timeline.push({
        id: `msg-csv-${Date.now()}-${rowIdx}-${Math.random().toString(36).slice(2, 5)}`,
        type: "message",
        senderId: sender.id,
        text: rawText,
        timestamp: timeToUse,
        showTimestamp: true,
        dateDivider: rawDateDivider || undefined,
        reactions,
      });
    }
  });

  return { timeline, newParticipants, errors };
}
