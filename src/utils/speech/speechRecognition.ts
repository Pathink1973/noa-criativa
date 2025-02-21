import { SpeechError, SpeechRecognition, SpeechRecognitionError, SpeechRecognitionEvent } from './types';

export function createSpeechRecognitionError(message: string, originalError?: any): SpeechError {
  const error = new Error(message) as SpeechError;
  error.type = 'recognition';
  error.originalError = originalError;
  return error;
}

let recognition: SpeechRecognition | null = null;

function initializeRecognition() {
  if (!recognition) {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      throw createSpeechRecognitionError('Speech recognition is not supported in this browser');
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    // Configure recognition
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pt-PT';
  }
  return recognition;
}

let isListening = false;
let onResultCallback: ((event: SpeechRecognitionEvent) => void) | null = null;
let onEndCallback: (() => void) | null = null;
let noSpeechTimeout: NodeJS.Timeout | null = null;

const TIMEOUT_DURATION = 5000; // 5 seconds timeout for no speech

export async function startSpeechRecognition(
  onResult?: (event: SpeechRecognitionEvent) => void,
  onEnd?: () => void
): Promise<SpeechRecognition> {
  try {
    const recognitionInstance = initializeRecognition();

    if (isListening) {
      return recognitionInstance;
    }

    // Reset callbacks
    onResultCallback = onResult || null;
    onEndCallback = onEnd || null;

    // Setup event handlers
    recognitionInstance.onstart = () => {
      console.log('Recognition started');
      isListening = true;
    };

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      if (noSpeechTimeout) {
        clearTimeout(noSpeechTimeout);
        noSpeechTimeout = null;
      }

      try {
        onResultCallback?.(event);
      } catch (error) {
        console.error('Error processing recognition result:', error);
        stopSpeechRecognition();
      }
    };

    recognitionInstance.onerror = (event: SpeechRecognitionError) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'not-allowed') {
        throw createSpeechRecognitionError('Microphone access denied');
      }
      stopSpeechRecognition();
    };

    recognitionInstance.onend = () => {
      console.log('Recognition ended');
      isListening = false;
      onEndCallback?.();
    };

    // Request microphone permission
    await navigator.mediaDevices.getUserMedia({ audio: true });

    // Start recognition
    recognitionInstance.start();

    // Set timeout for no speech
    noSpeechTimeout = setTimeout(() => {
      if (isListening) {
        console.log('No speech detected, stopping recognition');
        stopSpeechRecognition();
      }
    }, TIMEOUT_DURATION);

    return recognitionInstance;
  } catch (error) {
    console.error('Error starting speech recognition:', error);
    throw createSpeechRecognitionError(
      'Failed to start speech recognition',
      error
    );
  }
}

export function stopSpeechRecognition(): void {
  if (recognition && isListening) {
    if (noSpeechTimeout) {
      clearTimeout(noSpeechTimeout);
      noSpeechTimeout = null;
    }
    recognition.stop();
    isListening = false;
  }
}

export function isRecognitionActive(): boolean {
  return isListening;
}