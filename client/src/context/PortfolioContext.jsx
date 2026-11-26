import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import {
  defaultProfile,
  defaultAbout,
  defaultSkills,
  defaultExperiences,
  defaultProjects,
  defaultEducation,
  defaultCertifications,
  defaultSocialLinks,
  defaultSettings,
  defaultAppearance,
  defaultSeoSettings
} from '../data/defaultPortfolioData';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState({
    profile: defaultProfile,
    about: defaultAbout,
    skills: defaultSkills,
    experiences: defaultExperiences,
    projects: defaultProjects,
    education: defaultEducation,
    certifications: defaultCertifications,
    resources: [],
    socialLinks: defaultSocialLinks,
    settings: defaultSettings,
    appearance: defaultAppearance,
    seoSettings: defaultSeoSettings
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const res = await api.getPortfolioData();
      if (res && res.success && res.data) {
        setData({
          profile: (res.data.profile && res.data.profile.fullName) ? res.data.profile : defaultProfile,
          about: (res.data.about && (res.data.about.headline || res.data.about.bioParagraphs)) ? res.data.about : defaultAbout,
          skills: (res.data.skills && res.data.skills.length > 0) ? res.data.skills : defaultSkills,
          experiences: (res.data.experiences && res.data.experiences.length > 0) ? res.data.experiences : defaultExperiences,
          projects: (res.data.projects && res.data.projects.length > 0) ? res.data.projects : defaultProjects,
          education: (res.data.education && res.data.education.length > 0) ? res.data.education : defaultEducation,
          certifications: (res.data.certifications && res.data.certifications.length > 0) ? res.data.certifications : defaultCertifications,
          resources: (res.data.resources && res.data.resources.length > 0) ? res.data.resources : [],
          socialLinks: (res.data.socialLinks && res.data.socialLinks.length > 0) ? res.data.socialLinks : defaultSocialLinks,
          settings: res.data.settings || defaultSettings,
          appearance: res.data.appearance || defaultAppearance,
          seoSettings: res.data.seoSettings || defaultSeoSettings
        });
        setError(null);
      }
    } catch (err) {
      console.warn('API fetch notice, using fallback canonical portfolio data:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        ...data,
        loading,
        error,
        reloadPortfolio: fetchPortfolio
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);
