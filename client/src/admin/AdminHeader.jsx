import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, Bell, Sun, Moon, User, ExternalLink } from 'lucide-react';

export const AdminHeader = ({ setMobileOpen, unreadMessages = 0 }) => {
  const { admin, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = () => {
    const p = location.pathname.split('/')[2] || 'dashboard';
    return p.charAt(0).toUpperCase() + p.slice(1).replace('-', ' ');
  };

  return (
    <header className="h-16 bg-[#1f1f1f] border-b border-[#383838] px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg bg-[#282828] text-foreground hover:bg-[#333]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-mono hidden sm:inline-block">Admin /</span>
          <h2 className="font-heading font-bold text-base text-foreground">
            {getPageTitle()}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Go to Live Website Without Logging Out */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#fb8236]/15 text-[#fb8236] hover:bg-[#fb8236] hover:text-black transition-all text-xs font-semibold cursor-pointer shadow-sm"
          title="Open live website in a new tab without logging out of CMS panel"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>View Live Site</span>
        </a>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="w-9 h-9 rounded-xl bg-[#282828] border border-[#383838] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          {isDark ? <Sun className="w-4 h-4 text-[#f8af26]" /> : <Moon className="w-4 h-4 text-[#fb8236]" />}
        </button>

        {/* Notifications Icon with Badge */}
        <Link
          to="/admin/messages"
          className="relative w-9 h-9 rounded-xl bg-[#282828] border border-[#383838] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          title={`${unreadMessages} unread message(s)`}
        >
          <Bell className="w-4 h-4" />
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#fb8236] text-black font-extrabold text-[9px] flex items-center justify-center animate-pulse">
              {unreadMessages}
            </span>
          )}
        </Link>

        {/* User Badge - Displaying Hero Image */}
        <Link
          to="/admin/profile"
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#282828] border border-[#383838] hover:border-[#fb8236]/40 transition-colors"
        >
          <div className="w-7 h-7 rounded-full overflow-hidden bg-card shrink-0 ring-1 ring-[#fb8236]/30">
            <img
              src="/neeraj-profile.jpeg"
              alt="Admin"
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-foreground leading-tight truncate max-w-[120px]">
              {admin?.name || 'Administrator'}
            </div>
            <div className="text-[10px] text-muted-foreground font-mono uppercase">
              {admin?.role || 'Admin'}
            </div>
          </div>
        </Link>
      </div>
    </header>
  );
};
