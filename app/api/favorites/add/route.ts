import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

interface AddSongRequest {
  title: string;
  artist: string;
  youtubeUrl: string;
  videoId: string;
}

export async function POST(request: Request) {
  try {
    const body: AddSongRequest = await request.json();
    const { title, artist, youtubeUrl, videoId } = body;

    // Validate required fields
    if (!title || !youtubeUrl || !videoId) {
      return NextResponse.json(
        { error: 'Missing required fields: title, youtubeUrl, videoId' },
        { status: 400 }
      );
    }

    // Path to song_hits folder and my_favorites.xlsx
    const songHitsPath = path.join(process.cwd(), 'song_hits');
    const favoritesFilePath = path.join(songHitsPath, 'my_favorites.xlsx');

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

      // Check if song already exists (by video ID in URL)
      const alreadyExists = existingData.some((row: any) => {
        const url = row['YouTube URL']?.toString() || '';
        return url.includes(videoId);
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
