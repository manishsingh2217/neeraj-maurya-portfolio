import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const [data, setData] = useState({
    profile: {
      fullName: 'Neeraj Maurya',
      title: 'Computer Science and Engineering Graduate',
      profileImage: '/neeraj-profile.jpeg',
      availabilityStatus: 'OPEN TO OPPORTUNITIES'
    },
    about: null,
    skills: [],
    experiences: [],
    projects: [],
    education: [],
    certifications: [],
    resources: [],
    socialLinks: [],
    settings: null,
    appearance: null,
    seoSettings: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const res = await api.getPortfolioData();
      if (res.success && res.data) {
        setData(res.data);
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
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
