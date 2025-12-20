import { NextResponse } from 'next/server';

interface YouTubeSearchParams {
  q: string;
  maxResults?: number;
}

interface YouTubeAPIResponse {
  items?: Array<{
    id: { videoId: string };
    snippet: {
      title: string;
      channelTitle: string;
      thumbnails: {
        default?: { url: string };
        medium?: { url: string };
        high?: { url: string };
      };
    };
  }>;
  error?: {
    message: string;
    code?: number;
  };
}

interface YouTubeVideosResponse {
  items?: Array<{
    id: string;
    status: {
      embeddable: boolean;
    };
  }>;
}

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const YOUTUBE_BASE_URL = 'https://www.googleapis.com/youtube/v3';
const MAX_SEARCH_RESULTS = 10;
const MAX_DISPLAY_RESULTS = 5;

/**
 * Check if videos are embeddable using YouTube API
 */
async function checkVideoEmbeddability(videoIds: string[]): Promise<Set<string>> {
  if (videoIds.length === 0) return new Set();

  try {
    const idsParam = videoIds.join(',');
    const url = `${YOUTUBE_BASE_URL}/videos?part=status&id=${idsParam}&key=${YOUTUBE_API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      console.warn('Failed to check video embeddability');
      return new Set();
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
    return new Set();
  }
}

export async function GET(request: Request) {
  try {
    // Validate API key is configured
    if (!YOUTUBE_API_KEY) {
      return NextResponse.json(
        { error: 'YouTube API key not configured' },
        { status: 500 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const maxResults = parseInt(searchParams.get('maxResults') || String(MAX_SEARCH_RESULTS));

    // Validate required parameters
    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    // Validate query length (prevent abuse)
    if (query.length > 200) {
      return NextResponse.json(
        { error: 'Query too long (max 200 characters)' },
        { status: 400 }
      );
    }

    // Build search query
    const searchQuery = `${query} karaoke`;
    const url = `${YOUTUBE_BASE_URL}/search?part=snippet&type=video&videoEmbeddable=true&q=${encodeURIComponent(
      searchQuery
    )}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`;

    // Call YouTube API
    const response = await fetch(url);

    if (!response.ok) {
      console.error('YouTube API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'YouTube API request failed' },
        { status: response.status }
      );
    }

    const data: YouTubeAPIResponse = await response.json();

    // Check for API errors
    if (data.error) {
      console.error('YouTube API error:', data.error);
      return NextResponse.json(
        { error: data.error.message || 'YouTube API error' },
        { status: data.error.code || 500 }
      );
    }

    // Process results
    if (data.items && data.items.length > 0) {
      // Map all results to our format
      const allResults = data.items.map((item) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url || '',
      }));

      // Double-check embeddability
      const videoIds = allResults.map((song) => song.id);
      const embeddableIds = await checkVideoEmbeddability(videoIds);

      // Filter to only embeddable videos and limit results
      const embeddableResults = allResults
        .filter((song) => embeddableIds.has(song.id))
        .slice(0, MAX_DISPLAY_RESULTS);

      if (embeddableResults.length > 0) {
        return NextResponse.json({
          songs: embeddableResults,
          total: embeddableResults.length,
        });
      } else {
        return NextResponse.json({
          songs: [],
          error: 'No embeddable karaoke songs found',
        });
      }
    } else {
      return NextResponse.json({
        songs: [],
        error: 'No karaoke songs found',
      });
    }
  } catch (error) {
    console.error('YouTube search API error:', error);
    return NextResponse.json(
      { error: 'Failed to search YouTube' },
      { status: 500 }
    );
  }
}
