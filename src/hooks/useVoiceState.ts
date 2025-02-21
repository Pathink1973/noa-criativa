import { useState, useEffect, useCallback, useRef } from 'react';
import { startSpeechRecognition, stopSpeechRecognition } from '../utils/speech/speechRecognition';
import { speak, cancelSpeech, isSpeechActive } from '../utils/speech/speechSynthesis';
import type { SpeechError } from '../utils/speech/types';

interface UseVoiceStateProps {
  onSpeechResult?: (text: string) => void;
  lastBotMessage?: string;
  onAmplitudeChange?: (amplitude: number) => void;
}

export function useVoiceState(props?: UseVoiceStateProps) {
  const { onSpeechResult, lastBotMessage, onAmplitudeChange } = props || {};
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isInitialMessage, setIsInitialMessage] = useState(true);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number>();

  const setupAudioAnalyser = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);

      const analyseAudio = () => {
        if (!analyserRef.current || !dataArrayRef.current || !onAmplitudeChange) return;
        
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        const amplitude = Array.from(dataArrayRef.current)
          .reduce((acc, val) => acc + val, 0) / dataArrayRef.current.length;
        
        onAmplitudeChange(amplitude / 128);
        animationFrameRef.current = requestAnimationFrame(analyseAudio);
      };

      analyseAudio();
    } catch (error) {
      console.error('Error setting up audio analyser:', error);
    }
  };

  useEffect(() => {
    if (lastBotMessage && !isListening && !isMuted) {
      if (isInitialMessage) {
        setIsInitialMessage(false);
        return;
      }

      speak(lastBotMessage)
        .catch((error: SpeechError) => {
          if (error.type === 'synthesis' && error.originalError?.error !== 'interrupted') {
            console.error('Speech synthesis error:', error);
          }
        });
    }
  }, [lastBotMessage, isListening, isMuted, isInitialMessage]);

  const startListening = useCallback(async () => {
    try {
      cancelSpeech();
      
      const recognition = await startSpeechRecognition(
        (event) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0].transcript)
            .join('');
          
          if (event.results[0].isFinal) {
            onSpeechResult?.(transcript);
            handleStopListening();
          }
        },
        () => setIsListening(false)
      );

      recognitionRef.current = recognition;
      setIsListening(true);
      await setupAudioAnalyser();
    } catch (error) {
      console.error('Error starting voice recognition:', error);
      setIsListening(false);
    }
  }, [onSpeechResult]);

  const handleStopListening = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    stopSpeechRecognition();
    setIsListening(false);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newState = !prev;
      if (!newState && isSpeechActive()) {
        cancelSpeech();
      }
      return newState;
    });
  }, []);

  useEffect(() => {
    return () => {
      handleStopListening();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [handleStopListening]);

  return {
    isListening,
    isMuted,
    startListening,
    stopListening: handleStopListening,
    toggleMute,
  };
}