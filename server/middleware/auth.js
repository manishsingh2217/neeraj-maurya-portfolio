const jwt = require('jsonwebtoken');
const models = require('../models');

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_neeraj_portfolio_2026_secure');

    const admin = await models.Admin.findById(decoded.id);
    if (!admin || admin.status === 'inactive') {
      return res.status(401).json({ success: false, message: 'User account not found or deactivated.' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.admin) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ success: false, message: `Access denied. Requires one of: ${roles.join(', ')}` });
    }
    next();
  };
};

const logActivity = async (admin, action, moduleName, description, req) => {
  try {
    const ip = req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1') : '127.0.0.1';
    await models.ActivityLog.create({
      adminId: admin ? (admin._id || admin.id) : 'system',
      adminEmail: admin ? admin.email : 'system',
      adminName: admin ? admin.name : 'System',
      action,
      module: moduleName,
      description,
      ipAddress: String(ip).replace('::ffff:', ''),
      timestamp: new Date()
    });
  } catch (err) {
    console.error('Failed to log activity:', err.message);
  }
};

module.exports = { verifyToken, requireRole, logActivity };
