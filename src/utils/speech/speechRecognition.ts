import { SpeechError, SpeechRecognition, SpeechRecognitionError, SpeechRecognitionEvent } from './types';

export function createSpeechRecognitionError(message: string, originalError?: any): SpeechError {
  const error = new Error(message) as SpeechError;
  error.type = 'recognition';
  error.originalError = originalError;
  return error;
}

let recognition: SpeechRecognition | null = null;

function initializeRecognition(): SpeechRecognition {
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

export async function startSpeechRecognition(
  onResult?: (event: SpeechRecognitionEvent) => void,
  onEnd?: () => void
): Promise<SpeechRecognition> {
  try {
    if (isListening) {
      stopSpeechRecognition();
    }

    const recognitionInstance = initializeRecognition();
    onResultCallback = onResult || null;
    onEndCallback = onEnd || null;

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      onResultCallback?.(event);
    };

    recognitionInstance.onend = () => {
      isListening = false;
      onEndCallback?.();
    };

    recognitionInstance.onerror = (event: SpeechRecognitionError) => {
      console.error('Speech recognition error:', event.error);
      isListening = false;
      onEndCallback?.();
    };

    recognitionInstance.start();
    isListening = true;
    return recognitionInstance;
  } catch (error) {
    throw createSpeechRecognitionError('Failed to start speech recognition', error);
  }
}

export function stopSpeechRecognition(): void {
  if (recognition && isListening) {
    recognition.stop();
    isListening = false;
    onResultCallback = null;
    onEndCallback = null;
  }
}

export function isRecognitionActive(): boolean {
  return isListening;
}