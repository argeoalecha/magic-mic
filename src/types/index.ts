export interface YouTubeSong {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  duration?: string;
}

export interface QueueItem extends YouTubeSong {
  queueId: string;
  queuePosition: number;
  addedBy: string;
  addedAt: Date;
}

export interface SearchState {
  isLoading: boolean;
  error: string;
  hasSearched: boolean;
}

export interface PlayerState {
  isReady: boolean;
  error: string | null;
}

// Favorites types
export interface FavoriteSong extends YouTubeSong {
  artist: string;
  group: string;
  sourceUrl: string;
  isFavorite: true;
}

export interface FavoriteFileRow {
  title: string;
  artist: string;
  url: string;
  group: string;
}

export interface FavoritesUploadState {
  isUploading: boolean;
  error: string;
  fileName: string;
  totalSongs: number;
}

export interface FavoriteGroup {
  name: string;
  songs: FavoriteSong[];
  count: number;
}
