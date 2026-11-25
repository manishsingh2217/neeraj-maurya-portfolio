const models = require('../models');
const { logActivity } = require('../middleware/auth');

const getAllCertifications = async (req, res) => {
  try {
    const certs = await models.Certification.find({}, { order: 1 });
    return res.json({ success: true, count: certs.length, data: certs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createCertification = async (req, res) => {
  try {
    const { name, issuer, issueDate, credentialUrl, order, isEnabled } = req.body;
    const issuerName = issuer || req.body.issuingOrganization || req.body.organization;
    if (!name || !issuerName) {
      return res.status(400).json({ success: false, message: 'Certification name and issuer are required.' });
    }

    let certificateFile = '';
    if (req.file) {
      certificateFile = `/uploads/certificates/${req.file.filename}`;
    }

    const count = await models.Certification.countDocuments();
    const newCert = await models.Certification.create({
      name: name.trim(),
      issuer: issuerName.trim(),
      issueDate: issueDate || '2024',
      credentialUrl: credentialUrl || '',
      certificateFile,
      order: order !== undefined ? Number(order) : count + 1,
      isEnabled: isEnabled !== undefined ? Boolean(isEnabled) : true
    });

    await logActivity(req.admin, 'CREATE', 'Certifications', `Added certification: ${newCert.name}`, req);
    return res.status(201).json({ success: true, message: 'Certification created.', data: newCert });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (req.file) {
      updates.certificateFile = `/uploads/certificates/${req.file.filename}`;
    }
    if (updates.order !== undefined) updates.order = Number(updates.order);
    if (updates.isEnabled !== undefined) updates.isEnabled = Boolean(updates.isEnabled);

    const updated = await models.Certification.findByIdAndUpdate(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Certification not found.' });
    }

    await logActivity(req.admin, 'UPDATE', 'Certifications', `Updated certification: ${updated.name}`, req);
    return res.json({ success: true, message: 'Certification updated.', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await models.Certification.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Certification not found.' });
    }

    await logActivity(req.admin, 'DELETE', 'Certifications', `Deleted certification: ${deleted.name}`, req);
    return res.json({ success: true, message: 'Certification deleted.', data: deleted });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllCertifications, createCertification, updateCertification, deleteCertification };
