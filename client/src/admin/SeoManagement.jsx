import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { usePortfolio } from '../context/PortfolioContext';
import { Save, CheckCircle2, AlertCircle, Loader2, Globe } from 'lucide-react';

export const SeoManagement = () => {
  const { reloadPortfolio } = usePortfolio();
  const [seo, setSeo] = useState({
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    canonicalUrl: '',
    robots: 'index, follow'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchSeo = async () => {
      try {
        setLoading(true);
        const res = await api.getSeo();
        if (res.success && res.data) {
          setSeo(res.data);
        }
      } catch (err) {
        setToast({ type: 'error', message: err.message });
      } finally {
        setLoading(false);
      }
    };
    fetchSeo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.updateSeo(seo);
      if (res.success) {
        setToast({ type: 'success', message: 'SEO and Social Open Graph metadata updated successfully.' });
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
          SEO & Social Metadata Management
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Configure search engine optimization meta tags, keywords, and Open Graph previews for LinkedIn & Twitter.
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
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
            PAGE META TITLE
          </label>
          <input
            type="text"
            name="metaTitle"
            value={seo.metaTitle || ''}
            onChange={handleChange}
            className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
            META DESCRIPTION
          </label>
          <textarea
            name="metaDescription"
            rows="3"
            value={seo.metaDescription || ''}
            onChange={handleChange}
            className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-xs text-foreground outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
            META KEYWORDS (COMMA SEPARATED)
          </label>
          <input
            type="text"
            name="metaKeywords"
            value={seo.metaKeywords || ''}
            onChange={handleChange}
            className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              OPEN GRAPH TITLE (SOCIAL SHARING)
            </label>
            <input
              type="text"
              name="ogTitle"
              value={seo.ogTitle || ''}
              onChange={handleChange}
              className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              CANONICAL URL
            </label>
            <input
              type="url"
              name="canonicalUrl"
              value={seo.canonicalUrl || ''}
              onChange={handleChange}
              className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
            ROBOTS DIRECTIVE
          </label>
          <select
            name="robots"
            value={seo.robots || 'index, follow'}
            onChange={handleChange}
            className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none"
          >
            <option value="index, follow">index, follow (Recommended for Search)</option>
            <option value="noindex, follow">noindex, follow</option>
            <option value="noindex, nofollow">noindex, nofollow</option>
          </select>
        </div>

        <div className="pt-4 border-t border-[#383838]/50 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#fb8236] hover:bg-[#e84e1b] text-black font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-[#fb8236]/20 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save SEO Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
