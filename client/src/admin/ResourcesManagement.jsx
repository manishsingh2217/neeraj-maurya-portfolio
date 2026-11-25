import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Plus,
  Edit2,
  Trash2,
  Download,
  ExternalLink,
  FileText,
  Database,
  Code,
  BookOpen,
  FolderGit2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Search,
  UploadCloud,
  FileCode,
  Layers,
  ShieldAlert
} from 'lucide-react';

export const ResourcesManagement = () => {
  const { isAdmin, admin } = useAuth();
  const { reloadPortfolio } = usePortfolio();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: '', message: '' });
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [fileInput, setFileInput] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Study Materials',
    type: 'material',
    format: 'PDF',
    size: '1.0 MB',
    description: '',
    downloadUrl: '',
    isExternal: false,
    order: 1,
    isEnabled: true
  });
  const [saving, setSaving] = useState(false);

  const fetchResources = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminResources();
      if (res.success) {
        setResources(res.data || []);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to load resources.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const openAddModal = () => {
    setEditingResource(null);
    setFileInput(null);
    setFormData({
      title: '',
      category: 'SQL Cheat Sheet',
      type: 'material',
      format: 'PDF',
      size: '1.0 MB',
      description: '',
      downloadUrl: '',
      isExternal: false,
      order: resources.length + 1,
      isEnabled: true
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingResource(item);
    setFileInput(null);
    setFormData({
      title: item.title || '',
      category: item.category || 'Study Materials',
      type: item.type || 'material',
      format: item.format || 'PDF',
      size: item.size || '1.0 MB',
      description: item.description || '',
      downloadUrl: item.downloadUrl || '',
      isExternal: !!item.isExternal,
      order: item.order || 1,
      isEnabled: item.isEnabled !== false
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setToast({ type: 'error', message: 'Resource title is required.' });
      return;
    }
    if (!formData.downloadUrl && !fileInput && !editingResource?.downloadUrl) {
      setToast({ type: 'error', message: 'Please provide either a download URL or upload a file.' });
      return;
    }

    try {
      setSaving(true);
      const data = new FormData();
      data.append('title', formData.title.trim());
      data.append('category', formData.category.trim());
      data.append('type', formData.type);
      data.append('format', formData.format);
      data.append('size', formData.size);
      data.append('description', formData.description.trim());
      data.append('downloadUrl', formData.downloadUrl);
      data.append('isExternal', String(formData.isExternal));
      data.append('order', String(formData.order));
      data.append('isEnabled', String(formData.isEnabled));

      if (fileInput) {
        data.append('resourceFile', fileInput);
      }

      let res;
      if (editingResource) {
        const id = editingResource._id || editingResource.id;
        res = await api.updateResource(id, data);
      } else {
        res = await api.createResource(data);
      }

      if (res.success) {
        setToast({
          type: 'success',
          message: editingResource ? 'Resource updated successfully!' : 'Resource added successfully!'
        });
        setModalOpen(false);
        fetchResources();
        if (reloadPortfolio) reloadPortfolio();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Operation failed.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.deleteResource(id);
      if (res.success) {
        setToast({ type: 'success', message: 'Resource removed successfully.' });
        setDeleteConfirmId(null);
        fetchResources();
        if (reloadPortfolio) reloadPortfolio();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to delete resource.' });
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await api.toggleResource(id);
      if (res.success) {
        fetchResources();
        if (reloadPortfolio) reloadPortfolio();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to toggle visibility.' });
    }
  };

  const getFormatIcon = (format = '', category = '') => {
    const f = format.toLowerCase();
    const c = category.toLowerCase();
    if (f.includes('sql') || c.includes('sql')) return <Database className="w-5 h-5 text-[#f8af26]" />;
    if (f.includes('py') || f.includes('ipynb') || c.includes('python')) return <Code className="w-5 h-5 text-[#fb8236]" />;
    if (f.includes('excel') || f.includes('xlsx') || f.includes('pbix') || c.includes('power bi')) return <BookOpen className="w-5 h-5 text-[#f8af26]" />;
    if (f.includes('git') || c.includes('project')) return <FolderGit2 className="w-5 h-5 text-[#fb8236]" />;
    return <FileText className="w-5 h-5 text-[#fb8236]" />;
  };

  const filteredResources = resources.filter((item) => {
    if (activeTab === 'materials' && item.type !== 'material') return false;
    if (activeTab === 'projects' && item.type !== 'project') return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.format && item.format.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  });

  const materialsCount = resources.filter((r) => r.type === 'material').length;
  const projectsCount = resources.filter((r) => r.type === 'project').length;
  const activeCount = resources.filter((r) => r.isEnabled !== false).length;

  // Access Control Guard: Only Admin and Super Admin
  if (!isAdmin) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-[#242424] border border-red-500/30 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="font-heading text-xl font-bold text-foreground">Access Restricted</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Only users with the <span className="text-red-400 font-semibold">Admin</span> or <span className="text-[#fb8236] font-semibold">Super Admin</span> role can add, modify, or remove portfolio resources.
          </p>
          <div className="mt-4 inline-block px-3 py-1 rounded-full text-xs font-mono bg-muted text-muted-foreground">
            Current Role: {admin?.role || 'Guest'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast.message && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between shadow-lg text-sm transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-950/80 border border-emerald-500/30 text-emerald-300'
              : 'bg-red-950/80 border border-red-500/30 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast({ type: '', message: '' })} className="hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase bg-[#fb8236]/15 text-[#fb8236] mb-2">
            <span>PUBLIC DOWNLOADS & REPOSITORIES</span>
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Resource Management</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Add, update, or remove study materials, cheatsheets, and project repository downloads. (Admin & Super Admin only)
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#fb8236] hover:bg-[#e84e1b] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#fb8236]/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Resource</span>
        </button>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#242424] border border-[#383838] rounded-xl p-4">
          <div className="text-xs text-muted-foreground font-mono uppercase">Total Resources</div>
          <div className="font-heading text-2xl font-bold text-foreground mt-1">{resources.length}</div>
        </div>
        <div className="bg-[#242424] border border-[#383838] rounded-xl p-4">
          <div className="text-xs text-muted-foreground font-mono uppercase">Study Materials</div>
          <div className="font-heading text-2xl font-bold text-[#fb8236] mt-1">{materialsCount}</div>
        </div>
        <div className="bg-[#242424] border border-[#383838] rounded-xl p-4">
          <div className="text-xs text-muted-foreground font-mono uppercase">Project Files</div>
          <div className="font-heading text-2xl font-bold text-[#f8af26] mt-1">{projectsCount}</div>
        </div>
        <div className="bg-[#242424] border border-[#383838] rounded-xl p-4">
          <div className="text-xs text-muted-foreground font-mono uppercase">Live & Visible</div>
          <div className="font-heading text-2xl font-bold text-emerald-400 mt-1">{activeCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#242424] border border-[#383838] p-3 rounded-2xl">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'all'
                ? 'bg-[#fb8236] text-black font-bold shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-[#2e2e2e]'
            }`}
          >
            All ({resources.length})
          </button>
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'materials'
                ? 'bg-[#fb8236] text-black font-bold shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-[#2e2e2e]'
            }`}
          >
            Study Materials ({materialsCount})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'projects'
                ? 'bg-[#fb8236] text-black font-bold shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-[#2e2e2e]'
            }`}
          >
            Project Files ({projectsCount})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#383838] rounded-xl pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#fb8236]"
          />
        </div>
      </div>

      {/* Resource Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 text-[#fb8236] animate-spin" />
          <p className="text-xs font-mono">Loading resources...</p>
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="bg-[#242424] border border-[#383838] rounded-2xl p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-muted/40 text-muted-foreground flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">No resources found.</p>
          <p className="text-xs text-muted-foreground mt-1">
            {searchQuery ? 'Try clearing your search query.' : 'Click "Add Resource" to create your first downloadable asset.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredResources.map((item) => {
            const id = item._id || item.id;
            const isDeleting = deleteConfirmId === id;

            return (
              <div
                key={id}
                className={`bg-[#242424] border rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between group ${
                  item.isEnabled === false
                    ? 'border-[#383838]/40 opacity-60'
                    : 'border-[#383838] hover:border-[#fb8236]/40 shadow-md'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1c1c1c] border border-[#383838] flex items-center justify-center shrink-0">
                      {getFormatIcon(item.format, item.category)}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-[#1a1a1a] border border-[#383838] text-muted-foreground">
                        {item.format}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#fb8236]/10 text-[#fb8236] border border-[#fb8236]/30 font-semibold">
                        {item.size}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          item.isEnabled !== false
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {item.isEnabled !== false ? 'Live' : 'Hidden'}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-[#f8af26] uppercase mt-3">
                    {item.category} • {item.type === 'project' ? 'Project File' : 'Study Material'}
                  </div>

                  <h3 className="font-heading font-bold text-base text-foreground mt-1 group-hover:text-[#fb8236] transition-colors">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#383838]/60 flex items-center justify-between gap-2">
                  <a
                    href={item.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#fb8236] hover:underline font-semibold"
                  >
                    {item.isExternal ? <ExternalLink className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
                    <span>{item.isExternal ? 'Repository Link' : 'Download Link'}</span>
                  </a>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggle(id)}
                      className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        item.isEnabled !== false
                          ? 'text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10'
                          : 'text-amber-400 hover:bg-amber-500/10'
                      }`}
                      title={item.isEnabled !== false ? 'Hide from public site' : 'Make visible on public site'}
                    >
                      {item.isEnabled !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-[#fb8236] hover:bg-[#2e2e2e] transition-colors cursor-pointer"
                      title="Edit Resource"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {isDeleting ? (
                      <div className="flex items-center gap-1 bg-red-950/80 px-2 py-1 rounded-lg border border-red-500/40">
                        <button
                          onClick={() => handleDelete(id)}
                          className="text-[10px] text-red-300 font-bold hover:underline"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="text-[10px] text-muted-foreground hover:text-foreground ml-1"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                        title="Delete Resource"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#242424] border border-[#383838] rounded-3xl w-full max-w-xl p-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between pb-4 border-b border-[#383838]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#fb8236]/15 text-[#fb8236] flex items-center justify-center">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-foreground">
                    {editingResource ? 'Edit Resource' : 'Add New Resource'}
                  </h3>
                  <p className="text-[11px] text-muted-foreground font-mono">
                    Restricted to Admin & Super Admin
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[#2e2e2e]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-5">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Resource Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SQL for Data Analysis & Joins Quick Reference"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[#383838] rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#fb8236]"
                />
              </div>

              {/* Type & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Resource Section Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#383838] rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#fb8236]"
                  >
                    <option value="material">Study Material</option>
                    <option value="project">Project File / Repository</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SQL Cheat Sheet, Power BI & Excel"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#383838] rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#fb8236]"
                  />
                </div>
              </div>

              {/* Format & Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Format
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PDF, PBIX, IPYNB, Excel / Guide"
                    value={formData.format}
                    onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#383838] rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#fb8236]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                    File Size Label
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 98.4 KB, 4.2 MB"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full bg-[#1a1a1a] border border-[#383838] rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#fb8236]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed summary of what the resource contains..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[#383838] rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#fb8236] resize-none"
                />
              </div>

              {/* Download URL / External Link */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Download Link or External URL
                </label>
                <input
                  type="text"
                  placeholder="https://... or /api/resume/download"
                  value={formData.downloadUrl}
                  onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                  className="w-full bg-[#1a1a1a] border border-[#383838] rounded-xl px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:border-[#fb8236]"
                />
              </div>

              {/* Direct File Upload */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Or Upload Resource File directly (PDF, PBIX, IPYNB, ZIP, XLSX)
                </label>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setFileInput(file || null);
                    if (file) {
                      const ext = file.name.split('.').pop().toUpperCase();
                      const sz = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
                      setFormData((prev) => ({
                        ...prev,
                        format: prev.format || ext,
                        size: sz
                      }));
                    }
                  }}
                  className="w-full text-xs text-muted-foreground file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#fb8236]/15 file:text-[#fb8236] hover:file:bg-[#fb8236]/25 cursor-pointer"
                />
                {fileInput && (
                  <p className="text-[11px] text-[#fb8236] mt-1 font-mono">
                    Selected: {fileInput.name} ({(fileInput.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>

              {/* Checkboxes: isExternal, isEnabled */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
                  <input
                    type="checkbox"
                    checked={formData.isExternal}
                    onChange={(e) => setFormData({ ...formData, isExternal: e.target.checked })}
                    className="w-4 h-4 rounded text-[#fb8236] focus:ring-0 bg-[#1a1a1a] border-[#383838]"
                  />
                  <span>Is External Link (Opens in new tab)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-foreground">
                  <input
                    type="checkbox"
                    checked={formData.isEnabled}
                    onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                    className="w-4 h-4 rounded text-[#fb8236] focus:ring-0 bg-[#1a1a1a] border-[#383838]"
                  />
                  <span>Visible to Public on /resources</span>
                </label>
              </div>

              {/* Order */}
              <div className="w-32 pt-1">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Display Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  className="w-full bg-[#1a1a1a] border border-[#383838] rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-[#fb8236]"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#383838]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-[#2e2e2e] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#fb8236] hover:bg-[#e84e1b] text-black font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-lg shadow-[#fb8236]/20"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingResource ? 'Update Resource' : 'Save Resource'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
