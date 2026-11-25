import React, { useState, useEffect } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { ArrowRight, Terminal, BarChart2, Database, FileSpreadsheet } from 'lucide-react';

export const HeroSection = () => {
  const { profile } = usePortfolio();
  const words = profile?.heroTypingWords || [
    'Data Analyst',
    'MIS Executive',
    'Business Intelligence Specialist',
    'Computer Science Graduate'
  ];

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[currentWordIndex] || 'Data Analyst';
    const typingSpeed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setCurrentText(word.substring(0, currentText.length + 1));
        if (currentText === word) {
          setTimeout(() => setIsDeleting(true), 1600);
        }
      } else {
        setCurrentText(word.substring(0, currentText.length - 1));
        if (currentText === '') {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words]);

  const fullName = profile?.fullName || 'Neeraj Maurya';
  const bioSummary =
    profile?.bioSummary ||
    'Computer Science and Engineering graduate with practical experience in MIS reporting, data analysis, business intelligence, and technical operations. Proficient in Python, SQL, Advanced Excel, and Power BI.';

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative pb-8 sm:pb-10">
      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-[#fb8236]/15 text-[#fb8236] mb-4 sm:mb-5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#fb8236]" />
        <span>SAY HELLO</span>
      </div>

      {/* Main Headline H1: Name Line */}
      <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
        I'm {fullName}
      </h1>

      {/* Typewriter Animation - Running directly below the name with wrap safety */}
      <div className="mt-2 sm:mt-3 flex flex-wrap items-baseline min-h-[34px] sm:min-h-[46px]">
        <span className="font-heading text-xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#fb8236] via-[#f8af26] to-[#fb8236] break-words">
          {currentText}
        </span>
        <span className="font-heading text-xl sm:text-3xl md:text-4xl text-[#fb8236] animate-pulse ml-0.5 font-bold">
          |
        </span>
      </div>

      <p className="text-sm sm:text-lg text-muted-foreground font-medium mt-1">
        Based in {profile?.location || 'India'}.
      </p>

      {/* Narrative Bio */}
      <p className="mt-4 sm:mt-5 text-xs sm:text-base text-muted-foreground leading-relaxed max-w-2xl font-normal">
        {bioSummary}
      </p>

      {/* Technical Focus Chips */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mt-6 sm:mt-8">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-card text-foreground shadow-sm">
          <Terminal className="w-3.5 h-3.5 text-primary" />
          <span>Python</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-card text-foreground shadow-sm">
          <Database className="w-3.5 h-3.5 text-accent" />
          <span>SQL</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-card text-foreground shadow-sm">
          <BarChart2 className="w-3.5 h-3.5 text-primary" />
          <span>Power BI</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-card text-foreground shadow-sm">
          <FileSpreadsheet className="w-3.5 h-3.5 text-accent" />
          <span>Advanced Excel</span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-3.5 mt-7 sm:mt-8">
        <button
          onClick={() => handleScroll('projects')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-xs tracking-wide uppercase transition-all duration-200 shadow-lg shadow-primary/25 cursor-pointer active:scale-95 text-center"
        >
          <span>Explore Projects</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleScroll('contact')}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-muted/60 hover:bg-muted text-foreground font-semibold text-xs tracking-wide uppercase transition-all duration-200 cursor-pointer shadow-sm active:scale-95 text-center"
        >
          <span>Get In Touch</span>
        </button>
      </div>
    </section>
  );
};
