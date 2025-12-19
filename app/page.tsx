'use client';

import { SearchBar } from '@/components/SearchBar';
import { SongResults } from '@/components/SongResults';
import { VideoPlayer } from '@/components/VideoPlayer';
import { QueueSidebar } from '@/components/QueueSidebar';
import { CompactQueue } from '@/components/CompactQueue';
import { useYouTubeSearch } from '@/hooks/useYouTubeSearch';
import { useQueue } from '@/hooks/useQueue';
import type { YouTubeSong } from '@/types';
import React, { useCallback } from 'react';

export default function Home() {
  const { songs, isLoading: isSearching, error, searchSongs } = useYouTubeSearch();
  const [searchQuery, setSearchQuery] = React.useState('');

  // Memoize searchSongs to prevent SearchBar re-renders
  const memoizedSearchSongs = useCallback((query: string) => {
    setSearchQuery(query);
    searchSongs(query);
  }, [searchSongs]);

  const {
    queue,
    currentSong,
    currentSongIndex,
    nextSongs,
    addToQueue,
    removeFromQueue,
    reorderQueue,
    playNext,
    playPrevious,
    playSong,
    clearQueue,
  } = useQueue();

  const handleSongSelect = (song: YouTubeSong) => {
    addToQueue(song);
  };

  const handleClearSearchResults = () => {
    setSearchQuery('');
  };

  // Auto-play first song when queue gets first item
  React.useEffect(() => {
    if (queue.length === 1 && currentSongIndex === -1) {
      playNext();
    }
  }, [queue, currentSongIndex, playNext]);

  const handleVideoEnd = () => {
    playNext();
  };

  const handleNextSong = () => {
    playNext();
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#1C5753' }}>
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>

      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6 lg:py-8 relative z-10">
        {/* Header - Only show when queue is empty */}
        {queue.length === 0 && (
          <div className="text-center mb-12">
            <div className="relative">
              <h1 className="text-6xl lg:text-7xl font-bold mb-4 drop-shadow-2xl">
                🎤 <span style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontWeight: '400' }}>Personal</span>{' '}
                <span className="bg-gradient-to-r from-white via-blue-200 to-sky-200 bg-clip-text text-transparent">Videoke</span>
              </h1>
              <div className="absolute -inset-8 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
            </div>
            <p className="text-xl text-blue-100 drop-shadow-md mb-6">
              Your personal karaoke experience
            </p>
          </div>
        )}

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Search Results & Queue */}
          <div className="lg:col-span-4 space-y-6">
            {/* Search Bar - moved to left column */}
            <SearchBar onSearch={memoizedSearchSongs} isLoading={isSearching} />

            {queue.length > 0 && (
              <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent mb-2 drop-shadow-lg">
                  🎤 Queue
                </h2>
              </div>
            )}

            {/* Search Results - only show when there's an active search */}
            {searchQuery && (songs.length > 0 || isSearching || error) && (
              <SongResults
                songs={songs.slice(0, 3)}
                onSongSelect={handleSongSelect}
                isLoading={isSearching}
                error={error}
                onClearResults={handleClearSearchResults}
              />
            )}

            {/* Queue Sidebar */}
            {queue.length > 0 && (
              <QueueSidebar
                queue={queue}
                currentSongIndex={currentSongIndex}
                onPlaySong={playSong}
                onRemoveFromQueue={removeFromQueue}
                onReorderQueue={reorderQueue}
                onClearQueue={clearQueue}
                onNext={playNext}
                onPrevious={playPrevious}
              />
            )}
          </div>

          {/* Right Column - Video & Score */}
          {queue.length > 0 && (
            <div className="lg:col-span-8">
              <div className="relative">
                {currentSong ? (
                  <div className="space-y-6">
                    <VideoPlayer
                      currentSong={currentSong}
                      onVideoEnd={handleVideoEnd}
                      onNext={playNext}
                      onPrevious={playPrevious}
                      currentSongIndex={currentSongIndex}
                      queueLength={queue.length}
                    />
                  </div>
                ) : (
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 text-center">
                    <div className="text-6xl mb-4">🎵</div>
                    <h3 className="text-2xl font-bold text-white mb-2">Ready to Sing!</h3>
                    <p className="text-blue-100">Select a song from your queue to start</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Compact Queue for mobile */}
        {queue.length > 0 && (
          <div className="lg:hidden mt-6">
            <CompactQueue
              currentSong={currentSong}
              nextSongs={nextSongs}
              onNext={handleNextSong}
              onPrevious={playPrevious}
              currentSongIndex={currentSongIndex}
              queueLength={queue.length}
            />
          </div>
        )}
      </div>
    </div>
  );
}
