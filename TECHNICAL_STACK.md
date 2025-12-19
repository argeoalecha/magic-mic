# Personal Videoke - Technical Stack Documentation

## Table of Contents
1. [Technology Overview](#technology-overview)
2. [Core Framework & Runtime](#core-framework--runtime)
3. [Dependencies Deep Dive](#dependencies-deep-dive)
4. [Development Tools](#development-tools)
5. [Project Architecture](#project-architecture)
6. [Data Flow](#data-flow)
7. [Component Integration](#component-integration)
8. [API Integration](#api-integration)
9. [Build & Deployment](#build--deployment)
10. [Type System](#type-system)

---

## Technology Overview

**Personal Videoke** is built as a modern, type-safe React application using the Next.js framework with server-side rendering capabilities, though primarily operating as a client-side application for this use case.

### Tech Stack Summary

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| Framework | Next.js | 14.2.32 | React framework with routing & SSR |
| UI Library | React | 18.3.1 | Component-based UI |
| Language | TypeScript | 5.8.3 | Type safety & IDE support |
| Styling | Tailwind CSS | 3.4.14 | Utility-first CSS framework |
| Video Player | react-youtube | 10.1.0 | YouTube player integration |
| Animations | react-spring | 10.0.1 | Physics-based animations |
| API | YouTube Data API v3 | - | Video search functionality |

---

## Core Framework & Runtime

### Next.js 14.2.32

**What it is:**
- React-based framework by Vercel
- Full-stack framework with both frontend and backend capabilities
- App Router architecture (latest paradigm)

**How it's used in this app:**
```
Features utilized:
✓ App Router (app/ directory structure)
✓ Server Components (though app runs client-side)
✓ Fast Refresh (instant feedback during development)
✓ Automatic code splitting
✓ Built-in CSS support
✓ Environment variables (.env.local)
✓ Development server with HMR

Features NOT used:
✗ API Routes (no backend needed)
✗ Server-side rendering (uses 'use client' directive)
✗ Static site generation
✗ Image optimization
```

**File structure:**
```
app/
├── layout.tsx      # Root layout (HTML structure, fonts, metadata)
└── page.tsx        # Main application page (entry point)
```

**Configuration:**
- `next.config.js` - Next.js configuration (minimal, using defaults)
- Development: `npm run dev` starts server on port 3000
- Production: `npm run build` creates optimized bundle

---

### React 18.3.1

**What it is:**
- Library for building user interfaces
- Component-based architecture
- Virtual DOM for efficient updates

**How it's used in this app:**

**Core React Features:**
```typescript
// Hooks used throughout the app:
- useState      // Component state management
- useEffect     // Side effects (API calls, event listeners)
- useCallback   // Memoized callbacks to prevent re-renders
- useRef        // DOM references and mutable values
- Custom hooks  // Abstracted logic (useQueue, useYouTubeSearch)
```

**Component Pattern:**
```typescript
// Functional components with TypeScript
export const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Side effects
  }, [dependencies]);

  return <JSX />;
};
```

**react-dom 18.3.1:**
- Bridge between React and browser DOM
- Handles rendering React components to HTML

---

### TypeScript 5.8.3

**What it is:**
- Typed superset of JavaScript
- Compile-time type checking
- Enhanced IDE features

**How it's used in this app:**

**Configuration (tsconfig.json):**
```json
{
  "compilerOptions": {
    "target": "es5",              // Output JavaScript ES5
    "lib": ["dom", "esnext"],     // Type definitions
    "strict": true,               // Strict type checking
    "jsx": "preserve",            // Let Next.js handle JSX
    "moduleResolution": "bundler",// Modern resolution
    "paths": {
      "@/*": ["./src/*"]          // Path alias for imports
    }
  }
}
```

**Type Safety:**
```typescript
// Custom types defined in src/types/
interface YouTubeSong {
  id: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
}

interface QueueItem extends YouTubeSong {
  queueId: string;  // Unique queue identifier
  addedAt: number;  // Timestamp
}
```

**Benefits:**
- Catch errors at compile time
- IntelliSense autocomplete
- Refactoring safety
- Self-documenting code

---

## Dependencies Deep Dive

### Production Dependencies

#### 1. react-youtube (10.1.0)

**Purpose:** Embed and control YouTube videos

**How it works:**
```typescript
import YouTube from 'react-youtube';

<YouTube
  videoId={currentSong.id}
  opts={{
    height: '600',
    width: '100%',
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0
    }
  }}
  onEnd={handleVideoEnd}
  onReady={handleReady}
/>
```

**Features used:**
- Video playback control
- Event handling (onEnd, onReady, onPlay, onPause)
- Player state management
- YouTube IFrame API wrapper

**Integration:**
- Used in `VideoPlayer.tsx`
- Manages playback state
- Auto-advances to next song on end
- Provides player instance for controls

---

#### 2. react-spring (10.0.1)

**Purpose:** Physics-based animations

**How it works:**
```typescript
import { useSpring, animated } from 'react-spring';

const animation = useSpring({
  from: { opacity: 0, transform: 'translateY(20px)' },
  to: { opacity: 1, transform: 'translateY(0px)' },
  config: { tension: 280, friction: 60 }
});

return <animated.div style={animation}>Content</animated.div>;
```

**Features:**
- Smooth, natural animations
- Spring physics (tension, friction, mass)
- Gesture-based animations
- Performance optimized

**Current Usage:**
- Minimal in baseline (prepared for future enhancements)
- Can be used for queue reordering animations
- Smooth transitions between states

---

### Development Dependencies

#### 1. Tailwind CSS (3.4.14)

**Purpose:** Utility-first CSS framework

**How it works:**
```typescript
// Instead of writing CSS:
<div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-5">

// Translates to:
.element {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 1.25rem;
}
```

**Configuration (tailwind.config.js):**
```javascript
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**Features used:**
```
Layout:      grid, flex, space-y, gap
Sizing:      w-full, h-screen, max-w-7xl
Colors:      bg-blue-500, text-white, from-emerald-400
Effects:     backdrop-blur, shadow-2xl, hover:scale-105
Responsive:  lg:col-span-8, md:grid-cols-2
Animations:  animate-pulse, transition-all
```

**Benefits:**
- No custom CSS files needed
- Consistent design system
- Responsive by default
- Small production bundle (purges unused styles)

---

#### 2. PostCSS (8.5.6) & Autoprefixer (10.4.21)

**Purpose:** CSS processing and vendor prefixing

**How it works:**
```
Tailwind CSS → PostCSS → Autoprefixer → Optimized CSS
```

**What it does:**
```css
/* You write: */
backdrop-filter: blur(10px);

/* It outputs: */
-webkit-backdrop-filter: blur(10px);
backdrop-filter: blur(10px);
```

**Integration:**
- Automatic in Next.js
- Configured in `postcss.config.js`
- Ensures browser compatibility

---

#### 3. ESLint (8.57.1) + eslint-config-next (14.2.15)

**Purpose:** Code quality and consistency

**What it checks:**
- React best practices
- Next.js specific rules
- Unused variables
- Missing dependencies in useEffect
- Accessibility issues

**Usage:**
```bash
npm run lint  # Check for issues
```

**Configuration:**
- `.eslintrc.json` extends Next.js config
- Catches common React mistakes
- Enforces consistent code style

---

#### 4. TypeScript Type Definitions

**@types/node (20.16.12)**
- Node.js API types
- Process, environment variables

**@types/react (18.3.12)**
- React API types
- JSX type definitions

**@types/react-dom (18.3.1)**
- ReactDOM types
- Event handlers

---

## Project Architecture

### Directory Structure

```
videoke-Christmas/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout (HTML, fonts, metadata)
│   └── page.tsx                 # Main application page
│
├── src/
│   ├── components/              # React components
│   │   ├── SearchBar.tsx       # Search input & button
│   │   ├── SongResults.tsx     # Display search results
│   │   ├── QueueSidebar.tsx    # Queue management panel
│   │   ├── DraggableQueueItem.tsx  # Individual queue item
│   │   ├── VideoPlayer.tsx     # YouTube player wrapper
│   │   ├── CompactQueue.tsx    # Mobile queue view
│   │   ├── ScoreDisplay.tsx    # (Unused - scoring feature)
│   │   └── MicControls.tsx     # (Unused - mic feature)
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useQueue.ts         # Queue state management
│   │   ├── useYouTubeSearch.ts # YouTube API integration
│   │   ├── useDebounce.ts      # Debounce utility
│   │   ├── useMicrophone.ts    # (Unused - mic feature)
│   │   ├── useAudioAnalysis.ts # (Unused - audio feature)
│   │   └── usePerformanceScoring.ts  # (Unused)
│   │
│   ├── types/                   # TypeScript type definitions
│   │   ├── index.ts            # Main type exports
│   │   └── youtube.ts          # YouTube-specific types
│   │
│   ├── utils/                   # Utility functions
│   │   └── errorHandling.ts    # User-friendly error messages
│   │
│   └── index.css               # Global styles & Tailwind imports
│
├── public/                      # Static assets
│
├── .env.local                   # Environment variables (API key)
├── package.json                 # Dependencies & scripts
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.js          # Tailwind configuration
├── next.config.js              # Next.js configuration
└── postcss.config.js           # PostCSS configuration
```

---

### Component Hierarchy

```
App (page.tsx)
│
├── SearchBar
│   └── Input + Button
│
├── SongResults (conditional)
│   └── Results[]
│       └── Song Card + "Add to Queue" Button
│
├── QueueSidebar (conditional)
│   ├── Header + Clear All
│   ├── Now Playing Section
│   │   ├── Current Song Info
│   │   └── Prev/Next Buttons
│   └── Full Queue Section
│       └── DraggableQueueItem[]
│           ├── Song Info
│           ├── Play Button
│           └── Remove Button
│
└── VideoPlayer (conditional)
    ├── Now Playing Header
    │   ├── Prev Button
    │   ├── Song Title
    │   └── Next Button
    └── YouTube Component
        └── Video Player
```

---

## Data Flow

### State Management Architecture

```
┌─────────────────────────────────────────────────┐
│                  app/page.tsx                    │
│              (Main Application)                  │
└─────────────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
   ┌─────────┐  ┌──────────┐  ┌─────────┐
   │ Search  │  │  Queue   │  │  Video  │
   │  State  │  │  State   │  │  State  │
   └─────────┘  └──────────┘  └─────────┘
        │             │             │
        │             │             │
   useYouTube    useQueue      Current Song
    Search                      from Queue
```

### 1. Search Flow

```typescript
User Input
    ↓
SearchBar Component
    ↓
memoizedSearchSongs(query)
    ↓
useYouTubeSearch Hook
    ↓
YouTube Data API v3
    ↓
Parse Response
    ↓
Update songs state
    ↓
SongResults Component renders
    ↓
User clicks "Add to Queue"
    ↓
addToQueue(song)
```

### 2. Queue Management Flow

```typescript
useQueue Hook manages:
├── queue: QueueItem[]           // All songs
├── currentSongIndex: number     // Which song is playing
├── currentSong: QueueItem | null
└── nextSongs: QueueItem[]       // Upcoming songs

Operations:
├── addToQueue(song)
│   └── Adds unique queueId + timestamp
├── removeFromQueue(queueId)
│   └── Filters out song, adjusts currentIndex
├── reorderQueue(fromIndex, toIndex)
│   └── Drag-and-drop reordering
├── playNext()
│   └── currentSongIndex++
├── playPrevious()
│   └── currentSongIndex--
└── playSong(queueId)
    └── Jump to specific song
```

### 3. Video Playback Flow

```typescript
Queue has songs
    ↓
Auto-play first song (useEffect)
    ↓
VideoPlayer receives currentSong
    ↓
YouTube component loads video
    ↓
User watches/sings
    ↓
Video ends → onVideoEnd()
    ↓
playNext() called
    ↓
currentSongIndex increments
    ↓
New song loads automatically
```

---

## Component Integration

### How Components Work Together

#### 1. SearchBar → SongResults → Queue

```typescript
// SearchBar.tsx
export const SearchBar = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    onSearch(query);  // Triggers API call
  };

  return (
    <input onChange={(e) => setQuery(e.target.value)} />
    <button onClick={handleSearch}>Search</button>
  );
};

// app/page.tsx
const { songs, searchSongs } = useYouTubeSearch();

<SearchBar onSearch={searchSongs} />
<SongResults
  songs={songs}
  onSongSelect={addToQueue}  // Callback to add to queue
/>
```

#### 2. Queue → VideoPlayer Synchronization

```typescript
// app/page.tsx
const { queue, currentSong, currentSongIndex, playNext } = useQueue();

// VideoPlayer receives current song
<VideoPlayer
  currentSong={currentSong}
  onVideoEnd={playNext}      // Auto-advance
  onNext={playNext}          // Manual skip
  onPrevious={playPrevious}
/>

// QueueSidebar shows same state
<QueueSidebar
  queue={queue}
  currentSongIndex={currentSongIndex}
  onPlaySong={playSong}      // Jump to song
/>
```

#### 3. Drag-and-Drop Queue Reordering

```typescript
// DraggableQueueItem.tsx
const handleDragStart = (e: DragEvent) => {
  e.dataTransfer.setData('queueIndex', index.toString());
};

const handleDrop = (e: DragEvent) => {
  const fromIndex = parseInt(e.dataTransfer.getData('queueIndex'));
  const toIndex = index;
  onDrop(fromIndex, toIndex);  // Callback to parent
};

// QueueSidebar.tsx
const handleDrop = (fromIndex, toIndex) => {
  onReorderQueue(fromIndex, toIndex);  // Updates queue state
};
```

---

## API Integration

### YouTube Data API v3

**Endpoint Used:**
```
https://www.googleapis.com/youtube/v3/search
```

**Implementation (useYouTubeSearch.ts):**

```typescript
const searchSongs = async (query: string) => {
  setIsLoading(true);
  setError('');

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
      `part=snippet` +
      `&q=${encodeURIComponent(query + ' karaoke')}` +
      `&type=video` +
      `&videoCategoryId=10` +  // Music category
      `&maxResults=10` +
      `&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const songs = data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnailUrl: item.snippet.thumbnails.medium.url
    }));

    setSongs(songs);
  } catch (err) {
    setError(createUserFriendlyError(err));
  } finally {
    setIsLoading(false);
  }
};
```

**Error Handling (errorHandling.ts):**

```typescript
export const createUserFriendlyError = (error: unknown): string => {
  if (error instanceof Error) {
    // API quota exceeded
    if (error.message.includes('quotaExceeded')) {
      return 'YouTube API quota exceeded. Please try again later.';
    }

    // Invalid API key
    if (error.message.includes('keyInvalid')) {
      return 'Invalid YouTube API key. Please check your configuration.';
    }

    // Network error
    if (error.message.includes('NetworkError')) {
      return 'Network error. Please check your internet connection.';
    }

    return error.message;
  }
  return 'An unexpected error occurred.';
};
```

**API Response Structure:**

```json
{
  "items": [
    {
      "id": {
        "videoId": "dQw4w9WgXcQ"
      },
      "snippet": {
        "title": "Song Title - Karaoke Version",
        "channelTitle": "Channel Name",
        "thumbnails": {
          "medium": {
            "url": "https://..."
          }
        }
      }
    }
  ]
}
```

---

## Build & Deployment

### Development Mode

```bash
npm run dev
```

**What happens:**
1. Next.js starts development server
2. TypeScript compilation in watch mode
3. Hot Module Replacement (HMR) enabled
4. Fast Refresh for instant updates
5. Server runs on http://localhost:3000
6. Reads environment from `.env.local`

**Development Features:**
- Source maps for debugging
- Detailed error messages
- React DevTools support
- Unoptimized builds (faster compilation)

---

### Production Build

```bash
npm run build
```

**Build Process:**
1. TypeScript type checking
2. Component compilation
3. Tailwind CSS purging (removes unused styles)
4. JavaScript minification
5. Code splitting
6. Asset optimization
7. Creates `.next/` folder with optimized build

**Output:**
```
.next/
├── static/
│   ├── chunks/         # JavaScript bundles
│   ├── css/            # Optimized CSS
│   └── media/          # Images, fonts
├── server/             # Server-side code
└── cache/              # Build cache
```

---

### Production Server

```bash
npm run build
npm start
```

**What happens:**
- Serves optimized production build
- Runs on port 3000
- No HMR or Fast Refresh
- Compressed assets
- Optimal performance

---

## Type System

### Core Types (src/types/youtube.ts)

```typescript
// Base YouTube song structure
export interface YouTubeSong {
  id: string;              // YouTube video ID
  title: string;           // Video title
  channelTitle: string;    // Channel name
  thumbnailUrl: string;    // Thumbnail image URL
}

// Queue-specific extension
export interface QueueItem extends YouTubeSong {
  queueId: string;         // Unique identifier for queue
  addedAt: number;         // Timestamp when added
}
```

### Component Props Types

```typescript
// SearchBar
interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

// SongResults
interface SongResultsProps {
  songs: YouTubeSong[];
  onSongSelect: (song: YouTubeSong) => void;
  isLoading: boolean;
  error: string;
  onClearResults?: () => void;
}

// VideoPlayer
interface VideoPlayerProps {
  currentSong: YouTubeSong | null;
  onVideoEnd?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  currentSongIndex?: number;
  queueLength?: number;
}

// QueueSidebar
interface QueueSidebarProps {
  queue: QueueItem[];
  currentSongIndex: number;
  onPlaySong: (queueId: string) => void;
  onRemoveFromQueue: (queueId: string) => void;
  onReorderQueue: (fromIndex: number, toIndex: number) => void;
  onClearQueue: () => void;
  onNext: () => void;
  onPrevious: () => void;
}
```

### Hook Return Types

```typescript
// useYouTubeSearch
interface UseYouTubeSearchReturn {
  songs: YouTubeSong[];
  isLoading: boolean;
  error: string;
  searchSongs: (query: string) => Promise<void>;
}

// useQueue
interface UseQueueReturn {
  queue: QueueItem[];
  currentSong: QueueItem | null;
  currentSongIndex: number;
  nextSongs: QueueItem[];
  addToQueue: (song: YouTubeSong) => void;
  removeFromQueue: (queueId: string) => void;
  reorderQueue: (fromIndex: number, toIndex: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  playSong: (queueId: string) => void;
  clearQueue: () => void;
}
```

---

## Performance Optimizations

### 1. React Memoization

```typescript
// Prevent unnecessary re-renders
const memoizedSearchSongs = useCallback((query: string) => {
  setSearchQuery(query);
  searchSongs(query);
}, [searchSongs]);

// Pass memoized version to child
<SearchBar onSearch={memoizedSearchSongs} />
```

### 2. Conditional Rendering

```typescript
// Only render components when needed
{queue.length > 0 && <QueueSidebar />}
{searchQuery && <SongResults />}
{currentSong && <VideoPlayer />}
```

### 3. Code Splitting

Next.js automatically splits code:
- Each page is a separate bundle
- Dynamic imports for heavy components
- Lazy loading of unused features

### 4. CSS Purging

Tailwind removes unused classes in production:
```
Development: ~3MB CSS
Production:  ~10KB CSS (99% reduction)
```

---

## Environment Configuration

### Environment Variables (.env.local)

```bash
# YouTube API Configuration
NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key_here

# Next.js prefixes client-side variables with NEXT_PUBLIC_
```

**Access in code:**
```typescript
const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
```

**Security:**
- `.env.local` is in `.gitignore`
- Never commit API keys to git
- Keys prefixed with `NEXT_PUBLIC_` are exposed to browser

---

## Integration Summary

### How Everything Works Together

```
User opens app in browser
    ↓
Next.js serves index.html
    ↓
React hydrates the page
    ↓
TypeScript-compiled JavaScript loads
    ↓
Tailwind CSS applies styles
    ↓
Components mount
    ↓
Hooks initialize state
    ↓
User interacts with SearchBar
    ↓
useYouTubeSearch calls API
    ↓
Results display in SongResults
    ↓
User adds song to queue
    ↓
useQueue updates state
    ↓
VideoPlayer receives current song
    ↓
react-youtube loads video
    ↓
User watches/sings
    ↓
Video ends → playNext()
    ↓
Cycle continues
```

---

## Technology Decisions & Rationale

### Why Next.js?
- **Fast Refresh:** Instant feedback during development
- **Built-in TypeScript:** Zero configuration
- **App Router:** Modern, file-based routing
- **Future-proof:** Easy to add SSR/API routes if needed

### Why React?
- **Component reusability:** SearchBar, QueueSidebar, etc.
- **State management:** Hooks for clean state logic
- **Large ecosystem:** Easy to find solutions
- **Performance:** Virtual DOM for efficient updates

### Why TypeScript?
- **Catch bugs early:** Type errors at compile time
- **Better IDE support:** Autocomplete, refactoring
- **Self-documenting:** Types serve as documentation
- **Refactoring confidence:** Safe to change code

### Why Tailwind CSS?
- **Fast development:** No context switching to CSS files
- **Consistent design:** Utility classes enforce consistency
- **Small bundle:** Purges unused styles in production
- **Responsive:** Mobile-first utilities built-in

### Why react-youtube?
- **Official wrapper:** Uses YouTube IFrame API
- **Event handling:** Easy to hook into video lifecycle
- **Reliable:** Well-maintained library
- **Type support:** TypeScript definitions included

---

## Browser Compatibility

### Supported Browsers

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully supported |
| Edge | 90+ | ✅ Fully supported |
| Firefox | 88+ | ✅ Fully supported |
| Safari | 14+ | ⚠️ localhost restrictions |
| Mobile Safari | 14+ | ✅ Supported |
| Chrome Mobile | 90+ | ✅ Supported |

### Required Features

- ES6 JavaScript
- Fetch API
- CSS Grid & Flexbox
- HTML5 Video
- Local Storage
- Drag and Drop API

---

## Future Extensibility

### Current Architecture Supports:

**✅ Easy to add:**
- More search filters
- Playlist saving (localStorage)
- Volume controls
- Playback speed
- Loop functionality
- History tracking

**✅ Moderate effort:**
- User accounts (auth)
- Cloud storage (Firebase)
- Collaborative queues
- Song recommendations
- Favorites system

**✅ Removed but code exists:**
- Microphone input (useMicrophone.ts)
- Audio analysis (useAudioAnalysis.ts)
- Performance scoring (usePerformanceScoring.ts)
- Score display (ScoreDisplay.tsx)

---

## Dependencies License Summary

| Package | License | Commercial Use |
|---------|---------|----------------|
| Next.js | MIT | ✅ Yes |
| React | MIT | ✅ Yes |
| TypeScript | Apache 2.0 | ✅ Yes |
| Tailwind CSS | MIT | ✅ Yes |
| react-youtube | MIT | ✅ Yes |
| react-spring | MIT | ✅ Yes |

**All dependencies use permissive licenses suitable for personal and commercial use.**

---

## Summary

Personal Videoke leverages a modern, well-integrated stack:

1. **Next.js** provides the foundation and development experience
2. **React** handles the component architecture and state
3. **TypeScript** ensures type safety and code quality
4. **Tailwind CSS** creates a beautiful, responsive UI
5. **react-youtube** integrates YouTube video playback
6. **YouTube API** provides the content search
7. **Custom hooks** abstract complex logic
8. **Component composition** creates a maintainable codebase

Each technology serves a specific purpose and integrates seamlessly with the others to create a fast, reliable, and enjoyable karaoke experience.

---

**Last Updated:** December 2024
**Version:** 0.1.0 (Improvement Branch)
