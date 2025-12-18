import React from 'react';
import type { QueueItem } from '@/types';
import { DraggableQueueItem } from './DraggableQueueItem';

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

export const QueueSidebar: React.FC<QueueSidebarProps> = ({
  queue,
  currentSongIndex,
  onPlaySong,
  onRemoveFromQueue,
  onReorderQueue,
  onClearQueue,
  onNext,
  onPrevious,
}) => {
  const currentSong = currentSongIndex >= 0 ? queue[currentSongIndex] : null;

  const handleDrop = (fromIndex: number, toIndex: number) => {
    if (fromIndex !== toIndex) {
      onReorderQueue(fromIndex, toIndex);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-blue-200/30 lg:sticky top-4 max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col min-h-[400px] relative">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-t-3xl"></div>
      <div className="flex items-center justify-between mb-6 mt-2">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center">🎵 Queue ({queue.length})</h3>
        {queue.length > 0 && (
          <button
            onClick={onClearQueue}
            className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 hover:bg-red-50 rounded-xl transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {queue.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">🎤</div>
          <p>No songs in queue</p>
          <p className="text-sm">Search and add songs to get started!</p>
        </div>
      ) : (
        <div className="space-y-4 flex-1 overflow-hidden">
          {/* Current Song */}
          {currentSong && (
            <div className="bg-gradient-to-r from-blue-500 to-sky-500 text-white p-4 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-bl-2xl"></div>
              <div className="text-sm font-medium mb-1 relative z-10">▶️ NOW PLAYING</div>
              <div className="font-semibold text-sm truncate relative z-10">{currentSong.title}</div>
              <div className="text-xs opacity-90 relative z-10">{currentSong.channelTitle}</div>
              <div className="flex gap-2 mt-3 relative z-10">
                <button
                  onClick={onPrevious}
                  disabled={currentSongIndex <= 0}
                  className="px-3 py-1 bg-white/20 rounded-lg text-xs hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ⏮️ Prev
                </button>
                <button
                  onClick={onNext}
                  disabled={currentSongIndex >= queue.length - 1}
                  className="px-3 py-1 bg-white/20 rounded-lg text-xs hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ⏭️ Next
                </button>
              </div>
            </div>
          )}

          {/* All Queue Items - Draggable */}
          <div>
            <div className="text-sm font-medium text-gray-600 mb-2 flex items-center">
              📋 FULL QUEUE
              <span className="text-xs text-gray-400 ml-2">(Drag to reorder)</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1 min-h-0">
              {queue.map((song, index) => (
                <DraggableQueueItem
                  key={song.queueId}
                  song={song}
                  index={index}
                  isCurrentSong={index === currentSongIndex}
                  onPlay={onPlaySong}
                  onRemove={onRemoveFromQueue}
                  onDrop={handleDrop}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
