import OpenAI from 'openai';

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('OpenAI API key is not set in environment variables');
}

// Create OpenAI client
export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Flag to indicate if we're in demo mode
export const isDemo = false;

// Default message when needed
export function getDefaultMessage(): string {
  return "Olá! Como posso ajudar-te hoje?";
}