const bcrypt = require('bcryptjs');
const models = require('../models');
const { logActivity } = require('../middleware/auth');

const getAllAdmins = async (req, res) => {
  try {
    const admins = await models.Admin.find();
    // Exclude password hashes
    const safeAdmins = admins.map(a => ({
      id: a._id || a.id,
      name: a.name,
      email: a.email,
      role: a.role,
      status: a.status,
      avatar: a.avatar,
      lastLogin: a.lastLogin,
      createdAt: a.createdAt
    }));
    return res.json({ success: true, count: safeAdmins.length, data: safeAdmins });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const existing = await models.Admin.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'An administrator with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await models.Admin.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'admin',
      status: status || 'active',
      avatar: '/uploads/images/avatar.png'
    });

    await logActivity(req.admin, 'CREATE', 'AdminUsers', `Created new admin account for ${newAdmin.email} (${newAdmin.role})`, req);
    return res.status(201).json({
      success: true,
      message: 'Administrator created successfully.',
      data: {
        id: newAdmin._id || newAdmin.id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
        status: newAdmin.status
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, status, password } = req.body;

    const admin = await models.Admin.findById(id);
    if (!admin) return res.status(404).json({ success: false, message: 'Administrator not found.' });

    const updates = {};
    if (name) updates.name = name.trim();
    if (email) updates.email = email.toLowerCase().trim();
    if (role) updates.role = role;
    if (status) updates.status = status;
    if (password) updates.password = await bcrypt.hash(password, 10);

    const updated = await models.Admin.findByIdAndUpdate(id, updates);
    await logActivity(req.admin, 'UPDATE', 'AdminUsers', `Updated admin ${admin.email}`, req);

    return res.json({
      success: true,
      message: 'Administrator updated successfully.',
      data: {
        id: updated._id || updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        status: updated.status
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    if (String(req.admin._id || req.admin.id) === String(id)) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
    }

    const deleted = await models.Admin.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Administrator not found.' });

    await logActivity(req.admin, 'DELETE', 'AdminUsers', `Deleted administrator account ${deleted.email}`, req);
    return res.json({ success: true, message: 'Administrator deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllAdmins, createAdmin, updateAdmin, deleteAdmin };
