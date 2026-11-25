import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Plus,
  Edit2,
  Trash2,
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';

export const ExperienceManagement = () => {
  const { reloadPortfolio } = usePortfolio();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: '', message: '' });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    employmentType: 'Full-time',
    location: '',
    startDate: '',
    endDate: 'Present',
    isCurrent: false,
    responsibilitiesText: '',
    order: 1
  });
  const [saving, setSaving] = useState(false);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const res = await api.getExperiences();
      if (res.success) {
        setExperiences(res.data || []);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to load experience records.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const openAddModal = () => {
    setEditingExp(null);
    setFormData({
      company: '',
      role: '',
      employmentType: 'Full-time',
      location: 'Noida, India',
      startDate: '',
      endDate: 'Present',
      isCurrent: false,
      responsibilitiesText: '',
      order: experiences.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingExp(exp);
    setFormData({
      company: exp.company,
      role: exp.role,
      employmentType: exp.employmentType || 'Full-time',
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate || 'Present',
      isCurrent: exp.isCurrent || false,
      responsibilitiesText: (exp.responsibilities || []).join('\n'),
      order: exp.order || 1
    });
    setModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const respArr = formData.responsibilitiesText
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);

      const payload = {
        company: formData.company,
        role: formData.role,
        employmentType: formData.employmentType,
        location: formData.location,
        startDate: formData.startDate,
        endDate: formData.isCurrent ? 'Present' : formData.endDate,
        isCurrent: formData.isCurrent,
        responsibilities: respArr,
        order: formData.order
      };

      if (editingExp) {
        await api.updateExperience(editingExp._id || editingExp.id, payload);
        setToast({ type: 'success', message: 'Experience record updated successfully.' });
      } else {
        await api.createExperience(payload);
        setToast({ type: 'success', message: 'Experience record added.' });
      }

      setModalOpen(false);
      fetchExperiences();
      reloadPortfolio();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Operation failed.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, company) => {
    if (!window.confirm(`Delete experience at "${company}"?`)) return;
    try {
      await api.deleteExperience(id);
      setToast({ type: 'success', message: 'Experience deleted.' });
      fetchExperiences();
      reloadPortfolio();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to delete experience.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Experience Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your employment history, exact dates, roles, and key responsibilities.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#fb8236] hover:bg-[#e84e1b] text-[#171717] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-[#fb8236]/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
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
      ) : experiences.length === 0 ? (
        <div className="bg-[#242424] border border-[#383838] rounded-3xl p-12 text-center text-muted-foreground text-xs">
          No experience records found. Click "Add Experience" to add one.
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp._id || exp.id}
              className="bg-[#242424] border border-[#383838]/60 rounded-2xl p-5 sm:p-6 shadow-md flex flex-col justify-between hover:border-[#fb8236]/40 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#383838]/40">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-heading font-bold text-base text-foreground">
                      {exp.role}
                    </h3>
                    {exp.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#fb8236]/15 text-[#fb8236] border border-[#fb8236]/30">
                        CURRENT
                      </span>
                    )}
                    <span className="text-xs font-mono uppercase text-muted-foreground">
                      ({exp.employmentType})
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-[#f8af26] mt-0.5">
                    {exp.company}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono mt-1">
                    <span>
                      {exp.startDate} – {exp.endDate || 'Present'}
                    </span>
                    <span>•</span>
                    <span>{exp.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start">
                  <button
                    onClick={() => openEditModal(exp)}
                    className="w-8 h-8 rounded-lg bg-[#1a1a1a] hover:bg-[#333] border border-[#383838] flex items-center justify-center text-muted-foreground hover:text-[#fb8236] transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(exp._id || exp.id, exp.company)}
                    className="w-8 h-8 rounded-lg bg-[#1a1a1a] hover:bg-red-950/50 border border-[#383838] flex items-center justify-center text-muted-foreground hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Responsibilities bullets */}
              <div className="mt-4 space-y-1.5">
                {(exp.responsibilities || []).map((r, rIdx) => (
                  <div key={rIdx} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-[#fb8236]">•</span>
                    <span>{r}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-[#242424] border border-[#383838] rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#383838] mb-5">
              <h3 className="font-heading font-bold text-lg text-foreground">
                {editingExp ? 'Edit Experience' : 'Add Experience'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                    ROLE / JOB TITLE *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="MIS Executive"
                    className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                    COMPANY NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Indiavision Realty & Infrastructure Pvt. Ltd."
                    className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                    EMPLOYMENT TYPE
                  </label>
                  <select
                    value={formData.employmentType}
                    onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                    className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                    LOCATION *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Noida, India"
                    className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                    START DATE *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    placeholder="e.g. June 2026 or 1 December 2025"
                    className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                    END DATE
                  </label>
                  <input
                    type="text"
                    disabled={formData.isCurrent}
                    value={formData.isCurrent ? 'Present' : formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    placeholder="Present or 30 May 2026"
                    className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="expCurrent"
                  checked={formData.isCurrent}
                  onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                  className="rounded border-[#383838] text-[#fb8236] focus:ring-[#fb8236] bg-[#171717]"
                />
                <label htmlFor="expCurrent" className="text-xs text-foreground cursor-pointer">
                  Currently employed in this role
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                  KEY RESPONSIBILITIES (ONE PER LINE) *
                </label>
                <textarea
                  required
                  rows="5"
                  value={formData.responsibilitiesText}
                  onChange={(e) => setFormData({ ...formData, responsibilitiesText: e.target.value })}
                  placeholder="Generate and maintain daily, weekly, and monthly MIS reports.&#10;Use Advanced Excel functions (VLOOKUP, XLOOKUP, Pivot Tables)."
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
                  <span>Save Experience</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
