export interface Participant {
  id: string;
  name: string;
  role: string;
  isCustom?: boolean;
  avatarColor?: string;
  avatarUrl?: string;
  defaultAvatarUrl?: string;
  nameColor?: string;
}

export interface ReactionItem {
  id: string;
  emoji: string;
  count: number;
  reactedBy?: string[]; // Participant IDs or names
}

export interface MessageItem {
  id: string;
  type: "message";
  senderId: string;
  text: string;
  timestamp: string; // e.g. "9:41 AM"
  showTimestamp?: boolean;
  dateDivider?: string; // Optional date divider before this message (e.g. "Today", "Saturday, Nov 28")
  reactions: ReactionItem[];
}

export type SystemEventType =
  | "participant_added"
  | "participant_left"
  | "name_changed"
  | "photo_changed"
  | "custom";

export interface SystemEventItem {
  id: string;
  type: "system";
  eventType: SystemEventType;
  actorId?: string;
  targetId?: string;
  text: string; // e.g. "Maria added Tita Letty."
  timestamp?: string;
  dateDivider?: string;
}

export type TimelineItem = MessageItem | SystemEventItem;

export interface ConversationSettings {
  groupName: string;
  groupDescription?: string;
  groupAvatarUrl?: string;
  groupAvatarInitials?: string;
  groupAvatarColor?: string;
  povParticipantId: string;
  includePovAvatar: boolean;
  chatThemeColor?: string; // Bubble color for POV owner, default #0084FF
  previewWidth: number; // e.g. 420
  autoTimestampIntervalMinutes: number; // default 2
  startTimestamp: string; // default "9:41 AM"
  startDate: string; // default "Today"
}

export interface ExportSettings {
  pixelRatio: 2 | 3;
  includeHeader: boolean;
  includeSenderNames: boolean;
  includeReactions: boolean;
  includeSystemEvents: boolean;
  includeTimestamps: boolean;
  selectedOnly: boolean;
  selectedItemIds: string[];
  backgroundColor: string; // Fixed #242832
}
