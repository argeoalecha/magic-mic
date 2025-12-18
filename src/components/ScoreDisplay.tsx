import React, { useState, useEffect, useRef } from 'react';
import { useSpring, animated } from 'react-spring';

interface PerformanceMetrics {
  pitchAccuracy: number;
  timingAccuracy: number;
  volumeConsistency: number;
  overallScore: number;
}

interface ScoreDisplayProps {
  score: number;
  onNextSong: () => void;
  isNextDisabled: boolean;
  metrics?: PerformanceMetrics;
  debugInfo?: Record<string, unknown>;
  songStartTime?: number; // Timestamp when song started
}

const motivationalMessages = ['🌟 Amazing!', '🎵 Great job!', '👍 Good effort!', '🎤 Keep singing!'];

const getMotivationalMessage = (score: number, songTimeSeconds: number) => {
  // For first 10 seconds or scores below 60, always show "Keep singing"
  if (songTimeSeconds < 10 || score < 60) {
    return motivationalMessages[3]; // Keep singing!
  }

  if (score >= 90) {
    return motivationalMessages[0]; // Amazing!
  }
  if (score >= 75) {
    return motivationalMessages[1]; // Great job!
  }
  if (score >= 60) {
    return motivationalMessages[2]; // Good effort!
  }

  // Fallback (should not reach here due to first condition)
  return motivationalMessages[3]; // Keep singing!
};

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  onNextSong,
  isNextDisabled,
  metrics,
  debugInfo,
  songStartTime,
}) => {
  const { number } = useSpring({ from: { number: 0 }, number: score, delay: 200 });

  // Stable message management
  const [currentMessage, setCurrentMessage] = useState('🎤 Keep singing!');
  const [songTimeSeconds, setSongTimeSeconds] = useState(0);
  const lastScoreRangeRef = useRef(-1);
  const messageUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Update song time every second
  useEffect(() => {
    if (!songStartTime) return;

    const updateTimer = setInterval(() => {
      setSongTimeSeconds((Date.now() - songStartTime) / 1000);
    }, 1000);

    return () => clearInterval(updateTimer);
  }, [songStartTime]);

  // Update message based on score and song time
  useEffect(() => {
    const currentRange = Math.floor(score / 15);

    if (currentRange !== lastScoreRangeRef.current || songTimeSeconds < 10) {
      lastScoreRangeRef.current = currentRange;

      // Clear any existing timeout
      if (messageUpdateTimeoutRef.current) {
        clearTimeout(messageUpdateTimeoutRef.current);
      }

      // Update message immediately for first 10 seconds, with delay otherwise
      const delay = songTimeSeconds < 10 ? 0 : 1000;
      messageUpdateTimeoutRef.current = setTimeout(() => {
        setCurrentMessage(getMotivationalMessage(score, songTimeSeconds));
      }, delay);
    }

    return () => {
      if (messageUpdateTimeoutRef.current) {
        clearTimeout(messageUpdateTimeoutRef.current);
      }
    };
  }, [score, songTimeSeconds]);

  return (
    <div className="space-y-4">
      {/* Main Score Display */}
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-blue-200/30 relative overflow-hidden min-w-[200px]">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-t-3xl"></div>

        <div className="text-center mb-6 mt-2">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Live Score</h3>
          <animated.div className="text-6xl font-bold text-blue-600 mb-2">
            {number.to((n) => n.toFixed(1))}
          </animated.div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-sky-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(score, 100)}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 transition-all duration-300">{currentMessage}</p>
        </div>

        <button
          onClick={onNextSong}
          disabled={isNextDisabled}
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-sky-500 text-white rounded-2xl font-semibold hover:from-blue-600 hover:to-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          Next Song
        </button>
      </div>

      {/* Performance Metrics */}
      {metrics && (
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-4 border border-blue-200/30 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-emerald-400 rounded-t-3xl"></div>
          <h4 className="text-lg font-bold text-gray-800 mb-3 mt-1">Performance</h4>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-sm">
                <span>🎵 Pitch</span>
                <span className="font-semibold">{metrics.pitchAccuracy.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(metrics.pitchAccuracy, 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span>⏱️ Timing</span>
                <span className="font-semibold">{metrics.timingAccuracy.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(metrics.timingAccuracy, 100)}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span>🔊 Volume</span>
                <span className="font-semibold">{metrics.volumeConsistency.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(metrics.volumeConsistency, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Debug Info (Development Only) */}
      {debugInfo && (
        <div className="bg-gray-900 text-green-400 rounded-2xl p-3 text-xs font-mono">
          <div>🎵 Pitch: {(debugInfo.currentPitch as any) ? (debugInfo.currentPitch as any).toFixed(1) + 'Hz' : 'N/A'}</div>
          <div>📝 Note: {debugInfo.currentNote as React.ReactNode}</div>
          <div>🔊 Volume: {((debugInfo.currentVolume as any) || 0).toFixed(1)}</div>
          <div>🎤 Active: {(debugInfo.isActive as any) ? '✅' : '❌'}</div>
          {(debugInfo.expectedNote as any) && (<div>🎯 Target: {((debugInfo.expectedNote as any)?.pitch || 0).toFixed(1)}Hz</div>)}
        </div>
      )}
    </div>
  );
};
