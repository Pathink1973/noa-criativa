import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Mic, MicOff, MessageSquare } from 'lucide-react';
import { Message } from './utils/types';
import { getChatGPTResponse } from './utils/openai/chat';
import VoiceSphere from './components/VoiceSphere';
import LoadingState from './components/LoadingState';
import ErrorBoundary from './components/ErrorBoundary';
import Footer from './components/Footer';
import ChatWindow from './components/ChatWindow';
import { useVoiceState } from './hooks/useVoiceState';
import { setUserHasInteracted } from './utils/speech/speechSynthesis';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      text: "Olá! Sou a Noa, a tua assistente criativa. Precisas de inspiração, técnica ou um novo olhar sobre o teu projeto?", 
      isBot: true,
      timestamp: new Date().toLocaleString('pt-PT')
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceAmplitude, setVoiceAmplitude] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSpeechResult = async (text: string) => {
    if (!text.trim() || isProcessing) return;
    await handleSendMessage(text);
  };

  const { isListening, startListening, stopListening } = useVoiceState({
    onSpeechResult: handleSpeechResult,
    lastBotMessage: messages[messages.length - 1]?.text,
    onAmplitudeChange: setVoiceAmplitude
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isProcessing) return;
    setUserHasInteracted();
    await handleSendMessage(inputText);
    setInputText('');
  };

  const handleSendMessage = async (text: string) => {
    const newMessage: Message = {
      text,
      isBot: false,
      timestamp: new Date().toLocaleString('pt-PT')
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsProcessing(true);

    try {
      const response = await getChatGPTResponse(text, messages);
      const botMessage: Message = {
        text: response,
        isBot: true,
        timestamp: new Date().toLocaleString('pt-PT')
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        text: "Lamento, ocorreu um erro. Por favor, tenta novamente.",
        isBot: true,
        timestamp: new Date().toLocaleString('pt-PT')
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-purple via-primary-orange to-accent-pink">
      <ErrorBoundary>
        {/* Header */}
        <header className="sticky top-0 bg-white/95 backdrop-blur-lg border-b border-neutral-200/50 z-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-8 h-8 text-primary-purple animate-float" />
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-purple to-primary-orange bg-clip-text text-transparent">
                  NOA - Assistente Criativo AI
                </h1>
              </div>
              <button
                onClick={() => setIsChatOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-purple text-white rounded-xl hover:bg-accent-purple transition-colors"
              >
                <MessageSquare className="w-5 h-5" />
                <span className="hidden sm:inline">Chat Bot AI</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 pb-32">
          <div className="container mx-auto px-4 py-6">
            {/* Voice Sphere */}
            <div className="flex justify-center mb-8">
              <VoiceSphere 
                isActive={!isProcessing} 
                isSpeaking={isListening} 
                amplitude={voiceAmplitude}
              />
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 mb-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.isBot ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] p-3 sm:p-4 rounded-2xl ${
                      message.isBot
                        ? 'bg-white/95 backdrop-blur-sm text-neutral-900'
                        : 'bg-primary-purple text-white'
                    }`}
                  >
                    <p className="text-sm sm:text-base">{message.text}</p>
                    <p className="text-xs mt-2 opacity-70">
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="max-w-[85%] sm:max-w-[75%] p-3 sm:p-4 rounded-2xl bg-white/95 backdrop-blur-sm">
                    <LoadingState />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="fixed bottom-[84px] left-0 right-0 bg-white/95 backdrop-blur-lg p-4 border-t border-neutral-200/50">
              <div className="container mx-auto">
                <form onSubmit={handleTextSubmit} className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Digite a tua mensagem..."
                    className="flex-1 px-4 py-2 rounded-xl bg-white/50 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-transparent text-sm sm:text-base"
                    disabled={isProcessing}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setUserHasInteracted();
                      isListening ? stopListening() : startListening();
                    }}
                    disabled={isProcessing}
                    className={`p-2 rounded-xl transition-colors ${
                      isListening
                        ? 'bg-accent-pink text-white'
                        : 'bg-white/50 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {isListening ? <MicOff className="w-5 h-5 sm:w-6 sm:h-6" /> : <Mic className="w-5 h-5 sm:w-6 sm:h-6" />}
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing || !inputText.trim()}
                    className="p-2 rounded-xl bg-primary-purple text-white hover:bg-accent-purple transition-colors disabled:opacity-50"
                  >
                    <Send className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>

        <Footer />

        {/* Chat Window */}
        <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </ErrorBoundary>
    </div>
  );
}