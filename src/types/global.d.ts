interface Window {
  SpeechRecognition: any;
  webkitSpeechRecognition: any;
  chatbase: any;
}

interface SpeechRecognitionEvent extends Event {
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

interface SpeechRecognitionError extends Event {
  error: string;
  message: string;
}

declare const webkitSpeechRecognition: {
  new(): SpeechRecognition;
};