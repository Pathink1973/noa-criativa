import { SpeechConfig, SpeechError } from './types';
import { voiceManager } from './voiceManager';

let currentUtterance: SpeechSynthesisUtterance | null = null;
let isSpeaking = false;
let hasSpokenInitialGreeting = false;
let cachedVoice: SpeechSynthesisVoice | null = null;
let hasUserInteracted = false;

const defaultConfig: SpeechConfig = {
  lang: 'pt-PT',
  pitch: 1,
  rate: 1,
  volume: 1
};

export function setUserHasInteracted() {
  hasUserInteracted = true;
}

export function cancelSpeech() {
  if (currentUtterance || isSpeaking) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
    isSpeaking = false;
  }
}

function createSpeechError(message: string, originalError?: any): SpeechError {
  const error = new Error(message) as SpeechError;
  error.type = 'synthesis';
  error.originalError = originalError;
  return error;
}

function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/([.!?])\s*\1+/g, '$1')
    .trim();
}

async function initializeSpeechSynthesis(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      resolve(false);
      return;
    }

    if (window.speechSynthesis.getVoices().length > 0) {
      resolve(true);
      return;
    }

    window.speechSynthesis.onvoiceschanged = () => {
      resolve(true);
    };
  });
}

function getPortugueseVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;

  const voices = window.speechSynthesis.getVoices();
  
  // First try: Portuguese (European) female voice
  let portugueseVoice = voices.find(
    voice => voice.lang === 'pt-PT' && 
    (voice.name.toLowerCase().includes('female') || 
     voice.name.toLowerCase().includes('joana') ||
     voice.name.toLowerCase().includes('maria'))
  );
  
  // Second try: Any Portuguese (European) voice
  if (!portugueseVoice) {
    portugueseVoice = voices.find(voice => voice.lang === 'pt-PT');
  }
  
  // Third try: Any Portuguese voice
  if (!portugueseVoice) {
    portugueseVoice = voices.find(voice => voice.lang.startsWith('pt'));
  }
  
  if (portugueseVoice) {
    cachedVoice = portugueseVoice;
    return portugueseVoice;
  }

  return null;
}

export async function speak(text: string, config: Partial<SpeechConfig> = {}): Promise<void> {
  // Skip speech if user hasn't interacted yet
  if (!hasUserInteracted) {
    return;
  }

  try {
    const initialized = await initializeSpeechSynthesis();
    if (!initialized) {
      return;
    }

    const cleanedText = cleanText(text);
    if (!cleanedText) return;

    // Cancel any ongoing speech before starting new one
    cancelSpeech();

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    currentUtterance = utterance;

    const voice = getPortugueseVoice();
    if (voice) {
      utterance.voice = voice;
    }

    const finalConfig = { ...defaultConfig, ...config };
    utterance.lang = finalConfig.lang;
    utterance.pitch = finalConfig.pitch;
    utterance.rate = finalConfig.rate;
    utterance.volume = finalConfig.volume;

    return new Promise((resolve, reject) => {
      utterance.onend = () => {
        isSpeaking = false;
        currentUtterance = null;
        resolve();
      };

      utterance.onerror = (event) => {
        isSpeaking = false;
        currentUtterance = null;
        // Only log non-interrupted errors
        if (event.error !== 'interrupted') {
          console.error('Speech synthesis error:', event);
        }
        resolve(); // Resolve instead of reject for better error handling
      };

      try {
        isSpeaking = true;
        window.speechSynthesis.speak(utterance);
      } catch (error) {
        isSpeaking = false;
        currentUtterance = null;
        resolve(); // Resolve instead of reject for better error handling
      }
    });
  } catch (error) {
    // Silently handle errors without throwing
    return Promise.resolve();
  }
}

export function isSpeechActive(): boolean {
  return isSpeaking;
}

// Handle visibility changes
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && isSpeaking && currentUtterance) {
    window.speechSynthesis.resume();
  }
});

// Periodic check to prevent speech synthesis from getting stuck
setInterval(() => {
  if (isSpeaking && currentUtterance) {
    window.speechSynthesis.pause();
    window.speechSynthesis.resume();
  }
}, 5000);