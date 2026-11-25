import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Info,
  Code,
  Briefcase,
  FolderKanban,
  GraduationCap,
  Award,
  FileText,
  FolderDown,
  MessageSquare,
  Share2,
  Palette,
  Search,
  Settings,
  Users,
  History,
  Database,
  ExternalLink,
  LogOut,
  X
} from 'lucide-react';

export const AdminSidebar = ({ mobileOpen, setMobileOpen, unreadMessages = 0 }) => {
  const { logout, isSuperAdmin, admin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/admin/profile', icon: User },
    { name: 'About', path: '/admin/about', icon: Info },
    { name: 'Skills', path: '/admin/skills', icon: Code },
    { name: 'Experience', path: '/admin/experience', icon: Briefcase },
    { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
    { name: 'Education', path: '/admin/education', icon: GraduationCap },
    { name: 'Certifications', path: '/admin/certifications', icon: Award },
    { name: 'Resources', path: '/admin/resources', icon: FolderDown },
    { name: 'Resume', path: '/admin/resume', icon: FileText },
    {
      name: 'Messages',
      path: '/admin/messages',
      icon: MessageSquare,
      badge: unreadMessages > 0 ? unreadMessages : null
    },
    { name: 'Social Links', path: '/admin/social-links', icon: Share2 },
    { name: 'Appearance', path: '/admin/appearance', icon: Palette },
    { name: 'SEO Settings', path: '/admin/seo', icon: Search },
    { name: 'Website Settings', path: '/admin/settings', icon: Settings },
    ...(isSuperAdmin
      ? [{ name: 'Admin Users', path: '/admin/users', icon: Users }]
      : []),
    { name: 'Activity Logs', path: '/admin/activity-logs', icon: History },
    ...(isSuperAdmin
      ? [{ name: 'Backup & Restore', path: '/admin/backup', icon: Database }]
      : [])
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#1f1f1f] border-r border-[#383838] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div>
          <div className="h-16 px-5 border-b border-[#383838] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden bg-card shrink-0 ring-1 ring-[#fb8236]/40 shadow-sm">
                <img
                  src="/neeraj-profile.jpeg"
                  alt="Neeraj Maurya"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div>
                <h1 className="font-heading font-bold text-sm text-foreground tracking-tight">
                  Admin Panel
                </h1>
                <p className="text-[10px] text-muted-foreground font-mono">
                  {admin?.role || 'Administrator'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links Scrollable */}
          <div className="px-3 py-4 space-y-1 max-h-[calc(100vh-140px)] overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                      isActive
                        ? 'bg-[#fb8236]/15 text-[#fb8236] border border-[#fb8236]/30 shadow-sm'
                        : 'text-[#a3a3a3] hover:text-foreground hover:bg-[#282828]'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fb8236] text-black">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-[#383838] space-y-2 bg-[#1a1a1a]">
          {/* Go to live website WITHOUT logging out */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-[#fb8236]/15 text-[#fb8236] hover:bg-[#fb8236] hover:text-black transition-all cursor-pointer shadow-sm"
            title="Open live website in a new tab without logging out of CMS panel"
          >
            <div className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 shrink-0" />
              <span>View Live Website</span>
            </div>
            <span className="text-[10px] font-mono opacity-80">New Tab ↗</span>
          </a>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-[#282828] transition-colors text-left cursor-pointer"
            title="Log out from admin panel and return to live website"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Logout & Return Home</span>
          </button>
        </div>
      </aside>
    </>
  );
};
