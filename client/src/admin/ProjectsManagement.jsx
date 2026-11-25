import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Github,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Upload,
  Star
} from 'lucide-react';

export const ProjectsManagement = () => {
  const { reloadPortfolio } = usePortfolio();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState({ type: '', message: '' });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Data Analytics',
    description: '',
    technologiesInput: '',
    featuresText: '',
    githubUrl: '',
    liveUrl: '',
    imageUrl: '',
    isFeatured: false,
    isPublished: true,
    order: 1
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.getProjects();
      if (res.success) {
        setProjects(res.data || []);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to load projects.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      category: 'Data Analytics',
      description: '',
      technologiesInput: 'Python, SQL, Power BI',
      featuresText: '',
      githubUrl: '',
      liveUrl: '',
      imageUrl: '',
      isFeatured: false,
      isPublished: true,
      order: projects.length + 1
    });
    setImageFile(null);
    setPreviewImage('');
    setModalOpen(true);
  };

  const openEditModal = (proj) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title,
      category: proj.category || 'Data Analytics',
      description: proj.description,
      technologiesInput: (proj.technologies || []).join(', '),
      featuresText: (proj.features || []).join('\n'),
      githubUrl: proj.githubUrl || '',
      liveUrl: proj.liveUrl || '',
      imageUrl: proj.image || '',
      isFeatured: proj.isFeatured || false,
      isPublished: proj.isPublished !== false,
      order: proj.order || 1
    });
    setImageFile(null);
    setPreviewImage(proj.image || '');
    setModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const techArr = formData.technologiesInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const featArr = formData.featuresText
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);

      const fData = new FormData();
      fData.append('title', formData.title);
      fData.append('category', formData.category);
      fData.append('description', formData.description);
      fData.append('technologies', JSON.stringify(techArr));
      fData.append('features', JSON.stringify(featArr));
      fData.append('githubUrl', formData.githubUrl);
      fData.append('liveUrl', formData.liveUrl);
      fData.append('isFeatured', formData.isFeatured);
      fData.append('isPublished', formData.isPublished);
      fData.append('order', formData.order);

      if (formData.imageUrl) {
        fData.append('image', formData.imageUrl);
      }
      if (imageFile) {
        fData.append('image', imageFile);
      }

      if (editingProject) {
        await api.updateProject(editingProject._id || editingProject.id, fData);
        setToast({ type: 'success', message: 'Project updated successfully.' });
      } else {
        await api.createProject(fData);
        setToast({ type: 'success', message: 'New project created successfully.' });
      }

      setModalOpen(false);
      fetchProjects();
      reloadPortfolio();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to save project.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await api.deleteProject(id);
      setToast({ type: 'success', message: 'Project deleted.' });
      fetchProjects();
      reloadPortfolio();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  const handleTogglePublish = async (id) => {
    try {
      await api.toggleProjectPublish(id);
      fetchProjects();
      reloadPortfolio();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Projects Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add, update, feature, or publish data analytics and engineering projects.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#fb8236] hover:bg-[#e84e1b] text-[#171717] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-[#fb8236]/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
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

      {/* Search Bar */}
      <div className="bg-[#242424] border border-[#383838]/60 rounded-2xl p-4 flex items-center gap-3 shadow-md">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search projects by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl pl-9 pr-4 py-2 text-xs text-foreground outline-none"
          />
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#fb8236] animate-spin" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-[#242424] border border-[#383838] rounded-3xl p-12 text-center text-muted-foreground text-xs">
          No projects found. Click "Add Project" to showcase your work.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((proj) => (
            <div
              key={proj._id || proj.id}
              className="bg-[#242424] border border-[#383838]/60 rounded-2xl p-5 shadow-md flex flex-col justify-between hover:border-[#fb8236]/40 transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase text-[#fb8236]">
                        {proj.category}
                      </span>
                      {proj.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fb8236]/20 text-[#fb8236] border border-[#fb8236]/30 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current" />
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading font-bold text-base text-foreground mt-1">
                      {proj.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(proj)}
                      className="w-8 h-8 rounded-lg bg-[#1a1a1a] hover:bg-[#333] border border-[#383838] flex items-center justify-center text-muted-foreground hover:text-[#fb8236]"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(proj._id || proj.id, proj.title)}
                      className="w-8 h-8 rounded-lg bg-[#1a1a1a] hover:bg-red-950/50 border border-[#383838] flex items-center justify-center text-muted-foreground hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                  {proj.description}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {(proj.technologies || []).map((t, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-[#1a1a1a] text-muted-foreground border border-[#383838]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status and Visibility */}
              <div className="mt-4 pt-3 border-t border-[#383838]/40 flex items-center justify-between text-xs">
                <button
                  onClick={() => handleTogglePublish(proj._id || proj.id)}
                  className="flex items-center gap-1.5 font-semibold"
                >
                  {proj.isPublished !== false ? (
                    <span className="text-green-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-400" />
                      Published
                    </span>
                  ) : (
                    <span className="text-gray-500 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-gray-500" />
                      Draft
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                  {proj.githubUrl && <span>GitHub Linked</span>}
                  {proj.liveUrl && <span>Demo Active</span>}
                </div>
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
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                  PROJECT TITLE *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Bank Loan Analysis Dashboard"
                  className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                    CATEGORY
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Data Analytics / MIS"
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
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                  DESCRIPTION *
                </label>
                <textarea
                  required
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Developed an interactive business intelligence dashboard to analyse bank loan data..."
                  className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                  TECHNOLOGIES (COMMA SEPARATED) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.technologiesInput}
                  onChange={(e) => setFormData({ ...formData, technologiesInput: e.target.value })}
                  placeholder="Excel, Power BI, DAX, Python"
                  className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                  KEY FEATURES / HIGHLIGHTS (ONE PER LINE)
                </label>
                <textarea
                  rows="4"
                  value={formData.featuresText}
                  onChange={(e) => setFormData({ ...formData, featuresText: e.target.value })}
                  placeholder="Loan data preparation&#10;Data cleaning and validation&#10;Loan approval analysis&#10;Interactive Power BI dashboard"
                  className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                    GITHUB REPOSITORY URL
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
                    className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                    LIVE DEMO / DASHBOARD URL
                  </label>
                  <input
                    type="url"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://app.powerbi.com/view?r=..."
                    className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded border-[#383838] text-[#fb8236] focus:ring-[#fb8236] bg-[#171717]"
                  />
                  <span>Mark as Featured Hero Project</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded border-[#383838] text-[#fb8236] focus:ring-[#fb8236] bg-[#171717]"
                  />
                  <span>Publish immediately to public website</span>
                </label>
              </div>

              {/* Image Preview & URL/File Input */}
              <div className="space-y-3 pt-2">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
                  PROJECT PREVIEW IMAGE (LINK OR FILE)
                </label>
                
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  {previewImage ? (
                    <div className="w-full sm:w-44 h-28 rounded-xl overflow-hidden border border-[#383838] bg-[#1a1a1a] shrink-0">
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : null}

                  <div className="flex-1 w-full space-y-2">
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => {
                        setFormData({ ...formData, imageUrl: e.target.value });
                        if (e.target.value) setPreviewImage(e.target.value);
                      }}
                      placeholder="Paste image URL (e.g. https://images.unsplash.com/...)"
                      className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">or</span>
                      <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1c1c1c] hover:bg-[#282828] border border-[#383838] text-xs font-semibold text-foreground cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5 text-[#fb8236]" />
                        <span>Upload Image File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setImageFile(file);
                              setPreviewImage(URL.createObjectURL(file));
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
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
                  <span>Save Project</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
