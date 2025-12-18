import { useState, useEffect, useRef, useCallback } from 'react';

interface AudioAnalysisData {
  pitch: number | null; // Fundamental frequency in Hz
  volume: number; // 0-100 volume level
  isActive: boolean; // Whether user is currently singing
}

export const useAudioAnalysis = () => {
  const [analysisData, setAnalysisData] = useState<AudioAnalysisData>({
    pitch: null,
    volume: 0,
    isActive: false,
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Float32Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Pitch detection using autocorrelation (simplified YIN algorithm)
  const detectPitch = useCallback((buffer: Float32Array, sampleRate: number): number | null => {
    const threshold = 0.2;
    const minFreq = 80; // Minimum human vocal frequency
    const maxFreq = 800; // Maximum frequency we care about for vocals

    const minPeriod = Math.floor(sampleRate / maxFreq);
    const maxPeriod = Math.floor(sampleRate / minFreq);

    let bestCorrelation = 0;
    let bestPeriod = 0;

    // Autocorrelation to find fundamental frequency
    for (let period = minPeriod; period < maxPeriod; period++) {
      let correlation = 0;
      for (let i = 0; i < buffer.length - period; i++) {
        correlation += buffer[i] * buffer[i + period];
      }

      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestPeriod = period;
      }
    }

    if (bestCorrelation > threshold) {
      return sampleRate / bestPeriod;
    }

    return null;
  }, []);

  // Calculate RMS volume
  const calculateVolume = useCallback((buffer: Float32Array): number => {
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i];
    }
    const rms = Math.sqrt(sum / buffer.length);
    return Math.min(100, Math.max(0, rms * 100 * 10)); // Scale and clamp to 0-100
  }, []);

  // Analysis loop
  const analyze = useCallback(() => {
    if (!analyserRef.current || !dataArrayRef.current || !audioContextRef.current) return;

    const analyser = analyserRef.current;
    const dataArray = dataArrayRef.current;

    analyser.getFloatTimeDomainData(dataArray);

    const volume = calculateVolume(dataArray);
    const pitch = volume > 5 ? detectPitch(dataArray, audioContextRef.current.sampleRate) : null;
    const isActive = volume > 8; // User is actively singing if volume > 8

    setAnalysisData({
      pitch,
      volume,
      isActive,
    });

    animationFrameRef.current = requestAnimationFrame(analyze);
  }, [calculateVolume, detectPitch]);

  const startAnalysis = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false,
        },
      });

      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);

      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      analyserRef.current.smoothingTimeConstant = 0.8;

      source.connect(analyserRef.current);

      const bufferLength = analyserRef.current.fftSize;
      dataArrayRef.current = new Float32Array(bufferLength);

      setIsAnalyzing(true);
      analyze();
    } catch (error) {
      console.error('Failed to start audio analysis:', error);
    }
  }, [analyze]);

  const stopAnalysis = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    dataArrayRef.current = null;
    setIsAnalyzing(false);

    setAnalysisData({
      pitch: null,
      volume: 0,
      isActive: false,
    });
  }, []);

  useEffect(() => {
    return () => {
      stopAnalysis();
    };
  }, [stopAnalysis]);

  return {
    ...analysisData,
    isAnalyzing,
    startAnalysis,
    stopAnalysis,
  };
};
