import { useState, useCallback, useEffect } from 'react';
import type { FavoriteSong, FavoritesUploadState, FavoriteGroup } from '@/types';
import {
  parseCsvFile,
  parseExcelFile,
  validateAndTransformFavorites,
  groupFavorites as groupFavoritesUtil,
} from '@/utils/favoritesParser';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteSong[]>([]);
  const [uploadState, setUploadState] = useState<FavoritesUploadState>({
    isUploading: false,
    error: '',
    fileName: '',
    totalSongs: 0,
  });

  /**
   * Load favorites from API on mount
   */
  useEffect(() => {
    const loadFavoritesFromAPI = async () => {
      setUploadState({
        isUploading: true,
        error: '',
        fileName: '',
        totalSongs: 0,
      });

      try {
        const response = await fetch('/api/favorites');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load favorites');
        }

        if (data.favorites && data.favorites.length > 0) {
          setFavorites(data.favorites);
          setUploadState({
            isUploading: false,
            error: data.errors ? `Loaded with warnings:\n${data.errors.join('\n')}` : '',
            fileName: `${data.filesProcessed} file(s) from song_hits folder`,
            totalSongs: data.favorites.length,
          });
        } else {
          setUploadState({
            isUploading: false,
            error: data.error || 'No favorites found in song_hits folder',
            fileName: '',
            totalSongs: 0,
          });
        }
      } catch (error) {
        setUploadState({
          isUploading: false,
          error: error instanceof Error ? error.message : 'Failed to load favorites',
          fileName: '',
          totalSongs: 0,
        });
      }
    };

    loadFavoritesFromAPI();
  }, []);

  /**
   * Upload and parse favorites file (CSV or Excel)
   */
  const uploadFavoritesFile = useCallback(async (file: File) => {
    setUploadState({
      isUploading: true,
      error: '',
      fileName: file.name,
      totalSongs: 0,
    });

    try {
      // Detect file type and parse accordingly
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      let rows;

      if (fileExtension === 'csv') {
        rows = await parseCsvFile(file);
      } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
        rows = await parseExcelFile(file);
      } else {
        throw new Error('Invalid file format. Please upload a CSV or Excel (.xlsx, .xls) file.');
      }

      // Validate and transform data
      const { valid, errors } = validateAndTransformFavorites(rows);

      if (errors.length > 0) {
        // Show first 5 errors
        const errorMessage =
          errors.length <= 5
            ? errors.join('\n')
            : `${errors.slice(0, 5).join('\n')}\n...and ${errors.length - 5} more errors`;

        setUploadState({
          isUploading: false,
          error: `Found ${errors.length} error(s):\n${errorMessage}`,
          fileName: file.name,
          totalSongs: valid.length,
        });
      }

      // Set favorites even if there are errors (valid songs will be loaded)
      setFavorites(valid);

      if (errors.length === 0) {
        setUploadState({
          isUploading: false,
          error: '',
          fileName: file.name,
          totalSongs: valid.length,
        });
      }
    } catch (error) {
      setUploadState({
        isUploading: false,
        error: error instanceof Error ? error.message : 'Failed to parse file',
        fileName: file.name,
        totalSongs: 0,
      });
      setFavorites([]);
    }
  }, []);

  /**
   * Search favorites by query (matches title or artist)
   */
  const searchFavorites = useCallback(
    (query: string): FavoriteSong[] => {
      if (!query.trim()) return [];

      const lowerQuery = query.toLowerCase();

      return favorites.filter((song) => {
        const titleMatch = song.title.toLowerCase().includes(lowerQuery);
        const artistMatch = song.artist.toLowerCase().includes(lowerQuery);
        return titleMatch || artistMatch;
      });
    },
    [favorites]
  );

  /**
   * Get all favorite groups with song counts
   */
  const getFavoriteGroups = useCallback((): FavoriteGroup[] => {
    const grouped = groupFavoritesUtil(favorites);
    const groups: FavoriteGroup[] = [];

    grouped.forEach((songs, name) => {
      groups.push({
        name,
        songs,
        count: songs.length,
      });
    });

    // Sort groups by name
    return groups.sort((a, b) => a.name.localeCompare(b.name));
  }, [favorites]);

  /**
   * Get songs by group name
   */
  const getSongsByGroup = useCallback(
    (groupName: string): FavoriteSong[] => {
      return favorites.filter((song) => song.group === groupName);
    },
    [favorites]
  );

  /**
   * Reload favorites from API
   */
  const reloadFavorites = useCallback(async () => {
    setUploadState({
      isUploading: true,
      error: '',
      fileName: '',
      totalSongs: 0,
    });

    try {
      const response = await fetch('/api/favorites');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load favorites');
      }

      if (data.favorites && data.favorites.length > 0) {
        setFavorites(data.favorites);
        setUploadState({
          isUploading: false,
          error: data.errors ? `Loaded with warnings:\n${data.errors.join('\n')}` : '',
          fileName: `${data.filesProcessed} file(s) from song_hits folder`,
          totalSongs: data.favorites.length,
        });
      } else {
        setUploadState({
          isUploading: false,
          error: data.error || 'No favorites found in song_hits folder',
          fileName: '',
          totalSongs: 0,
        });
      }
    } catch (error) {
      setUploadState({
        isUploading: false,
        error: error instanceof Error ? error.message : 'Failed to load favorites',
        fileName: '',
        totalSongs: 0,
      });
    }
  }, []);

  /**
   * Clear all favorites
   */
  const clearFavorites = useCallback(() => {
    setFavorites([]);
    setUploadState({
      isUploading: false,
      error: '',
      fileName: '',
      totalSongs: 0,
    });
  }, []);

  return {
    favorites,
    uploadState,
    uploadFavoritesFile,
    reloadFavorites,
    searchFavorites,
    getFavoriteGroups,
    getSongsByGroup,
    clearFavorites,
  };
};
