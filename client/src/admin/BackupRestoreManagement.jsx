import React, { useState } from 'react';
import { api } from '../services/api';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Download,
  Upload,
  Database,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';

export const BackupRestoreManagement = () => {
  const { reloadPortfolio } = usePortfolio();
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [toast, setToast] = useState({ type: '', message: '' });

  const handleExport = async () => {
    try {
      setExporting(true);
      setToast({ type: '', message: '' });
      await api.exportBackup();
      setToast({ type: 'success', message: 'Database backup downloaded successfully as JSON.' });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Export failed.' });
    } finally {
      setExporting(false);
    }
  };

  const handleImportFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!window.confirm('WARNING: Restoring from a backup will overwrite existing portfolio records with the backup snapshot. Do you want to proceed?')) {
      e.target.value = '';
      return;
    }

    try {
      setImporting(true);
      setToast({ type: '', message: '' });

      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!parsed.data) {
        throw new Error('Invalid backup file. Missing "data" payload property.');
      }

      const res = await api.importBackup(parsed);
      if (res.success) {
        setToast({ type: 'success', message: 'Portfolio database restored successfully!' });
        reloadPortfolio();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Restore failed. Please verify JSON file format.' });
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">
          Backup & Data Disaster Recovery
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Export full JSON snapshots of your portfolio database or restore data from an existing backup.
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="bg-[#242424] border border-[#383838]/60 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#fb8236]/15 border border-[#fb8236]/30 text-[#fb8236] flex items-center justify-center mb-4">
              <Download className="w-6 h-6" />
            </div>
            <h2 className="font-heading font-bold text-lg text-foreground">
              Export Database Snapshot
            </h2>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Creates a complete portable JSON export containing your profile, experiences, projects, skills, education, certifications, and settings. Sensitive administrator hashes are safely excluded.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-[#383838]/40">
            <button
              onClick={handleExport}
              disabled={exporting}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#fb8236] hover:bg-[#e84e1b] disabled:opacity-50 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-[#fb8236]/20 cursor-pointer"
            >
              {exporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Backup...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Backup JSON</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Import / Restore Card */}
        <div className="bg-[#242424] border border-[#383838]/60 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-[#f8af26] flex items-center justify-center mb-4">
              <Upload className="w-6 h-6" />
            </div>
            <h2 className="font-heading font-bold text-lg text-foreground">
              Restore from Backup
            </h2>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              Restore all portfolio tables from a previously exported JSON backup file. This replaces the active records with the backup dataset after explicit confirmation.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-[#383838]/40">
            <label className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1c1c1c] hover:bg-[#282828] border border-[#383838] text-foreground font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer">
              {importing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#fb8236]" />
                  <span>Restoring Database...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-[#fb8236]" />
                  <span>Upload & Restore Backup</span>
                </>
              )}
              <input
                type="file"
                accept=".json,application/json"
                disabled={importing}
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
