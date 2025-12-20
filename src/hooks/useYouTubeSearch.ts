import { useState, useCallback } from 'react';

import type { YouTubeSong } from '@/types';
import { createUserFriendlyError } from '@/utils/errorHandling';

// Simple in-memory cache for search results
interface CacheEntry {
  songs: YouTubeSong[];
  timestamp: number;
}

interface YouTubeSearchResponse {
  songs: YouTubeSong[];
  total?: number;
  error?: string;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 50;
const searchCache = new Map<string, CacheEntry>();

/**
 * Clean up cache by removing expired entries first, then oldest entries if size exceeded
 */
const cleanupCache = () => {
  const now = Date.now();

  // Remove expired entries
  for (const [key, entry] of searchCache.entries()) {
    if (now - entry.timestamp > CACHE_DURATION) {
      searchCache.delete(key);
    }
  }

  // If still over limit, remove oldest entries
  if (searchCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(searchCache.entries())
      .sort((a, b) => a[1].timestamp - b[1].timestamp);

    const entriesToRemove = entries.slice(0, searchCache.size - MAX_CACHE_SIZE);
    entriesToRemove.forEach(([key]) => searchCache.delete(key));
  }
};

export const useYouTubeSearch = () => {
  const [songs, setSongs] = useState<YouTubeSong[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const searchSongs = useCallback(async (query: string) => {
    if (!query) return;

    const cacheKey = query.toLowerCase().trim();

    // Check cache first
    const cachedEntry = searchCache.get(cacheKey);
    const now = Date.now();

    if (cachedEntry && (now - cachedEntry.timestamp) < CACHE_DURATION) {
      setSongs(cachedEntry.songs);
      setError('');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Call our server-side API instead of YouTube directly
      const url = `/api/youtube/search?q=${encodeURIComponent(query)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: YouTubeSearchResponse = await response.json();

      // Check for API errors
      if (data.error && (!data.songs || data.songs.length === 0)) {
        throw new Error(data.error);
      }

      if (data.songs && data.songs.length > 0) {
        setSongs(data.songs);

        // Cache the results
        searchCache.set(cacheKey, {
          songs: data.songs,
          timestamp: now
        });

        // Clean up cache to prevent memory leaks
        cleanupCache();
      } else {
        setSongs([]);
        setError(data.error || 'No karaoke songs found. Try a different search term!');
      }
    } catch (err) {
      console.error('Search error:', err);
      const errorMessage = createUserFriendlyError(err);
      setSongs([]);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { songs, isLoading, error, searchSongs };
};
