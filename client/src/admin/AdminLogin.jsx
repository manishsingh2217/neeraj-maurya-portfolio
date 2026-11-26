import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Lock, Mail, Eye, EyeOff, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileImage, setProfileImage] = useState('/neeraj-profile.jpeg');

  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Dynamic fetch so hero image is always synchronized whenever updated in admin panel
    api.getProfile().then((res) => {
      if (res?.success && res?.data?.profileImage) {
        setProfileImage(res.data.profileImage);
      }
    }).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(email, password);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#171717] text-[#fafafa] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="ambient-glow" />

      <div className="w-full max-w-md bg-[#242424] border border-[#383838]/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 backdrop-blur-md">
        {/* Hero Section Profile Avatar - Auto-updates with profile photo changes */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl bg-[#1e1e1e] mb-3 ring-2 ring-[#fb8236]/40">
            <img
              src={profileImage}
              alt="Admin Profile"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/neeraj-profile.jpeg';
              }}
            />
          </div>
          <h1 className="font-heading font-bold text-2xl text-foreground tracking-tight">
            Admin Authentication
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Sign in to manage your portfolio content, projects, and messages
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              ADMIN EMAIL
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#171717] border border-[#333] focus:border-[#fb8236] focus:ring-0 focus:outline-none rounded-xl px-4 py-3 pl-10 text-sm text-foreground outline-none transition-colors"
                placeholder="nm9025127@gmail.com"
              />
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#171717] border border-[#333] focus:border-[#fb8236] focus:ring-0 focus:outline-none rounded-xl px-4 py-3 pl-10 pr-10 text-sm text-foreground outline-none transition-colors"
                placeholder="••••••••••••"
              />
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#fb8236] hover:bg-[#e84e1b] disabled:opacity-50 text-[#171717] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-[#fb8236]/20 flex items-center justify-center gap-2 cursor-pointer mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-[#383838]/60 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-[#fb8236] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
