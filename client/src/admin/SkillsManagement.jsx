import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export const SkillsManagement = () => {
  const { reloadPortfolio } = usePortfolio();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [toast, setToast] = useState({ type: '', message: '' });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Database and Tools',
    icon: 'code',
    proficiency: 85,
    order: 1,
    isEnabled: true
  });
  const [modalSaving, setModalSaving] = useState(false);

  const categories = [
    'All',
    'Programming Languages',
    'Database and Tools',
    'Data Analysis',
    'Python Libraries',
    'Excel',
    'Machine Learning',
    'Core Concepts',
    'Web Technologies'
  ];

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await api.getSkills();
      if (res.success) {
        setSkills(res.data || []);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to load skills.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const openAddModal = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: 'Database and Tools',
      icon: 'code',
      proficiency: 85,
      order: skills.length + 1,
      isEnabled: true
    });
    setModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      icon: skill.icon || 'code',
      proficiency: skill.proficiency || 85,
      order: skill.order || 1,
      isEnabled: skill.isEnabled !== false
    });
    setModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      setModalSaving(true);
      if (editingSkill) {
        await api.updateSkill(editingSkill._id || editingSkill.id, formData);
        setToast({ type: 'success', message: `Updated ${formData.name} successfully.` });
      } else {
        await api.createSkill(formData);
        setToast({ type: 'success', message: `Added ${formData.name} to skills.` });
      }
      setModalOpen(false);
      fetchSkills();
      reloadPortfolio();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Operation failed.' });
    } finally {
      setModalSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete skill "${name}"?`)) return;
    try {
      await api.deleteSkill(id);
      setToast({ type: 'success', message: `Deleted ${name}.` });
      fetchSkills();
      reloadPortfolio();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to delete skill.' });
    }
  };

  const handleToggle = async (id) => {
    try {
      await api.toggleSkill(id);
      fetchSkills();
      reloadPortfolio();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  const filteredSkills = skills.filter((s) => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Skills & Toolkit Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add, update, reorder, or toggle technical skills and proficiencies.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#fb8236] hover:bg-[#e84e1b] text-[#171717] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-[#fb8236]/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Skill</span>
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

      {/* Filter and Search Bar */}
      <div className="bg-[#242424] border border-[#383838]/60 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search skills by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl pl-9 pr-4 py-2 text-xs text-foreground outline-none"
          />
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {categories.slice(0, 5).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#fb8236] text-black font-bold'
                  : 'bg-[#1a1a1a] text-muted-foreground hover:text-foreground border border-[#383838]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Skills Table */}
      <div className="bg-[#242424] border border-[#383838]/60 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#fb8236] animate-spin" />
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground text-xs">
            No matching skills found. Click "Add New Skill" to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1c1c1c] border-b border-[#383838] text-muted-foreground font-mono uppercase text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Skill Name</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Proficiency</th>
                  <th className="px-6 py-3.5">Order</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#383838]/40">
                {filteredSkills.map((skill) => (
                  <tr key={skill._id || skill.id} className="hover:bg-[#282828] transition-colors">
                    <td className="px-6 py-4 font-bold text-foreground">
                      {skill.name}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[#171717] border border-[#383838] text-muted-foreground">
                        {skill.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-[#171717] h-1.5 rounded-full overflow-hidden border border-[#383838]">
                          <div
                            className="bg-[#fb8236] h-full rounded-full"
                            style={{ width: `${skill.proficiency || 80}%` }}
                          />
                        </div>
                        <span className="font-mono text-muted-foreground">{skill.proficiency || 80}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-muted-foreground">
                      {skill.order || 0}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggle(skill._id || skill.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold"
                      >
                        {skill.isEnabled !== false ? (
                          <span className="text-green-400 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-400" />
                            Active
                          </span>
                        ) : (
                          <span className="text-gray-500 flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-gray-500" />
                            Disabled
                          </span>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(skill)}
                          className="w-7 h-7 rounded-lg bg-[#1a1a1a] hover:bg-[#333] border border-[#383838] flex items-center justify-center text-muted-foreground hover:text-[#fb8236] transition-colors"
                          title="Edit Skill"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill._id || skill.id, skill.name)}
                          className="w-7 h-7 rounded-lg bg-[#1a1a1a] hover:bg-red-950/50 border border-[#383838] flex items-center justify-center text-muted-foreground hover:text-red-400 transition-colors"
                          title="Delete Skill"
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
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#242424] border border-[#383838] rounded-3xl p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-[#383838] mb-5">
              <h3 className="font-heading font-bold text-lg text-foreground">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                  SKILL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Power BI, Python, SQL"
                  className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                  CATEGORY *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none"
                >
                  {categories.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                    PROFICIENCY ({formData.proficiency}%)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={formData.proficiency}
                    onChange={(e) => setFormData({ ...formData, proficiency: Number(e.target.value) })}
                    className="w-full accent-[#fb8236]"
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

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="skillEnabled"
                  checked={formData.isEnabled}
                  onChange={(e) => setFormData({ ...formData, isEnabled: e.target.checked })}
                  className="rounded border-[#383838] text-[#fb8236] focus:ring-[#fb8236] bg-[#171717]"
                />
                <label htmlFor="skillEnabled" className="text-xs text-foreground cursor-pointer">
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
                  disabled={modalSaving}
                  className="px-5 py-2 rounded-xl bg-[#fb8236] hover:bg-[#e84e1b] text-black font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                >
                  {modalSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Skill</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
