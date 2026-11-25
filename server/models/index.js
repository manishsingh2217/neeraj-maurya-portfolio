const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const store = require('../data/store');

// --- 1. Admin Schema ---
const AdminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['superadmin', 'admin', 'editor'], default: 'admin' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  avatar: { type: String, default: '' },
  lastLogin: { type: Date }
}, { timestamps: true });

AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

AdminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// --- 2. Profile Schema ---
const ProfileSchema = new mongoose.Schema({
  fullName: { type: String, default: 'Neeraj Maurya' },
  title: { type: String, default: 'Computer Science and Engineering Graduate' },
  email: { type: String, default: 'erneerajmaurya01@gmail.com' },
  phone: { type: String, default: '+91 9369279641' },
  location: { type: String, default: 'India' },
  bioSummary: { type: String, default: 'Computer Science and Engineering graduate with practical experience in MIS reporting, data analysis, business intelligence, and technical operations. Proficient in Python, SQL, Advanced Excel, and Power BI, with knowledge of data cleaning, exploratory data analysis, dashboard development, and reporting automation.' },
  profileImage: { type: String, default: '/uploads/images/profile-default.jpg' },
  resumeUrl: { type: String, default: '/api/resume/download' },
  resumeDriveUrl: { type: String, default: 'https://drive.google.com/file/d/1B7x_neeraj_maurya_resume/view?usp=sharing' },
  availabilityStatus: { type: String, default: 'OPEN TO OPPORTUNITIES' },
  isAvailable: { type: Boolean, default: true },
  heroTypingWords: { type: [String], default: ['Data Analyst', 'MIS Executive', 'Business Intelligence Specialist', 'Computer Science Graduate'] },
  languages: { type: [String], default: ['English (Professional Working)', 'Hindi (Native)'] },
  careerInterests: { type: String, default: 'Open to opportunities across technical, analytical, business, reporting, operations, and technology-related fields.' }
}, { timestamps: true });

// --- 3. About Schema ---
const AboutSchema = new mongoose.Schema({
  headline: { type: String, default: 'Dedicated to turning raw data into strategic business intelligence.' },
  bioParagraphs: {
    type: [String],
    default: [
      'I am a Computer Science and Engineering graduate with a strong passion for data analytics, business intelligence, and technical operations. Through hands-on roles as an MIS Executive and Data Analytics Intern, I have developed expertise in transforming complex data into clear, actionable insights.',
      'My technical repertoire includes Python (Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn), SQL, Power BI, and Advanced Excel (XLOOKUP, Pivot Tables, Data Modeling). I have a proven track record of creating automated reporting pipelines, designing interactive executive dashboards, and uncovering operational bottlenecks.'
    ]
  },
  careerObjectives: {
    type: String,
    default: 'To leverage my strong analytical, technical, and problem-solving skills in high-impact data analytics, business intelligence, or software engineering roles where I can drive operational efficiency and data-informed decision making.'
  },
  yearsOfExperience: { type: String, default: '1+' },
  projectsCompleted: { type: String, default: '10+' },
  certificationsCount: { type: String, default: '6+' }
}, { timestamps: true });

// --- 4. Skill Schema ---
const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Programming Languages', 'Database and Tools', 'Web Technologies', 'Python Libraries', 'Data Analysis', 'Machine Learning', 'Excel', 'Core Concepts'],
    required: true 
  },
  icon: { type: String, default: 'code' },
  proficiency: { type: Number, default: 85 },
  order: { type: Number, default: 0 },
  isEnabled: { type: Boolean, default: true }
}, { timestamps: true });

// --- 5. Experience Schema ---
const ExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  employmentType: { type: String, default: 'Full-time' },
  location: { type: String, required: true },
  startDate: { type: String, required: true }, // e.g. "June 2026", "1 December 2025"
  endDate: { type: String, default: 'Present' }, // e.g. "Present", "30 May 2026"
  isCurrent: { type: Boolean, default: false },
  responsibilities: { type: [String], required: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// --- 6. Project Schema ---
const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, required: true },
  features: { type: [String], default: [] },
  technologies: { type: [String], required: true },
  image: { type: String, default: '' },
  additionalImages: { type: [String], default: [] },
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  category: { type: String, default: 'Data Analytics' },
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// --- 7. Education Schema ---
const EducationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  duration: { type: String, required: true }, // e.g. "2022 – 2026", "2022", "2020"
  score: { type: String, required: true }, // e.g. "CGPA: 7.9/10", "67%", "77.33%"
  description: { type: String, default: '' },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// --- 8. Certification Schema ---
const CertificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  issueDate: { type: String, default: '2024' },
  credentialUrl: { type: String, default: '' },
  certificateFile: { type: String, default: '' },
  certificateImage: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isEnabled: { type: Boolean, default: true }
}, { timestamps: true });

// --- 9. Resume Schema ---
const ResumeSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  originalName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileSizeBytes: { type: Number, default: 0 },
  version: { type: String, default: '1.0' },
  isPublished: { type: Boolean, default: true },
  uploadedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// --- 10. Message Schema ---
const MessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: 'Portfolio Contact' },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  replyNotes: { type: String, default: '' },
  senderIp: { type: String, default: '' }
}, { timestamps: true });

// --- 11. Social Link Schema ---
const SocialLinkSchema = new mongoose.Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String, default: 'globe' },
  isEnabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// --- 12. Website Settings Schema ---
const WebsiteSettingsSchema = new mongoose.Schema({
  siteTitle: { type: String, default: 'Neeraj Maurya | Portfolio' },
  siteDescription: { type: String, default: 'Computer Science and Engineering Graduate - Data Analytics & MIS Portfolio' },
  logoText: { type: String, default: 'NM' },
  primaryColor: { type: String, default: '#fb8236' },
  secondaryColor: { type: String, default: '#f8af26' },
  themeMode: { type: String, default: 'dark' },
  maintenanceMode: { type: Boolean, default: false },
  contactEmail: { type: String, default: 'erneerajmaurya01@gmail.com' },
  allowResumeDownload: { type: Boolean, default: true },
  footerText: { type: String, default: 'Neeraj Maurya · © 2026 — All rights reserved' }
}, { timestamps: true });

// --- 13. Appearance Schema ---
const AppearanceSchema = new mongoose.Schema({
  primaryColor: { type: String, default: '#fb8236' },
  accentColor: { type: String, default: '#f8af26' },
  fontFamily: { type: String, default: 'Space Grotesk' },
  sectionOrder: {
    type: [String],
    default: ['hero', 'about', 'experience', 'projects', 'skills', 'education', 'certifications', 'contact']
  },
  visibleSections: {
    hero: { type: Boolean, default: true },
    about: { type: Boolean, default: true },
    experience: { type: Boolean, default: true },
    projects: { type: Boolean, default: true },
    skills: { type: Boolean, default: true },
    education: { type: Boolean, default: true },
    certifications: { type: Boolean, default: true },
    contact: { type: Boolean, default: true }
  }
}, { timestamps: true });

// --- 14. SEO Settings Schema ---
const SeoSettingsSchema = new mongoose.Schema({
  metaTitle: { type: String, default: 'Neeraj Maurya | Data Analyst & MIS Executive' },
  metaDescription: { type: String, default: 'Official portfolio of Neeraj Maurya - B.Tech CSE Graduate specializing in MIS reporting, Python, SQL, Power BI, and Data Analysis.' },
  metaKeywords: { type: String, default: 'Neeraj Maurya, Data Analyst, MIS Executive, Power BI, Python, SQL, Advanced Excel' },
  ogTitle: { type: String, default: 'Neeraj Maurya - Portfolio & Projects' },
  ogDescription: { type: String, default: 'Explore data analytics dashboards, machine learning analysis, and MIS reporting projects by Neeraj Maurya.' },
  ogImage: { type: String, default: '/uploads/images/og-preview.png' },
  canonicalUrl: { type: String, default: 'https://neerajmaurya.onrender.com' },
  robots: { type: String, default: 'index, follow' }
}, { timestamps: true });

