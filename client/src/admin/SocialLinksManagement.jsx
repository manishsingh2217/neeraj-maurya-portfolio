import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Share2
} from 'lucide-react';

export const SocialLinksManagement = () => {
  const { reloadPortfolio } = usePortfolio();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: '', message: '' });

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    icon: 'globe',
    isEnabled: true,
    order: 1
  });
  const [saving, setSaving] = useState(false);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await api.getSocialLinks();
      if (res.success) {
        setLinks(res.data || []);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const openAddModal = () => {
    setEditingLink(null);
    setFormData({
      platform: '',
      url: '',
      icon: 'globe',
      isEnabled: true,
      order: links.length + 1
    });
    setModalOpen(true);
  };

  const openEditModal = (link) => {
    setEditingLink(link);
    setFormData({
      platform: link.platform,
      url: link.url,
      icon: link.icon || 'globe',
      isEnabled: link.isEnabled !== false,
      order: link.order || 1
    });
    setModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingLink) {
        await api.updateSocialLink(editingLink._id || editingLink.id, formData);
        setToast({ type: 'success', message: 'Social link updated.' });
      } else {
        await api.createSocialLink(formData);
        setToast({ type: 'success', message: 'Social link added.' });
      }
      setModalOpen(false);
      fetchLinks();
      reloadPortfolio();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, platform) => {
    if (!window.confirm(`Delete link for "${platform}"?`)) return;
    try {
      await api.deleteSocialLink(id);
      setToast({ type: 'success', message: 'Social link deleted.' });
      fetchLinks();
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
            Social Media Links Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure social and external profile links displayed in the sticky sidebar and footer.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#fb8236] hover:bg-[#e84e1b] text-[#171717] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-[#fb8236]/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Social Link</span>
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
      ) : links.length === 0 ? (
        <div className="bg-[#242424] border border-[#383838] rounded-3xl p-12 text-center text-xs text-muted-foreground">
          No social links configured.
        </div>
      ) : (
        <div className="bg-[#242424] border border-[#383838]/60 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1c1c1c] border-b border-[#383838] text-muted-foreground font-mono uppercase text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Platform</th>
                  <th className="px-6 py-3.5">Target URL</th>
                  <th className="px-6 py-3.5">Display Order</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#383838]/40">
                {links.map((link) => (
                  <tr key={link._id || link.id} className="hover:bg-[#282828] transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-[#fb8236]" />
                      <span>{link.platform}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-muted-foreground truncate max-w-xs">
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#fb8236] hover:underline flex items-center gap-1">
                        <span>{link.url}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="px-6 py-4 font-mono text-muted-foreground">
                      {link.order || 0}
                    </td>
                    <td className="px-6 py-4">
                      {link.isEnabled !== false ? (
                        <span className="text-green-400 font-semibold flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-400" />
                          Enabled
                        </span>
                      ) : (
                        <span className="text-gray-500 font-semibold">Disabled</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(link)}
                          className="w-7 h-7 rounded-lg bg-[#1a1a1a] hover:bg-[#333] border border-[#383838] flex items-center justify-center text-muted-foreground hover:text-[#fb8236]"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(link._id || link.id, link.platform)}
                          className="w-7 h-7 rounded-lg bg-[#1a1a1a] hover:bg-red-950/50 border border-[#383838] flex items-center justify-center text-muted-foreground hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#242424] border border-[#383838] rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#383838] mb-5">
              <h3 className="font-heading font-bold text-lg text-foreground">
                {editingLink ? 'Edit Link' : 'Add Social Link'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                  PLATFORM NAME *
                </label>
                <input
                  type="text"
                  required
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  placeholder="LinkedIn / GitHub / Kaggle / Twitter"
                  className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                  DESTINATION URL *
                </label>
                <input
                  type="text"
                  required
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://linkedin.com/in/neeraj-maurya"
                  className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                  DISPLAY ORDER
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="linkEnabled"
                  checked={formData.isEnabled}
                  onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                  className="rounded border-[#383838] text-[#fb8236] focus:ring-[#fb8236] bg-[#171717]"
                />
                <label htmlFor="linkEnabled" className="text-xs text-foreground cursor-pointer">
                  Display in public portfolio sidebar & footer
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
                  <span>Save Link</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
