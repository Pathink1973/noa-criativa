import { SpeechError } from './types';

export function createSpeechRecognitionError(message: string, originalError?: any): SpeechError {
  const error = new Error(message) as SpeechError;
  error.type = 'recognition';
  error.originalError = originalError;
  return error;
}

let recognition: SpeechRecognition | null = null;

function initializeRecognition(): SpeechRecognition {
  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    throw createSpeechRecognitionError('Speech recognition is not supported in this browser');
  }

  const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
  const newRecognition = new SpeechRecognitionConstructor();

  // Configure recognition
  newRecognition.continuous = true;
  newRecognition.interimResults = true;
  newRecognition.lang = 'pt-PT';

  return newRecognition;
}

let isListening = false;
let onResultCallback: ((event: SpeechRecognitionEvent) => void) | null = null;
let onEndCallback: (() => void) | null = null;

export async function startSpeechRecognition(
  onResult?: (event: SpeechRecognitionEvent) => void,
  onEnd?: () => void
): Promise<SpeechRecognition> {
  try {
    if (isListening && recognition) {
      recognition.stop();
      isListening = false;
    }

    recognition = initializeRecognition();
    onResultCallback = onResult || null;
    onEndCallback = onEnd || null;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      onResultCallback?.(event);
    };

    recognition.onend = () => {
      isListening = false;
      onEndCallback?.();
    };

    recognition.onerror = (event: SpeechRecognitionError) => {
      console.error('Speech recognition error:', event.error);
      isListening = false;
      onEndCallback?.();
    };

    recognition.start();
    isListening = true;
    return recognition;
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