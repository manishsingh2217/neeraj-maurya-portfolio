const models = require('../models');
const { logActivity } = require('../middleware/auth');

const getAbout = async (req, res) => {
  try {
    let about = await models.About.findOne();
    if (!about) {
      about = await models.About.create({});
    }
    return res.json({ success: true, data: about });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateAbout = async (req, res) => {
  try {
    let about = await models.About.findOne();
    const updates = { ...req.body };

    if (typeof updates.bioParagraphs === 'string') {
      try {
        updates.bioParagraphs = JSON.parse(updates.bioParagraphs);
      } catch (e) {
        updates.bioParagraphs = updates.bioParagraphs.split('\n\n').filter(Boolean);
      }
    }

    let result;
    if (about) {
      result = await models.About.findByIdAndUpdate(about._id || about.id, updates);
    } else {
      result = await models.About.create(updates);
    }

    await logActivity(req.admin, 'UPDATE', 'About', 'Updated about section bio and career objectives.', req);
    return res.json({ success: true, message: 'About section updated successfully.', data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAbout, updateAbout };
