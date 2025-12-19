# Personal Videoke - Operating Guide

## Table of Contents
1. [Overview](#overview)
2. [Setup Instructions](#setup-instructions)
3. [Starting the Application](#starting-the-application)
4. [Using the App](#using-the-app)
5. [Features Guide](#features-guide)
6. [Troubleshooting](#troubleshooting)
7. [Version Control](#version-control)

---

## Overview

**Personal Videoke** is a simple karaoke application that lets you:
- Search for karaoke songs on YouTube
- Build a queue of songs to sing
- Play videos with easy navigation controls
- Manage your queue with drag-and-drop reordering

This is a local-only application for personal use, designed for Christmas and family gatherings.

---

## Setup Instructions

### Prerequisites

Before running the app, ensure you have:
- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- **YouTube Data API v3 Key** (free from Google Cloud Console)

### Installation Steps

1. **Navigate to the project directory:**
   ```bash
   cd /Users/argeotublealecha/projects-mvp/videoke-Christmas
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure YouTube API Key:**
   - Create a `.env.local` file in the project root
   - Add your YouTube API key:
     ```
     NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key_here
     ```
   - **How to get a YouTube API key:**
     1. Go to [Google Cloud Console](https://console.cloud.google.com/)
     2. Create a new project or select existing one
     3. Enable "YouTube Data API v3"
     4. Create credentials (API Key)
     5. Copy the key to your `.env.local` file

---

## Starting the Application

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open in browser:**
   - The app will start on `http://localhost:3000`
   - If port 3000 is busy, it will use `http://localhost:3001`
   - Check the terminal output for the actual URL

3. **Recommended browser:**
   - **Chrome** (works best, use Incognito mode if needed)
   - **Edge** (works well)
   - **Safari** may have localhost security restrictions

---

## Using the App

### Main Interface

The app has a **2-column layout**:

**Left Column:**
- Search bar at the top
- Search results (shows up to 3 songs)
- Queue sidebar (shows all queued songs)

**Right Column:**
- Video player with "Now Playing" controls
- Shows current song being played

### Basic Workflow

1. **Search for a song:**
   - Type a song name (e.g., "Jingle Bells karaoke")
   - Click the "Search" button or press Enter
   - Wait for results to load

2. **Add songs to queue:**
   - Click "➕ Add to Queue" on any search result
   - Song appears in the Queue sidebar on the left

3. **Play songs:**
   - First song auto-plays when queue has 1 song
   - Click on any song in the queue to play it immediately
   - Use navigation buttons to skip songs

4. **Clear search:**
   - Click "Clear All" in the search results header
   - This hides search results but keeps your queue

---

## Features Guide

### 🔍 Search Features

**Search Bar (Top Left)**
- Enter song name + "karaoke" for best results
- Example searches:
  - "Silent Night karaoke"
  - "All I Want for Christmas karaoke"
  - "Jingle Bells KARAOKE Lyrics"

**Search Results**
- Shows up to **3 results** to keep interface compact
- Displays: Song title, Channel name
- **Clear All button:** Removes search results from view

### 🎵 Queue Management

**Queue Sidebar**
- Shows all songs in your queue
- **Now Playing** section highlights current song
- **Full Queue** section shows all queued songs

**Queue Controls:**
- **📋 Drag to reorder:** Click and drag songs to rearrange
- **🗑️ Remove:** Click the remove button (X) on any song
- **Clear All:** Removes all songs from queue
- **⏮️ Prev / ⏭️ Next:** Navigate between songs

**Auto-play:**
- First song in queue automatically plays
- After each song ends, next song plays automatically

### 🎬 Video Player

**Now Playing Header:**
- Shows current song title and channel
- **⏮️ Prev button:** Go to previous song (disabled if first song)
- **⏭️ Next button:** Go to next song (disabled if last song)

**Video Controls:**
- Standard YouTube player controls
- Play/Pause
- Volume control
- Fullscreen option
- Progress bar for seeking

**Navigation:**
- Songs auto-advance when finished
- Use Prev/Next buttons to skip manually
- Click any song in queue to jump to it

### 🎨 Visual Design

**Color Scheme:**
- Teal/emerald background with animated gradients
- White/transparent cards with backdrop blur
- Orange-to-pink accent bars on cards
- Blue gradient buttons

**Responsive Design:**
- **Desktop:** 2-column layout (search/queue left, video right)
- **Mobile:** Stacked layout with compact queue at bottom

---

## Troubleshooting

### Common Issues

#### 1. "Port 3000 is in use"
**Solution:** The app will automatically use port 3001
- Check terminal for the actual URL
- Use the URL shown in the terminal output

#### 2. "SSL Error" or "Page won't load"
**Problem:** Using wrong URL format

**Solution:**
- Use `http://` NOT `https://`
- Correct: `http://localhost:3000`
- Wrong: `https://localhost:3000`
- Try Chrome Incognito mode if Safari doesn't work

#### 3. "YouTube API access denied"
**Causes:**
- Invalid API key
- API key not configured
- YouTube API not enabled in Google Cloud

**Solution:**
1. Check `.env.local` file exists
2. Verify API key is correct
3. Ensure YouTube Data API v3 is enabled
4. Check API key restrictions in Google Cloud Console

#### 4. "No search results" or "Search failed"
**Causes:**
- API quota exceeded
- Network connection issue
- Invalid search query

**Solution:**
- Try a different search term
- Add "karaoke" to your search
- Check internet connection
- Wait a few minutes if quota exceeded

#### 5. "Video won't play"
**Causes:**
- Video embedding disabled by uploader
- Network issues
- Regional restrictions

**Solution:**
- Try a different search result
- Check if video plays on YouTube.com
- Restart the app

#### 6. "Next.js compilation errors"
**Solution:** Clear cache and restart
```bash
rm -rf .next
npm run dev
```

### Browser Compatibility

**✅ Recommended:**
- Chrome (any mode)
- Chrome Incognito (best for localhost)
- Microsoft Edge

**⚠️ May have issues:**
- Safari (stricter localhost security)
- Safari Private Mode (strict HSTS)

**Fix for Safari:**
- Use Chrome instead, OR
- Access via `http://127.0.0.1:3000` instead of localhost

---

## Version Control

This app uses Git for version management.

### Available Versions

**baseline-v1** (tagged)
- Original working version
- Simple, stable functionality
- Use this if improvements break something

**improvement** (branch)
- Latest features and UI improvements
- Includes: compact layout, Clear All button, better navigation
- Currently active development branch

### Switching Versions

**To go back to baseline:**
```bash
git checkout baseline-v1
npm run dev
```

**To use latest improvements:**
```bash
git checkout improvement
npm run dev
```

**To see all versions:**
```bash
git log --oneline --all --graph
```

**To see what branch you're on:**
```bash
git branch
```

### Creating Checkpoints

**Save current work:**
```bash
git add -A
git commit -m "Description of changes"
```

**Create a new feature branch:**
```bash
git checkout -b my-new-feature
```

For detailed git instructions, see `GIT_GUIDE.md`

---

## Advanced Features

### Keyboard Shortcuts

While the app doesn't have custom keyboard shortcuts, you can use YouTube player shortcuts when the video is focused:

- **Spacebar:** Play/Pause
- **Left Arrow:** Rewind 5 seconds
- **Right Arrow:** Forward 5 seconds
- **Up Arrow:** Volume up
- **Down Arrow:** Volume down
- **F:** Fullscreen
- **M:** Mute

### Performance Tips

1. **Clear search results** when not needed (saves screen space)
2. **Keep queue under 20 songs** for best performance
3. **Close other browser tabs** for smoother video playback
4. **Use Incognito mode** to avoid browser cache issues

### API Quota Management

YouTube API has daily quotas:
- **Free tier:** 10,000 units per day
- **Each search:** ~100 units
- **Approximately 100 searches per day** possible

**If you hit the quota:**
- Wait until midnight Pacific Time for reset
- Consider creating multiple API keys
- Use more specific search terms to find songs faster

---

## Best Practices

### For Best Search Results:
1. Always include "karaoke" in search
2. Add "lyrics" for lyric videos
3. Include artist name if known
4. Try "instrumental" for backing tracks

### For Smooth Sessions:
1. Build your queue before starting
2. Test volume levels before singing
3. Keep queue organized (reorder as needed)
4. Clear completed songs periodically

### For Parties:
1. Pre-load popular songs in queue
2. Keep search results cleared for cleaner view
3. Use fullscreen mode for video
4. Have backup songs ready in queue

---

## Support & Feedback

This is a personal project for local use. For issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review console errors in browser DevTools (F12)
3. Check terminal output for server errors
4. Restart the app with cache clear if needed

---

## Technical Details

**Built with:**
- Next.js 14.2.35
- React 18
- TypeScript
- Tailwind CSS
- YouTube Data API v3
- react-youtube library

**Project Structure:**
```
videoke-Christmas/
├── app/                  # Next.js app router
│   ├── page.tsx         # Main application page
│   └── layout.tsx       # Root layout
├── src/
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── types/           # TypeScript types
│   └── utils/           # Utility functions
├── .env.local           # Environment variables (API key)
└── public/              # Static assets
```

---

## Quick Reference Card

| Action | How To |
|--------|--------|
| Search for song | Type in search bar, click Search |
| Add to queue | Click "➕ Add to Queue" |
| Play song | Click song in queue |
| Next song | Click "⏭️ Next" (video or queue) |
| Previous song | Click "⏮️ Prev" (video or queue) |
| Remove song | Click X on song in queue |
| Reorder queue | Drag and drop songs |
| Clear queue | Click "Clear All" in queue |
| Clear search | Click "Clear All" in search results |
| Start app | `npm run dev` |
| Stop app | Press Ctrl+C in terminal |

---

**Enjoy your Personal Videoke experience! 🎤🎵**
