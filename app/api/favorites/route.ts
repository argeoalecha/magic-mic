import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import type { FavoriteSong } from '@/types';
import { extractYouTubeVideoId } from '@/utils/favoritesParser';

export async function GET() {
  try {
    // Path to song_hits folder with security validation
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

    // Check if folder exists (async)
    try {
      await fs.access(songHitsPath);
    } catch {
      return NextResponse.json({ favorites: [], error: 'song_hits folder not found' });
    }

    // Read all Excel and CSV files from song_hits folder (async)
    const allFiles = await fs.readdir(songHitsPath);
    const files = allFiles.filter(file =>
      file.endsWith('.xlsx') || file.endsWith('.xls') || file.endsWith('.csv')
    );

    if (files.length === 0) {
      return NextResponse.json({ favorites: [], error: 'No Excel or CSV files found in song_hits folder' });
    }

    const allFavorites: FavoriteSong[] = [];
    const errors: string[] = [];

    // Process each file
    for (const file of files) {
      // Security: Validate filename doesn't contain path separators
      if (file.includes('/') || file.includes('\\') || file.includes('..')) {
        errors.push(`Skipped invalid filename: ${file}`);
        continue;
      }

      const filePath = path.join(songHitsPath, file);

      // Security: Double-check the resolved path is still within song_hits
      const resolvedPath = path.resolve(filePath);
      const resolvedSongHits = path.resolve(songHitsPath);
      if (!resolvedPath.startsWith(resolvedSongHits)) {
        errors.push(`Skipped file outside song_hits directory: ${file}`);
        continue;
      }

      try {
        // Read the file (async)
        const fileBuffer = await fs.readFile(filePath);
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

        // Get first sheet
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet) as any[];

        // Transform each row
        jsonData.forEach((row, index) => {
          const title = row['Title of Song']?.toString().trim();
          const artist = row['Name of Artist']?.toString().trim();
          const url = row['YouTube URL']?.toString().trim();
          const group = row['Group']?.toString().trim();

          // Validate required fields
          if (!title || !url) {
            errors.push(`${file} - Row ${index + 2}: Missing title or URL`);
            return;
          }

          // Extract video ID
          const videoId = extractYouTubeVideoId(url);
          if (!videoId) {
            errors.push(`${file} - Row ${index + 2}: Invalid YouTube URL: ${url}`);
            return;
          }

          // Add to favorites
          allFavorites.push({
            id: videoId,
            title: title,
            channelTitle: artist || 'Unknown Artist',
            thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
            artist: artist || 'Unknown Artist',
            group: group || 'Default',
            sourceUrl: url,
            isFavorite: true,
          });
        });
      } catch (fileError) {
        errors.push(`Error reading ${file}: ${fileError instanceof Error ? fileError.message : 'Unknown error'}`);
      }
    }

    return NextResponse.json({
      favorites: allFavorites,
      errors: errors.length > 0 ? errors : undefined,
      filesProcessed: files.length,
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to load favorites', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
