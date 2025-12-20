import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { extractYouTubeVideoId } from '@/utils/favoritesParser';

interface AddSongRequest {
  title: string;
  artist: string;
  youtubeUrl: string;
  videoId: string;
}

/**
 * Sanitize string input by removing potentially dangerous characters
 * Allows letters, numbers, spaces, and common punctuation
 */
function sanitizeString(input: string): string {
  // Remove null bytes and control characters
  return input.replace(/[\x00-\x1F\x7F]/g, '')
    .trim()
    .substring(0, 500); // Hard limit to prevent abuse
}

/**
 * Validate YouTube URL format
 */
function isValidYouTubeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const validHosts = ['www.youtube.com', 'youtube.com', 'youtu.be', 'm.youtube.com'];
    return validHosts.includes(urlObj.hostname);
  } catch {
    return false;
  }
}

/**
 * Validate YouTube video ID format (11 characters, alphanumeric, dash, underscore)
 */
function isValidVideoId(videoId: string): boolean {
  return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
}

export async function POST(request: Request) {
  try {
    const body: AddSongRequest = await request.json();
    let { title, artist, youtubeUrl, videoId } = body;

    // Validate required fields exist
    if (!title || !youtubeUrl || !videoId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, youtubeUrl, videoId' },
        { status: 400 }
      );
    }

    // Validate and sanitize title
    title = sanitizeString(title);
    if (title.length === 0) {
      return NextResponse.json(
        { error: 'Title is required and cannot be empty' },
        { status: 400 }
      );
    }
    if (title.length > 200) {
      return NextResponse.json(
        { error: 'Title is too long (max 200 characters)' },
        { status: 400 }
      );
    }

    // Validate and sanitize artist
    artist = artist ? sanitizeString(artist) : 'Unknown Artist';
    if (artist.length > 100) {
      return NextResponse.json(
        { error: 'Artist name is too long (max 100 characters)' },
        { status: 400 }
      );
    }

    // Validate YouTube URL format
    if (!isValidYouTubeUrl(youtubeUrl)) {
      return NextResponse.json(
        { error: 'Invalid YouTube URL format' },
        { status: 400 }
      );
    }

    // Validate video ID format
    if (!isValidVideoId(videoId)) {
      return NextResponse.json(
        { error: 'Invalid YouTube video ID format' },
        { status: 400 }
      );
    }

    // Path to song_hits folder and my_favorites.xlsx with security validation
    const baseDir = process.cwd();
    const songHitsPath = path.join(baseDir, 'song_hits');

    // Security: Validate path to prevent traversal attacks
    const normalizedPath = path.normalize(songHitsPath);
    const relativePath = path.relative(baseDir, normalizedPath);

    // Ensure the path doesn't escape the project directory
    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
      console.error('Path traversal attempt detected:', songHitsPath);
      return NextResponse.json(
        { error: 'Invalid path' },
        { status: 400 }
      );
    }

    const favoritesFilePath = path.join(songHitsPath, 'my_favorites.xlsx');

    // Security: Validate the favorites file path
    const resolvedFavPath = path.resolve(favoritesFilePath);
    const resolvedSongHits = path.resolve(songHitsPath);
    if (!resolvedFavPath.startsWith(resolvedSongHits)) {
      console.error('File path escapes song_hits directory');
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      );
    }

    // Ensure song_hits folder exists
    if (!fs.existsSync(songHitsPath)) {
      fs.mkdirSync(songHitsPath, { recursive: true });
    }

    let workbook: XLSX.WorkBook;
    let worksheet: XLSX.WorkSheet;
    let existingData: any[] = [];

    // Check if my_favorites.xlsx exists
    if (fs.existsSync(favoritesFilePath)) {
      // Read existing file
      const fileBuffer = fs.readFileSync(favoritesFilePath);
      workbook = XLSX.read(fileBuffer, { type: 'buffer' });
      worksheet = workbook.Sheets[workbook.SheetNames[0]];
      existingData = XLSX.utils.sheet_to_json(worksheet);

      // Check if song already exists (by exact video ID match)
      const alreadyExists = existingData.some((row: any) => {
        const url = row['YouTube URL']?.toString() || '';
        const existingVideoId = extractYouTubeVideoId(url);
        return existingVideoId === videoId;
      });

      if (alreadyExists) {
        return NextResponse.json({
          message: 'Song already exists in my_favorites.xlsx',
          skipped: true,
        });
      }
    } else {
      // Create new workbook
      workbook = XLSX.utils.book_new();
    }

    // Add new song to data - default to "To Organize" group so user can reorganize later
    const newSong = {
      'Title of Song': title,
      'Name of Artist': artist || 'Unknown Artist',
      'YouTube URL': youtubeUrl,
      'Group': 'To Organize',
    };

    existingData.push(newSong);

    // Create new worksheet with updated data
    const newWorksheet = XLSX.utils.json_to_sheet(existingData);

    // Update or add worksheet to workbook
    if (workbook.SheetNames.length > 0) {
      workbook.Sheets[workbook.SheetNames[0]] = newWorksheet;
    } else {
      XLSX.utils.book_append_sheet(workbook, newWorksheet, 'Favorites');
    }

    // Write file
    XLSX.writeFile(workbook, favoritesFilePath);

    return NextResponse.json({
      message: 'Song added successfully to my_favorites.xlsx',
      song: newSong,
      totalSongs: existingData.length,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to add song',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
