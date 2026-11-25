import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { usePortfolio } from '../context/PortfolioContext';
import {
  Upload,
  FileText,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Check,
  Calendar,
  HardDrive
} from 'lucide-react';

export const ResumeManagement = () => {
  const { reloadPortfolio } = usePortfolio();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [versionInput, setVersionInput] = useState('');
  const [toast, setToast] = useState({ type: '', message: '' });

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await api.getResumes();
      if (res.success) {
        setResumes(res.data || []);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setToast({ type: 'error', message: 'Only PDF documents are accepted for resumes.' });
      return;
    }

    try {
      setUploading(true);
      setToast({ type: '', message: '' });

      const formData = new FormData();
      formData.append('resumeFile', file);
      formData.append('version', versionInput || `v${new Date().toLocaleDateString('en-CA')}`);

      const res = await api.uploadResume(formData);
      if (res.success) {
        setToast({ type: 'success', message: 'New resume uploaded and set as active published resume!' });
        setVersionInput('');
        fetchResumes();
        reloadPortfolio();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to upload resume.' });
    } finally {
      setUploading(false);
    }
  };

  const handleSetActive = async (id) => {
    try {
      await api.setActiveResume(id);
      setToast({ type: 'success', message: 'Active resume updated.' });
      fetchResumes();
      reloadPortfolio();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete resume "${name}"?`)) return;
    try {
      await api.deleteResume(id);
      setToast({ type: 'success', message: 'Resume deleted.' });
      fetchResumes();
      reloadPortfolio();
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb > 1024) return `${(kb / 1024).toFixed(1)} MB`;
    return `${kb.toFixed(1)} KB`;
  };

  const activeResume = resumes.find((r) => r.isPublished) || resumes[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Resume Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upload, replace, and configure the published resume downloaded by visitors.
          </p>
        </div>
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

      {/* Active Resume Showcase Box */}
      {activeResume && (
        <div className="bg-[#242424] border border-[#fb8236]/40 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[#fb8236]/15 border border-[#fb8236]/30 text-[#fb8236] flex items-center justify-center shrink-0 shadow-md">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fb8236] text-black">
                  ACTIVE PUBLISHED RESUME
                </span>
                <span className="text-xs font-mono text-muted-foreground">
                  Version: {activeResume.version || '1.0'}
                </span>
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground mt-1">
                {activeResume.originalName || activeResume.fileName}
              </h3>
              <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5 text-[#fb8236]" />
                  {formatFileSize(activeResume.fileSizeBytes)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(activeResume.uploadedAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <a
              href="/api/resume/download"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#fb8236] hover:bg-[#e84e1b] text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Download & Verify</span>
            </a>
          </div>
        </div>
      )}

      {/* Upload New Resume Card */}
      <div className="bg-[#242424] border border-[#383838]/60 rounded-3xl p-6 sm:p-8 shadow-md">
        <h2 className="font-heading font-bold text-base text-foreground mb-1">
          Upload / Replace Resume PDF
        </h2>
        <p className="text-xs text-muted-foreground mb-6">
          Uploading a new PDF replaces the public "Download CV" button target across the entire portfolio.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-64">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1 font-semibold">
              VERSION LABEL
            </label>
            <input
              type="text"
              value={versionInput}
              onChange={(e) => setVersionInput(e.target.value)}
              placeholder="e.g. v2026.1 - Updated MIS"
              className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-xs text-foreground outline-none"
            />
          </div>

          <div className="self-end w-full sm:w-auto mt-2 sm:mt-0">
            <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#1c1c1c] hover:bg-[#282828] border border-[#383838] text-foreground text-xs font-semibold cursor-pointer transition-colors">
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#fb8236]" />
                  <span>Uploading PDF...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 text-[#fb8236]" />
                  <span>Select Resume PDF to Upload</span>
                </>
              )}
              <input
                type="file"
                accept="application/pdf"
                disabled={uploading}
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Uploaded History Table */}
      <div className="bg-[#242424] border border-[#383838]/60 rounded-3xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-[#383838]">
          <h3 className="font-heading font-bold text-sm text-foreground">
            Version History
          </h3>
        </div>

        {loading ? (
          <div className="h-40 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-[#fb8236] animate-spin" />
          </div>
        ) : resumes.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            No resume records uploaded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1c1c1c] border-b border-[#383838] text-muted-foreground font-mono uppercase text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">File Name</th>
                  <th className="px-6 py-3.5">Version</th>
                  <th className="px-6 py-3.5">Size</th>
                  <th className="px-6 py-3.5">Uploaded Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#383838]/40">
                {resumes.map((r) => (
                  <tr key={r._id || r.id} className="hover:bg-[#282828] transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#fb8236]" />
                      <span>{r.originalName || r.fileName}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-muted-foreground">
                      {r.version || '1.0'}
                    </td>
                    <td className="px-6 py-4 font-mono text-muted-foreground">
                      {formatFileSize(r.fileSizeBytes)}
                    </td>
                    <td className="px-6 py-4 font-mono text-muted-foreground">
                      {new Date(r.uploadedAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {r.isPublished ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fb8236]/20 text-[#fb8236] border border-[#fb8236]/30">
                          Active
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetActive(r._id || r.id)}
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#1a1a1a] hover:bg-[#333] border border-[#383838] text-muted-foreground hover:text-foreground"
                        >
                          Set Active
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(r._id || r.id, r.originalName || r.fileName)}
                        className="w-7 h-7 rounded-lg bg-[#1a1a1a] hover:bg-red-950/50 border border-[#383838] inline-flex items-center justify-center text-muted-foreground hover:text-red-400"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
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
