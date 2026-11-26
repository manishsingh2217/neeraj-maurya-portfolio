// Canonical default portfolio data to ensure website sections NEVER display empty content
// under any network, server, database, or offline condition.

export const defaultProfile = {
  fullName: 'Neeraj Maurya',
  title: 'Computer Science and Engineering Graduate',
  email: 'erneerajmaurya01@gmail.com',
  phone: '+91 9369279641',
  location: 'India',
  bioSummary:
    'Computer Science and Engineering graduate with practical experience in MIS reporting, data analysis, business intelligence, and technical operations. Proficient in Python, SQL, Advanced Excel, and Power BI, with knowledge of data cleaning, exploratory data analysis, dashboard development, and reporting automation.',
  profileImage: '/neeraj-profile.jpeg',
  resumeUrl: '/api/resume/download',
  resumeDriveUrl: 'https://drive.google.com/file/d/1B7x_neeraj_maurya_resume/view?usp=sharing',
  availabilityStatus: 'OPEN TO OPPORTUNITIES',
  isAvailable: true,
  heroTypingWords: [
    'Data Analyst',
    'MIS Executive',
    'Business Intelligence Specialist',
    'Computer Science Graduate'
  ],
  languages: ['English (Professional Working Proficiency)', 'Hindi (Native)'],
  careerInterests:
    'Open to opportunities across technical, analytical, business, reporting, operations, and technology-related fields.'
};

export const defaultAbout = {
  headline: 'Dedicated to turning raw, multifaceted data into strategic business intelligence.',
  bioParagraphs: [
    'I am a Computer Science and Engineering graduate with hands-on experience in MIS reporting, data analysis, business intelligence, and operational analytics. Through corporate execution at Indiavision Realty & Infrastructure and specialized analytics at GRAStech, I specialize in transforming fragmented operational datasets into high-fidelity dashboards and streamlined automated reporting pipelines.',
    'My core analytical stack centers around Python (Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn), robust SQL query authoring for complex joins and aggregations, Microsoft Power BI for dynamic executive KPI visualization, and Advanced Excel utilizing nested XLOOKUPs, dynamic Pivot Tables, and automated macros. I am passionate about identifying systemic bottlenecks and bridging business requirements with reliable data solutions.'
  ],
  careerObjectives:
    'To leverage my strong analytical, technical, and problem-solving skills in high-impact data analytics, business intelligence, or software engineering roles where I can drive operational efficiency and data-informed decision making.',
  yearsOfExperience: '1+ Years',
  projectsCompleted: '8+ End-to-End',
  certificationsCount: '6 Verified'
};

