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

export interface SpeechRecognitionResult extends Array<SpeechRecognitionAlternative> {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

export interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

export interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

export interface SpeechRecognitionError extends Event {
  error: string;
  message?: string;
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionError) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}