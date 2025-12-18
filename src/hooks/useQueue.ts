import { useState, useCallback, useEffect } from 'react';

import type { QueueItem, YouTubeSong } from '@/types';
import { QUEUE_CONFIG } from '@/constants';

const STORAGE_KEY = 'personal-videoke-queue';

export const useQueue = () => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(-1);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load queue from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const { queue: savedQueue, currentSongIndex: savedIndex } = JSON.parse(saved);
        setQueue(savedQueue);
        setCurrentSongIndex(savedIndex);
      } catch (e) {
        console.error('Failed to load queue from localStorage:', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save queue to localStorage whenever it changes
  useEffect(() => {
    if (!isInitialized) return;

    if (queue.length > 0 || currentSongIndex >= 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        queue,
        currentSongIndex
      }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [queue, currentSongIndex, isInitialized]);

  const addToQueue = useCallback((song: YouTubeSong, addedBy = QUEUE_CONFIG.DEFAULT_USER_NAME) => {
    setQueue((prev) => {
      const queueItem: QueueItem = {
        ...song,
        queueId: `${song.id}-${Date.now()}-${Math.random()}`,
        queuePosition: prev.length,
        addedBy,
        addedAt: new Date(),
      };

      return [...prev, queueItem];
    });
  }, []);

  const removeFromQueue = useCallback((queueId: string) => {
    setQueue((prev) => {
      const filtered = prev.filter((item) => item.queueId !== queueId);
      // Update queue positions
      return filtered.map((item, index) => ({
        ...item,
        queuePosition: index,
      }));
    });
  }, []);

  const reorderQueue = useCallback((fromIndex: number, toIndex: number) => {
    setQueue((prev) => {
      const result = [...prev];
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);

      // Update queue positions
      return result.map((item, index) => ({
        ...item,
        queuePosition: index,
      }));
    });
  }, []);

  const playNext = useCallback(() => {
    if (queue.length === 0) return;

    const nextIndex = currentSongIndex + 1;
    if (nextIndex >= queue.length) {
      setCurrentSongIndex(-1);
      setQueue([]);
    } else {
      setCurrentSongIndex(nextIndex);
    }
  }, [queue, currentSongIndex]);

  const playPrevious = useCallback(() => {
    if (queue.length === 0 || currentSongIndex <= 0) return;

    const prevIndex = currentSongIndex - 1;
    setCurrentSongIndex(prevIndex);
  }, [queue, currentSongIndex]);

  const playSong = useCallback(
    (queueId: string) => {
      const index = queue.findIndex((item) => item.queueId === queueId);
      if (index !== -1) {
        setCurrentSongIndex(index);
      }
    },
    [queue],
  );

  const clearQueue = useCallback(() => {
    setQueue([]);
    setCurrentSongIndex(-1);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const currentSong = currentSongIndex >= 0 ? queue[currentSongIndex] : null;
  const nextSongs = queue.slice(currentSongIndex + 1, currentSongIndex + 1 + QUEUE_CONFIG.MAX_NEXT_SONGS_PREVIEW);

  return {
    queue,
    currentSong,
    currentSongIndex,
    nextSongs,
    addToQueue,
    removeFromQueue,
    reorderQueue,
    playNext,
    playPrevious,
    playSong,
    clearQueue,
  };
};
