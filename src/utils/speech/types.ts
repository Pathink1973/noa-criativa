export interface SpeechConfig {
  lang: string;
  pitch: number;
  rate: number;
  volume: number;
}

export interface VoiceOptions {
  preferredLang: string;
  preferredGender?: 'female' | 'male';
}

export interface SpeechError extends Error {
  type: 'recognition' | 'synthesis';
  originalError?: any;
}

export interface SpeechState {
  isSpeaking: boolean;
  isListening: boolean;
  error: string | null;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

export interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
  item(index: number): SpeechRecognitionResult;
}

export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionError extends Event {
  error: string;
  message?: string;
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionError) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

// Note: Global declarations are in src/types/global.d.ts