export const defaultSkills = [
  // Programming Languages
  { _id: 'skill-1', name: 'Python', category: 'Programming Languages', icon: 'terminal', proficiency: 90, order: 1, isEnabled: true },
  { _id: 'skill-2', name: 'C', category: 'Programming Languages', icon: 'code', proficiency: 80, order: 2, isEnabled: true },
  
  // Database and Tools
  { _id: 'skill-3', name: 'SQL', category: 'Database and Tools', icon: 'database', proficiency: 92, order: 3, isEnabled: true },
  { _id: 'skill-4', name: 'Microsoft Excel', category: 'Database and Tools', icon: 'table', proficiency: 95, order: 4, isEnabled: true },
  { _id: 'skill-5', name: 'Power BI', category: 'Database and Tools', icon: 'bar-chart-3', proficiency: 90, order: 5, isEnabled: true },

  // Web Technologies
  { _id: 'skill-6', name: 'HTML', category: 'Web Technologies', icon: 'layout', proficiency: 88, order: 6, isEnabled: true },
  { _id: 'skill-7', name: 'CSS', category: 'Web Technologies', icon: 'palette', proficiency: 85, order: 7, isEnabled: true },
  { _id: 'skill-8', name: 'JavaScript', category: 'Web Technologies', icon: 'file-code', proficiency: 80, order: 8, isEnabled: true },

  // Python Libraries
  { _id: 'skill-9', name: 'Pandas', category: 'Python Libraries', icon: 'binary', proficiency: 92, order: 9, isEnabled: true },
  { _id: 'skill-10', name: 'NumPy', category: 'Python Libraries', icon: 'cpu', proficiency: 90, order: 10, isEnabled: true },
  { _id: 'skill-11', name: 'Matplotlib', category: 'Python Libraries', icon: 'line-chart', proficiency: 88, order: 11, isEnabled: true },
  { _id: 'skill-12', name: 'Seaborn', category: 'Python Libraries', icon: 'pie-chart', proficiency: 88, order: 12, isEnabled: true },
  { _id: 'skill-13', name: 'Plotly', category: 'Python Libraries', icon: 'activity', proficiency: 84, order: 13, isEnabled: true },
  { _id: 'skill-14', name: 'Scikit-learn', category: 'Python Libraries', icon: 'network', proficiency: 82, order: 14, isEnabled: true },
  { _id: 'skill-15', name: 'OpenCV', category: 'Python Libraries', icon: 'eye', proficiency: 75, order: 15, isEnabled: true },

  // Data Analysis
  { _id: 'skill-16', name: 'Data Cleaning', category: 'Data Analysis', icon: 'check-circle', proficiency: 95, order: 16, isEnabled: true },
  { _id: 'skill-17', name: 'Exploratory Data Analysis', category: 'Data Analysis', icon: 'search', proficiency: 92, order: 17, isEnabled: true },
  { _id: 'skill-18', name: 'Data Visualization', category: 'Data Analysis', icon: 'bar-chart-2', proficiency: 94, order: 18, isEnabled: true },
  { _id: 'skill-19', name: 'Reporting', category: 'Data Analysis', icon: 'file-text', proficiency: 95, order: 19, isEnabled: true },
  { _id: 'skill-20', name: 'Data Validation', category: 'Data Analysis', icon: 'shield-check', proficiency: 90, order: 20, isEnabled: true },

  // Machine Learning
  { _id: 'skill-21', name: 'Regression', category: 'Machine Learning', icon: 'trending-up', proficiency: 82, order: 21, isEnabled: true },
  { _id: 'skill-22', name: 'Classification', category: 'Machine Learning', icon: 'git-branch', proficiency: 80, order: 22, isEnabled: true },
  { _id: 'skill-23', name: 'Clustering', category: 'Machine Learning', icon: 'share-2', proficiency: 78, order: 23, isEnabled: true },

  // Excel
  { _id: 'skill-24', name: 'VLOOKUP / XLOOKUP', category: 'Excel', icon: 'table', proficiency: 96, order: 24, isEnabled: true },
  { _id: 'skill-25', name: 'Pivot Tables & Slicers', category: 'Excel', icon: 'layers', proficiency: 95, order: 25, isEnabled: true },
  { _id: 'skill-26', name: 'Advanced Data Validation', category: 'Excel', icon: 'filter', proficiency: 92, order: 26, isEnabled: true },

  // Core Concepts
  { _id: 'skill-27', name: 'Statistics & Probability', category: 'Core Concepts', icon: 'sigma', proficiency: 88, order: 27, isEnabled: true },
  { _id: 'skill-28', name: 'Artificial Intelligence Fundamentals', category: 'Core Concepts', icon: 'brain', proficiency: 82, order: 28, isEnabled: true }
];

