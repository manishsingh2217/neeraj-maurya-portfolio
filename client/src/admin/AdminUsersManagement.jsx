import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  Shield,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';

export const AdminUsersManagement = () => {
  const { admin: currentAdmin } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: '', message: '' });

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'admin',
    status: 'active'
  });
  const [saving, setSaving] = useState(false);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminUsers();
      if (res.success) {
        setAdmins(res.data || []);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to load admin users.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const openAddModal = () => {
    setEditingAdmin(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'admin',
      status: 'active'
    });
    setModalOpen(true);
  };

  const openEditModal = (a) => {
    setEditingAdmin(a);
    setFormData({
      name: a.name,
      email: a.email,
      password: '',
      role: a.role,
      status: a.status
    });
    setModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingAdmin) {
        await api.updateAdminUser(editingAdmin.id || editingAdmin._id, formData);
        setToast({ type: 'success', message: 'Admin account updated.' });
      } else {
        await api.createAdminUser(formData);
        setToast({ type: 'success', message: 'Admin user created.' });
      }
      setModalOpen(false);
      fetchAdmins();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, email) => {
    if (!window.confirm(`Delete administrator "${email}"?`)) return;
    try {
      await api.deleteAdminUser(id);
      setToast({ type: 'success', message: 'Admin removed.' });
      fetchAdmins();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Administrator User Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Super Admin access: Manage dashboard administrators, roles, and security access.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#fb8236] hover:bg-[#e84e1b] text-[#171717] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-[#fb8236]/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Administrator</span>
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

      {/* Table */}
      <div className="bg-[#242424] border border-[#383838]/60 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#fb8236] animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1c1c1c] border-b border-[#383838] text-muted-foreground font-mono uppercase text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Admin Name</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Last Login</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#383838]/40">
                {admins.map((a) => {
                  const isCurrent = (a.id || a._id) === (currentAdmin?.id || currentAdmin?._id);
                  return (
                    <tr key={a.id || a._id} className="hover:bg-[#282828] transition-colors">
                      <td className="px-6 py-4 font-bold text-foreground flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-[#fb8236]/20 text-[#fb8236] flex items-center justify-center font-bold text-xs">
                          {a.name.charAt(0)}
                        </div>
                        <span>{a.name}</span>
                        {isCurrent && (
                          <span className="text-[10px] text-muted-foreground font-mono">(You)</span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-mono text-muted-foreground">
                        {a.email}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                            a.role === 'superadmin'
                              ? 'bg-[#fb8236]/20 text-[#fb8236] border border-[#fb8236]/30'
                              : 'bg-[#1c1c1c] text-muted-foreground border border-[#383838]'
                          }`}
                        >
                          {a.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`font-semibold ${
                            a.status === 'active' ? 'text-green-400' : 'text-gray-500'
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-muted-foreground">
                        {a.lastLogin ? new Date(a.lastLogin).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(a)}
                            className="w-7 h-7 rounded-lg bg-[#1a1a1a] hover:bg-[#333] border border-[#383838] flex items-center justify-center text-muted-foreground hover:text-[#fb8236]"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {!isCurrent && (
                            <button
                              onClick={() => handleDelete(a.id || a._id, a.email)}
                              className="w-7 h-7 rounded-lg bg-[#1a1a1a] hover:bg-red-950/50 border border-[#383838] flex items-center justify-center text-muted-foreground hover:text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#242424] border border-[#383838] rounded-3xl p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#383838] mb-5">
              <h3 className="font-heading font-bold text-lg text-foreground">
                {editingAdmin ? 'Edit Administrator' : 'Create Administrator'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Admin Name"
                  className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                  EMAIL ADDRESS *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@domain.com"
                  className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                  PASSWORD {editingAdmin && '(LEAVE BLANK TO KEEP UNCHANGED)'}
                </label>
                <input
                  type="password"
                  required={!editingAdmin}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                    ROLE
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                  >
                    <option value="admin">Admin</option>
                    <option value="editor">Editor</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
                    STATUS
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2 text-sm text-foreground outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
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
                  <span>Save Admin</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
