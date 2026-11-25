const models = require('../models');
const { logActivity } = require('../middleware/auth');

const getAllExperience = async (req, res) => {
  try {
    const experiences = await models.Experience.find({}, { order: 1 });
    return res.json({ success: true, count: experiences.length, data: experiences });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createExperience = async (req, res) => {
  try {
    const { company, role, employmentType, location, startDate, endDate, isCurrent, responsibilities, order } = req.body;
    const roleName = role || req.body.position || req.body.title;
    if (!company || !roleName || !location || !startDate) {
      return res.status(400).json({ success: false, message: 'Company, role/position, location, and start date are required.' });
    }

    let respArray = [];
    if (Array.isArray(responsibilities)) {
      respArray = responsibilities;
    } else if (typeof responsibilities === 'string') {
      try {
        respArray = JSON.parse(responsibilities);
      } catch (e) {
        respArray = responsibilities.split('\n').filter(Boolean);
      }
    }

    const count = await models.Experience.countDocuments();
    const newExp = await models.Experience.create({
      company: company.trim(),
      role: roleName.trim(),
      employmentType: employmentType || 'Full-time',
      location: location.trim(),
      startDate: startDate.trim(),
      endDate: isCurrent ? 'Present' : (endDate ? endDate.trim() : 'Present'),
      isCurrent: isCurrent === 'true' || isCurrent === true,
      responsibilities: respArray,
      order: order !== undefined ? Number(order) : count + 1
    });

    await logActivity(req.admin, 'CREATE', 'Experience', `Added experience: ${newExp.role} at ${newExp.company}`, req);
    return res.status(201).json({ success: true, message: 'Experience record created.', data: newExp });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.responsibilities) {
      if (typeof updates.responsibilities === 'string') {
        try {
          updates.responsibilities = JSON.parse(updates.responsibilities);
        } catch (e) {
          updates.responsibilities = updates.responsibilities.split('\n').filter(Boolean);
        }
      }
    }

    if (updates.isCurrent !== undefined) {
      updates.isCurrent = updates.isCurrent === 'true' || updates.isCurrent === true;
      if (updates.isCurrent) updates.endDate = 'Present';
    }

    if (updates.order !== undefined) updates.order = Number(updates.order);

    const updated = await models.Experience.findByIdAndUpdate(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Experience record not found.' });
    }

    await logActivity(req.admin, 'UPDATE', 'Experience', `Updated experience at ${updated.company}`, req);
    return res.json({ success: true, message: 'Experience record updated.', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await models.Experience.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Experience record not found.' });
    }

    await logActivity(req.admin, 'DELETE', 'Experience', `Deleted experience at ${deleted.company}`, req);
    return res.json({ success: true, message: 'Experience record deleted.', data: deleted });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllExperience, createExperience, updateExperience, deleteExperience };
