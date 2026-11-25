import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  History,
  Trash2,
  Filter,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  Globe
} from 'lucide-react';

export const ActivityLogsManagement = () => {
  const { isSuperAdmin } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');
  const [toast, setToast] = useState({ type: '', message: '' });

  const modules = ['All', 'Auth', 'Profile', 'About', 'Skills', 'Experience', 'Projects', 'Education', 'Certifications', 'Resume', 'Messages', 'Settings', 'Appearance', 'AdminUsers', 'System'];
  const actions = ['All', 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'BACKUP', 'RESTORE'];

  const fetchLogs = async () => {
    try {
      setLoading(true);
      let query = `?limit=100`;
      if (moduleFilter !== 'All') query += `&module=${moduleFilter}`;
      if (actionFilter !== 'All') query += `&action=${actionFilter}`;
      const res = await api.getActivityLogs(query);
      if (res.success) {
        setLogs(res.data || []);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to load logs.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [moduleFilter, actionFilter]);

  const handleClear = async () => {
    if (!window.confirm('Are you sure you want to clear all activity logs? This action cannot be undone.')) return;
    try {
      await api.clearActivityLogs();
      setToast({ type: 'success', message: 'Activity audit logs cleared.' });
      fetchLogs();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  const getActionBadgeClass = (action) => {
    switch (action) {
      case 'CREATE':
        return 'bg-green-950/40 text-green-400 border-green-500/30';
      case 'UPDATE':
        return 'bg-blue-950/40 text-blue-400 border-blue-500/30';
      case 'DELETE':
        return 'bg-red-950/40 text-red-400 border-red-500/30';
      case 'LOGIN':
        return 'bg-[#fb8236]/20 text-[#fb8236] border-[#fb8236]/30';
      default:
        return 'bg-[#1c1c1c] text-muted-foreground border-[#383838]';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Admin Activity Audit Logs
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Immutable log of all administrative actions, updates, logins, and deletions.
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-500/30 text-red-400 font-bold text-xs uppercase tracking-wider transition-all self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear Logs</span>
          </button>
        )}
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

      {/* Filter Bar */}
      <div className="bg-[#242424] border border-[#383838]/60 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-muted-foreground">Module:</span>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-3 py-1.5 text-xs text-foreground outline-none"
            >
              {modules.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono uppercase text-muted-foreground">Action:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-3 py-1.5 text-xs text-foreground outline-none"
            >
              {actions.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>

        <span className="text-xs font-mono text-muted-foreground">
          Showing {logs.length} logged entries
        </span>
      </div>

      {/* Logs Table */}
      <div className="bg-[#242424] border border-[#383838]/60 rounded-3xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#fb8236] animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-xs text-muted-foreground">
            No activity log entries match the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1c1c1c] border-b border-[#383838] text-muted-foreground font-mono uppercase text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Timestamp</th>
                  <th className="px-6 py-3.5">Action</th>
                  <th className="px-6 py-3.5">Module</th>
                  <th className="px-6 py-3.5">Description</th>
                  <th className="px-6 py-3.5">Administrator</th>
                  <th className="px-6 py-3.5 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#383838]/40">
                {logs.map((log, idx) => (
                  <tr key={log._id || log.id || idx} className="hover:bg-[#282828] transition-colors">
                    <td className="px-6 py-3.5 font-mono text-muted-foreground whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold border ${getActionBadgeClass(log.action)}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 font-mono font-semibold text-foreground">
                      {log.module}
                    </td>
                    <td className="px-6 py-3.5 text-muted-foreground max-w-sm truncate">
                      {log.description}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-foreground">
                      {log.adminName || log.adminEmail || 'System'}
                    </td>
                    <td className="px-6 py-3.5 text-right font-mono text-muted-foreground">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
