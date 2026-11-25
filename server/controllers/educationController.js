const models = require('../models');
const { logActivity } = require('../middleware/auth');

const getAllEducation = async (req, res) => {
  try {
    const education = await models.Education.find({}, { order: 1 });
    return res.json({ success: true, count: education.length, data: education });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createEducation = async (req, res) => {
  try {
    const { degree, institution, duration, score, description, order } = req.body;
    const durationVal = duration || (req.body.startYear ? `${req.body.startYear} – ${req.body.endYear || 'Present'}` : '');
    const scoreVal = score || req.body.grade || req.body.percentage || '';
    if (!degree || !institution || !durationVal || !scoreVal) {
      return res.status(400).json({ success: false, message: 'Degree, institution, duration, and score are required.' });
    }

    const count = await models.Education.countDocuments();
    const newEdu = await models.Education.create({
      degree: degree.trim(),
      institution: institution.trim(),
      duration: durationVal.trim(),
      score: scoreVal.trim(),
      description: description || '',
      order: order !== undefined ? Number(order) : count + 1
    });

    await logActivity(req.admin, 'CREATE', 'Education', `Added education: ${newEdu.degree}`, req);
    return res.status(201).json({ success: true, message: 'Education record created.', data: newEdu });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.order !== undefined) updates.order = Number(updates.order);

    const updated = await models.Education.findByIdAndUpdate(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Education record not found.' });
    }

    await logActivity(req.admin, 'UPDATE', 'Education', `Updated education: ${updated.degree}`, req);
    return res.json({ success: true, message: 'Education record updated.', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await models.Education.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Education record not found.' });
    }

    await logActivity(req.admin, 'DELETE', 'Education', `Deleted education: ${deleted.degree}`, req);
    return res.json({ success: true, message: 'Education record deleted.', data: deleted });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllEducation, createEducation, updateEducation, deleteEducation };
