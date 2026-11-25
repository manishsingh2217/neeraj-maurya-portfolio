import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { usePortfolio } from '../context/PortfolioContext';
import { Sun, Moon, Lock, Menu, X, ChevronRight } from 'lucide-react';

export const Navbar = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { settings, profile } = usePortfolio();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('skills');
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Scroll spy for active section on home page
      if (location.pathname === '/') {
        const sections = ['about', 'skills', 'experience', 'projects', 'education', 'certifications', 'contact'];
        for (const sec of sections) {
          const el = document.getElementById(sec);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 200 && rect.bottom >= 200) {
              setActiveSection(sec);
              break;
            }
          }
        }
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [location]);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Education', href: '#education' },
    { name: 'Certifications', href: '#certifications' },
    { name: 'Contact', href: '#contact' },
    { name: 'Resources', to: '/resources' }
  ];

  const handleNavClick = (e, item) => {
    if (item.href) {
      if (location.pathname !== '/') {
        window.location.href = `/${item.href}`;
      } else {
        e.preventDefault();
        const target = document.querySelector(item.href);
        if (target) {
          const yOffset = -70; // Account for fixed navbar height
          const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
          setActiveSection(item.href.replace('#', ''));
        }
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileMenuOpen
            ? 'bg-card/95 dark:bg-[#171717]/95 backdrop-blur-2xl border-b border-neutral-200/50 dark:border-[#222] shadow-lg py-2.5 sm:py-3'
            : 'bg-card/80 dark:bg-[#171717]/80 backdrop-blur-md border-b border-neutral-200/30 dark:border-[#1f1f1f] py-3 sm:py-4'
        }`}
      >
        <div className="max-w-[1560px] 2xl:max-w-[1680px] mx-auto px-3.5 sm:px-6 lg:px-8 xl:px-10 flex items-center justify-between">
          {/* Brand Avatar & Name */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group cursor-pointer shrink-0"
            onClick={() => {
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-muted/30 group-hover:scale-105 transition-transform shadow-md shrink-0">
              <img
                src={profile?.profileImage || '/neeraj-profile.jpeg'}
                alt={profile?.fullName || 'Neeraj Maurya'}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/neeraj-profile.jpeg';
                }}
              />
            </div>
            <span className="font-heading font-bold text-base sm:text-lg text-foreground tracking-tight hidden min-[380px]:inline-block">
              {profile?.fullName || 'Neeraj Maurya'}
            </span>
          </Link>

          {/* Desktop Links - Seamless Pill (lg:flex for proper tablet separation) */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-1.5 bg-card/90 dark:bg-[#1c1c1c]/90 p-1.5 rounded-full backdrop-blur-md shadow-md">
            {navLinks.map((item) => {
              const isActive =
                item.href && activeSection === item.href.replace('#', '') && location.pathname === '/';
              const isResourcesActive = item.to && location.pathname === '/resources';

              if (item.to) {
                return (
                  <Link
                    key={item.name}
                    to={item.to}
                    className={`px-3 xl:px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-1 ${
                      isResourcesActive
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              }

              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item)}
                  className={`px-3 xl:px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
          </div>

          {/* Utility Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-card dark:bg-[#222] border border-neutral-200/60 dark:border-[#2a2a2a] flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors cursor-pointer shadow-sm active:scale-95"
            >
              {isDark ? <Sun className="w-4 h-4 text-accent" /> : <Moon className="w-4 h-4 text-primary" />}
            </button>

            {/* Admin Login Link */}
            <Link
              to="/admin/login"
              title="Admin Login"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-card dark:bg-[#222] border border-neutral-200/60 dark:border-[#2a2a2a] flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors shadow-sm active:scale-95"
            >
              <Lock className="w-4 h-4" />
            </Link>

            {/* Mobile / Tablet Menu Button (lg:hidden) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
              className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-card dark:bg-[#222] border border-neutral-200/60 dark:border-[#2a2a2a] flex items-center justify-center text-foreground hover:border-primary/50 hover:text-primary transition-colors cursor-pointer shadow-sm active:scale-95"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-card/95 dark:bg-[#1a1a1a]/95 backdrop-blur-2xl border-t border-b border-neutral-200/50 dark:border-[#222] px-4 py-3 sm:px-6 shadow-2xl animate-in slide-in-from-top-2 duration-200 max-h-[calc(100vh-70px)] overflow-y-auto">
            <div className="space-y-1">
              {navLinks.map((item) => {
                const isActive =
                  item.href && activeSection === item.href.replace('#', '') && location.pathname === '/';
                const isResourcesActive = item.to && location.pathname === '/resources';
                const current = isActive || isResourcesActive;

                if (item.to) {
                  return (
                    <Link
                      key={item.name}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors min-h-[44px] ${
                        current
                          ? 'bg-primary/15 text-primary font-bold'
                          : 'text-foreground hover:bg-muted hover:text-primary'
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronRight className={`w-4 h-4 ${current ? 'text-primary' : 'text-muted-foreground'}`} />
                    </Link>
                  );
                }
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors min-h-[44px] ${
                      current
                        ? 'bg-primary/15 text-primary font-bold'
                        : 'text-foreground hover:bg-muted hover:text-primary'
                    }`}
                  >
                    <span>{item.name}</span>
                    <ChevronRight className={`w-4 h-4 ${current ? 'text-primary' : 'text-muted-foreground'}`} />
                  </a>
                );
              })}
            </div>

            <div className="pt-3 mt-2 border-t border-neutral-200/50 dark:border-[#222]">
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold bg-primary/10 text-primary hover:bg-primary/20 transition-colors min-h-[44px]"
              >
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </div>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Backdrop Overlay for mobile drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
};
