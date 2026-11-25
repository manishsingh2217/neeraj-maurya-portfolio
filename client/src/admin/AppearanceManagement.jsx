import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { usePortfolio } from '../context/PortfolioContext';
import { Save, CheckCircle2, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

export const AppearanceManagement = () => {
  const { reloadPortfolio } = usePortfolio();
  const [appearance, setAppearance] = useState({
    primaryColor: '#fb8236',
    accentColor: '#f8af26',
    fontFamily: 'Space Grotesk',
    visibleSections: {
      hero: true,
      about: true,
      experience: true,
      projects: true,
      skills: true,
      education: true,
      certifications: true,
      contact: true
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchAppearance = async () => {
      try {
        setLoading(true);
        const res = await api.getAppearance();
        if (res.success && res.data) {
          setAppearance({
            primaryColor: res.data.primaryColor || '#fb8236',
            accentColor: res.data.accentColor || '#f8af26',
            fontFamily: res.data.fontFamily || 'Space Grotesk',
            visibleSections: res.data.visibleSections || {
              hero: true,
              about: true,
              experience: true,
              projects: true,
              skills: true,
              education: true,
              certifications: true,
              contact: true
            }
          });
        }
      } catch (err) {
        setToast({ type: 'error', message: err.message });
      } finally {
        setLoading(false);
      }
    };
    fetchAppearance();
  }, []);

  const handleSectionToggle = (key) => {
    setAppearance((prev) => ({
      ...prev,
      visibleSections: {
        ...prev.visibleSections,
        [key]: !prev.visibleSections[key]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.updateAppearance(appearance);
      if (res.success) {
        setToast({ type: 'success', message: 'Appearance settings updated successfully.' });
        reloadPortfolio();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const sectionLabels = {
    hero: 'Hero Section & Typewriter Headline',
    about: 'About Me & Key Highlights',
    experience: 'Where I’ve Worked (Timeline)',
    projects: 'Projects Worth a Look (Showcase)',
    skills: 'Toolkit & Skills Grid',
    education: 'Education & Academics',
    certifications: 'Verified Certifications',
    contact: 'Contact Form & Direct Inquiries'
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#fb8236] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Appearance & Layout Customization
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Customize font typography, color accents, and toggle visibility of individual portfolio sections.
        </p>
      </div>

      {toast.message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs sm:text-sm ${
            toast.type === 'success'
              ? 'bg-green-950/40 border border-green-500/30 text-green-300'
              : 'bg-red-950/40 border border-red-500/30 text-red-300'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-[#242424] border border-[#383838]/60 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
        {/* Color & Typography */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              HEADLINE FONT FAMILY
            </label>
            <select
              value={appearance.fontFamily}
              onChange={(e) => setAppearance({ ...appearance, fontFamily: e.target.value })}
              className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none"
            >
              <option value="Space Grotesk">Space Grotesk (Tech Geometric - Reference Default)</option>
              <option value="Inter">Inter (Modern Clean Sans)</option>
              <option value="Roboto Mono">Roboto Mono (Developer Code)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              PRIMARY GLOW & BUTTON COLOR
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={appearance.primaryColor}
                onChange={(e) => setAppearance({ ...appearance, primaryColor: e.target.value })}
                className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                value={appearance.primaryColor}
                onChange={(e) => setAppearance({ ...appearance, primaryColor: e.target.value })}
                className="w-full bg-[#171717] border border-[#383838] rounded-xl px-4 py-2 text-xs font-mono text-foreground outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section Visibility Toggles */}
        <div>
          <h3 className="font-heading font-bold text-base text-foreground mb-1">
            Section Visibility Toggles
          </h3>
          <p className="text-xs text-muted-foreground mb-4">
            Toggle which sections are rendered on the live public portfolio.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.keys(appearance.visibleSections || {}).map((secKey) => {
              const isVisible = appearance.visibleSections[secKey] !== false;
              return (
                <div
                  key={secKey}
                  onClick={() => handleSectionToggle(secKey)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isVisible
                      ? 'bg-[#1c1c1c] border-[#fb8236]/30 text-foreground'
                      : 'bg-[#181818] border-[#383838] text-muted-foreground opacity-60'
                  }`}
                >
                  <span className="text-xs font-semibold capitalize">
                    {sectionLabels[secKey] || secKey}
                  </span>
                  <div className="flex items-center gap-2">
                    {isVisible ? (
                      <span className="text-xs text-[#fb8236] font-semibold flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        Visible
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <EyeOff className="w-3.5 h-3.5" />
                        Hidden
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-[#383838]/50 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#fb8236] hover:bg-[#e84e1b] text-black font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-[#fb8236]/20 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Appearance</span>
          </button>
        </div>
      </form>
    </div>
  );
};
