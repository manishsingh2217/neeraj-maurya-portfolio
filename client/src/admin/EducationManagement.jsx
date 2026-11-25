import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Plus,
  Edit2,
  Trash2,
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';

export const EducationManagement = () => {
  const { reloadPortfolio } = usePortfolio();
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: '', message: '' });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    duration: '',
    score: '',
    description: '',
    order: 1
  });
  const [saving, setSaving] = useState(false);

  const fetchEducation = async () => {
    try {
      setLoading(true);
      const res = await api.getEducation();
      if (res.success) {
        setEducationList(res.data || []);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to load education records.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  const openAddModal = () => {
    setEditingEdu(null);
    setFormData({
      degree: '',
      institution: '',
      duration: '',
      score: '',
      description: '',
      order: educationList.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (edu) => {
    setEditingEdu(edu);
    setFormData({
      degree: edu.degree,
      institution: edu.institution,
      duration: edu.duration,
      score: edu.score,
      description: edu.description || '',
      order: edu.order || 1
    });
    setModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingEdu) {
        await api.updateEducation(editingEdu._id || editingEdu.id, formData);
        setToast({ type: 'success', message: 'Education record updated.' });
      } else {
        await api.createEducation(formData);
        setToast({ type: 'success', message: 'Education record added.' });
      }

      setModalOpen(false);
      fetchEducation();
      reloadPortfolio();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, degree) => {
    if (!window.confirm(`Delete education record "${degree}"?`)) return;
    try {
      await api.deleteEducation(id);
      setToast({ type: 'success', message: 'Education deleted.' });
      fetchEducation();
      reloadPortfolio();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Education Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your degrees, institutions, duration years, and CGPA or percentages.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#fb8236] hover:bg-[#e84e1b] text-[#171717] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-[#fb8236]/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Education</span>
        </button>
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

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#fb8236] animate-spin" />
        </div>
      ) : educationList.length === 0 ? (
        <div className="bg-[#242424] border border-[#383838] rounded-3xl p-12 text-center text-muted-foreground text-xs">
          No education records found.
        </div>
      ) : (
        <div className="space-y-4">
          {educationList.map((edu) => (
            <div
              key={edu._id || edu.id}
              className="bg-[#242424] border border-[#383838]/60 rounded-2xl p-5 shadow-md flex items-start justify-between gap-4 hover:border-[#fb8236]/40 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#1c1c1c] border border-[#383838] text-[#fb8236] flex items-center justify-center shrink-0 mt-0.5">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-foreground">
                    {edu.degree}
                  </h3>
                  <div className="text-xs font-semibold text-[#f8af26] mt-0.5">
                    {edu.institution}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono mt-1">
                    <span>{edu.duration}</span>
                    <span>•</span>
                    <span className="text-[#fb8236] font-semibold">{edu.score}</span>
                  </div>
                  {edu.description && (
                    <p className="text-xs text-muted-foreground mt-2 max-w-xl">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => openEditModal(edu)}
                  className="w-8 h-8 rounded-lg bg-[#1a1a1a] hover:bg-[#333] border border-[#383838] flex items-center justify-center text-muted-foreground hover:text-[#fb8236]"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(edu._id || edu.id, edu.degree)}
                  className="w-8 h-8 rounded-lg bg-[#1a1a1a] hover:bg-red-950/50 border border-[#383838] flex items-center justify-center text-muted-foreground hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#242424] border border-[#383838] rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#383838] mb-5">
              <h3 className="font-heading font-bold text-lg text-foreground">
                {editingEdu ? 'Edit Education' : 'Add Education'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                  DEGREE / QUALIFICATION *
                </label>
                <input
                  type="text"
                  required
                  value={formData.degree}
                  onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                  placeholder="Bachelor of Technology in Computer Science and Engineering"
                  className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                  INSTITUTION / UNIVERSITY *
                </label>
                <input
                  type="text"
                  required
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="Dr. A.P.J. Abdul Kalam Technical University"
                  className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                    DURATION / YEAR *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="2022 – 2026"
                    className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                    SCORE / CGPA *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.score}
                    onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                    placeholder="CGPA: 7.9/10 or 67%"
                    className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                  DESCRIPTION (OPTIONAL)
                </label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Focused on algorithms, data structures, and database engineering..."
                  className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#383838] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1c1c1c] text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#fb8236] hover:bg-[#e84e1b] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Education</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
