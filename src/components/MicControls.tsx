import React, { useState } from 'react';
import { useMicrophone } from '@/hooks/useMicrophone';

interface MicControlsProps {
  onVolumeChange?: (volume: number) => void;
  onMuteToggle?: (isMuted: boolean) => void;
}

export const MicControls: React.FC<MicControlsProps> = ({ onVolumeChange, onMuteToggle }) => {
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const { isListening } = useMicrophone();

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    onVolumeChange?.(newVolume);
  };

  const handleMuteToggle = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    onMuteToggle?.(newMutedState);
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-blue-200/30 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-t-3xl"></div>

      <div className="flex items-center gap-4 mt-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-medium text-gray-800">Mic</span>
          {isListening && <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>}
        </div>

        <div className="flex-1 flex items-center gap-3">
          {/* Volume Slider */}
          <div className="flex-1 relative">
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
              disabled={isMuted}
              className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #0EA5E9 ${isMuted ? 0 : volume}%, #E5E7EB ${isMuted ? 0 : volume}%, #E5E7EB 100%)`,
              }}
            />
          </div>

          {/* Mute Button */}
          <button
            onClick={handleMuteToggle}
            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${
              isMuted ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isMuted ? 'Muted' : 'Mute'}
          </button>
        </div>
      </div>
    </div>
  );
};
