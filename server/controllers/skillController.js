const models = require('../models');
const { logActivity } = require('../middleware/auth');

const getAllSkills = async (req, res) => {
  try {
    const skills = await models.Skill.find({}, { order: 1 });
    return res.json({ success: true, count: skills.length, data: skills });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createSkill = async (req, res) => {
  try {
    const { name, category, icon, proficiency, order, isEnabled } = req.body;
    if (!name || !category) {
      return res.status(400).json({ success: false, message: 'Skill name and category are required.' });
    }

    const count = await models.Skill.countDocuments();
    const newSkill = await models.Skill.create({
      name: name.trim(),
      category,
      icon: icon || 'code',
      proficiency: proficiency !== undefined ? Number(proficiency) : 85,
      order: order !== undefined ? Number(order) : count + 1,
      isEnabled: isEnabled !== undefined ? Boolean(isEnabled) : true
    });

    await logActivity(req.admin, 'CREATE', 'Skills', `Added new skill: ${newSkill.name}`, req);
    return res.status(201).json({ success: true, message: 'Skill created successfully.', data: newSkill });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.proficiency !== undefined) updates.proficiency = Number(updates.proficiency);
    if (updates.order !== undefined) updates.order = Number(updates.order);
    if (updates.isEnabled !== undefined) updates.isEnabled = Boolean(updates.isEnabled);

    const updated = await models.Skill.findByIdAndUpdate(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Skill not found.' });
    }

    await logActivity(req.admin, 'UPDATE', 'Skills', `Updated skill: ${updated.name}`, req);
    return res.json({ success: true, message: 'Skill updated successfully.', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await models.Skill.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Skill not found.' });
    }

    await logActivity(req.admin, 'DELETE', 'Skills', `Deleted skill: ${deleted.name}`, req);
    return res.json({ success: true, message: 'Skill deleted successfully.', data: deleted });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const toggleSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await models.Skill.findById(id);
    if (!skill) return res.status(404).json({ success: false, message: 'Skill not found.' });

    const updated = await models.Skill.findByIdAndUpdate(id, { isEnabled: !skill.isEnabled });
    return res.json({ success: true, message: 'Skill status toggled.', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllSkills, createSkill, updateSkill, deleteSkill, toggleSkill };
