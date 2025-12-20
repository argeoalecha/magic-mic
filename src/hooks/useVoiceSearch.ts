import { useState, useCallback, useEffect, useRef } from 'react';

interface VoiceSearchState {
  isListening: boolean;
  transcript: string;
  error: string | null;
  isSupported: boolean;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

export const useVoiceSearch = (onTranscriptComplete?: (transcript: string) => void) => {
  const [state, setState] = useState<VoiceSearchState>({
    isListening: false,
    transcript: '',
    error: null,
    isSupported: false,
  });

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef<boolean>(true);

  // Check if Web Speech API is supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setState(prev => ({ ...prev, isSupported: true }));

      // Initialize speech recognition
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      // Handle results
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        const fullTranscript = (finalTranscript + interimTranscript).trim();

        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setState(prev => ({ ...prev, transcript: fullTranscript, error: null }));
        }

        // Reset silence timer
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }

        // Auto-complete after 1.5 seconds of silence
        if (finalTranscript) {
          silenceTimerRef.current = setTimeout(() => {
            // Check if component is still mounted and recognition is active
            if (isMountedRef.current && recognitionRef.current && fullTranscript && onTranscriptComplete) {
              onTranscriptComplete(fullTranscript);
              stopListening();
            }
          }, 1500);
        }
      };

      // Handle errors
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        let errorMessage = 'Voice recognition error';

        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.';
            break;
          case 'audio-capture':
            errorMessage = 'No microphone found. Please check your device.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please enable it in settings.';
            break;
          case 'network':
            errorMessage = 'Network error. Please check your connection.';
            break;
          default:
            errorMessage = `Error: ${event.error}`;
        }

        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setState(prev => ({
            ...prev,
            error: errorMessage,
            isListening: false,
          }));
        }
      };

      // Handle end
      recognition.onend = () => {
        // Only update state if component is still mounted
        if (isMountedRef.current) {
          setState(prev => ({ ...prev, isListening: false }));
        }
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      // Mark component as unmounted
      isMountedRef.current = false;

      // Clean up recognition
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }

      // Clear any pending timers
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    };
  }, [onTranscriptComplete]);

  const startListening = useCallback(() => {
    if (!state.isSupported || !recognitionRef.current || !isMountedRef.current) {
      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          error: 'Voice search is not supported in this browser. Please try Chrome.',
        }));
      }
      return;
    }

    try {
      setState(prev => ({
        ...prev,
        isListening: true,
        transcript: '',
        error: null,
      }));
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      if (isMountedRef.current) {
        setState(prev => ({
          ...prev,
          error: 'Failed to start voice recognition',
          isListening: false,
        }));
      }
    }
  }, [state.isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    if (isMountedRef.current) {
      setState(prev => ({ ...prev, isListening: false }));
    }
  }, []);

  const clearTranscript = useCallback(() => {
    if (isMountedRef.current) {
      setState(prev => ({ ...prev, transcript: '', error: null }));
    }
  }, []);

  return {
    isListening: state.isListening,
    transcript: state.transcript,
    error: state.error,
    isSupported: state.isSupported,
    startListening,
    stopListening,
    clearTranscript,
  };
};