export const defaultExperiences = [
  {
    _id: 'exp-1',
    company: 'Indiavision Realty & Infrastructure Pvt. Ltd.',
    role: 'MIS Executive',
    employmentType: 'Full-time',
    location: 'Noida, India',
    startDate: 'June 2026',
    endDate: 'Present',
    isCurrent: true,
    order: 1,
    responsibilities: [
      'Generate and maintain daily, weekly, and monthly MIS reports for executive management.',
      'Use Advanced Excel functions, including VLOOKUP, XLOOKUP, dynamic Pivot Tables, and conditional formulas.',
      'Maintain data accuracy through systematic data validation and anomaly detection techniques.',
      'Collect, reconcile, and clean cross-departmental datasets from sales, CRM, and accounts.',
      'Identify operational bottlenecks across workflows and recommend data-backed mitigation strategies.',
      'Automate routine reporting tasks and weekly spreadsheet consolidations to save engineering hours.'
    ]
  },
  {
    _id: 'exp-2',
    company: 'GRAStech Institute',
    role: 'Data Analytics Intern',
    employmentType: 'Internship',
    location: 'Noida, India',
    startDate: '1 December 2025',
    endDate: '30 May 2026',
    isCurrent: false,
    order: 2,
    responsibilities: [
      'Cleaned and transformed heterogeneous raw datasets using Python, SQL, Excel, and Power BI.',
      'Performed exploratory data analysis (EDA) using Pandas, NumPy, Matplotlib, and Seaborn to isolate critical business drivers.',
      'Developed interactive Power BI dashboards featuring DAX measures, customized slicers, and KPI cards.',
      'Used SQL queries for data extraction, multi-table joins, subqueries, filtering, and aggregation summarisation.',
      'Applied data validation and preprocessing techniques to eliminate nulls, outliers, and duplicates.',
      'Presented analytical findings through clear executive visualisations and structured analytical reports.'
    ]
  }
];

