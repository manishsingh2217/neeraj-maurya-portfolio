import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { ResourcesPage } from './pages/ResourcesPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './admin/AdminLayout';
import { AdminLogin } from './admin/AdminLogin';
import { DashboardOverview } from './admin/DashboardOverview';
import { ProfileManagement } from './admin/ProfileManagement';
import { AboutManagement } from './admin/AboutManagement';
import { SkillsManagement } from './admin/SkillsManagement';
import { ExperienceManagement } from './admin/ExperienceManagement';
import { ProjectsManagement } from './admin/ProjectsManagement';
import { EducationManagement } from './admin/EducationManagement';
import { CertificationsManagement } from './admin/CertificationsManagement';
import { ResourcesManagement } from './admin/ResourcesManagement';
import { ResumeManagement } from './admin/ResumeManagement';
import { MessagesManagement } from './admin/MessagesManagement';
import { SocialLinksManagement } from './admin/SocialLinksManagement';
import { AppearanceManagement } from './admin/AppearanceManagement';
import { SeoManagement } from './admin/SeoManagement';
import { WebsiteSettingsManagement } from './admin/WebsiteSettingsManagement';
import { AdminUsersManagement } from './admin/AdminUsersManagement';
import { ActivityLogsManagement } from './admin/ActivityLogsManagement';
import { BackupRestoreManagement } from './admin/BackupRestoreManagement';

export const App = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/resources" element={<ResourcesPage />} />

      {/* Auth Route from reference URL inspection */}
      <Route path="/auth" element={<Navigate to="/admin/login" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardOverview />} />
        <Route path="profile" element={<ProfileManagement />} />
        <Route path="about" element={<AboutManagement />} />
        <Route path="skills" element={<SkillsManagement />} />
        <Route path="experience" element={<ExperienceManagement />} />
        <Route path="projects" element={<ProjectsManagement />} />
        <Route path="education" element={<EducationManagement />} />
        <Route path="certifications" element={<CertificationsManagement />} />
        <Route path="resources" element={<ResourcesManagement />} />
        <Route path="resume" element={<ResumeManagement />} />
        <Route path="messages" element={<MessagesManagement />} />
        <Route path="social-links" element={<SocialLinksManagement />} />
        <Route path="appearance" element={<AppearanceManagement />} />
        <Route path="seo" element={<SeoManagement />} />
        <Route path="settings" element={<WebsiteSettingsManagement />} />
        <Route
          path="users"
          element={
            <ProtectedRoute requireSuperAdmin={true}>
              <AdminUsersManagement />
            </ProtectedRoute>
          }
        />
        <Route path="activity-logs" element={<ActivityLogsManagement />} />
        <Route
          path="backup"
          element={
            <ProtectedRoute requireSuperAdmin={true}>
              <BackupRestoreManagement />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
