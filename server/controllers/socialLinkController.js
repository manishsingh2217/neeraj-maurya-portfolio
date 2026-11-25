const models = require('../models');
const { logActivity } = require('../middleware/auth');

const getAllSocialLinks = async (req, res) => {
  try {
    const links = await models.SocialLink.find({}, { order: 1 });
    return res.json({ success: true, count: links.length, data: links });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createSocialLink = async (req, res) => {
  try {
    const { platform, url, icon, isEnabled, order } = req.body;
    if (!platform || !url) {
      return res.status(400).json({ success: false, message: 'Platform and URL are required.' });
    }

    const count = await models.SocialLink.countDocuments();
    const newLink = await models.SocialLink.create({
      platform: platform.trim(),
      url: url.trim(),
      icon: icon || 'globe',
      isEnabled: isEnabled !== undefined ? Boolean(isEnabled) : true,
      order: order !== undefined ? Number(order) : count + 1
    });

    await logActivity(req.admin, 'CREATE', 'Social', `Added social link: ${newLink.platform}`, req);
    return res.status(201).json({ success: true, message: 'Social link created.', data: newLink });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateSocialLink = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.order !== undefined) updates.order = Number(updates.order);
    if (updates.isEnabled !== undefined) updates.isEnabled = Boolean(updates.isEnabled);

    const updated = await models.SocialLink.findByIdAndUpdate(id, updates);
    if (!updated) return res.status(404).json({ success: false, message: 'Social link not found.' });

    await logActivity(req.admin, 'UPDATE', 'Social', `Updated social link: ${updated.platform}`, req);
    return res.json({ success: true, message: 'Social link updated.', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteSocialLink = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await models.SocialLink.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Social link not found.' });

    await logActivity(req.admin, 'DELETE', 'Social', `Deleted social link: ${deleted.platform}`, req);
    return res.json({ success: true, message: 'Social link deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllSocialLinks, createSocialLink, updateSocialLink, deleteSocialLink };