export const defaultProjects = [
  {
    _id: 'proj-1',
    title: 'Bank Loan Analysis Dashboard',
    slug: 'bank-loan-analysis-dashboard',
    category: 'Business Intelligence & MIS',
    description:
      'Developed an interactive business intelligence dashboard to analyse bank loan data, monitor loan performance, and identify trends in loan approvals and defaults.',
    features: [
      'Loan data preparation & schema normalization',
      'Data cleaning and rigorous validation across financial fields',
      'Loan approval analysis segmented by credit tier and purpose',
      'Rejected application analysis with root cause attribution',
      'Default risk analysis and non-performing asset (NPA) trends',
      'Customer demographics breakdown by income bracket and tenure',
      'Executive KPI development (Total Funded Amount, Received Amount, Avg DTI)',
      'Interactive Power BI dashboard with dynamic cross-filtering and drill-through'
    ],
    technologies: ['Microsoft Excel', 'Power BI', 'DAX', 'Data Modeling', 'Financial Analysis'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com/erneerajmaurya/bank-loan-analysis-dashboard',
    liveUrl: 'https://app.powerbi.com/view?r=sample-loan-dashboard',
    isFeatured: true,
    isPublished: true,
    order: 1
  },
  {
    _id: 'proj-2',
    title: 'E-Commerce Sales Analysis',
    slug: 'e-commerce-sales-analysis',
    category: 'Data Science & Analytics',
    description:
      'Analysed e-commerce sales data to understand sales performance, customer purchasing patterns, and actionable business insights using Python and statistical modeling.',
    features: [
      'Automated data importing from multi-source CSVs',
      'Data cleaning and handling missing values with Pandas',
      'Data preprocessing, feature engineering, and RFM customer segmentation',
      'Exploratory Data Analysis (EDA) uncovering regional demand variance',
      'Sales pattern and seasonal trend analysis over multi-year periods',
      'Customer behaviour analysis (Repeat purchase rate, average basket value)',
      'High-impact data visualisations using Matplotlib, Seaborn, and Plotly'
    ],
    technologies: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Seaborn', 'Plotly', 'Jupyter Notebook'],
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com/erneerajmaurya/e-commerce-sales-analysis',
    liveUrl: 'https://github.com/erneerajmaurya/e-commerce-sales-analysis#readme',
    isFeatured: true,
    isPublished: true,
    order: 2
  },
  {
    _id: 'proj-3',
    title: 'MIS Cross-Departmental Reporting Automation',
    slug: 'mis-reporting-automation',
    category: 'MIS & Operations',
    description:
      'An automated workflow system that reconciles, cleans, and generates scheduled operational reports for multi-department real estate sales and inventory metrics.',
    features: [
      'Automated data reconciliation from diverse departments',
      'Dynamic XLOOKUP, Pivot Tables, and automated error-checking routines',
      'Scheduled summary generation for executive decision-makers',
      'Operational bottleneck detection and anomaly alerts'
    ],
    technologies: ['Advanced Excel', 'VBA / Macros', 'SQL', 'Data Validation'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com/erneerajmaurya/mis-reporting-pipeline',
    liveUrl: '',
    isFeatured: false,
    isPublished: true,
    order: 3
  },
  {
    _id: 'proj-4',
    title: 'Retail Store Inventory & Sales Forecasting',
    slug: 'retail-inventory-sales-forecasting',
    category: 'Machine Learning',
    description:
      'Predictive analysis and inventory optimization engine applying machine learning regression to forecast weekly stock demands and reduce inventory holding costs.',
    features: [
      'Historical time-series trend extraction',
      'Linear Regression and Random Forest demand forecasting',
      'Stockout risk mitigation matrices and safety stock recommendations',
      'Interactive visual reporting with interactive sliders'
    ],
    technologies: ['Python', 'Scikit-learn', 'Pandas', 'Seaborn', 'Streamlit'],
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com/erneerajmaurya/retail-sales-forecasting',
    liveUrl: '',
    isFeatured: false,
    isPublished: true,
    order: 4
  },
  {
    _id: 'proj-5',
    title: 'Customer Churn Analysis & Retention Modeling',
    slug: 'customer-churn-analysis-retention',
    category: 'Machine Learning',
    description:
      'Exploratory data analysis and predictive classification to identify at-risk enterprise customers and recommend targeted retention workflows.',
    features: [
      'Feature correlation analysis & churn probability scoring',
      'Predictive classification modeling with 85%+ validation accuracy',
      'Interactive Power BI churn dashboard with customer risk tiering',
      'Automated customer retention strategy playbook'
    ],
    technologies: ['Python', 'Pandas', 'Scikit-learn', 'Seaborn', 'Power BI'],
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com/erneerajmaurya/customer-churn-analysis',
    liveUrl: 'https://app.powerbi.com/view?r=eyJrIjoiY2h1cm4tYW5hbHlzaXMiLCJ0IjoiZGVtbyJ9',
    isFeatured: false,
    isPublished: true,
    order: 5
  },
  {
    _id: 'proj-6',
    title: 'Financial Risk & Investment Portfolio Tracker',
    slug: 'financial-risk-portfolio-tracker',
    category: 'Business Intelligence',
    description:
      'Comprehensive financial performance and risk monitoring dashboard tracking asset returns, volatility metrics, and asset allocation breakdown.',
    features: [
      'Real-time KPI variance calculation & Sharpe ratio benchmarking',
      'Dynamic asset weight rebalancing & volatility tracking',
      'Historical drawdown analysis across market cycles',
      'Executive summary PDF export & reporting automation'
    ],
    technologies: ['Advanced Excel', 'SQL', 'Power BI', 'DAX', 'Financial Modeling'],
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    githubUrl: 'https://github.com/erneerajmaurya/portfolio-risk-tracker',
    liveUrl: 'https://app.powerbi.com/view?r=eyJrIjoicmlzay10cmFja2VyIiwidCI6ImRlbW8ifQ',
    isFeatured: false,
    isPublished: true,
    order: 6
  }
];

export const defaultEducation = [
  {
    _id: 'edu-1',
    degree: 'Bachelor of Technology in Computer Science and Engineering',
    institution: 'Dr. A.P.J. Abdul Kalam Technical University',
    duration: '2022 – 2026',
    score: 'CGPA: 7.9/10',
    description:
      'Comprehensive computer science curriculum focused on data structures, algorithms, database management systems, artificial intelligence, and software engineering principles.',
    order: 1
  },
  {
    _id: 'edu-2',
    degree: 'Intermediate (Class XII)',
    institution: 'G.S.V.S Inter College, Maharajganj',
    duration: '2022',
    score: 'Percentage: 67%',
    description:
      'Mathematics, Physics, Chemistry, and Computer Science foundation with consistent analytical academic engagement.',
    order: 2
  },
  {
    _id: 'edu-3',
    degree: 'High School (Class X)',
    institution: 'S.P.K.I.C.J.B.T.N., Maharajganj',
    duration: '2020',
    score: 'Percentage: 77.33%',
    description: 'Secondary school education focusing on science, mathematics, and analytical reasoning.',
    order: 3
  }
];

export const defaultCertifications = [
  {
    _id: 'cert-1',
    name: 'GenAI Powered Data Analytics Job Simulation',
    issuer: 'Tata',
    issueDate: '2024',
    credentialUrl: 'https://www.theforage.com/simulations/tata/data-analytics',
    order: 1,
    isEnabled: true
  },
  {
    _id: 'cert-2',
    name: 'SQL for Data Analysis',
    issuer: 'Coursera / Stanford Online',
    issueDate: '2024',
    credentialUrl: '',
    order: 2,
    isEnabled: true
  },
  {
    _id: 'cert-3',
    name: 'Data Labeling',
    issuer: 'Forage Academy',
    issueDate: '2024',
    credentialUrl: '',
    order: 3,
    isEnabled: true
  },
  {
    _id: 'cert-4',
    name: 'Power BI Data Modeling',
    issuer: 'Simplilearn',
    issueDate: '2024',
    credentialUrl: '',
    order: 4,
    isEnabled: true
  },
  {
    _id: 'cert-5',
    name: 'Data Visualization',
    issuer: 'Tata',
    issueDate: '2024',
    credentialUrl: '',
    order: 5,
    isEnabled: true
  },
  {
    _id: 'cert-6',
    name: 'Data Analytics Job Simulation',
    issuer: 'Deloitte',
    issueDate: '2024',
    credentialUrl: '',
    order: 6,
    isEnabled: true
  }
];

export const defaultSocialLinks = [
  { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/neeraj-maurya', icon: 'linkedin', isEnabled: true, order: 1 },
  { platform: 'GitHub', url: 'https://github.com/erneerajmaurya', icon: 'github', isEnabled: true, order: 2 },
  { platform: 'Instagram', url: 'https://www.instagram.com/erneerajmaurya/', icon: 'instagram', isEnabled: true, order: 3 },
  { platform: 'Facebook', url: 'https://www.facebook.com/erneerajmaurya', icon: 'facebook', isEnabled: true, order: 4 },
  { platform: 'Email', url: 'mailto:erneerajmaurya01@gmail.com', icon: 'mail', isEnabled: true, order: 5 },
  { platform: 'Phone', url: 'tel:+919369279641', icon: 'phone', isEnabled: true, order: 6 }
];

export const defaultSettings = {
  siteTitle: 'Neeraj Maurya | Computer Science & Engineering Graduate | Data & MIS Portfolio',
  siteDescription: 'Portfolio of Neeraj Maurya - MIS Executive and Data Analyst specializing in Python, SQL, Power BI, Advanced Excel, and business intelligence.',
  logoText: 'NM',
  primaryColor: '#fb8236',
  secondaryColor: '#f8af26',
  themeMode: 'dark',
  maintenanceMode: false,
  contactEmail: 'erneerajmaurya01@gmail.com',
  allowResumeDownload: true,
  footerText: 'Neeraj Maurya · © 2026 — All rights reserved'
};

export const defaultAppearance = {
  primaryColor: '#fb8236',
  accentColor: '#f8af26',
  fontFamily: 'Space Grotesk',
  sectionOrder: ['hero', 'about', 'experience', 'projects', 'skills', 'education', 'certifications', 'contact'],
  visibleSections: {
    hero: true,
    about: true,
    experience: true,
    projects: true,
    skills: true,
    education: true,
    certifications: true,
    contact: true
  }
};

export const defaultSeoSettings = {
  metaTitle: 'Neeraj Maurya | Data Analyst & MIS Executive Portfolio',
  metaDescription: 'Explore the full-stack portfolio of Neeraj Maurya, CSE Graduate specializing in data analysis, business intelligence, Power BI dashboards, Python modeling, and automated MIS reporting.',
  metaKeywords: 'Neeraj Maurya, Data Analyst, MIS Executive, Power BI, Python, SQL, Advanced Excel, Portfolio',
  ogTitle: 'Neeraj Maurya - Portfolio & Projects',
  ogDescription: 'Explore data analytics dashboards, machine learning analysis, and MIS reporting projects by Neeraj Maurya.',
  ogImage: '/uploads/images/og-preview.png',
  canonicalUrl: 'https://neerajmaurya.onrender.com',
  robots: 'index, follow'
};
