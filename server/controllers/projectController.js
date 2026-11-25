const models = require('../models');
const { logActivity } = require('../middleware/auth');

const getAllProjects = async (req, res) => {
  try {
    const { category, search, publishedOnly } = req.query;
    let query = {};
    if (publishedOnly === 'true') {
      query.isPublished = true;
    }
    if (category && category !== 'All') {
      query.category = category;
    }

    let projects = await models.Project.find(query, { order: 1 });

    if (search) {
      const s = search.toLowerCase();
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(s) ||
        p.description.toLowerCase().includes(s) ||
        p.technologies.some(t => t.toLowerCase().includes(s))
      );
    }

    return res.json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await models.Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });
    return res.json({ success: true, data: project });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const { title, description, category, technologies, features, githubUrl, liveUrl, isFeatured, isPublished, order } = req.body;
    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required.' });
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    let techArray = [];
    if (Array.isArray(technologies)) techArray = technologies;
    else if (typeof technologies === 'string') {
      try { techArray = JSON.parse(technologies); } catch (e) { techArray = technologies.split(',').map(t => t.trim()).filter(Boolean); }
    }

    let featArray = [];
    if (Array.isArray(features)) featArray = features;
    else if (typeof features === 'string') {
      try { featArray = JSON.parse(features); } catch (e) { featArray = features.split('\n').map(f => f.trim()).filter(Boolean); }
    }

    let image = '';
    if (req.file) {
      image = `/uploads/images/${req.file.filename}`;
    } else if (req.body.image) {
      image = req.body.image;
    }

    const count = await models.Project.countDocuments();
    const newProject = await models.Project.create({
      title: title.trim(),
      slug: slug || `project-${Date.now()}`,
      description: description.trim(),
      category: category || 'Data Analytics',
      technologies: techArray,
      features: featArray,
      image,
      githubUrl: githubUrl || '',
      liveUrl: liveUrl || '',
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isPublished: isPublished === undefined ? true : (isPublished === 'true' || isPublished === true),
      order: order !== undefined ? Number(order) : count + 1
    });

    await logActivity(req.admin, 'CREATE', 'Projects', `Created project: ${newProject.title}`, req);
    return res.status(201).json({ success: true, message: 'Project created successfully.', data: newProject });
  } catch (error) {
    console.error('Create project error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.technologies) {
      if (typeof updates.technologies === 'string') {
        try { updates.technologies = JSON.parse(updates.technologies); } catch (e) {
          updates.technologies = updates.technologies.split(',').map(t => t.trim()).filter(Boolean);
        }
      }
    }

    if (updates.features) {
      if (typeof updates.features === 'string') {
        try { updates.features = JSON.parse(updates.features); } catch (e) {
          updates.features = updates.features.split('\n').map(f => f.trim()).filter(Boolean);
        }
      }
    }

    if (updates.isFeatured !== undefined) {
      updates.isFeatured = updates.isFeatured === 'true' || updates.isFeatured === true;
    }
    if (updates.isPublished !== undefined) {
      updates.isPublished = updates.isPublished === 'true' || updates.isPublished === true;
    }
    if (updates.order !== undefined) {
      updates.order = Number(updates.order);
    }

    if (req.file) {
      updates.image = `/uploads/images/${req.file.filename}`;
    }

    const updated = await models.Project.findByIdAndUpdate(id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    await logActivity(req.admin, 'UPDATE', 'Projects', `Updated project: ${updated.title}`, req);
    return res.json({ success: true, message: 'Project updated successfully.', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await models.Project.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Project not found.' });
    }

    await logActivity(req.admin, 'DELETE', 'Projects', `Deleted project: ${deleted.title}`, req);
    return res.json({ success: true, message: 'Project deleted successfully.', data: deleted });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const togglePublished = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await models.Project.findById(id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    const updated = await models.Project.findByIdAndUpdate(id, { isPublished: !project.isPublished });
    return res.json({ success: true, message: 'Project publish status changed.', data: updated });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllProjects, getProjectById, createProject, updateProject, deleteProject, togglePublished };
