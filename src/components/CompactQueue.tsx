import React from 'react';
import type { QueueItem } from '@/types';

interface CompactQueueProps {
  currentSong: QueueItem | null;
  nextSongs: QueueItem[];
  onNext: () => void;
  onPrevious: () => void;
  currentSongIndex: number;
  queueLength: number;
}

export const CompactQueue: React.FC<CompactQueueProps> = ({
  currentSong,
  nextSongs,
  onNext,
  onPrevious,
  currentSongIndex,
  queueLength,
}) => {
  if (!currentSong) return null;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-4 mb-4 border border-blue-200/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-t-2xl"></div>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-blue-600 mb-1">🎵 NOW PLAYING</div>
          <div className="font-semibold text-gray-900 truncate">{currentSong.title}</div>
          <div className="text-sm text-gray-600">{currentSong.channelTitle}</div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={onPrevious}
            disabled={currentSongIndex <= 0}
            className="px-3 py-2 bg-blue-100 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ⏮️
          </button>
          <span className="text-sm text-gray-500 px-2">
            {currentSongIndex + 1}/{queueLength}
          </span>
          <button
            onClick={onNext}
            disabled={currentSongIndex >= queueLength - 1}
            className="px-3 py-2 bg-blue-100 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ⏭️
          </button>
        </div>
      </div>

      {nextSongs.length > 0 && (
        <div className="mt-3 pt-3 border-t border-blue-100">
          <div className="text-xs text-gray-500 mb-2">UP NEXT:</div>
          <div className="flex gap-2 overflow-x-auto">
            {nextSongs.map((song, index) => (
              <div key={song.queueId} className="flex-shrink-0 bg-blue-50 px-3 py-2 rounded-xl border border-blue-200">
                <div className="text-xs font-medium text-gray-700 truncate w-32">
                  {index + 1}. {song.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
