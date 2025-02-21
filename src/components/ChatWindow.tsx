import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ isOpen, onClose }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      } transition-opacity duration-300`}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl h-[80vh] min-h-[500px] flex flex-col">
        <div className="flex items-center p-4 border-b">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-3"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-lg font-semibold text-gray-800">Chat Bot AI</h2>
        </div>
        <div className="flex-1 overflow-hidden">
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/3CBUxN2VRfbk16FIYaF16"
            width="100%"
            height="100%"
            frameBorder="0"
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;