import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Plus,
  Edit2,
  Trash2,
  Award,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';

export const CertificationsManagement = () => {
  const { reloadPortfolio } = usePortfolio();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: '', message: '' });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issueDate: '2024',
    credentialUrl: '',
    isEnabled: true,
    order: 1
  });
  const [saving, setSaving] = useState(false);

  const fetchCerts = async () => {
    try {
      setLoading(true);
      const res = await api.getCertifications();
      if (res.success) {
        setCerts(res.data || []);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const openAddModal = () => {
    setEditingCert(null);
    setFormData({
      name: '',
      issuer: '',
      issueDate: '2024',
      credentialUrl: '',
      isEnabled: true,
      order: certs.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (cert) => {
    setEditingCert(cert);
    setFormData({
      name: cert.name,
      issuer: cert.issuer,
      issueDate: cert.issueDate || '2024',
      credentialUrl: cert.credentialUrl || '',
      isEnabled: cert.isEnabled !== false,
      order: cert.order || 1
    });
    setModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingCert) {
        await api.updateCertification(editingCert._id || editingCert.id, formData);
        setToast({ type: 'success', message: 'Certification updated.' });
      } else {
        await api.createCertification(formData);
        setToast({ type: 'success', message: 'Certification added.' });
      }

      setModalOpen(false);
      fetchCerts();
      reloadPortfolio();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete certification "${name}"?`)) return;
    try {
      await api.deleteCertification(id);
      setToast({ type: 'success', message: 'Certification deleted.' });
      fetchCerts();
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
            Certifications Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your accredited certifications, issuing organizations, and verification links.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#fb8236] hover:bg-[#e84e1b] text-[#171717] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-[#fb8236]/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certification</span>
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
      ) : certs.length === 0 ? (
        <div className="bg-[#242424] border border-[#383838] rounded-3xl p-12 text-center text-muted-foreground text-xs">
          No certifications found. Click "Add Certification" to record one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.map((cert) => (
            <div
              key={cert._id || cert.id}
              className="bg-[#242424] border border-[#383838]/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-[#fb8236]/40 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#fb8236]/10 border border-[#fb8236]/20 text-[#fb8236] flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(cert)}
                      className="w-7 h-7 rounded-lg bg-[#1a1a1a] hover:bg-[#333] border border-[#383838] flex items-center justify-center text-muted-foreground hover:text-[#fb8236]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cert._id || cert.id, cert.name)}
                      className="w-7 h-7 rounded-lg bg-[#1a1a1a] hover:bg-red-950/50 border border-[#383838] flex items-center justify-center text-muted-foreground hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-heading font-bold text-sm text-foreground mt-3">
                  {cert.name}
                </h3>
                <p className="text-xs font-semibold text-[#f8af26] mt-0.5">
                  {cert.issuer}
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mt-4 pt-3 border-t border-[#383838]/40">
                <span>{cert.issueDate || '2024'}</span>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#fb8236] hover:underline flex items-center gap-1"
                  >
                    <span>Verify Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
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
                {editingCert ? 'Edit Certification' : 'Add Certification'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                  CERTIFICATION NAME *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="GenAI Powered Data Analytics Job Simulation"
                  className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                  ISSUING ORGANISATION *
                </label>
                <input
                  type="text"
                  required
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  placeholder="Tata / Forage / Deloitte"
                  className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                    ISSUE DATE / YEAR
                  </label>
                  <input
                    type="text"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    placeholder="2024"
                    className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                    ORDER
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                  VERIFICATION / CREDENTIAL URL
                </label>
                <input
                  type="url"
                  value={formData.credentialUrl}
                  onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                  placeholder="https://www.theforage.com/..."
                  className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="certVisible"
                  checked={formData.isEnabled}
                  onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                  className="rounded border-[#383838] text-[#fb8236] focus:ring-[#fb8236] bg-[#171717]"
                />
                <label htmlFor="certVisible" className="text-xs text-foreground cursor-pointer">
                  Visible on public website
                </label>
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
                  <span>Save Certification</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
