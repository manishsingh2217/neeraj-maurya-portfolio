const models = require('../models');

const getActivityLogs = async (req, res) => {
  try {
    const { module: modFilter, action: actionFilter, limit = 50 } = req.query;
    let query = {};
    if (modFilter && modFilter !== 'All') query.module = modFilter;
    if (actionFilter && actionFilter !== 'All') query.action = actionFilter;

    const logs = await models.ActivityLog.find(query, { timestamp: -1 });
    const limitedLogs = (logs || []).slice(0, Number(limit));

    return res.json({
      success: true,
      count: limitedLogs.length,
      data: limitedLogs
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const clearActivityLogs = async (req, res) => {
  try {
    await models.ActivityLog.deleteMany({});
    return res.json({ success: true, message: 'Activity logs cleared.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getActivityLogs, clearActivityLogs };
