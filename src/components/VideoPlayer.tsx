import React from 'react';
import YouTube from 'react-youtube';
import type { YouTubeSong } from '@/types';

interface VideoPlayerProps {
  currentSong: YouTubeSong | null;
  onVideoEnd?: () => void;
  onVideoPlay?: () => void;
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

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ currentSong, onVideoEnd, onVideoPlay }) => {
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

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center border border-blue-200/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-t-3xl"></div>
      <div className="bg-gradient-to-r from-blue-500 to-sky-500 text-white p-4 rounded-2xl mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-3xl"></div>
        <h3 className="text-2xl font-bold relative z-10">🎵 Now Playing</h3>
        <p className="text-lg mt-2 font-medium relative z-10">{currentSong.title}</p>
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
