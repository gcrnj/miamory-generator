import { Participant } from '@/types/conversation';

export const PRESET_CHARACTERS: (Participant & { defaultAvatarUrl?: string })[] = [
  {
    id: 'char-maria',
    name: 'Maria Isabella Santos',
    role: 'Bride',
    avatarColor: '#EC4899', // Pink
    nameColor: '#F472B6',
    avatarUrl: '/characters/maria.jpg',
    defaultAvatarUrl: '/characters/maria.jpg',
  },
  {
    id: 'char-gabo',
    name: 'Gabriel "Gabo" Bautista',
    role: 'Groom',
    avatarColor: '#3B82F6', // Blue
    nameColor: '#60A5FA',
    avatarUrl: '/characters/gabo.jpg',
    defaultAvatarUrl: '/characters/gabo.jpg',
  },
  {
    id: 'char-elena',
    name: 'Elena Reyes',
    role: "Bride's Mother",
    avatarColor: '#F59E0B', // Amber
    nameColor: '#FBBF24',
    avatarUrl: '/characters/elena.jpg',
    defaultAvatarUrl: '/characters/elena.jpg',
  },
  {
    id: 'char-beto',
    name: 'Roberto "Beto" Bautista',
    role: "Bride's Father",
    avatarColor: '#10B981', // Emerald
    nameColor: '#34D399',
    avatarUrl: '/characters/beto.jpg',
    defaultAvatarUrl: '/characters/beto.jpg',
  },
  {
    id: 'char-cora',
    name: 'Corazon "Cora" Mendoza',
    role: "Groom's Mother",
    avatarColor: '#8B5CF6', // Purple
    nameColor: '#A78BFA',
    avatarUrl: '/characters/cora.jpg',
    defaultAvatarUrl: '/characters/cora.jpg',
  },
  {
    id: 'char-art',
    name: 'Arturo "Art" Mendoza',
    role: "Groom's Father",
    avatarColor: '#F97316', // Orange
    nameColor: '#FB923C',
    avatarUrl: '/characters/art.jpg',
    defaultAvatarUrl: '/characters/art.jpg',
  },
  {
    id: 'char-letty',
    name: 'Tita Letty',
    role: "Bride's Aunt",
    avatarColor: '#D946EF', // Fuchsia
    nameColor: '#E879F9',
    avatarUrl: '/characters/tita-letty.jpg',
    defaultAvatarUrl: '/characters/tita-letty.jpg',
  },
  {
    id: 'char-vicky',
    name: 'Tita Vicky',
    role: "Groom's Aunt",
    avatarColor: '#06B6D4', // Cyan
    nameColor: '#22D3EE',
    avatarUrl: '/characters/tita-vicky.jpg',
    defaultAvatarUrl: '/characters/tita-vicky.jpg',
  },
];
