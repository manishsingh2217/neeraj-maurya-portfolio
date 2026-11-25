import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Download,
  Mail,
  Send,
  Linkedin,
  Github,
  Phone,
  Instagram,
  Facebook,
  Globe
} from 'lucide-react';

export const StickyProfileCard = () => {
  const { profile, socialLinks } = usePortfolio();

  const handleContactClick = (e) => {
    e.preventDefault();
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const fullName = profile?.fullName || 'Neeraj Maurya';
  const availabilityStatus = profile?.availabilityStatus || 'OPEN TO OPPORTUNITIES';
  const profileImage = profile?.profileImage || '/neeraj-profile.jpeg';
  const resumeDownloadUrl =
    profile?.resumeDriveUrl ||
    'https://drive.google.com/file/d/1B7x_neeraj_maurya_resume/view?usp=sharing';

  const getSocialIcon = (platform) => {
    const p = (platform || '').toLowerCase();
    if (p.includes('linkedin')) return <Linkedin className="w-4 h-4" />;
    if (p.includes('github')) return <Github className="w-4 h-4" />;
    if (p.includes('instagram') || p.includes('insta')) return <Instagram className="w-4 h-4" />;
    if (p.includes('facebook') || p.includes('fb')) return <Facebook className="w-4 h-4" />;
    if (p.includes('mail') || p.includes('email')) return <Mail className="w-4 h-4" />;
    if (p.includes('phone') || p.includes('tel')) return <Phone className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  // Fallback defaults if socialLinks array in db is empty
  const defaultSocials = [
    { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/neeraj-maurya' },
    { platform: 'GitHub', url: 'https://github.com/erneerajmaurya' },
    { platform: 'Instagram', url: 'https://www.instagram.com/erneerajmaurya/' },
    { platform: 'Facebook', url: 'https://www.facebook.com/erneerajmaurya' },
    { platform: 'Email', url: 'mailto:erneerajmaurya01@gmail.com' },
    { platform: 'Phone', url: 'tel:+919369279641' }
  ];

  const activeSocials = socialLinks && socialLinks.length > 0 ? socialLinks : defaultSocials;

  return (
    <aside className="w-full lg:w-80 xl:w-[22rem] shrink-0 self-start lg:sticky lg:top-24 z-20 transition-all duration-300 flex justify-center lg:block">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-none bg-card rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col items-center text-center relative overflow-hidden group">
        {/* Subtle Ambient Card Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Profile Avatar Frame - Seamless, centered & proportional on phone, tablet, and desktop */}
        <div className="w-full max-w-[260px] sm:max-w-[310px] lg:max-w-none aspect-[4/4.7] sm:h-80 lg:h-80 rounded-2xl overflow-hidden shadow-lg bg-muted/20 relative mx-auto">
          <img
            src={profileImage}
            alt={fullName}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/neeraj-profile.jpeg';
            }}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Availability Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase bg-primary/10 text-primary mt-4 sm:mt-5">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span>{availabilityStatus}</span>
        </div>

        {/* Name Only */}
        <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground mt-2.5 sm:mt-3 tracking-tight">
          {fullName}
        </h2>

        {/* Social Links Bar */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-3.5 sm:mt-4">
          {activeSocials.map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              title={item.platform}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-muted/60 hover:bg-primary hover:text-black dark:bg-[#222] dark:hover:bg-primary dark:hover:text-black flex items-center justify-center text-muted-foreground hover:scale-110 transition-all duration-200"
            >
              {getSocialIcon(item.platform)}
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="w-full grid grid-cols-2 gap-2 sm:gap-3 mt-5 pt-2">
          <a
            href={resumeDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-muted/60 hover:bg-muted text-foreground text-[11px] sm:text-xs font-semibold rounded-full px-2 sm:px-3 py-2.5 flex items-center justify-center gap-1 sm:gap-1.5 transition-all duration-200 shadow-sm cursor-pointer whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-primary shrink-0" />
            <span>Download CV</span>
          </a>
          <button
            onClick={handleContactClick}
            className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-bold text-[11px] sm:text-xs rounded-full px-2 sm:px-3 py-2.5 flex items-center justify-center gap-1 sm:gap-1.5 transition-all duration-200 shadow-md shadow-primary/25 cursor-pointer whitespace-nowrap"
          >
            <Send className="w-3.5 h-3.5 shrink-0" />
            <span>Contact Me</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
