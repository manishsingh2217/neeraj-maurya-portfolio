const models = require('../models');
const { logActivity } = require('../middleware/auth');

// Website Settings
const getSettings = async (req, res) => {
  try {
    let settings = await models.WebsiteSettings.findOne();
    if (!settings) settings = await models.WebsiteSettings.create({});
    return res.json({ success: true, data: settings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    let settings = await models.WebsiteSettings.findOne();
    const updates = { ...req.body };

    if (updates.maintenanceMode !== undefined) {
      updates.maintenanceMode = updates.maintenanceMode === 'true' || updates.maintenanceMode === true;
    }
    if (updates.allowResumeDownload !== undefined) {
      updates.allowResumeDownload = updates.allowResumeDownload === 'true' || updates.allowResumeDownload === true;
    }

    let result;
    if (settings) {
      result = await models.WebsiteSettings.findByIdAndUpdate(settings._id || settings.id, updates);
    } else {
      result = await models.WebsiteSettings.create(updates);
    }

    await logActivity(req.admin, 'UPDATE', 'Settings', 'Updated core website settings.', req);
    return res.json({ success: true, message: 'Website settings updated.', data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Appearance
const getAppearance = async (req, res) => {
  try {
    let appearance = await models.Appearance.findOne();
    if (!appearance) appearance = await models.Appearance.create({});
    return res.json({ success: true, data: appearance });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateAppearance = async (req, res) => {
  try {
    let appearance = await models.Appearance.findOne();
    const updates = { ...req.body };

    if (typeof updates.sectionOrder === 'string') {
      try { updates.sectionOrder = JSON.parse(updates.sectionOrder); } catch (e) {}
    }
    if (typeof updates.visibleSections === 'string') {
      try { updates.visibleSections = JSON.parse(updates.visibleSections); } catch (e) {}
    }

    let result;
    if (appearance) {
      result = await models.Appearance.findByIdAndUpdate(appearance._id || appearance.id, updates);
    } else {
      result = await models.Appearance.create(updates);
    }

    await logActivity(req.admin, 'UPDATE', 'Appearance', 'Updated website appearance and theme configuration.', req);
    return res.json({ success: true, message: 'Appearance settings updated.', data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// SEO Settings
const getSeo = async (req, res) => {
  try {
    let seo = await models.SeoSettings.findOne();
    if (!seo) seo = await models.SeoSettings.create({});
    return res.json({ success: true, data: seo });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateSeo = async (req, res) => {
  try {
    let seo = await models.SeoSettings.findOne();
    const updates = { ...req.body };

    let result;
    if (seo) {
      result = await models.SeoSettings.findByIdAndUpdate(seo._id || seo.id, updates);
    } else {
      result = await models.SeoSettings.create(updates);
    }

    await logActivity(req.admin, 'UPDATE', 'SEO', 'Updated SEO and social Open Graph metadata.', req);
    return res.json({ success: true, message: 'SEO settings updated.', data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSettings, updateSettings, getAppearance, updateAppearance, getSeo, updateSeo };
