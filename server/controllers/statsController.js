const models = require('../models');

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalVisitors,
      totalProjects,
      totalSkills,
      totalExperiences,
      totalCertifications,
      totalMessages,
      unreadMessages,
      recentActivities,
      allVisitors,
      allMessages
    ] = await Promise.all([
      models.VisitorAnalytics.countDocuments(),
      models.Project.countDocuments(),
      models.Skill.countDocuments(),
      models.Experience.countDocuments(),
      models.Certification.countDocuments(),
      models.Message.countDocuments(),
      models.Message.countDocuments({ isRead: false }),
      models.ActivityLog.find({}, { timestamp: -1 }),
      models.VisitorAnalytics.find({}, { timestamp: -1 }),
      models.Message.find({}, { createdAt: -1 })
    ]);

    // Group visitors by last 7 days
    const dailyMap = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      dailyMap[ds] = { date: ds, label: dayName, visitors: 0, messages: 0 };
    }

    (allVisitors || []).forEach(v => {
      const ds = v.dateString || (v.timestamp ? new Date(v.timestamp).toISOString().split('T')[0] : '');
      if (dailyMap[ds]) {
        dailyMap[ds].visitors += 1;
      }
    });

    (allMessages || []).forEach(m => {
      const ds = m.createdAt ? new Date(m.createdAt).toISOString().split('T')[0] : '';
      if (dailyMap[ds]) {
        dailyMap[ds].messages += 1;
      }
    });

    const timelineData = Object.values(dailyMap);

    // Top pages breakdown
    const pagesMap = {};
    (allVisitors || []).forEach(v => {
      const p = v.page || '/';
      pagesMap[p] = (pagesMap[p] || 0) + 1;
    });

    return res.json({
      success: true,
      stats: {
        totalVisitors,
        totalProjects,
        totalSkills,
        totalExperiences,
        totalCertifications,
        totalMessages,
        unreadMessages
      },
      timelineData,
      recentActivities: (recentActivities || []).slice(0, 10),
      pagesBreakdown: Object.entries(pagesMap).map(([page, count]) => ({ page, count }))
    });
  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats };
