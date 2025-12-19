import React from 'react';
import YouTube from 'react-youtube';
import type { YouTubeSong } from '@/types';

interface VideoPlayerProps {
  currentSong: YouTubeSong | null;
  onVideoEnd?: () => void;
  onVideoPlay?: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  currentSongIndex?: number;
  queueLength?: number;
}

const NoSongState = () => (
  <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center border border-blue-200/30 relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-t-3xl"></div>
    <div className="py-16 text-gray-400">
      <div className="text-6xl mb-4">🎤</div>
      <h3 className="text-xl font-medium">Ready to sing?</h3>
      <p>Search for songs and add them to your queue!</p>
    </div>
  </div>
);

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentSong,
  onVideoEnd,
  onVideoPlay,
  onNext,
  onPrevious,
  currentSongIndex = 0,
  queueLength = 1
}) => {
  if (!currentSong) {
    return <NoSongState />;
  }

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      controls: 1,
    },
  };

  const isFirstSong = currentSongIndex === 0;
  const isLastSong = currentSongIndex >= queueLength - 1;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center border border-blue-200/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-t-3xl"></div>
      <div className="bg-gradient-to-r from-blue-500 to-sky-500 text-white p-4 rounded-2xl mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-3xl"></div>
        <div className="flex items-center justify-between relative z-10">
          <button
            onClick={onPrevious}
            disabled={isFirstSong}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              isFirstSong
                ? 'bg-white/20 text-white/40 cursor-not-allowed'
                : 'bg-white/30 text-white hover:bg-white/40 hover:scale-105'
            }`}
          >
            ⏮️ Prev
          </button>
          <div className="text-center flex-1">
            <h3 className="text-2xl font-bold">🎵 Now Playing</h3>
            <p className="text-lg mt-2 font-medium">{currentSong.title}</p>
          </div>
          <button
            onClick={onNext}
            disabled={isLastSong}
            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
              isLastSong
                ? 'bg-white/20 text-white/40 cursor-not-allowed'
                : 'bg-white/30 text-white hover:bg-white/40 hover:scale-105'
            }`}
          >
            Next ⏭️
          </button>
        </div>
      </div>
      <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
        <YouTube
          videoId={currentSong.id}
          opts={opts}
          onEnd={onVideoEnd}
          onPlay={onVideoPlay}
          className="w-full h-full"
        />
      </div>
      <div className="mt-6 bg-blue-50 p-4 rounded-2xl border border-blue-200/50">
        <p className="text-blue-700 font-medium">
          🎤 Grab your mic and start singing! Use YouTube controls for volume.
        </p>
      </div>
    </div>
  );
};
