import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowUp, Heart } from 'lucide-react';

export const Footer = () => {
  const { settings, profile } = usePortfolio();
  const currentYear = new Date().getFullYear();
  const fullName = profile?.fullName || 'Neeraj Maurya';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-8 sm:py-10 px-3.5 sm:px-6 lg:px-8 mt-12 sm:mt-16 bg-card/40 backdrop-blur-md text-muted-foreground text-xs border-t border-neutral-200/50 dark:border-[#222]">
      <div className="max-w-[1560px] 2xl:max-w-[1680px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-mono text-center sm:text-left text-[11px] sm:text-xs">
            {settings?.footerText || `${fullName} · © ${currentYear} — All rights reserved.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <a
            href="https://www.linkedin.com/in/neeraj-maurya"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#fb8236] transition-colors"
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/erneerajmaurya"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#fb8236] transition-colors"
          >
            GitHub
          </a>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-[#fb8236] transition-colors font-semibold cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
