import React, { useState, useEffect } from 'react';
import { Mail, ArrowUp } from 'lucide-react';

export const FloatingActionButton = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex flex-col gap-2.5 sm:gap-3">
      {/* Scroll to Top (Appears after scrolling) */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="w-11 h-11 rounded-full bg-[#242424] hover:bg-[#2e2e2e] border border-[#383838] text-foreground flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-110"
        >
          <ArrowUp className="w-5 h-5 text-muted-foreground" />
        </button>
      )}

      {/* Primary Mail FAB */}
      <button
        onClick={scrollToContact}
        aria-label="Contact Neeraj Maurya"
        className="w-12 h-12 rounded-full bg-[#fb8236] hover:bg-[#e84e1b] text-[#171717] flex items-center justify-center shadow-xl shadow-[#fb8236]/30 transition-all duration-200 hover:scale-110 active:scale-95"
      >
        <Mail className="w-5 h-5" />
      </button>
    </div>
  );
};
