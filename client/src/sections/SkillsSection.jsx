import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { defaultSkills } from '../data/defaultPortfolioData';
import {
  Code,
  Terminal,
  Database,
  Table,
  BarChart3,
  BarChart2,
  PieChart,
  LineChart,
  Layers,
  Filter,
  Brain,
  ShieldCheck,
  FileText,
  Search,
  Cpu,
  Eye,
  GitBranch,
  TrendingUp,
  Share2,
  Binary,
  Sigma,
  Layout,
  Palette,
  FileCode,
  Activity
} from 'lucide-react';

export const SkillsSection = () => {
  const { skills } = usePortfolio();
  const effectiveSkills = (skills && skills.length > 0) ? skills : defaultSkills;
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    'All',
    'Database and Tools',
    'Programming Languages',
    'Data Analysis',
    'Python Libraries',
    'Excel',
    'Machine Learning',
    'Core Concepts',
    'Web Technologies'
  ];

  const getSkillIcon = (name, iconName) => {
    const n = (name || '').toLowerCase();
    const ic = (iconName || '').toLowerCase();

    if (n.includes('python') || ic === 'terminal') return <Terminal className="w-5 h-5" />;
    if (n.includes('sql') || ic === 'database') return <Database className="w-5 h-5" />;
    if (n.includes('excel') || ic === 'table') return <Table className="w-5 h-5" />;
    if (n.includes('power bi') || ic === 'bar-chart-3') return <BarChart3 className="w-5 h-5" />;
    if (n.includes('pandas') || ic === 'binary') return <Binary className="w-5 h-5" />;
    if (n.includes('numpy') || ic === 'cpu') return <Cpu className="w-5 h-5" />;
    if (n.includes('matplotlib') || ic === 'line-chart') return <LineChart className="w-5 h-5" />;
    if (n.includes('seaborn') || ic === 'pie-chart') return <PieChart className="w-5 h-5" />;
    if (n.includes('plotly') || ic === 'activity') return <Activity className="w-5 h-5" />;
    if (n.includes('scikit') || ic === 'network') return <Share2 className="w-5 h-5" />;
    if (n.includes('opencv') || ic === 'eye') return <Eye className="w-5 h-5" />;
    if (n.includes('clean') || ic === 'check-circle') return <ShieldCheck className="w-5 h-5" />;
    if (n.includes('exploratory') || ic === 'search') return <Search className="w-5 h-5" />;
    if (n.includes('visual') || ic === 'bar-chart-2') return <BarChart2 className="w-5 h-5" />;
    if (n.includes('reporting') || ic === 'file-text') return <FileText className="w-5 h-5" />;
    if (n.includes('regression') || ic === 'trending-up') return <TrendingUp className="w-5 h-5" />;
    if (n.includes('classification') || ic === 'git-branch') return <GitBranch className="w-5 h-5" />;
    if (n.includes('clustering') || ic === 'share-2') return <Share2 className="w-5 h-5" />;
    if (n.includes('vlookup') || n.includes('pivot') || ic === 'layers') return <Layers className="w-5 h-5" />;
    if (n.includes('statistic') || ic === 'sigma') return <Sigma className="w-5 h-5" />;
    if (n.includes('ai') || n.includes('artificial') || ic === 'brain') return <Brain className="w-5 h-5" />;
    if (n.includes('html') || ic === 'layout') return <Layout className="w-5 h-5" />;
    if (n.includes('css') || ic === 'palette') return <Palette className="w-5 h-5" />;
    if (n.includes('js') || n.includes('javascript') || ic === 'file-code') return <FileCode className="w-5 h-5" />;

    return <Code className="w-5 h-5" />;
  };

  const filteredSkills = effectiveSkills.filter((s) => {
    if (activeCategory === 'All') return s.isEnabled !== false;
    return s.category === activeCategory && s.isEnabled !== false;
  });

  return (
    <section id="skills" className="py-8 sm:py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Toolkit
          </h2>
          <p className="mt-2 text-sm sm:text-lg text-primary font-medium">
            Skills & <span className="text-primary">tools.</span>
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            The stack I reach for across analysis, modeling, and automated MIS reporting.
          </p>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2.5 mb-6 scrollbar-none -mx-1 px-1 sm:mx-0 sm:px-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              activeCategory === cat
                ? 'bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20'
                : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {filteredSkills.map((skill, idx) => (
          <div
            key={skill._id || skill.id || idx}
            className="bg-card rounded-2xl p-3.5 sm:p-5 flex items-start gap-3 sm:gap-4 transition-all duration-300 group hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
              {getSkillIcon(skill.name, skill.icon)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-sm sm:text-base text-foreground truncate group-hover:text-primary transition-colors">
                  {skill.name}
                </h3>
              </div>
              <p className="text-[11px] text-muted-foreground font-mono mt-0.5 truncate">
                {skill.category}
              </p>
              {skill.proficiency && (
                <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden mt-2.5 sm:mt-3">
                  <div
                    className="bg-gradient-to-r from-primary to-accent h-full rounded-full transition-all duration-500"
                    style={{ width: `${skill.proficiency}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
