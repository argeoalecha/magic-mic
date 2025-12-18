# Personal Videoke 🎤

A simplified, local-only karaoke application built with Next.js 14. Sing your heart out with YouTube karaoke tracks, manage your queue, and get real-time performance scoring!

## Features ✨

- **YouTube Search**: Search for karaoke songs directly from YouTube
- **Queue Management**: Add, remove, reorder songs with drag-and-drop
- **Auto-Play**: Automatically plays the first song and advances to the next
- **Performance Scoring**: Real-time singing performance analysis (0-100 score)
- **Microphone Controls**: Volume slider and mute toggle
- **Persistent Queue**: Your queue survives page refreshes (localStorage)
- **Responsive Design**: Beautiful glass-morphism UI that works on desktop and mobile
- **No Authentication**: Simple, personal use - no login required!

## Getting Started

### Prerequisites

- Node.js 18+ installed
- YouTube Data API v3 key (already configured in `.env.local`)

### Installation

Dependencies are already installed! Just run:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### First Use

1. **Search for songs**: Type in the search bar (e.g., "happy birthday karaoke")
2. **Add to queue**: Click "Add to Queue" on any song
3. **Start singing**: The first song will auto-play when added
4. **Control playback**: Use Previous/Next buttons in the queue
5. **Check your score**: Real-time performance metrics appear while singing

## Project Structure

```
/videoke-Christmas/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main karaoke page
├── src/
│   ├── components/         # 8 UI components
│   ├── hooks/              # 5 custom hooks
│   ├── types/              # TypeScript definitions
│   ├── constants/          # Configuration constants
│   └── index.css           # Global styles
├── .env.local              # YouTube API key
└── package.json            # Dependencies
```

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Video Player**: react-youtube
- **Animations**: react-spring
- **Audio**: Web Audio API

## Key Features Explained

### Queue Persistence

Your queue is automatically saved to localStorage. Refresh the page and your songs are still there!

### Performance Scoring

The app analyzes your singing in real-time using:
- **Pitch Accuracy** (50%): How close you are to the melody
- **Timing** (30%): Rhythm consistency
- **Volume** (20%): Voice projection

### Drag & Drop

Reorder your queue by dragging songs up or down. Uses native HTML5 drag-and-drop API.

## Environment Variables

Located in `.env.local`:

```bash
NEXT_PUBLIC_YOUTUBE_API_KEY=<your-api-key>
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

## Customization

### Change Theme Colors

Edit the background color in `app/page.tsx`:

```tsx
<div style={{ backgroundColor: '#1C5753' }}> {/* Change this */}
```

### Adjust Search Results

Edit `MAX_DISPLAY_RESULTS` in `src/constants/index.ts`:

```ts
MAX_DISPLAY_RESULTS: 5, // Show more or fewer results
```

## Troubleshooting

### YouTube API Quota

The YouTube API has daily quota limits. If searches fail:
1. Check your API key in `.env.local`
2. Verify quotas in [Google Cloud Console](https://console.cloud.google.com)

### Microphone Not Working

1. Grant microphone permissions when prompted
2. Use HTTPS or localhost (required for Web Audio API)
3. Check browser console for audio context errors

### Songs Not Embeddable

Some YouTube videos can't be embedded. The app automatically filters these out during search.

## Browser Support

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (macOS/iOS)

Web Audio API and drag-and-drop work in all modern browsers.

## Differences from Original App

This is a **simplified, personal version** of the production videoke-app:

**Removed**:
- Authentication (NextAuth, Supabase)
- Marketing components (hero, features, banners)
- Usage limits (unlimited songs!)
- User accounts and subscriptions
- Backend database

**Added**:
- localStorage queue persistence
- Cleaner, simpler UI
- "Personal Videoke" branding

## Credits

Built from the production-ready [videoke-app](../videoke-app) with auth and backend removed for local-only use.

## License

Personal use only.
