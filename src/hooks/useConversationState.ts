'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ConversationSettings,
  ExportSettings,
  Participant,
  TimelineItem,
  MessageItem,
  SystemEventItem,
  ReactionItem,
} from '@/types/conversation';
import { PRESET_CHARACTERS } from '@/data/defaultCharacters';
import { INITIAL_SETTINGS, SAMPLE_TIMELINE } from '@/data/sampleConversations';
import { addMinutesToTimeString, formatMinutesToTime } from '@/utils/timeUtils';

const STORAGE_KEY = 'miamory_conversation_draft_v2';

interface HistoryState {
  timeline: TimelineItem[];
  settings: ConversationSettings;
  participants: Participant[];
}

export function useConversationState() {
  const [participants, setParticipants] = useState<Participant[]>(PRESET_CHARACTERS);
  const [settings, setSettings] = useState<ConversationSettings>(INITIAL_SETTINGS);
  const [timeline, setTimeline] = useState<TimelineItem[]>(SAMPLE_TIMELINE);
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    pixelRatio: 2,
    includeHeader: true,
    includeReactions: true,
    includeSystemEvents: true,
    includeTimestamps: true,
    selectedOnly: false,
    selectedItemIds: [],
    backgroundColor: '#242832', // Fixed background
  });

  // Undo / Redo stacks
  const [past, setPast] = useState<HistoryState[]>([]);
  const [future, setFuture] = useState<HistoryState[]>([]);
  const isUndoRedoAction = useRef(false);

  // Initial load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.participants && Array.isArray(parsed.participants)) {
          // Merge preset avatarUrl defaults if participant avatarUrl is empty
          const mergedParticipants = parsed.participants.map((p: Participant) => {
            const preset = PRESET_CHARACTERS.find((pre) => pre.id === p.id);
            if (preset && !p.avatarUrl) {
              return { ...p, avatarUrl: preset.avatarUrl, defaultAvatarUrl: preset.defaultAvatarUrl };
            }
            return p;
          });
          setParticipants(mergedParticipants);
        }
        if (parsed.settings) {
          setSettings((prev) => ({ ...prev, ...parsed.settings }));
        }
        if (parsed.timeline && Array.isArray(parsed.timeline)) {
          setTimeline(parsed.timeline);
        }
      }
    } catch (e) {
      console.warn('Failed to load draft from localStorage', e);
    }
  }, []);

  // Autosave to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          participants,
          settings,
          timeline,
        })
      );
    } catch (e) {
      console.warn('Failed to save draft to localStorage', e);
    }
  }, [participants, settings, timeline]);

  // Record history snapshot helper
  const recordHistory = useCallback(() => {
    if (isUndoRedoAction.current) return;
    setPast((prev) => [
      ...prev.slice(-30), // keep up to 30 steps
      {
        timeline: JSON.parse(JSON.stringify(timeline)),
        settings: JSON.parse(JSON.stringify(settings)),
        participants: JSON.parse(JSON.stringify(participants)),
      },
    ]);
    setFuture([]);
  }, [timeline, settings, participants]);

  // Undo
  const undo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);

    isUndoRedoAction.current = true;
    setFuture((prev) => [
      {
        timeline: JSON.parse(JSON.stringify(timeline)),
        settings: JSON.parse(JSON.stringify(settings)),
        participants: JSON.parse(JSON.stringify(participants)),
      },
      ...prev,
    ]);
    setTimeline(previous.timeline);
    setSettings(previous.settings);
    setParticipants(previous.participants);
    setPast(newPast);

    setTimeout(() => {
      isUndoRedoAction.current = false;
    }, 50);
  }, [past, timeline, settings, participants]);

  // Redo
  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);

    isUndoRedoAction.current = true;
    setPast((prev) => [
      ...prev,
      {
        timeline: JSON.parse(JSON.stringify(timeline)),
        settings: JSON.parse(JSON.stringify(settings)),
        participants: JSON.parse(JSON.stringify(participants)),
      },
    ]);
    setTimeline(next.timeline);
    setSettings(next.settings);
    setParticipants(next.participants);
    setFuture(newFuture);

    setTimeout(() => {
      isUndoRedoAction.current = false;
    }, 50);
  }, [future, timeline, settings, participants]);

  // Keyboard shortcut for Undo / Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Add Message
  const addMessage = useCallback(
    (afterIndex?: number, senderIdOverride?: string) => {
      recordHistory();
      setTimeline((prev) => {
        const lastMsg = [...prev].reverse().find((it) => it.type === 'message') as
          | MessageItem
          | undefined;

        // Sensible next sender: alternate or default to POV
        const sender =
          senderIdOverride ||
          (lastMsg
            ? lastMsg.senderId === settings.povParticipantId
              ? participants.find((p) => p.id !== settings.povParticipantId)?.id ||
                settings.povParticipantId
              : settings.povParticipantId
            : settings.povParticipantId);

        // Next timestamp
        const lastTime = lastMsg ? lastMsg.timestamp : settings.startTimestamp;
        const nextTime = addMinutesToTimeString(
          lastTime,
          settings.autoTimestampIntervalMinutes || 2
        );

        const newMessage: MessageItem = {
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          type: 'message',
          senderId: sender,
          text: '',
          timestamp: nextTime,
          showTimestamp: true,
          reactions: [],
        };

        if (afterIndex !== undefined && afterIndex >= 0 && afterIndex < prev.length) {
          const updated = [...prev];
          updated.splice(afterIndex + 1, 0, newMessage);
          return updated;
        }

        return [...prev, newMessage];
      });
    },
    [recordHistory, settings, participants]
  );

  // Add System Event
  const addSystemEvent = useCallback(
    (afterIndex?: number, customText?: string) => {
      recordHistory();
      setTimeline((prev) => {
        const newEvent: SystemEventItem = {
          id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          type: 'system',
          eventType: 'custom',
          text: customText || 'Elena Reyes changed the group name.',
        };

        if (afterIndex !== undefined && afterIndex >= 0 && afterIndex < prev.length) {
          const updated = [...prev];
          updated.splice(afterIndex + 1, 0, newEvent);
          return updated;
        }

        return [...prev, newEvent];
      });
    },
    [recordHistory]
  );

  // Update Item
  const updateItem = useCallback(
    (id: string, updates: Partial<MessageItem> | Partial<SystemEventItem>) => {
      recordHistory();
      setTimeline((prev) =>
        prev.map((item) => (item.id === id ? ({ ...item, ...updates } as TimelineItem) : item))
      );
    },
    [recordHistory]
  );

  // Duplicate Item
  const duplicateItem = useCallback(
    (id: string) => {
      recordHistory();
      setTimeline((prev) => {
        const index = prev.findIndex((item) => item.id === id);
        if (index === -1) return prev;
        const item = prev[index];
        const copy: TimelineItem = {
          ...JSON.parse(JSON.stringify(item)),
          id: `${item.type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        };
        const updated = [...prev];
        updated.splice(index + 1, 0, copy);
        return updated;
      });
    },
    [recordHistory]
  );

  // Delete Item
  const deleteItem = useCallback(
    (id: string) => {
      recordHistory();
      setTimeline((prev) => prev.filter((item) => item.id !== id));
      setExportSettings((prev) => ({
        ...prev,
        selectedItemIds: prev.selectedItemIds.filter((itemId) => itemId !== id),
      }));
    },
    [recordHistory]
  );

  // Move Item Up / Down
  const moveItem = useCallback(
    (id: string, direction: 'up' | 'down') => {
      recordHistory();
      setTimeline((prev) => {
        const index = prev.findIndex((item) => item.id === id);
        if (index === -1) return prev;
        if (direction === 'up' && index === 0) return prev;
        if (direction === 'down' && index === prev.length - 1) return prev;

        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        const updated = [...prev];
        const [moved] = updated.splice(index, 1);
        updated.splice(targetIndex, 0, moved);
        return updated;
      });
    },
    [recordHistory]
  );

  // Reorder Item via drag and drop
  const reorderItems = useCallback(
    (startIndex: number, endIndex: number) => {
      if (startIndex === endIndex) return;
      recordHistory();
      setTimeline((prev) => {
        const updated = [...prev];
        const [removed] = updated.splice(startIndex, 1);
        updated.splice(endIndex, 0, removed);
        return updated;
      });
    },
    [recordHistory]
  );

  // Recalculate auto timestamps across all messages
  const autoGenerateTimestamps = useCallback(
    (start = settings.startTimestamp, interval = settings.autoTimestampIntervalMinutes) => {
      recordHistory();
      setTimeline((prev) => {
        let currentTime = start;
        return prev.map((item, idx) => {
          if (item.type !== 'message') return item;
          const msg = item as MessageItem;
          const updatedTime = currentTime;
          currentTime = addMinutesToTimeString(currentTime, interval);
          return {
            ...msg,
            timestamp: updatedTime,
          };
        });
      });
    },
    [recordHistory, settings.startTimestamp, settings.autoTimestampIntervalMinutes]
  );

  // Add / Toggle Reaction on a message
  const toggleReaction = useCallback(
    (messageId: string, emoji: string) => {
      recordHistory();
      setTimeline((prev) =>
        prev.map((item) => {
          if (item.id !== messageId || item.type !== 'message') return item;
          const msg = item as MessageItem;
          const existingIndex = msg.reactions.findIndex((r) => r.emoji === emoji);

          let updatedReactions: ReactionItem[];
          if (existingIndex > -1) {
            // increment count or remove if 1
            const current = msg.reactions[existingIndex];
            updatedReactions = [...msg.reactions];
            updatedReactions[existingIndex] = {
              ...current,
              count: current.count + 1,
            };
          } else {
            updatedReactions = [
              ...msg.reactions,
              {
                id: `rx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                emoji,
                count: 1,
              },
            ];
          }

          return { ...msg, reactions: updatedReactions };
        })
      );
    },
    [recordHistory]
  );

  // Remove reaction
  const removeReaction = useCallback(
    (messageId: string, reactionId: string) => {
      recordHistory();
      setTimeline((prev) =>
        prev.map((item) => {
          if (item.id !== messageId || item.type !== 'message') return item;
          const msg = item as MessageItem;
          return {
            ...msg,
            reactions: msg.reactions.filter((r) => r.id !== reactionId),
          };
        })
      );
    },
    [recordHistory]
  );

  // Update reaction count
  const updateReactionCount = useCallback(
    (messageId: string, reactionId: string, count: number) => {
      recordHistory();
      setTimeline((prev) =>
        prev.map((item) => {
          if (item.id !== messageId || item.type !== 'message') return item;
          const msg = item as MessageItem;
          if (count <= 0) {
            return {
              ...msg,
              reactions: msg.reactions.filter((r) => r.id !== reactionId),
            };
          }
          return {
            ...msg,
            reactions: msg.reactions.map((r) => (r.id === reactionId ? { ...r, count } : r)),
          };
        })
      );
    },
    [recordHistory]
  );

  // Participant management
  const addParticipant = useCallback(
    (name: string, role: string, avatarUrl?: string) => {
      recordHistory();
      const colors = ['#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4', '#F97316'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const newP: Participant = {
        id: `char-${Date.now()}`,
        name: name.trim() || 'New Character',
        role: role.trim() || 'Guest',
        isCustom: true,
        avatarColor: randomColor,
        nameColor: randomColor,
        avatarUrl,
      };
      setParticipants((prev) => [...prev, newP]);
      return newP;
    },
    [recordHistory]
  );

  const updateParticipant = useCallback(
    (id: string, updates: Partial<Participant>) => {
      recordHistory();
      setParticipants((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
    },
    [recordHistory]
  );

  const deleteParticipant = useCallback(
    (id: string) => {
      recordHistory();
      setParticipants((prev) => prev.filter((p) => p.id !== id));
      // if POV owner was deleted, fallback to first
      if (settings.povParticipantId === id) {
        const remaining = participants.filter((p) => p.id !== id);
        if (remaining.length > 0) {
          setSettings((prev) => ({ ...prev, povParticipantId: remaining[0].id }));
        }
      }
    },
    [recordHistory, settings.povParticipantId, participants]
  );

  // Reset to sample
  const resetToSample = useCallback(() => {
    recordHistory();
    setParticipants(PRESET_CHARACTERS);
    setSettings(INITIAL_SETTINGS);
    setTimeline(SAMPLE_TIMELINE);
  }, [recordHistory]);

  // Clear all messages
  const clearConversation = useCallback(() => {
    recordHistory();
    setTimeline([]);
  }, [recordHistory]);

  // Import timeline from CSV (replace or append)
  const importCsvTimeline = useCallback(
    (newTimeline: TimelineItem[], newParticipants: Participant[], mode: 'replace' | 'append') => {
      recordHistory();
      if (newParticipants.length > 0) {
        setParticipants((prev) => {
          const existingIds = new Set(prev.map((p) => p.id));
          const toAdd = newParticipants.filter((np) => !existingIds.has(np.id));
          return [...prev, ...toAdd];
        });
      }

      setTimeline((prev) => {
        if (mode === 'replace') {
          return newTimeline;
        }
        return [...prev, ...newTimeline];
      });
    },
    [recordHistory]
  );

  return {
    participants,
    settings,
    timeline,
    exportSettings,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
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
  };
}
