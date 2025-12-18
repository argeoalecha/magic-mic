import React from 'react';
import type { QueueItem } from '@/types';

interface DraggableQueueItemProps {
  song: QueueItem;
  index: number;
  isCurrentSong: boolean;
  onPlay: (queueId: string) => void;
  onRemove: (queueId: string) => void;
  onDrop: (fromIndex: number, toIndex: number) => void;
}

export const DraggableQueueItem: React.FC<DraggableQueueItemProps> = ({
  song,
  index,
  isCurrentSong,
  onPlay,
  onRemove,
  onDrop,
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    onDrop(fromIndex, index);
  };

  const itemClasses = isCurrentSong
    ? 'bg-purple-200 border-purple-400 shadow-md'
    : 'bg-gray-50 hover:bg-gray-100 border-gray-200 hover:border-gray-300';

  const textClasses = isCurrentSong ? 'text-purple-800' : 'text-gray-700';

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`p-3 rounded-lg border group cursor-move transition-all duration-200 ${itemClasses}`}
    >
      <div className="flex items-center justify-between">
        <button onClick={() => onPlay(song.queueId)} className="flex-1 text-left min-w-0">
          <div className={`font-medium truncate text-sm ${textClasses}`}>
            <span className="text-gray-400 mr-2">⋮⋮</span>
            {index + 1}. {song.title}
          </div>
          <div className="text-xs text-purple-600 mt-1">{song.channelTitle}</div>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(song.queueId);
          }}
          className="opacity-0 group-hover:opacity-100 ml-2 text-red-500 hover:text-red-700 p-1 transition-opacity"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
