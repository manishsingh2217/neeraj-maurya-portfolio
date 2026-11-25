import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { usePortfolio } from '../context/PortfolioContext';
import { Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export const WebsiteSettingsManagement = () => {
  const { reloadPortfolio } = usePortfolio();
  const [settings, setSettings] = useState({
    siteTitle: '',
    siteDescription: '',
    logoText: 'NM',
    primaryColor: '#fb8236',
    secondaryColor: '#f8af26',
    contactEmail: '',
    footerText: '',
    maintenanceMode: false,
    allowResumeDownload: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const res = await api.getSettings();
        if (res.success && res.data) {
          setSettings(res.data);
        }
      } catch (err) {
        setToast({ type: 'error', message: err.message });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.updateSettings(settings);
      if (res.success) {
        setToast({ type: 'success', message: 'Website settings updated successfully.' });
        reloadPortfolio();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
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
          Website Settings
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Configure site meta title, logo monogram, contact routing, and maintenance mode.
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

      <form onSubmit={handleSubmit} className="bg-[#242424] border border-[#383838]/60 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              WEBSITE TITLE
            </label>
            <input
              type="text"
              name="siteTitle"
              value={settings.siteTitle || ''}
              onChange={handleChange}
              className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              BRAND / LOGO MONOGRAM
            </label>
            <input
              type="text"
              name="logoText"
              maxLength={4}
              value={settings.logoText || 'NM'}
              onChange={handleChange}
              placeholder="NM"
              className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none uppercase font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              PRIMARY THEME ACCENT COLOR
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="primaryColor"
                value={settings.primaryColor || '#fb8236'}
                onChange={handleChange}
                className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                name="primaryColor"
                value={settings.primaryColor || '#fb8236'}
                onChange={handleChange}
                className="w-full bg-[#171717] border border-[#383838] rounded-xl px-4 py-2 text-xs font-mono text-foreground outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              SECONDARY ACCENT COLOR
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                name="secondaryColor"
                value={settings.secondaryColor || '#f8af26'}
                onChange={handleChange}
                className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
              />
              <input
                type="text"
                name="secondaryColor"
                value={settings.secondaryColor || '#f8af26'}
                onChange={handleChange}
                className="w-full bg-[#171717] border border-[#383838] rounded-xl px-4 py-2 text-xs font-mono text-foreground outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
            WEBSITE META DESCRIPTION
          </label>
          <textarea
            name="siteDescription"
            rows="2"
            value={settings.siteDescription || ''}
            onChange={handleChange}
            className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-xs text-foreground outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
            FOOTER COPYRIGHT TEXT
          </label>
          <input
            type="text"
            name="footerText"
            value={settings.footerText || ''}
            onChange={handleChange}
            className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-xs text-foreground outline-none font-mono"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 pt-3 border-t border-[#383838]/50">
          <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer">
            <input
              type="checkbox"
              name="allowResumeDownload"
              checked={settings.allowResumeDownload !== false}
              onChange={handleChange}
              className="rounded border-[#383838] text-[#fb8236] focus:ring-[#fb8236] bg-[#171717]"
            />
            <span>Allow Public Resume PDF Download</span>
          </label>

          <label className="flex items-center gap-2.5 text-xs text-foreground cursor-pointer">
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={settings.maintenanceMode === true}
              onChange={handleChange}
              className="rounded border-[#383838] text-red-500 focus:ring-red-500 bg-[#171717]"
            />
            <span className="text-red-400">Enable Maintenance Mode</span>
          </label>
        </div>

        <div className="pt-4 border-t border-[#383838]/50 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#fb8236] hover:bg-[#e84e1b] text-black font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-[#fb8236]/20 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
