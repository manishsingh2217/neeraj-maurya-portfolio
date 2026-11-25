import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { usePortfolio } from '../context/PortfolioContext';
import { Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export const AboutManagement = () => {
  const { reloadPortfolio } = usePortfolio();
  const [about, setAbout] = useState({
    headline: '',
    bioParagraphsText: '',
    careerObjectives: '',
    yearsOfExperience: '',
    projectsCompleted: '',
    certificationsCount: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        const res = await api.getAbout();
        if (res.success && res.data) {
          setAbout({
            headline: res.data.headline || '',
            bioParagraphsText: (res.data.bioParagraphs || []).join('\n\n'),
            careerObjectives: res.data.careerObjectives || '',
            yearsOfExperience: res.data.yearsOfExperience || '1+',
            projectsCompleted: res.data.projectsCompleted || '8+',
            certificationsCount: res.data.certificationsCount || '6'
          });
        }
      } catch (err) {
        setToast({ type: 'error', message: err.message || 'Failed to load about details.' });
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  const handleChange = (e) => {
    setAbout((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setToast({ type: '', message: '' });

      const paragraphs = about.bioParagraphsText
        .split('\n\n')
        .map((p) => p.trim())
        .filter(Boolean);

      const res = await api.updateAbout({
        headline: about.headline,
        bioParagraphs: paragraphs,
        careerObjectives: about.careerObjectives,
        yearsOfExperience: about.yearsOfExperience,
        projectsCompleted: about.projectsCompleted,
        certificationsCount: about.certificationsCount
      });

      if (res.success) {
        setToast({ type: 'success', message: 'About section updated successfully!' });
        reloadPortfolio();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to save about section.' });
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
          About Section Management
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Customize your detailed narrative, career objectives, and key statistical highlights.
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
            ABOUT SECTION HEADLINE *
          </label>
          <input
            type="text"
            name="headline"
            value={about.headline}
            onChange={handleChange}
            required
            className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
            DETAILED NARRATIVE PARAGRAPHS (SEPARATE BY EMPTY LINES) *
          </label>
          <textarea
            name="bioParagraphsText"
            rows="6"
            value={about.bioParagraphsText}
            onChange={handleChange}
            required
            className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
            CAREER OBJECTIVES
          </label>
          <textarea
            name="careerObjectives"
            rows="3"
            value={about.careerObjectives}
            onChange={handleChange}
            className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors"
          />
        </div>

        {/* Highlights Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              YEARS EXPERIENCE STAT
            </label>
            <input
              type="text"
              name="yearsOfExperience"
              value={about.yearsOfExperience}
              onChange={handleChange}
              placeholder="1+ Years"
              className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              PROJECTS COMPLETED STAT
            </label>
            <input
              type="text"
              name="projectsCompleted"
              value={about.projectsCompleted}
              onChange={handleChange}
              placeholder="8+ End-to-End"
              className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              CERTIFICATIONS COUNT STAT
            </label>
            <input
              type="text"
              name="certificationsCount"
              value={about.certificationsCount}
              onChange={handleChange}
              placeholder="6 Verified"
              className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#383838]/50 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#fb8236] hover:bg-[#e84e1b] disabled:opacity-50 text-[#171717] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-[#fb8236]/20 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save About Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
