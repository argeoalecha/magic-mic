import { useState, useCallback } from 'react';

import type { YouTubeSong } from '@/types';
import type { YouTubeAPIResponse, YouTubeAPIItem, YouTubeVideosResponse } from '@/types/youtube';
import { YOUTUBE_CONFIG } from '@/constants';
import { createUserFriendlyError } from '@/utils/errorHandling';

// Simple in-memory cache for search results
interface CacheEntry {
  songs: YouTubeSong[];
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 50; // Limit cache to 50 entries to prevent memory leaks
const searchCache = new Map<string, CacheEntry>();

// Helper function to clean up old cache entries
const cleanupCache = () => {
  if (searchCache.size <= MAX_CACHE_SIZE) return;

  // Remove oldest entries until we're under the limit
  const entries = Array.from(searchCache.entries())
    .sort((a, b) => a[1].timestamp - b[1].timestamp);

  const entriesToRemove = entries.slice(0, searchCache.size - MAX_CACHE_SIZE);
  entriesToRemove.forEach(([key]) => searchCache.delete(key));
};

// Helper function to check if videos are embeddable
const checkVideoEmbeddability = async (videoIds: string[]): Promise<Set<string>> => {
  if (videoIds.length === 0) return new Set();

  try {
    const idsParam = videoIds.join(',');
    const url = `${YOUTUBE_CONFIG.BASE_URL}/videos?part=status&id=${idsParam}&key=${YOUTUBE_CONFIG.API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      console.warn('Failed to check video embeddability, returning empty set');
      return new Set(); // Return empty set on failure
    }

    const data: YouTubeVideosResponse = await response.json();
    const embeddableIds = new Set<string>();

    if (data.items) {
      data.items.forEach((item) => {
        if (item.status.embeddable) {
          embeddableIds.add(item.id);
        }
      });
    }

    return embeddableIds;
  } catch (error) {
    console.warn('Error checking video embeddability:', error);
    return new Set(); // Return empty set on failure
  }
};

export const useYouTubeSearch = () => {
  const [songs, setSongs] = useState<YouTubeSong[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const searchSongs = useCallback(async (query: string) => {
    if (!query) return;

    const searchQuery = `${query} karaoke`;
    const cacheKey = searchQuery.toLowerCase().trim();
    
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
      const url = `${YOUTUBE_CONFIG.BASE_URL}/search?part=snippet&type=video&videoEmbeddable=true&q=${encodeURIComponent(
        searchQuery,
      )}&maxResults=${YOUTUBE_CONFIG.MAX_SEARCH_RESULTS}&key=${YOUTUBE_CONFIG.API_KEY}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: YouTubeAPIResponse = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      if (data.items && data.items.length > 0) {
        // First, map all results
        const allResults: YouTubeSong[] = data.items.map((item: YouTubeAPIItem) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url || '',
        }));

        // Double-check embeddability using videos API
        const videoIds = allResults.map((song) => song.id);
        const embeddableIds = await checkVideoEmbeddability(videoIds);

        // Filter to only embeddable videos and limit to display results
        const embeddableResults = allResults
          .filter((song) => embeddableIds.has(song.id))
          .slice(0, YOUTUBE_CONFIG.MAX_DISPLAY_RESULTS);

        if (embeddableResults.length > 0) {
          setSongs(embeddableResults);
          // Cache the results
          searchCache.set(cacheKey, {
            songs: embeddableResults,
            timestamp: now
          });
          // Clean up old cache entries to prevent memory leaks
          cleanupCache();
        } else {
          setSongs([]);
          setError('No embeddable karaoke songs found. Try a different search term!');
        }
      } else {
        setSongs([]);
        setError('No karaoke songs found. Try a different search term!');
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
