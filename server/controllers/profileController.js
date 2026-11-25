const models = require('../models');
const { logActivity } = require('../middleware/auth');

const getProfile = async (req, res) => {
  try {
    let profile = await models.Profile.findOne();
    if (!profile) {
      profile = await models.Profile.create({});
    }
    return res.json({ success: true, data: profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    let profile = await models.Profile.findOne();
    const updates = { ...req.body };

    if (req.file) {
      updates.profileImage = `/uploads/images/${req.file.filename}`;
    }

    // Handle array parse if sent as JSON string
    if (typeof updates.heroTypingWords === 'string') {
      try { updates.heroTypingWords = JSON.parse(updates.heroTypingWords); } catch (e) {
        updates.heroTypingWords = updates.heroTypingWords.split(',').map(s => s.trim());
      }
    }

    if (typeof updates.languages === 'string') {
      try { updates.languages = JSON.parse(updates.languages); } catch (e) {
        updates.languages = updates.languages.split(',').map(s => s.trim());
      }
    }

    if (updates.isAvailable !== undefined) {
      updates.isAvailable = updates.isAvailable === 'true' || updates.isAvailable === true;
    }

    let result;
    if (profile) {
      result = await models.Profile.findByIdAndUpdate(profile._id || profile.id, updates);
    } else {
      result = await models.Profile.create(updates);
    }

    await logActivity(req.admin, 'UPDATE', 'Profile', 'Updated personal profile and contact details.', req);
    return res.json({ success: true, message: 'Profile updated successfully.', data: result });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile };
