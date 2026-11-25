import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { api } from '../services/api';
import { Download, FileText, Database, Code, FolderGit2, BookOpen, ExternalLink, Search, Loader2, Layers } from 'lucide-react';

export const ResourcesPage = () => {
  const [activeTab, setActiveTab] = useState('materials');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchResources = () => {
    setLoading(true);
    api.getResources(`?enabledOnly=true&_t=${Date.now()}`)
      .then((res) => {
        if (res?.success && Array.isArray(res.data)) {
          setResources(res.data);
        } else {
          setResources([]);
        }
      })
      .catch((err) => {
        console.error('Failed to load resources:', err);
        setResources([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const getFormatIcon = (format = '', category = '') => {
    const f = (format || '').toLowerCase();
    const c = (category || '').toLowerCase();
    if (f.includes('sql') || c.includes('sql')) return <Database className="w-5 h-5 text-[#f8af26]" />;
    if (f.includes('py') || f.includes('ipynb') || c.includes('python')) return <Code className="w-5 h-5 text-[#fb8236]" />;
    if (f.includes('excel') || f.includes('xlsx') || f.includes('pbix') || c.includes('power bi')) return <BookOpen className="w-5 h-5 text-[#f8af26]" />;
    if (f.includes('git') || c.includes('project')) return <FolderGit2 className="w-5 h-5 text-[#fb8236]" />;
    return <FileText className="w-5 h-5 text-[#fb8236]" />;
  };

  const studyMaterials = resources.filter((r) => r.type === 'material');
  const projectFiles = resources.filter((r) => r.type === 'project');

  const displayedList = (activeTab === 'materials' ? studyMaterials : projectFiles).filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q)) ||
      (item.format && item.format.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#171717] text-[#fafafa] relative overflow-hidden">
      <div className="ambient-glow" />
      <Navbar />

      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16 sm:pb-20">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase border border-[#fb8236]/30 bg-[#fb8236]/10 text-[#fb8236] mb-3">
            <span>DOWNLOADS & ASSETS</span>
          </div>
          <h1 className="font-heading text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Resources & <span className="text-[#fb8236]">Materials.</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">
            Browse and download study materials, SQL references, and project artifacts.
          </p>

          {/* Quick Search */}
          <div className="relative max-w-md mx-auto mt-6">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, keyword, or file type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#242424] border border-[#383838] rounded-full pl-10 pr-4 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#fb8236] shadow-sm"
            />
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center mb-8 px-1">
          <div className="w-full max-w-md bg-[#242424] border border-[#383838] p-1 rounded-full flex items-center justify-between">
            <button
              onClick={() => setActiveTab('materials')}
              className={`flex-1 text-center px-2.5 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'materials'
                  ? 'bg-[#fb8236] text-black shadow-md font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Study Materials ({studyMaterials.length})
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 text-center px-2.5 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-[#fb8236] text-black shadow-md font-bold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Project Files ({projectFiles.length})
            </button>
          </div>
        </div>

        {/* List of Resource Cards */}
        {loading ? (
          <div className="p-16 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-[#fb8236] animate-spin" />
            <p className="text-xs font-mono">Loading downloadable assets...</p>
          </div>
        ) : displayedList.length === 0 ? (
          <div className="bg-[#242424] border border-[#383838] rounded-2xl p-8 sm:p-12 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-muted/30 text-muted-foreground flex items-center justify-center mx-auto mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-foreground">
              {searchQuery ? 'No matching resources found.' : `No ${activeTab === 'materials' ? 'study materials' : 'project files'} currently available.`}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {searchQuery ? 'Try clearing your search keyword.' : 'Check back later for newly published downloads.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedList.map((item, idx) => (
              <div
                key={item._id || item.id || idx}
                className="bg-[#242424] border border-[#383838]/60 hover:border-[#fb8236]/50 rounded-2xl p-4 sm:p-6 shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1c1c1c] border border-[#383838] flex items-center justify-center shrink-0">
                      {getFormatIcon(item.format, item.category)}
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[11px]">
                      <span className="px-2 py-0.5 rounded-md bg-[#1a1a1a] border border-[#383838] text-muted-foreground">
                        {item.format}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-[#fb8236]/10 text-[#fb8236] border border-[#fb8236]/30 font-semibold">
                        {item.size}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-[#f8af26] uppercase mt-3">
                    {item.category}
                  </div>
                  <h3 className="font-heading font-bold text-base text-foreground mt-0.5 group-hover:text-[#fb8236] transition-colors">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-[#383838]/40">
                  {item.isExternal ? (
                    <a
                      href={item.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#1c1c1c] hover:bg-[#282828] border border-[#383838] text-xs font-semibold text-foreground transition-colors"
                    >
                      <span>View Repository</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <a
                      href={item.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#fb8236] hover:bg-[#e84e1b] text-black text-xs font-bold transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Asset</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};
