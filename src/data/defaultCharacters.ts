import { Participant } from "@/types/conversation";

export const PRESET_CHARACTERS: (Participant & {
  defaultAvatarUrl?: string;
})[] = [
  {
    id: "char-maria",
    name: "Maria",
    role: "Bride",
    avatarColor: "#EC4899", // Pink
    nameColor: "#F472B6",
    avatarUrl: "/characters/maria.png",
    defaultAvatarUrl: "/characters/maria.png",
  },
  {
    id: "char-gabo",
    name: "Gabo",
    role: "Groom",
    avatarColor: "#3B82F6", // Blue
    nameColor: "#60A5FA",
    avatarUrl: "/characters/gabo.png",
    defaultAvatarUrl: "/characters/gabo.png",
  },
  {
    id: "char-elena",
    name: "Elena Reyes",
    role: "Bride's Mother",
    avatarColor: "#F59E0B", // Amber
    nameColor: "#FBBF24",
    avatarUrl: "/characters/elena.png",
    defaultAvatarUrl: "/characters/elena.png",
  },
  {
    id: "char-beto",
    name: 'Roberto "Beto" Bautista',
    role: "Bride's Father",
    avatarColor: "#10B981", // Emerald
    nameColor: "#34D399",
    avatarUrl: "/characters/beto.png",
    defaultAvatarUrl: "/characters/beto.png",
  },
  {
    id: "char-cora",
    name: 'Corazon "Cora" Mendoza',
    role: "Groom's Mother",
    avatarColor: "#8B5CF6", // Purple
    nameColor: "#A78BFA",
    avatarUrl: "/characters/cora.png",
    defaultAvatarUrl: "/characters/cora.png",
  },
  {
    id: "char-art",
    name: 'Arturo "Art" Mendoza',
    role: "Groom's Father",
    avatarColor: "#F97316", // Orange
    nameColor: "#FB923C",
    avatarUrl: "/characters/art.png",
    defaultAvatarUrl: "/characters/art.png",
  },
  {
    id: "char-letty",
    name: "Tita Letty",
    role: "Bride's Aunt",
    avatarColor: "#D946EF", // Fuchsia
    nameColor: "#E879F9",
    avatarUrl: "/characters/tita-letty.png",
    defaultAvatarUrl: "/characters/tita-letty.png",
  },
  {
    id: "char-vicky",
    name: "Tita Vicky",
    role: "Groom's Aunt",
    avatarColor: "#06B6D4", // Cyan
    nameColor: "#22D3EE",
    avatarUrl: "/characters/tita-vicky.png",
    defaultAvatarUrl: "/characters/tita-vicky.png",
  },
];
