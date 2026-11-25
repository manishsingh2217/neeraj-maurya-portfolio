const models = require('../models');
const { logActivity } = require('../middleware/auth');

// 1. Get all resources (Public or Admin)
const getAllResources = async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    const { type, category, search, enabledOnly } = req.query;
    let query = {};
    if (enabledOnly === 'true') {
      query.isEnabled = true;
    }
    if (type && type !== 'all') {
      query.type = type;
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    let resources = await models.Resource.find(query, { order: 1 });

    if (search) {
      const s = search.toLowerCase();
      resources = resources.filter(r =>
        (r.title && r.title.toLowerCase().includes(s)) ||
        (r.description && r.description.toLowerCase().includes(s)) ||
        (r.category && r.category.toLowerCase().includes(s)) ||
        (r.format && r.format.toLowerCase().includes(s))
      );
    }

    return res.json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get single resource
const getResourceById = async (req, res) => {
  try {
    const resource = await models.Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found.' });
    return res.json({ success: true, data: resource });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Create resource (Admin and Super Admin only)
const createResource = async (req, res) => {
  try {
    const { title, category, type, format, size, description, downloadUrl, isExternal, order, isEnabled } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required.' });
    }

    let url = downloadUrl || '';
    let calcSize = size || '1.0 MB';
    let calcFormat = format || 'PDF';

    if (req.file) {
      url = `/uploads/resources/${req.file.filename}`;
      calcSize = `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;
      const ext = req.file.originalname.split('.').pop().toUpperCase();
      if (!format) calcFormat = ext;
    }

    if (!url) {
      return res.status(400).json({ success: false, message: 'Please provide either a download URL or upload a resource file.' });
    }

    const count = await models.Resource.countDocuments();

    const resource = await models.Resource.create({
      title: title.trim(),
      category: category ? category.trim() : 'General Resource',
      type: type === 'project' ? 'project' : 'material',
      format: calcFormat,
      size: calcSize,
      description: description ? description.trim() : '',
      downloadUrl: url,
      isExternal: isExternal === 'true' || isExternal === true,
      order: order !== undefined ? Number(order) : count + 1,
      isEnabled: isEnabled !== undefined ? (isEnabled === 'true' || isEnabled === true) : true
    });

    await logActivity(req.admin, 'CREATE', 'Resources', `Created resource "${resource.title}"`, req);

    return res.status(201).json({ success: true, message: 'Resource created successfully.', data: resource });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Update resource (Admin and Super Admin only)
const updateResource = async (req, res) => {
  try {
    const resource = await models.Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found.' });

    const { title, category, type, format, size, description, downloadUrl, isExternal, order, isEnabled } = req.body;

    let updates = {};
    if (title !== undefined) updates.title = title.trim();
    if (category !== undefined) updates.category = category.trim();
    if (type !== undefined) updates.type = type;
    if (format !== undefined) updates.format = format;
    if (size !== undefined) updates.size = size;
    if (description !== undefined) updates.description = description.trim();
    if (downloadUrl !== undefined) updates.downloadUrl = downloadUrl;
    if (isExternal !== undefined) updates.isExternal = isExternal === 'true' || isExternal === true;
    if (order !== undefined) updates.order = Number(order);
    if (isEnabled !== undefined) updates.isEnabled = isEnabled === 'true' || isEnabled === true;

    if (req.file) {
      updates.downloadUrl = `/uploads/resources/${req.file.filename}`;
      updates.size = `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;
      const ext = req.file.originalname.split('.').pop().toUpperCase();
      if (!format) updates.format = ext;
    }

    const updated = await models.Resource.findByIdAndUpdate(req.params.id, updates, { new: true });
    await logActivity(req.admin, 'UPDATE', 'Resources', `Updated resource "${updated.title}"`, req);

    return res.json({ success: true, message: 'Resource updated successfully.', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Delete resource (Admin and Super Admin only)
const deleteResource = async (req, res) => {
  try {
    const resource = await models.Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found.' });

    await models.Resource.findByIdAndDelete(req.params.id);
    await logActivity(req.admin, 'DELETE', 'Resources', `Deleted resource "${resource.title}"`, req);

    return res.json({ success: true, message: 'Resource removed successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Toggle resource active state (Admin and Super Admin only)
const toggleResource = async (req, res) => {
  try {
    const resource = await models.Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ success: false, message: 'Resource not found.' });

    const newStatus = !resource.isEnabled;
    const updated = await models.Resource.findByIdAndUpdate(req.params.id, { isEnabled: newStatus }, { new: true });
    await logActivity(req.admin, 'UPDATE', 'Resources', `Toggled resource "${resource.title}" to ${newStatus ? 'active' : 'disabled'}`, req);

    return res.json({ success: true, message: `Resource is now ${newStatus ? 'visible' : 'hidden'}.`, data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  toggleResource
};
