export interface Message {
  text: string;
  isBot: boolean;
  timestamp: string;
}

export interface VoiceState {
  isListening: boolean;
  isMuted: boolean;
  amplitude: number;
}
