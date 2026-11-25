const express = require('express');
const router = express.Router();

const { verifyToken, requireRole } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Controllers
const authController = require('../controllers/authController');
const publicController = require('../controllers/publicController');
const profileController = require('../controllers/profileController');
const aboutController = require('../controllers/aboutController');
const skillController = require('../controllers/skillController');
const experienceController = require('../controllers/experienceController');
const projectController = require('../controllers/projectController');
const educationController = require('../controllers/educationController');
const certificationController = require('../controllers/certificationController');
const resumeController = require('../controllers/resumeController');
const messageController = require('../controllers/messageController');
const socialLinkController = require('../controllers/socialLinkController');
const settingsController = require('../controllers/settingsController');
const statsController = require('../controllers/statsController');
const adminUserController = require('../controllers/adminUserController');
const activityLogController = require('../controllers/activityLogController');
const backupController = require('../controllers/backupController');
const resourceController = require('../controllers/resourceController');

// --- 1. Public Endpoints ---
router.get('/portfolio', publicController.getPortfolioData);
router.post('/contact', publicController.submitContactMessage);
router.get('/resume/download', resumeController.downloadResume);

// Public read endpoints for individual resources
router.get('/profile', profileController.getProfile);
router.get('/about', aboutController.getAbout);
router.get('/skills', skillController.getAllSkills);
router.get('/experiences', experienceController.getAllExperience);
router.get('/projects', projectController.getAllProjects);
router.get('/projects/:id', projectController.getProjectById);
router.get('/education', educationController.getAllEducation);
router.get('/certifications', certificationController.getAllCertifications);
router.get('/resources', resourceController.getAllResources);
router.get('/resources/:id', resourceController.getResourceById);
router.get('/social-links', socialLinkController.getAllSocialLinks);
router.get('/settings', settingsController.getSettings);
router.get('/appearance', settingsController.getAppearance);
router.get('/seo', settingsController.getSeo);

// --- 2. Auth Endpoints ---
router.post('/auth/login', authController.login);
router.get('/auth/me', verifyToken, authController.getMe);
router.put('/auth/me', verifyToken, upload.single('avatar'), authController.updateMe);

// --- 3. Protected Admin Management Endpoints ---
// Profile
router.put('/admin/profile', verifyToken, upload.single('profileImage'), profileController.updateProfile);

// About
router.put('/admin/about', verifyToken, aboutController.updateAbout);

// Skills
router.get('/admin/skills', verifyToken, skillController.getAllSkills);
router.post('/admin/skills', verifyToken, skillController.createSkill);
router.put('/admin/skills/:id', verifyToken, skillController.updateSkill);
router.delete('/admin/skills/:id', verifyToken, skillController.deleteSkill);
router.patch('/admin/skills/:id/toggle', verifyToken, skillController.toggleSkill);

// Experience
router.get('/admin/experiences', verifyToken, experienceController.getAllExperience);
router.post('/admin/experiences', verifyToken, experienceController.createExperience);
router.put('/admin/experiences/:id', verifyToken, experienceController.updateExperience);
router.delete('/admin/experiences/:id', verifyToken, experienceController.deleteExperience);

// Projects
router.get('/admin/projects', verifyToken, projectController.getAllProjects);
router.post('/admin/projects', verifyToken, upload.single('image'), projectController.createProject);
router.put('/admin/projects/:id', verifyToken, upload.single('image'), projectController.updateProject);
router.delete('/admin/projects/:id', verifyToken, projectController.deleteProject);
router.patch('/admin/projects/:id/toggle-publish', verifyToken, projectController.togglePublished);

// Education
router.get('/admin/education', verifyToken, educationController.getAllEducation);
router.post('/admin/education', verifyToken, educationController.createEducation);
router.put('/admin/education/:id', verifyToken, educationController.updateEducation);
router.delete('/admin/education/:id', verifyToken, educationController.deleteEducation);

// Certifications
router.get('/admin/certifications', verifyToken, certificationController.getAllCertifications);
router.post('/admin/certifications', verifyToken, upload.single('certificateFile'), certificationController.createCertification);
router.put('/admin/certifications/:id', verifyToken, upload.single('certificateFile'), certificationController.updateCertification);
router.delete('/admin/certifications/:id', verifyToken, certificationController.deleteCertification);

// Resources (Admin and Super Admin Only)
router.get('/admin/resources', verifyToken, requireRole('admin', 'superadmin'), resourceController.getAllResources);
router.post('/admin/resources', verifyToken, requireRole('admin', 'superadmin'), upload.single('resourceFile'), resourceController.createResource);
router.put('/admin/resources/:id', verifyToken, requireRole('admin', 'superadmin'), upload.single('resourceFile'), resourceController.updateResource);
router.delete('/admin/resources/:id', verifyToken, requireRole('admin', 'superadmin'), resourceController.deleteResource);
router.patch('/admin/resources/:id/toggle', verifyToken, requireRole('admin', 'superadmin'), resourceController.toggleResource);

// Resumes
router.get('/admin/resumes', verifyToken, resumeController.getAllResumes);
router.post('/admin/resumes', verifyToken, upload.single('resumeFile'), resumeController.uploadResume);
router.delete('/admin/resumes/:id', verifyToken, resumeController.deleteResume);
router.patch('/admin/resumes/:id/active', verifyToken, resumeController.setActiveResume);

// Messages
router.get('/admin/messages', verifyToken, messageController.getAllMessages);
router.patch('/admin/messages/:id/read', verifyToken, messageController.markAsRead);
router.delete('/admin/messages/:id', verifyToken, messageController.deleteMessage);
router.post('/admin/messages/:id/reply', verifyToken, messageController.replyMessage);

// Social Links
router.get('/admin/social-links', verifyToken, socialLinkController.getAllSocialLinks);
router.post('/admin/social-links', verifyToken, socialLinkController.createSocialLink);
router.put('/admin/social-links/:id', verifyToken, socialLinkController.updateSocialLink);
router.delete('/admin/social-links/:id', verifyToken, socialLinkController.deleteSocialLink);

// Settings
router.put('/admin/settings', verifyToken, settingsController.updateSettings);
router.put('/admin/appearance', verifyToken, settingsController.updateAppearance);
router.put('/admin/seo', verifyToken, settingsController.updateSeo);

// Dashboard Statistics
router.get('/admin/stats', verifyToken, statsController.getDashboardStats);

// Activity Logs
router.get('/admin/activity-logs', verifyToken, activityLogController.getActivityLogs);
router.delete('/admin/activity-logs', verifyToken, requireRole('superadmin'), activityLogController.clearActivityLogs);

// Admin Users (Super Admin Only)
router.get('/admin/users', verifyToken, requireRole('superadmin'), adminUserController.getAllAdmins);
router.post('/admin/users', verifyToken, requireRole('superadmin'), adminUserController.createAdmin);
router.put('/admin/users/:id', verifyToken, requireRole('superadmin'), adminUserController.updateAdmin);
router.delete('/admin/users/:id', verifyToken, requireRole('superadmin'), adminUserController.deleteAdmin);

// Backup & Restore (Super Admin Only)
router.get('/admin/backup/export', verifyToken, requireRole('superadmin'), backupController.exportBackup);
router.post('/admin/backup/import', verifyToken, requireRole('superadmin'), backupController.importBackup);

module.exports = router;
