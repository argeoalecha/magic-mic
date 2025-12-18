import { useState, useEffect, useRef } from 'react';

interface UseMicrophoneReturn {
  isListening: boolean;
  startListening: () => Promise<void>;
  stopListening: () => void;
  stream: MediaStream | null;
  error: string | null;
}

export const useMicrophone = (): UseMicrophoneReturn => {
  const [isListening, setIsListening] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startListening = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setIsListening(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to access microphone';
      setError(errorMessage);
      console.error('Error accessing microphone:', err);
    }
  };

  const stopListening = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setStream(null);
    }
    setIsListening(false);
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return {
    isListening,
    startListening,
    stopListening,
    stream,
    error,
  };
};
