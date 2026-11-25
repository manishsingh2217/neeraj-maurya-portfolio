const API_BASE = '/api';

const getHeaders = (isFormData = false) => {
  const token = localStorage.getItem('admin_token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    // If on an admin page and unauthorized, clear token
    if (window.location.pathname.startsWith('/admin') && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin/login';
    }
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    return data;
  }

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response;
};

export const api = {
  // Public
  getPortfolioData: () => fetch(`${API_BASE}/portfolio`).then(handleResponse),
  submitContactMessage: (payload) =>
    fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    }).then(handleResponse),

  // Auth
  login: (credentials) =>
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials)
    }).then(handleResponse),
  getMe: () => fetch(`${API_BASE}/auth/me`, { headers: getHeaders() }).then(handleResponse),
  updateMe: (formData) =>
    fetch(`${API_BASE}/auth/me`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: formData
    }).then(handleResponse),

  // Profile
  getProfile: () => fetch(`${API_BASE}/profile`).then(handleResponse),
  updateProfile: (formData) =>
    fetch(`${API_BASE}/admin/profile`, {
      method: 'PUT',
      headers: getHeaders(formData instanceof FormData),
      body: formData instanceof FormData ? formData : JSON.stringify(formData)
    }).then(handleResponse),

  // About
  getAbout: () => fetch(`${API_BASE}/about`).then(handleResponse),
  updateAbout: (data) =>
    fetch(`${API_BASE}/admin/about`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  // Skills
  getSkills: () => fetch(`${API_BASE}/admin/skills`, { headers: getHeaders() }).then(handleResponse),
  createSkill: (data) =>
    fetch(`${API_BASE}/admin/skills`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),
  updateSkill: (id, data) =>
    fetch(`${API_BASE}/admin/skills/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),
  deleteSkill: (id) =>
    fetch(`${API_BASE}/admin/skills/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),
  toggleSkill: (id) =>
    fetch(`${API_BASE}/admin/skills/${id}/toggle`, {
      method: 'PATCH',
      headers: getHeaders()
    }).then(handleResponse),

  // Experience
  getExperiences: () => fetch(`${API_BASE}/admin/experiences`, { headers: getHeaders() }).then(handleResponse),
  createExperience: (data) =>
    fetch(`${API_BASE}/admin/experiences`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),
  updateExperience: (id, data) =>
    fetch(`${API_BASE}/admin/experiences/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),
  deleteExperience: (id) =>
    fetch(`${API_BASE}/admin/experiences/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  // Projects
  getProjects: (params = '') => fetch(`${API_BASE}/admin/projects${params}`, { headers: getHeaders() }).then(handleResponse),
  getProjectById: (id) => fetch(`${API_BASE}/projects/${id}`).then(handleResponse),
  createProject: (formData) =>
    fetch(`${API_BASE}/admin/projects`, {
      method: 'POST',
      headers: getHeaders(formData instanceof FormData),
      body: formData instanceof FormData ? formData : JSON.stringify(formData)
    }).then(handleResponse),
  updateProject: (id, formData) =>
    fetch(`${API_BASE}/admin/projects/${id}`, {
      method: 'PUT',
      headers: getHeaders(formData instanceof FormData),
      body: formData instanceof FormData ? formData : JSON.stringify(formData)
    }).then(handleResponse),
  deleteProject: (id) =>
    fetch(`${API_BASE}/admin/projects/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),
  toggleProjectPublish: (id) =>
    fetch(`${API_BASE}/admin/projects/${id}/toggle-publish`, {
      method: 'PATCH',
      headers: getHeaders()
    }).then(handleResponse),

  // Education
  getEducation: () => fetch(`${API_BASE}/admin/education`, { headers: getHeaders() }).then(handleResponse),
  createEducation: (data) =>
    fetch(`${API_BASE}/admin/education`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),
  updateEducation: (id, data) =>
    fetch(`${API_BASE}/admin/education/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),
  deleteEducation: (id) =>
    fetch(`${API_BASE}/admin/education/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  // Certifications
  getCertifications: () => fetch(`${API_BASE}/admin/certifications`, { headers: getHeaders() }).then(handleResponse),
  createCertification: (formData) =>
    fetch(`${API_BASE}/admin/certifications`, {
      method: 'POST',
      headers: getHeaders(formData instanceof FormData),
      body: formData instanceof FormData ? formData : JSON.stringify(formData)
    }).then(handleResponse),
  updateCertification: (id, formData) =>
    fetch(`${API_BASE}/admin/certifications/${id}`, {
      method: 'PUT',
      headers: getHeaders(formData instanceof FormData),
      body: formData instanceof FormData ? formData : JSON.stringify(formData)
    }).then(handleResponse),
  deleteCertification: (id) =>
    fetch(`${API_BASE}/admin/certifications/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  // Resources
  getResources: (params = '') => fetch(`${API_BASE}/resources${params}`).then(handleResponse),
  getAdminResources: (params = '') => fetch(`${API_BASE}/admin/resources${params}`, { headers: getHeaders() }).then(handleResponse),
  createResource: (formData) =>
    fetch(`${API_BASE}/admin/resources`, {
      method: 'POST',
      headers: getHeaders(formData instanceof FormData),
      body: formData instanceof FormData ? formData : JSON.stringify(formData)
    }).then(handleResponse),
  updateResource: (id, formData) =>
    fetch(`${API_BASE}/admin/resources/${id}`, {
      method: 'PUT',
      headers: getHeaders(formData instanceof FormData),
      body: formData instanceof FormData ? formData : JSON.stringify(formData)
    }).then(handleResponse),
  deleteResource: (id) =>
    fetch(`${API_BASE}/admin/resources/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),
  toggleResource: (id) =>
    fetch(`${API_BASE}/admin/resources/${id}/toggle`, {
      method: 'PATCH',
      headers: getHeaders()
    }).then(handleResponse),

  // Resumes
  getResumes: () => fetch(`${API_BASE}/admin/resumes`, { headers: getHeaders() }).then(handleResponse),
  uploadResume: (formData) =>
    fetch(`${API_BASE}/admin/resumes`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData
    }).then(handleResponse),
  deleteResume: (id) =>
    fetch(`${API_BASE}/admin/resumes/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),
  setActiveResume: (id) =>
    fetch(`${API_BASE}/admin/resumes/${id}/active`, {
      method: 'PATCH',
      headers: getHeaders()
    }).then(handleResponse),

  // Messages
  getMessages: (params = '') => fetch(`${API_BASE}/admin/messages${params}`, { headers: getHeaders() }).then(handleResponse),
  markMessageRead: (id, isRead) =>
    fetch(`${API_BASE}/admin/messages/${id}/read`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ isRead })
    }).then(handleResponse),
  deleteMessage: (id) =>
    fetch(`${API_BASE}/admin/messages/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),
  replyMessage: (id, replyNotes) =>
    fetch(`${API_BASE}/admin/messages/${id}/reply`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ replyNotes })
    }).then(handleResponse),

  // Social Links
  getSocialLinks: () => fetch(`${API_BASE}/admin/social-links`, { headers: getHeaders() }).then(handleResponse),
  createSocialLink: (data) =>
    fetch(`${API_BASE}/admin/social-links`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),
  updateSocialLink: (id, data) =>
    fetch(`${API_BASE}/admin/social-links/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),
  deleteSocialLink: (id) =>
    fetch(`${API_BASE}/admin/social-links/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  // Settings & Appearance & SEO
  getSettings: () => fetch(`${API_BASE}/settings`).then(handleResponse),
  updateSettings: (data) =>
    fetch(`${API_BASE}/admin/settings`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),
  getAppearance: () => fetch(`${API_BASE}/appearance`).then(handleResponse),
  updateAppearance: (data) =>
    fetch(`${API_BASE}/admin/appearance`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),
  getSeo: () => fetch(`${API_BASE}/seo`).then(handleResponse),
  updateSeo: (data) =>
    fetch(`${API_BASE}/admin/seo`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),

  // Stats
  getDashboardStats: () => fetch(`${API_BASE}/admin/stats`, { headers: getHeaders() }).then(handleResponse),

  // Admin Users
  getAdminUsers: () => fetch(`${API_BASE}/admin/users`, { headers: getHeaders() }).then(handleResponse),
  createAdminUser: (data) =>
    fetch(`${API_BASE}/admin/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),
  updateAdminUser: (id, data) =>
    fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    }).then(handleResponse),
  deleteAdminUser: (id) =>
    fetch(`${API_BASE}/admin/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  // Activity Logs
  getActivityLogs: (params = '') => fetch(`${API_BASE}/admin/activity-logs${params}`, { headers: getHeaders() }).then(handleResponse),
  clearActivityLogs: () =>
    fetch(`${API_BASE}/admin/activity-logs`, {
      method: 'DELETE',
      headers: getHeaders()
    }).then(handleResponse),

  // Backup & Restore
  exportBackup: async () => {
    const res = await fetch(`${API_BASE}/admin/backup/export`, { headers: getHeaders() });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },
  importBackup: (backupData) =>
    fetch(`${API_BASE}/admin/backup/import`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(backupData)
    }).then(handleResponse)
};