// --- 15. Visitor Analytics Schema ---
const VisitorAnalyticsSchema = new mongoose.Schema({
  ip: { type: String, default: '127.0.0.1' },
  userAgent: { type: String, default: '' },
  page: { type: String, default: '/' },
  referer: { type: String, default: '' },
  dateString: { type: String, default: () => new Date().toISOString().split('T')[0] },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

// --- 16. Activity Log Schema ---
const ActivityLogSchema = new mongoose.Schema({
  adminId: { type: String, default: '' },
  adminEmail: { type: String, default: '' },
  adminName: { type: String, default: '' },
  action: { type: String, required: true }, // 'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'BACKUP'
  module: { type: String, required: true }, // 'Profile', 'Skills', 'Projects', etc.
  description: { type: String, required: true },
  ipAddress: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

// --- 17. Resource Schema ---
const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true, default: 'General Resource' },
  type: { type: String, enum: ['material', 'project'], default: 'material' },
  format: { type: String, default: 'PDF' },
  size: { type: String, default: '1.0 MB' },
  description: { type: String, default: '' },
  downloadUrl: { type: String, required: true },
  isExternal: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  isEnabled: { type: Boolean, default: true }
}, { timestamps: true });

// Instantiate Mongoose models (safely guard against re-compilation)
const MongooseModels = {
  Admin: mongoose.models.Admin || mongoose.model('Admin', AdminSchema),
  Profile: mongoose.models.Profile || mongoose.model('Profile', ProfileSchema),
  About: mongoose.models.About || mongoose.model('About', AboutSchema),
  Skill: mongoose.models.Skill || mongoose.model('Skill', SkillSchema),
  Experience: mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema),
  Project: mongoose.models.Project || mongoose.model('Project', ProjectSchema),
  Education: mongoose.models.Education || mongoose.model('Education', EducationSchema),
  Certification: mongoose.models.Certification || mongoose.model('Certification', CertificationSchema),
  Resume: mongoose.models.Resume || mongoose.model('Resume', ResumeSchema),
  Message: mongoose.models.Message || mongoose.model('Message', MessageSchema),
  SocialLink: mongoose.models.SocialLink || mongoose.model('SocialLink', SocialLinkSchema),
  WebsiteSettings: mongoose.models.WebsiteSettings || mongoose.model('WebsiteSettings', WebsiteSettingsSchema),
  Appearance: mongoose.models.Appearance || mongoose.model('Appearance', AppearanceSchema),
  SeoSettings: mongoose.models.SeoSettings || mongoose.model('SeoSettings', SeoSettingsSchema),
  VisitorAnalytics: mongoose.models.VisitorAnalytics || mongoose.model('VisitorAnalytics', VisitorAnalyticsSchema),
  ActivityLog: mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema),
  Resource: mongoose.models.Resource || mongoose.model('Resource', ResourceSchema)
};

// Create unified store collections
const models = {
  Admin: store.collection('admins', MongooseModels.Admin),
  Profile: store.collection('profiles', MongooseModels.Profile),
  About: store.collection('about', MongooseModels.About),
  Skill: store.collection('skills', MongooseModels.Skill),
  Experience: store.collection('experiences', MongooseModels.Experience),
  Project: store.collection('projects', MongooseModels.Project),
  Education: store.collection('education', MongooseModels.Education),
  Certification: store.collection('certifications', MongooseModels.Certification),
  Resume: store.collection('resumes', MongooseModels.Resume),
  Message: store.collection('contactMessages', MongooseModels.Message),
  SocialLink: store.collection('socialLinks', MongooseModels.SocialLink),
  WebsiteSettings: store.collection('websiteSettings', MongooseModels.WebsiteSettings),
  Appearance: store.collection('appearance', MongooseModels.Appearance),
  SeoSettings: store.collection('seoSettings', MongooseModels.SeoSettings),
  VisitorAnalytics: store.collection('visitorAnalytics', MongooseModels.VisitorAnalytics),
  ActivityLog: store.collection('activityLogs', MongooseModels.ActivityLog),
  Resource: store.collection('resources', MongooseModels.Resource),
  rawMongoose: MongooseModels
};

module.exports = models;
