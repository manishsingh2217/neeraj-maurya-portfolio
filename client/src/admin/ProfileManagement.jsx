import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { usePortfolio } from '../context/PortfolioContext';
import { Save, Upload, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export const ProfileManagement = () => {
  const { reloadPortfolio } = usePortfolio();
  const [profile, setProfile] = useState({
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    bioSummary: '',
    availabilityStatus: '',
    isAvailable: true,
    heroTypingWords: [],
    languages: [],
    careerInterests: '',
    resumeDriveUrl: ''
  });
  const [typingWordsInput, setTypingWordsInput] = useState('');
  const [languagesInput, setLanguagesInput] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.getProfile();
        if (res.success && res.data) {
          setProfile(res.data);
          setTypingWordsInput((res.data.heroTypingWords || []).join(', '));
          setLanguagesInput((res.data.languages || []).join(', '));
          if (res.data.profileImage) {
            setPreviewUrl(res.data.profileImage);
          }
        }
      } catch (err) {
        setToast({ type: 'error', message: err.message || 'Failed to load profile.' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setToast({ type: '', message: '' });

      const formData = new FormData();
      formData.append('fullName', profile.fullName);
      formData.append('title', profile.title);
      formData.append('email', profile.email);
      formData.append('phone', profile.phone);
      formData.append('location', profile.location);
      formData.append('bioSummary', profile.bioSummary);
      formData.append('availabilityStatus', profile.availabilityStatus);
      formData.append('isAvailable', profile.isAvailable);
      formData.append('careerInterests', profile.careerInterests);
      formData.append('resumeDriveUrl', profile.resumeDriveUrl || '');

      // Arrays
      const wordsArr = typingWordsInput.split(',').map((w) => w.trim()).filter(Boolean);
      formData.append('heroTypingWords', JSON.stringify(wordsArr));

      const langArr = languagesInput.split(',').map((l) => l.trim()).filter(Boolean);
      formData.append('languages', JSON.stringify(langArr));

      if (avatarFile) {
        formData.append('profileImage', avatarFile);
      }

      const res = await api.updateProfile(formData);
      if (res.success) {
        setToast({ type: 'success', message: 'Profile updated and published successfully!' });
        reloadPortfolio();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#fb8236] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Profile & Personal Information
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your personal bio, contact info, availability, and hero headline words.
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

      <form onSubmit={handleSubmit} className="bg-[#242424] border border-[#383838]/60 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Profile Picture Upload & Preview */}
        <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-[#383838]/50">
          <div className="w-28 h-28 rounded-2xl overflow-hidden border border-[#383838] bg-[#1a1a1a] shrink-0 relative flex items-center justify-center shadow-md">
            <img
              src={previewUrl || '/neeraj-profile.jpeg'}
              alt="Profile"
              className="w-full h-full object-cover object-top"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/neeraj-profile.jpeg';
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-foreground mb-1">
              Profile Photo
            </label>
            <p className="text-xs text-muted-foreground mb-3">
              Upload a professional portrait image (JPG, PNG, or WEBP up to 5MB).
            </p>
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1c1c1c] hover:bg-[#282828] border border-[#383838] text-xs font-semibold text-foreground cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 text-[#fb8236]" />
              <span>Choose New Photo</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </div>

        {/* Basic Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              FULL NAME *
            </label>
            <input
              type="text"
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              required
              className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              PROFESSIONAL TITLE *
            </label>
            <input
              type="text"
              name="title"
              value={profile.title}
              onChange={handleChange}
              required
              className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              EMAIL ADDRESS *
            </label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              required
              className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              PHONE NUMBER *
            </label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              required
              className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              LOCATION *
            </label>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
              required
              className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              AVAILABILITY STATUS BADGE
            </label>
            <input
              type="text"
              name="availabilityStatus"
              value={profile.availabilityStatus}
              onChange={handleChange}
              placeholder="OPEN TO OPPORTUNITIES"
              className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              GOOGLE DRIVE RESUME / CV DOWNLOAD LINK
            </label>
            <input
              type="url"
              name="resumeDriveUrl"
              value={profile.resumeDriveUrl || ''}
              onChange={handleChange}
              placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
              className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors"
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              The "Download CV" button on your sticky profile card opens this Google Drive link directly.
            </p>
          </div>
        </div>

        {/* Hero Typewriter Words */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
            HERO ANIMATED TYPING ROLES (COMMA SEPARATED)
          </label>
          <input
            type="text"
            value={typingWordsInput}
            onChange={(e) => setTypingWordsInput(e.target.value)}
            placeholder="Data Analyst, MIS Executive, Business Intelligence Specialist, Computer Science Graduate"
            className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors"
          />
        </div>

        {/* Professional Summary */}
        <div>
          <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
            PROFESSIONAL SUMMARY
          </label>
          <textarea
            name="bioSummary"
            rows="4"
            value={profile.bioSummary}
            onChange={handleChange}
            className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors resize-none"
          />
        </div>

        {/* Career Interests & Languages */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              CAREER INTERESTS
            </label>
            <input
              type="text"
              name="careerInterests"
              value={profile.careerInterests}
              onChange={handleChange}
              className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold">
              LANGUAGES (COMMA SEPARATED)
            </label>
            <input
              type="text"
              value={languagesInput}
              onChange={(e) => setLanguagesInput(e.target.value)}
              placeholder="English (Professional Working), Hindi (Native)"
              className="w-full bg-[#171717] border border-[#383838] focus:border-[#fb8236] rounded-xl px-4 py-2.5 text-sm text-foreground outline-none transition-colors"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-[#383838]/50 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#fb8236] hover:bg-[#e84e1b] disabled:opacity-50 text-[#171717] font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-[#fb8236]/20 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
