import { useState, useCallback, useRef, useEffect } from 'react';
import { useAudioAnalysis } from './useAudioAnalysis';

interface PerformanceMetrics {
  pitchAccuracy: number; // 0-100
  timingAccuracy: number; // 0-100
  volumeConsistency: number; // 0-100
  overallScore: number; // 0-100
}

interface SongNote {
  startTime: number; // seconds from song start
  duration: number; // note duration in seconds
  pitch: number; // expected frequency in Hz
  tolerance: number; // ±Hz tolerance for "correct" pitch
}

export const usePerformanceScoring = () => {
  const [score, setScore] = useState(0);
  const [isScoring, setIsScoring] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pitchAccuracy: 0,
    timingAccuracy: 0,
    volumeConsistency: 0,
    overallScore: 0,
  });

  const { pitch, volume, isActive, isAnalyzing, startAnalysis, stopAnalysis } = useAudioAnalysis();

  const scoringIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const metricsUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const songStartTimeRef = useRef<number>(0);
  const performanceHistoryRef = useRef<{
    pitchHits: number;
    pitchAttempts: number;
    volumeReadings: number[];
    timingPoints: number[];
    recentScores: number[];
    smoothedMetrics: PerformanceMetrics;
  }>({
    pitchHits: 0,
    pitchAttempts: 0,
    volumeReadings: [],
    timingPoints: [],
    recentScores: [],
    smoothedMetrics: {
      pitchAccuracy: 0,
      timingAccuracy: 0,
      volumeConsistency: 0,
      overallScore: 0,
    },
  });

  // Convert frequency to musical note (simplified)
  const frequencyToNote = useCallback((frequency: number): string => {
    const A4 = 440;
    const C4 = A4 * Math.pow(2, -9 / 12); // C4 is 9 semitones below A4

    if (frequency <= 0) return 'N/A';

    const semitoneFromC4 = Math.round(12 * Math.log2(frequency / C4));
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(semitoneFromC4 / 12) + 4;
    const noteIndex = ((semitoneFromC4 % 12) + 12) % 12;

    return `${noteNames[noteIndex]}${octave}`;
  }, []);

  // Generate simple expected pitch pattern (in real app, this would come from song data)
  const getExpectedPitch = useCallback((songTime: number): SongNote | null => {
    // Simplified: Generate a basic melody pattern
    // In reality, this would be loaded from song metadata/lyrics timing
    const baseFreq = 200; // Base frequency
    const pattern = [0, 2, 4, 2, 0, -2, 0]; // Simple melody in semitones
    const noteIndex = Math.floor(songTime) % pattern.length;
    const semitoneOffset = pattern[noteIndex];

    return {
      startTime: Math.floor(songTime),
      duration: 1,
      pitch: baseFreq * Math.pow(2, semitoneOffset / 12),
      tolerance: 50, // ±50 Hz tolerance
    };
  }, []);

  // Score the current performance sample
  const scorePerformance = useCallback(() => {
    const history = performanceHistoryRef.current;
    const songTime = (Date.now() - songStartTimeRef.current) / 1000;
    const expectedNote = getExpectedPitch(songTime);

    let pitchScore = 0;
    let timingScore = 0;
    let volumeScore = 0;

    // Pitch accuracy scoring
    if (isActive && pitch && expectedNote) {
      history.pitchAttempts++;
      const pitchDifference = Math.abs(pitch - expectedNote.pitch);

      if (pitchDifference <= expectedNote.tolerance) {
        history.pitchHits++;
        pitchScore = 100 - (pitchDifference / expectedNote.tolerance) * 30; // 70-100 points for good pitch
      } else if (pitchDifference <= expectedNote.tolerance * 2) {
        pitchScore = 40 - (pitchDifference / expectedNote.tolerance) * 20; // 20-40 points for close pitch
      }
    } else if (isActive && !pitch && expectedNote) {
      // User is trying to sing but no clear pitch detected
      history.pitchAttempts++;
      pitchScore = 10; // Minimal points for effort
    } else if (!isActive && !expectedNote) {
      // Correct silence
      pitchScore = 80;
    }

    // Volume consistency scoring
    if (volume > 0) {
      history.volumeReadings.push(volume);
      if (history.volumeReadings.length > 10) {
        history.volumeReadings.shift(); // Keep last 10 readings
      }

      // Score based on volume consistency and appropriate level
      const avgVolume = history.volumeReadings.reduce((a, b) => a + b, 0) / history.volumeReadings.length;
      const volumeVariance =
        history.volumeReadings.reduce((sum, v) => sum + Math.pow(v - avgVolume, 2), 0) / history.volumeReadings.length;

      volumeScore = Math.max(0, 100 - volumeVariance * 2); // Lower variance = higher score
      volumeScore *= avgVolume > 15 && avgVolume < 80 ? 1 : 0.7; // Penalty for too quiet or too loud
    }

    // Timing score (simplified - in real implementation, would sync with actual song timing)
    timingScore = isActive && expectedNote ? 85 : isActive ? 60 : 90;

    // Calculate weighted overall score
    const currentScore = Math.round(
      pitchScore * 0.5 + // 50% pitch accuracy
        timingScore * 0.3 + // 30% timing
        volumeScore * 0.2, // 20% volume control
    );

    // Update running averages
    history.recentScores.push(currentScore);
    if (history.recentScores.length > 20) {
      history.recentScores.shift();
    }

    const smoothedScore = history.recentScores.reduce((a, b) => a + b, 0) / history.recentScores.length;

    // Calculate current metrics but don't update display immediately
    const currentPitchAccuracy = history.pitchAttempts > 0 ? (history.pitchHits / history.pitchAttempts) * 100 : 0;

    // Store latest values for smoothed metrics update
    history.smoothedMetrics = {
      pitchAccuracy: currentPitchAccuracy,
      timingAccuracy: timingScore,
      volumeConsistency: volumeScore,
      overallScore: smoothedScore,
    };

    setScore(Math.round(smoothedScore * 10) / 10);
  }, [isActive, pitch, volume, getExpectedPitch]);

  // Smoothed metrics update - slower and more stable
  const updateMetricsDisplay = useCallback(() => {
    const history = performanceHistoryRef.current;
    const current = history.smoothedMetrics;
    const currentMetrics = metrics;

    // Smooth the transitions with exponential moving average
    const smoothingFactor = 0.3; // Adjust for more/less smoothing

    setMetrics({
      pitchAccuracy: currentMetrics.pitchAccuracy * (1 - smoothingFactor) + current.pitchAccuracy * smoothingFactor,
      timingAccuracy: currentMetrics.timingAccuracy * (1 - smoothingFactor) + current.timingAccuracy * smoothingFactor,
      volumeConsistency:
        currentMetrics.volumeConsistency * (1 - smoothingFactor) + current.volumeConsistency * smoothingFactor,
      overallScore: currentMetrics.overallScore * (1 - smoothingFactor) + current.overallScore * smoothingFactor,
    });
  }, [metrics]);

  const startScoring = useCallback(async () => {
    if (scoringIntervalRef.current) return;

    try {
      await startAnalysis();
      setIsScoring(true);
      songStartTimeRef.current = Date.now();

      // Reset performance history
      performanceHistoryRef.current = {
        pitchHits: 0,
        pitchAttempts: 0,
        volumeReadings: [],
        timingPoints: [],
        recentScores: [50], // Start at middle score
        smoothedMetrics: {
          pitchAccuracy: 0,
          timingAccuracy: 0,
          volumeConsistency: 0,
          overallScore: 50,
        },
      };

      setScore(50); // Start at neutral score

      // Score performance every 200ms for responsive feedback
      scoringIntervalRef.current = setInterval(scorePerformance, 200);

      // Update metrics display every 1 second for stability
      metricsUpdateIntervalRef.current = setInterval(updateMetricsDisplay, 1000);
    } catch (error) {
      console.error('Failed to start performance scoring:', error);
    }
  }, [startAnalysis, scorePerformance, updateMetricsDisplay]);

  const stopScoring = useCallback(() => {
    if (scoringIntervalRef.current) {
      clearInterval(scoringIntervalRef.current);
      scoringIntervalRef.current = null;
    }
    if (metricsUpdateIntervalRef.current) {
      clearInterval(metricsUpdateIntervalRef.current);
      metricsUpdateIntervalRef.current = null;
    }
    stopAnalysis();
    setIsScoring(false);
  }, [stopAnalysis]);

  const resetScore = useCallback(() => {
    setScore(0);
    setMetrics({
      pitchAccuracy: 0,
      timingAccuracy: 0,
      volumeConsistency: 0,
      overallScore: 0,
    });
    performanceHistoryRef.current = {
      pitchHits: 0,
      pitchAttempts: 0,
      volumeReadings: [],
      timingPoints: [],
      recentScores: [],
      smoothedMetrics: {
        pitchAccuracy: 0,
        timingAccuracy: 0,
        volumeConsistency: 0,
        overallScore: 0,
      },
    };
    stopScoring();
  }, [stopScoring]);

  // Smoothed debug info for development (updated less frequently)
  const [smoothedDebugInfo, setSmoothedDebugInfo] = useState({
    currentPitch: null as number | null,
    currentVolume: 0,
    isActive: false,
    currentNote: 'N/A',
    expectedNote: null as any,
  });

  // Update debug info every 500ms for readability
  useEffect(() => {
    if (!isScoring) return;

    const debugUpdateInterval = setInterval(() => {
      setSmoothedDebugInfo({
        currentPitch: pitch,
        currentVolume: volume,
        isActive,
        currentNote: pitch ? frequencyToNote(pitch) : 'N/A',
        expectedNote: getExpectedPitch((Date.now() - songStartTimeRef.current) / 1000),
      });
    }, 500);

    return () => clearInterval(debugUpdateInterval);
  }, [isScoring, pitch, volume, isActive, frequencyToNote, getExpectedPitch]);

  return {
    score,
    isScoring,
    metrics,
    startScoring,
    stopScoring,
    resetScore,
    debugInfo: smoothedDebugInfo, // Smoothed debug info
    isAnalyzing,
    songStartTime: songStartTimeRef.current,
  };
};
