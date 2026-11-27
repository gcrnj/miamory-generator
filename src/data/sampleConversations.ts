import { ConversationSettings, TimelineItem } from "@/types/conversation";
import { PRESET_CHARACTERS } from "./defaultCharacters";

export const INITIAL_SETTINGS: ConversationSettings = {
  groupName: "Santos-Bautista Wedding Entourage 💍",
  groupDescription: "Official group chat for wedding planning & updates",
  groupAvatarInitials: "SB",
  groupAvatarColor: "#E11D48",
  povParticipantId: "char-maria", // Maria POV
  includePovAvatar: false,
  chatThemeColor: "#0A7CFF", // Standard vibrant iOS/Messenger blue
  previewWidth: 420,
  autoTimestampIntervalMinutes: 2,
  startTimestamp: "9:41 AM",
  startDate: "Today",
};

export const SAMPLE_TIMELINE: TimelineItem[] = [
  {
    id: "evt-1",
    type: "system",
    eventType: "participant_added",
    actorId: "char-maria",
    targetId: "char-letty",
    text: "Maria added Tita Letty to the group.",
    dateDivider: "Today",
  },
  {
    id: "msg-1",
    type: "message",
    senderId: "char-maria",
    text: "Good morning everyone! Sending the final reception seating arrangement today. Please strictly no more last-minute additions po 🙏",
    timestamp: "9:41 AM",
    showTimestamp: true,
    reactions: [
      {
        id: "rx-1",
        emoji: "❤️",
        count: 3,
        reactedBy: ["Gabo", "Elena", "Cora"],
      },
      { id: "rx-2", emoji: "🙏", count: 2, reactedBy: ["Beto", "Art"] },
    ],
  },
  {
    id: "msg-2",
    type: "message",
    senderId: "char-gabo",
    text: "Yes please po, 150 pax na yung venue max limit! Super siksik na if we add more.",
    timestamp: "9:42 AM",
    showTimestamp: true,
    reactions: [{ id: "rx-3", emoji: "👍", count: 1, reactedBy: ["Maria"] }],
  },
  {
    id: "msg-3",
    type: "message",
    senderId: "char-letty",
    text: "Hija @Maria! Pwede bang isingit si Tito Boyet and his 4 kids galing Canada? Kararating lang nila kagabi, nakakahiya naman kung hindi invite!",
    timestamp: "9:44 AM",
    showTimestamp: true,
    reactions: [
      { id: "rx-4", emoji: "😭", count: 2, reactedBy: ["Maria", "Gabo"] },
      { id: "rx-5", emoji: "😂", count: 1, reactedBy: ["Art"] },
    ],
  },
  {
    id: "msg-4",
    type: "message",
    senderId: "char-elena",
    text: "Letty naman... Sabi ko na nga ba e 😂 Saan natin uupuin sila Boyet? Sa stage?",
    timestamp: "9:45 AM",
    showTimestamp: true,
    reactions: [
      {
        id: "rx-6",
        emoji: "😂",
        count: 4,
        reactedBy: ["Maria", "Gabo", "Cora", "Beto"],
      },
    ],
  },
  {
    id: "msg-5",
    type: "message",
    senderId: "char-vicky",
    text: "Kung kasama si Boyet, dapat kasama rin si Mareng Susan! Ninang siya ni Gabo sa binyag!",
    timestamp: "9:47 AM",
    showTimestamp: true,
    reactions: [
      { id: "rx-7", emoji: "🤦‍♂️", count: 2, reactedBy: ["Gabo", "Maria"] },
    ],
  },
  {
    id: "evt-2",
    type: "system",
    eventType: "participant_left",
    actorId: "char-gabo",
    text: "Gabo left the group.",
  },
  {
    id: "msg-6",
    type: "message",
    senderId: "char-maria",
    text: "GABOOOO BUMALIK KA DITO 😭😭😭",
    timestamp: "9:48 AM",
    showTimestamp: true,
    reactions: [
      {
        id: "rx-8",
        emoji: "😂",
        count: 5,
        reactedBy: ["Elena", "Beto", "Cora", "Art", "Letty"],
      },
    ],
  },
  {
    id: "evt-3",
    type: "system",
    eventType: "participant_added",
    actorId: "char-maria",
    targetId: "char-gabo",
    text: "Maria added Gabo to the group.",
  },
  {
    id: "msg-7",
    type: "message",
    senderId: "char-cora",
    text: "Mga Tita, relax! Nag-order na ako ng 2 extra lechon para walang magtampo. Kasya tayong lahat!",
    timestamp: "9:50 AM",
    showTimestamp: true,
    reactions: [
      { id: "rx-9", emoji: "❤️", count: 6, reactedBy: ["Everyone"] },
      {
        id: "rx-10",
        emoji: "🎉",
        count: 4,
        reactedBy: ["Maria", "Gabo", "Elena", "Beto"],
      },
    ],
  },
  {
    id: "msg-8",
    type: "message",
    senderId: "char-maria",
    text: "Aww thank you Mom Cora! Best mother-in-law ever! 💕 Love you all!",
    timestamp: "9:51 AM",
    showTimestamp: true,
    reactions: [
      {
        id: "rx-11",
        emoji: "🥰",
        count: 3,
        reactedBy: ["Cora", "Gabo", "Elena"],
      },
    ],
  },
];
