import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-neutral-200/50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col xs:flex-row items-center justify-between gap-2">
          <p className="text-sm text-neutral-600 text-center">
            Patricio Brito©2025 . Dev Full Stack AI
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;