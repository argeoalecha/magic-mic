export const YOUTUBE_CONFIG = {
  // API_KEY removed - now handled server-side only for security
  // Use /api/youtube/search endpoint instead of direct YouTube API calls
  EMBED_BASE_URL: 'https://www.youtube.com/embed',
  TRUSTED_ORIGINS: ['https://www.youtube.com', 'https://www.youtube-nocookie.com'] as const,
} as const;

export const QUEUE_CONFIG = {
  MAX_NEXT_SONGS_PREVIEW: 3,
  DEFAULT_USER_NAME: 'Singer',
} as const;

export const UI_CONFIG = {
  SEARCH_DEBOUNCE_MS: 300,
  ANIMATION_DURATION_MS: 200,
  MAX_TITLE_LENGTH: 100,
} as const;

export const YOUTUBE_PLAYER_EVENTS = {
  VIDEO_ENDED: 0,
  VIDEO_PLAYING: 1,
  VIDEO_PAUSED: 2,
} as const;
