import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface FavoriteFileRow {
  title: string;
  artist: string;
  url: string;
  group: string;
}

export interface FavoriteSong {
  id: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  artist: string;
  group: string;
  sourceUrl: string;
  isFavorite: true;
}

/**
 * Extract YouTube video ID from various URL formats
 * Supports: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, m.youtube.com/watch?v=ID
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|m\.youtube\.com\/watch\?v=)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/, // Just the ID itself
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Parse CSV file using papaparse
 */
export async function parseCsvFile(file: File): Promise<FavoriteFileRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      complete: (results) => {
        try {
          const rows = results.data.map((row: any) => ({
            title: row['Title of Song']?.trim() || '',
            artist: row['Name of Artist']?.trim() || '',
            url: row['YouTube URL']?.trim() || '',
            group: row['Group']?.trim() || '',
          }));
          resolve(rows);
        } catch (error) {
          reject(new Error('Failed to parse CSV data'));
        }
      },
      error: (error) => reject(new Error(`CSV parsing error: ${error.message}`)),
    });
  });
}

/**
 * Parse Excel file using xlsx
 */
export async function parseExcelFile(file: File): Promise<FavoriteFileRow[]> {
  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);

    return jsonData.map((row: any) => ({
      title: row['Title of Song']?.toString().trim() || '',
      artist: row['Name of Artist']?.toString().trim() || '',
      url: row['YouTube URL']?.toString().trim() || '',
      group: row['Group']?.toString().trim() || '',
    }));
  } catch (error) {
    throw new Error(`Excel parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Validate and transform parsed data to FavoriteSong objects
 */
export function validateAndTransformFavorites(
  rows: FavoriteFileRow[]
): { valid: FavoriteSong[]; errors: string[] } {
  const valid: FavoriteSong[] = [];
  const errors: string[] = [];

  rows.forEach((row, index) => {
    const rowNum = index + 2; // +2 for header and 0-based index

    // Check for missing required fields
    if (!row.title) {
      errors.push(`Row ${rowNum}: Missing title`);
      return;
    }

    if (!row.url) {
      errors.push(`Row ${rowNum}: Missing YouTube URL`);
      return;
    }

    // Extract and validate YouTube video ID
    const videoId = extractYouTubeVideoId(row.url);
    if (!videoId) {
      errors.push(`Row ${rowNum}: Invalid YouTube URL: ${row.url}`);
      return;
    }

    // Create FavoriteSong object
    valid.push({
      id: videoId,
      title: row.title,
      channelTitle: row.artist || 'Unknown Artist',
      thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      artist: row.artist || 'Unknown Artist',
      group: row.group || 'Default',
      sourceUrl: row.url,
      isFavorite: true,
    });
  });

  return { valid, errors };
}

/**
 * Group favorites by group name
 */
export function groupFavorites(favorites: FavoriteSong[]): Map<string, FavoriteSong[]> {
  const grouped = new Map<string, FavoriteSong[]>();

  favorites.forEach((song) => {
    const groupName = song.group;
    if (!grouped.has(groupName)) {
      grouped.set(groupName, []);
    }
    grouped.get(groupName)!.push(song);
  });

  return grouped;
}
