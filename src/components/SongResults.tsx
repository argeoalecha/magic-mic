import React from 'react';
import type { YouTubeSong } from '@/types';

interface SongResultsProps {
  songs: YouTubeSong[];
  onSongSelect: (song: YouTubeSong) => void;
  isLoading: boolean;
  error: string;
  onClearResults?: () => void;
}

const LoadingState = () => (
  <div className="text-blue-600 italic text-lg animate-pulse">🔍 Searching for karaoke versions...</div>
);

const ErrorState = ({ error }: { error: string }) => (
  <div className="text-red-600 bg-red-50 p-6 rounded-2xl border border-red-200">
    <strong>Search failed:</strong> {error}
    <br />
    <small>Check your API key and internet connection.</small>
  </div>
);

const NoResultsState = () => (
  <div className="text-orange-600 bg-orange-50 p-6 rounded-2xl border border-orange-200">
    No karaoke songs found. Try a different search term!
  </div>
);

const Results = ({ songs, onSongSelect }: { songs: YouTubeSong[]; onSongSelect: (song: YouTubeSong) => void }) => (
  <div className="grid gap-3">
    {songs.map((song) => (
      <div
        key={song.id}
        className="p-4 bg-white/80 backdrop-blur-md border border-blue-200/50 rounded-2xl hover:bg-white/90 hover:border-blue-400/70 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-400/10 to-sky-400/10 rounded-bl-3xl transition-all duration-300 group-hover:from-blue-400/20 group-hover:to-sky-400/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="font-semibold text-base text-gray-900 mb-1 relative z-10 group-hover:text-blue-900 transition-colors duration-200">
          {song.title}
        </div>
        <div className="text-blue-600 text-sm mb-3 relative z-10 group-hover:text-blue-700 transition-colors duration-200">
          by {song.channelTitle}
        </div>
        <button
          onClick={() => onSongSelect(song)}
          className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-sky-500 text-white text-sm rounded-xl font-semibold hover:from-blue-600 hover:to-sky-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl relative z-10 group-hover:shadow-2xl"
        >
          ➕ Add to Queue
        </button>
      </div>
    ))}
  </div>
);

export const SongResults: React.FC<SongResultsProps> = ({ songs, onSongSelect, isLoading, error, onClearResults }) => {
  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState error={error} />;
    }

    if (songs.length === 0) {
      return <NoResultsState />;
    }

    return <Results songs={songs} onSongSelect={onSongSelect} />;
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-5 mb-6 border border-blue-200/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-t-3xl"></div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">🎵 Search Results</h3>
        {songs.length > 0 && onClearResults && (
          <button
            onClick={onClearResults}
            className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 hover:bg-red-50 rounded-xl transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
      {renderContent()}
    </div>
  );
};
