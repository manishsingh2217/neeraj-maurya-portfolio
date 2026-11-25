const models = require('../models');
const { logActivity } = require('../middleware/auth');

const exportBackup = async (req, res) => {
  try {
    const [
      profiles,
      about,
      skills,
      experiences,
      projects,
      education,
      certifications,
      resumes,
      socialLinks,
      websiteSettings,
      appearance,
      seoSettings,
      contactMessages
    ] = await Promise.all([
      models.Profile.find(),
      models.About.find(),
      models.Skill.find(),
      models.Experience.find(),
      models.Project.find(),
      models.Education.find(),
      models.Certification.find(),
      models.Resume.find(),
      models.SocialLink.find(),
      models.WebsiteSettings.find(),
      models.Appearance.find(),
      models.SeoSettings.find(),
      models.Message.find()
    ]);

    const backupPayload = {
      exportVersion: '1.0',
      exportedAt: new Date().toISOString(),
      exportedBy: req.admin ? req.admin.email : 'system',
      data: {
        profiles,
        about,
        skills,
        experiences,
        projects,
        education,
        certifications,
        resumes,
        socialLinks,
        websiteSettings,
        appearance,
        seoSettings,
        contactMessages
      }
    };

    await logActivity(req.admin, 'BACKUP', 'System', 'Generated and exported complete JSON database backup.', req);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="portfolio-backup-${new Date().toISOString().split('T')[0]}.json"`);
    return res.send(JSON.stringify(backupPayload, null, 2));
  } catch (error) {
    console.error('Backup error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const importBackup = async (req, res) => {
  try {
    const { data } = req.body;
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ success: false, message: 'Invalid backup structure. "data" object required.' });
    }

    // Restore collections
    if (data.profiles && Array.isArray(data.profiles) && data.profiles.length > 0) {
      await models.Profile.deleteMany({});
      await models.Profile.create(data.profiles[0]);
    }
    if (data.about && Array.isArray(data.about) && data.about.length > 0) {
      await models.About.deleteMany({});
      await models.About.create(data.about[0]);
    }
    if (data.skills && Array.isArray(data.skills)) {
      await models.Skill.deleteMany({});
      for (const s of data.skills) await models.Skill.create(s);
    }
    if (data.experiences && Array.isArray(data.experiences)) {
      await models.Experience.deleteMany({});
      for (const e of data.experiences) await models.Experience.create(e);
    }
    if (data.projects && Array.isArray(data.projects)) {
      await models.Project.deleteMany({});
      for (const p of data.projects) await models.Project.create(p);
    }
    if (data.education && Array.isArray(data.education)) {
      await models.Education.deleteMany({});
      for (const ed of data.education) await models.Education.create(ed);
    }
    if (data.certifications && Array.isArray(data.certifications)) {
      await models.Certification.deleteMany({});
      for (const c of data.certifications) await models.Certification.create(c);
    }
    if (data.socialLinks && Array.isArray(data.socialLinks)) {
      await models.SocialLink.deleteMany({});
      for (const sl of data.socialLinks) await models.SocialLink.create(sl);
    }
    if (data.websiteSettings && Array.isArray(data.websiteSettings) && data.websiteSettings.length > 0) {
      await models.WebsiteSettings.deleteMany({});
      await models.WebsiteSettings.create(data.websiteSettings[0]);
    }
    if (data.appearance && Array.isArray(data.appearance) && data.appearance.length > 0) {
      await models.Appearance.deleteMany({});
      await models.Appearance.create(data.appearance[0]);
    }
    if (data.seoSettings && Array.isArray(data.seoSettings) && data.seoSettings.length > 0) {
      await models.SeoSettings.deleteMany({});
      await models.SeoSettings.create(data.seoSettings[0]);
    }

    await logActivity(req.admin, 'RESTORE', 'System', 'Restored portfolio database from uploaded backup snapshot.', req);
    return res.json({ success: true, message: 'Database backup restored successfully.' });
  } catch (error) {
    console.error('Import error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { exportBackup, importBackup };
