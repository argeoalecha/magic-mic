export interface YouTubeAPIItem {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: {
      medium?: {
        url: string;
      };
      default?: {
        url: string;
      };
    };
  };
}

export interface YouTubeAPIResponse {
  items?: YouTubeAPIItem[];
  error?: {
    message: string;
    code: number;
  };
}

export interface YouTubePlayerEvent {
  event: string;
  info: number;
}

export interface YouTubeVideoStatus {
  embeddable: boolean;
}

export interface YouTubeVideoItem {
  id: string;
  status: YouTubeVideoStatus;
}

export interface YouTubeVideosResponse {
  items?: YouTubeVideoItem[];
  error?: {
    message: string;
    code: number;
  };
}
