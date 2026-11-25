import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  Users,
  FolderKanban,
  Code,
  Briefcase,
  Award,
  MessageSquare,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Loader2,
  Calendar
} from 'lucide-react';

export const DashboardOverview = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardStats();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#fb8236] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-xs">
        {error}
      </div>
    );
  }

  const stats = data?.stats || {};
  const timeline = data?.timelineData || [];
  const maxVisitors = Math.max(...timeline.map((t) => t.visitors), 1);

  const statCards = [
    { title: 'Total Visitors', value: stats.totalVisitors || 0, icon: Users, color: 'text-[#fb8236]', link: null },
    { title: 'Total Projects', value: stats.totalProjects || 0, icon: FolderKanban, color: 'text-[#f8af26]', link: '/admin/projects' },
    { title: 'Skills & Tools', value: stats.totalSkills || 0, icon: Code, color: 'text-[#fb8236]', link: '/admin/skills' },
    { title: 'Work Experiences', value: stats.totalExperiences || 0, icon: Briefcase, color: 'text-[#f8af26]', link: '/admin/experience' },
    { title: 'Certifications', value: stats.totalCertifications || 0, icon: Award, color: 'text-[#fb8236]', link: '/admin/certifications' },
    {
      title: 'Contact Messages',
      value: stats.totalMessages || 0,
      subValue: stats.unreadMessages > 0 ? `${stats.unreadMessages} unread` : 'All read',
      icon: MessageSquare,
      color: 'text-amber-400',
      link: '/admin/messages'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Page Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            System Overview & Analytics
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time tracked analytics, visitor counts, and portfolio statistics.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono bg-[#242424] border border-[#383838] text-foreground">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />
          <span>Live MongoDB / Data Engine</span>
        </div>
      </div>

      {/* Summary KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-[#242424] border border-[#383838]/60 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-[#fb8236]/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                    {card.title}
                  </span>
                  <div className="font-heading text-3xl font-extrabold text-foreground mt-1">
                    {card.value}
                  </div>
                  {card.subValue && (
                    <span className="text-[11px] font-mono text-[#fb8236] mt-0.5 block font-semibold">
                      {card.subValue}
                    </span>
                  )}
                </div>
                <div className={`w-10 h-10 rounded-xl bg-[#1c1c1c] border border-[#383838] flex items-center justify-center ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {card.link && (
                <div className="mt-4 pt-3 border-t border-[#383838]/40">
                  <Link
                    to={card.link}
                    className="text-xs text-[#fb8236] hover:underline inline-flex items-center gap-1 font-semibold"
                  >
                    <span>Manage Module</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Charts & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visitor Traffic Analytics Chart */}
        <div className="lg:col-span-8 bg-[#242424] border border-[#383838]/60 rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading font-bold text-base text-foreground">
                Website Visitor Statistics
              </h2>
              <p className="text-xs text-muted-foreground">
                Daily sessions tracked over the past 7 days
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 text-[#fb8236]" />
              <span>7-Day Window</span>
            </div>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-56 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2 border-b border-[#383838]">
            {timeline.map((item, idx) => {
              const heightPercent = Math.max((item.visitors / maxVisitors) * 100, 8);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] font-mono text-muted-foreground group-hover:text-[#fb8236] transition-colors">
                    {item.visitors}
                  </div>
                  <div className="w-full bg-[#1c1c1c] rounded-t-lg h-40 flex items-end overflow-hidden p-1">
                    <div
                      className="w-full bg-gradient-to-t from-[#fb8236] to-[#f8af26] rounded-t transition-all duration-500 group-hover:brightness-110"
                      style={{ height: `${heightPercent}%` }}
                    />
                  </div>
                  <div className="text-[11px] font-mono text-foreground font-semibold">
                    {item.label}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground mt-4 pt-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#fb8236]" />
              <span>Unique Daily Visitors</span>
            </span>
            <span className="font-mono">Total Tracked: {stats.totalVisitors || 0}</span>
          </div>
        </div>

        {/* Top Pages Breakdown */}
        <div className="lg:col-span-4 bg-[#242424] border border-[#383838]/60 rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <h2 className="font-heading font-bold text-base text-foreground mb-1">
              Top Page Views
            </h2>
            <p className="text-xs text-muted-foreground mb-4">
              Breakdown of popular URLs visited
            </p>

            <div className="space-y-3">
              {(data?.pagesBreakdown || [
                { page: '/', count: 184 },
                { page: '/resources', count: 42 }
              ]).map((p, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[#1c1c1c] border border-[#383838] flex items-center justify-between text-xs"
                >
                  <span className="font-mono text-foreground font-semibold truncate">
                    {p.page}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#fb8236]/15 text-[#fb8236] font-mono font-bold">
                    {p.count} views
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#383838]/40 text-center">
            <Link
              to="/admin/activity-logs"
              className="text-xs text-[#fb8236] hover:underline font-semibold"
            >
              View Full Audit Trail →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Admin Activity Feed */}
      <div className="bg-[#242424] border border-[#383838]/60 rounded-2xl p-6 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#fb8236]" />
            <h2 className="font-heading font-bold text-base text-foreground">
              Recent System Activity
            </h2>
          </div>
          <Link
            to="/admin/activity-logs"
            className="text-xs text-muted-foreground hover:text-[#fb8236] transition-colors"
          >
            See all logs
          </Link>
        </div>

        <div className="divide-y divide-[#383838]/40">
          {(data?.recentActivities || []).length > 0 ? (
            data.recentActivities.slice(0, 5).map((log, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded-md font-mono text-[10px] bg-[#1a1a1a] border border-[#383838] text-[#fb8236] uppercase font-bold">
                    {log.action}
                  </span>
                  <div>
                    <span className="font-semibold text-foreground">{log.module}: </span>
                    <span className="text-muted-foreground">{log.description}</span>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-muted-foreground shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground py-3">No recent activities logged yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
