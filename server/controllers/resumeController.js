const path = require('path');
const fs = require('fs');
const models = require('../models');
const { logActivity } = require('../middleware/auth');

const getAllResumes = async (req, res) => {
  try {
    const resumes = await models.Resume.find({}, { uploadedAt: -1 });
    return res.json({ success: true, count: resumes.length, data: resumes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please select a PDF file to upload.' });
    }

    const { version } = req.body;
    const filePath = `/uploads/resumes/${req.file.filename}`;

    // Mark previous resumes as not active if this is published
    await models.Resume.updateMany ? await models.Resume.updateMany({}, { isPublished: false }) : null;

    const newResume = await models.Resume.create({
      fileName: req.file.filename,
      originalName: req.file.originalname,
      filePath,
      fileSizeBytes: req.file.size,
      version: version || `v${Date.now().toString().slice(-4)}`,
      isPublished: true,
      uploadedAt: new Date()
    });

    // Also update Profile resumeUrl
    await models.Profile.findOneAndUpdate({}, { resumeUrl: '/api/resume/download' });

    await logActivity(req.admin, 'CREATE', 'Resume', `Uploaded new resume: ${req.file.originalname}`, req);
    return res.status(201).json({ success: true, message: 'Resume uploaded successfully.', data: newResume });
  } catch (error) {
    console.error('Resume upload error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const downloadResume = async (req, res) => {
  try {
    // Find active published resume
    let resume = await models.Resume.findOne({ isPublished: true });
    if (!resume) {
      // Find latest uploaded resume
      const allResumes = await models.Resume.find({}, { uploadedAt: -1 });
      if (allResumes.length > 0) resume = allResumes[0];
    }

    let resolvedPath;
    let downloadName = 'Neeraj_Maurya_Resume.pdf';

    if (resume && resume.filePath) {
      resolvedPath = path.join(__dirname, '..', resume.filePath);
      if (resume.originalName) downloadName = resume.originalName;
    }

    // Fallback if file doesn't exist on disk
    if (!resolvedPath || !fs.existsSync(resolvedPath)) {
      resolvedPath = path.join(__dirname, '..', 'uploads', 'resumes', 'Neeraj_Maurya_Resume.pdf');
      if (!fs.existsSync(resolvedPath)) {
        // Generate minimal valid PDF on the fly
        const pdfContent = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj 4 0 obj<</Length 180>>stream\nBT /F1 20 Tf 50 720 Td (Neeraj Maurya - Resume) Tj /F1 12 Tf 0 -30 Td (Computer Science and Engineering Graduate) Tj 0 -20 Td (Email: erneerajmaurya01@gmail.com | Phone: +91 9369279641) Tj ET\nendstream\nendobj 5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\nxref\n0 6\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000244 00000 n\n0000000475 00000 n\ntrailer<</Size 6/Root 1 0 R>>\nstartxref\n550\n%%EOF`;
        const dir = path.dirname(resolvedPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(resolvedPath, pdfContent);
      }
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
    return res.sendFile(resolvedPath);
  } catch (error) {
    console.error('Download resume error:', error);
    return res.status(500).json({ success: false, message: 'Could not download resume file.' });
  }
};

const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await models.Resume.findById(id);
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found.' });

    // Remove file if exists
    if (resume.filePath) {
      const fullPath = path.join(__dirname, '..', resume.filePath);
      if (fs.existsSync(fullPath)) {
        try { fs.unlinkSync(fullPath); } catch (e) {}
      }
    }

    await models.Resume.findByIdAndDelete(id);
    await logActivity(req.admin, 'DELETE', 'Resume', `Deleted resume record: ${resume.fileName}`, req);
    return res.json({ success: true, message: 'Resume deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const setActiveResume = async (req, res) => {
  try {
    const { id } = req.params;
    const all = await models.Resume.find();
    for (const r of all) {
      const isActive = String(r._id || r.id) === String(id);
      await models.Resume.findByIdAndUpdate(r._id || r.id, { isPublished: isActive });
    }
    return res.json({ success: true, message: 'Active resume updated.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllResumes, uploadResume, downloadResume, deleteResume, setActiveResume };
