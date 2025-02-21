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
  type: 'synthesis' | 'recognition';
  originalError?: any;
}

export interface SpeechState {
  isSpeaking: boolean;
  isListening: boolean;
  error: string | null;
}

export interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionError) => void;
  onend: () => void;
}

export interface SpeechRecognitionEvent extends Event {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
        confidence: number;
      };
    };
    length: number;
  };
}

export interface SpeechRecognitionError extends Event {
  error: string;
  message: string;
}