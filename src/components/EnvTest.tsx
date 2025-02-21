import { useEffect } from 'react';

export default function EnvTest() {
  useEffect(() => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    console.log('API Key exists:', !!apiKey);
    console.log('API Key length:', apiKey?.length || 0);
  }, []);

  return null;
}
