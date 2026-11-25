const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const models = require('../models');

async function seedDatabase(force = false) {
  try {
    console.log('[Seed]: Checking database initialization...');
    
    // Check if admin already exists
    const adminCount = await models.Admin.countDocuments();
    if (adminCount > 0 && !force) {
      console.log(`[Seed]: Database already populated with ${adminCount} administrator(s).`);
      return;
    }

    if (force) {
      console.log('[Seed]: Force flag enabled. Resetting existing records...');
      await models.Admin.deleteMany({});
      await models.Profile.deleteMany({});
      await models.About.deleteMany({});
      await models.Skill.deleteMany({});
      await models.Experience.deleteMany({});
      await models.Project.deleteMany({});
      await models.Education.deleteMany({});
      await models.Certification.deleteMany({});
      await models.SocialLink.deleteMany({});
      await models.WebsiteSettings.deleteMany({});
      await models.Appearance.deleteMany({});
      await models.SeoSettings.deleteMany({});
      await models.Resume.deleteMany({});
    }

    // 1. Super Admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@12345', salt);
    await models.Admin.create({
      name: process.env.ADMIN_NAME || 'Neeraj Maurya (Super Admin)',
      email: (process.env.ADMIN_EMAIL || 'admin@neerajmaurya.com').toLowerCase(),
      password: hashedPassword,
      role: 'superadmin',
      status: 'active',
      avatar: '/uploads/images/avatar.png',
      lastLogin: new Date()
    });
    console.log(' - Admin created: admin@neerajmaurya.com / Admin@12345');

    // 2. Profile
    await models.Profile.create({
      fullName: 'Neeraj Maurya',
      title: 'Computer Science and Engineering Graduate',
      email: 'erneerajmaurya01@gmail.com',
      phone: '+91 9369279641',
      location: 'India',
      bioSummary: 'Computer Science and Engineering graduate with practical experience in MIS reporting, data analysis, business intelligence, and technical operations. Proficient in Python, SQL, Advanced Excel, and Power BI, with knowledge of data cleaning, exploratory data analysis, dashboard development, and reporting automation.',
      profileImage: '/uploads/images/profile-neeraj.jpg',
      resumeUrl: '/api/resume/download',
      availabilityStatus: 'OPEN TO OPPORTUNITIES',
      isAvailable: true,
      heroTypingWords: [
        'Data Analyst',
        'MIS Executive',
        'Business Intelligence Specialist',
        'Computer Science Graduate'
      ],
      languages: ['English (Professional Working Proficiency)', 'Hindi (Native)'],
      careerInterests: 'Open to opportunities across technical, analytical, business, reporting, operations, and technology-related fields.'
    });
    console.log(' - Profile seeded for Neeraj Maurya');

    // 3. About
    await models.About.create({
      headline: 'Dedicated to turning raw, multifaceted data into strategic business intelligence.',
      bioParagraphs: [
        'I am a Computer Science and Engineering graduate with hands-on experience in MIS reporting, data analysis, business intelligence, and operational analytics. Through corporate execution at Indiavision Realty & Infrastructure and specialized analytics at GRAStech, I specialize in transforming fragmented operational datasets into high-fidelity dashboards and streamlined automated reporting pipelines.',
        'My core analytical stack centers around Python (Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn), robust SQL query authoring for complex joins and aggregations, Microsoft Power BI for dynamic executive KPI visualization, and Advanced Excel utilizing nested XLOOKUPs, dynamic Pivot Tables, and automated macros. I am passionate about identifying systemic bottlenecks and bridging business requirements with reliable data solutions.'
      ],
      careerObjectives: 'To leverage my strong analytical, technical, and problem-solving skills in high-impact data analytics, business intelligence, or software engineering roles where I can drive operational efficiency and data-informed decision making.',
      yearsOfExperience: '1+ Years',
      projectsCompleted: '8+ End-to-End',
      certificationsCount: '6 Verified'
    });

    // 4. Skills
    const skillsData = [
      // Programming Languages
      { name: 'Python', category: 'Programming Languages', icon: 'terminal', proficiency: 90, order: 1 },
      { name: 'C', category: 'Programming Languages', icon: 'code', proficiency: 80, order: 2 },
      
      // Database and Tools
      { name: 'SQL', category: 'Database and Tools', icon: 'database', proficiency: 92, order: 3 },
      { name: 'Microsoft Excel', category: 'Database and Tools', icon: 'table', proficiency: 95, order: 4 },
      { name: 'Power BI', category: 'Database and Tools', icon: 'bar-chart-3', proficiency: 90, order: 5 },

      // Web Technologies
      { name: 'HTML', category: 'Web Technologies', icon: 'layout', proficiency: 88, order: 6 },
      { name: 'CSS', category: 'Web Technologies', icon: 'palette', proficiency: 85, order: 7 },
      { name: 'JavaScript', category: 'Web Technologies', icon: 'file-code', proficiency: 80, order: 8 },

      // Python Libraries
      { name: 'Pandas', category: 'Python Libraries', icon: 'binary', proficiency: 92, order: 9 },
      { name: 'NumPy', category: 'Python Libraries', icon: 'cpu', proficiency: 90, order: 10 },
      { name: 'Matplotlib', category: 'Python Libraries', icon: 'line-chart', proficiency: 88, order: 11 },
      { name: 'Seaborn', category: 'Python Libraries', icon: 'pie-chart', proficiency: 88, order: 12 },
      { name: 'Plotly', category: 'Python Libraries', icon: 'activity', proficiency: 84, order: 13 },
      { name: 'Scikit-learn', category: 'Python Libraries', icon: 'network', proficiency: 82, order: 14 },
      { name: 'OpenCV', category: 'Python Libraries', icon: 'eye', proficiency: 75, order: 15 },

      // Data Analysis
      { name: 'Data Cleaning', category: 'Data Analysis', icon: 'check-circle', proficiency: 95, order: 16 },
      { name: 'Exploratory Data Analysis', category: 'Data Analysis', icon: 'search', proficiency: 92, order: 17 },
      { name: 'Data Visualization', category: 'Data Analysis', icon: 'bar-chart-2', proficiency: 94, order: 18 },
      { name: 'Reporting', category: 'Data Analysis', icon: 'file-text', proficiency: 95, order: 19 },
      { name: 'Data Validation', category: 'Data Analysis', icon: 'shield-check', proficiency: 90, order: 20 },

      // Machine Learning
      { name: 'Regression', category: 'Machine Learning', icon: 'trending-up', proficiency: 82, order: 21 },
      { name: 'Classification', category: 'Machine Learning', icon: 'git-branch', proficiency: 80, order: 22 },
      { name: 'Clustering', category: 'Machine Learning', icon: 'share-2', proficiency: 78, order: 23 },

      // Excel
      { name: 'VLOOKUP / XLOOKUP', category: 'Excel', icon: 'table', proficiency: 96, order: 24 },
      { name: 'Pivot Tables & Slicers', category: 'Excel', icon: 'layers', proficiency: 95, order: 25 },
      { name: 'Advanced Data Validation', category: 'Excel', icon: 'filter', proficiency: 92, order: 26 },

      // Core Concepts
      { name: 'Statistics & Probability', category: 'Core Concepts', icon: 'sigma', proficiency: 88, order: 27 },
      { name: 'Artificial Intelligence Fundamentals', category: 'Core Concepts', icon: 'brain', proficiency: 82, order: 28 }
    ];

    for (const skill of skillsData) {
      await models.Skill.create(skill);
    }
    console.log(` - ${skillsData.length} technical skills seeded`);

    // 5. Professional Experience
    const experienceData = [
      {
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

    for (const exp of experienceData) {
      await models.Experience.create(exp);
    }
    console.log(' - Experience records seeded');

    // 6. Projects
    const projectsData = [
      {
        title: 'Bank Loan Analysis Dashboard',
        slug: 'bank-loan-analysis-dashboard',
        category: 'Business Intelligence & MIS',
        description: 'Developed an interactive business intelligence dashboard to analyse bank loan data, monitor loan performance, and identify trends in loan approvals and defaults.',
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
        image: '/uploads/images/project-bank-loan.jpg',
        githubUrl: 'https://github.com/erneerajmaurya/bank-loan-analysis-dashboard',
        liveUrl: 'https://app.powerbi.com/view?r=sample-loan-dashboard',
        isFeatured: true,
        isPublished: true,
        order: 1
      },
      {
        title: 'E-Commerce Sales Analysis',
        slug: 'e-commerce-sales-analysis',
        category: 'Data Science & Analytics',
        description: 'Analysed e-commerce sales data to understand sales performance, customer purchasing patterns, and actionable business insights using Python and statistical modeling.',
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
        image: '/uploads/images/project-ecommerce-sales.jpg',
        githubUrl: 'https://github.com/erneerajmaurya/e-commerce-sales-analysis',
        liveUrl: 'https://github.com/erneerajmaurya/e-commerce-sales-analysis#readme',
        isFeatured: true,
        isPublished: true,
        order: 2
      },
      {
        title: 'MIS Cross-Departmental Reporting Automation',
        slug: 'mis-reporting-automation',
        category: 'MIS & Operations',
        description: 'An automated workflow system that reconciles, cleans, and generates scheduled operational reports for multi-department real estate sales and inventory metrics.',
        features: [
          'Automated data reconciliation from diverse departments',
          'Dynamic XLOOKUP, Pivot Tables, and automated error-checking routines',
          'Scheduled summary generation for executive decision-makers',
          'Operational bottleneck detection and anomaly alerts'
        ],
        technologies: ['Advanced Excel', 'VBA / Macros', 'SQL', 'Data Validation'],
        image: '/uploads/images/project-mis-automation.jpg',
        githubUrl: 'https://github.com/erneerajmaurya/mis-reporting-pipeline',
        liveUrl: '',
        isFeatured: false,
        isPublished: true,
        order: 3
      },
      {
        title: 'Retail Store Inventory & Sales Forecasting',
        slug: 'retail-inventory-sales-forecasting',
        category: 'Machine Learning',
        description: 'Predictive analysis and inventory optimization engine applying machine learning regression to forecast weekly stock demands and reduce inventory holding costs.',
        features: [
          'Historical time-series trend extraction',
          'Linear Regression and Random Forest demand forecasting',
          'Stockout risk mitigation matrices and safety stock recommendations',
          'Interactive visual reporting with interactive sliders'
        ],
        technologies: ['Python', 'Scikit-learn', 'Pandas', 'Seaborn', 'Streamlit'],
        image: '/uploads/images/project-retail-forecast.jpg',
        githubUrl: 'https://github.com/erneerajmaurya/retail-sales-forecasting',
        liveUrl: '',
        isFeatured: false,
        isPublished: true,
        order: 4
      }
    ];

    for (const proj of projectsData) {
      await models.Project.create(proj);
    }
    console.log(' - Projects seeded');

    // 7. Education
    const educationData = [
      {
        degree: 'Bachelor of Technology in Computer Science and Engineering',
        institution: 'Dr. A.P.J. Abdul Kalam Technical University',
        duration: '2022 – 2026',
        score: 'CGPA: 7.9/10',
        description: 'Comprehensive computer science curriculum focused on data structures, algorithms, database management systems, artificial intelligence, and software engineering principles.',
        order: 1
      },
      {
        degree: 'Intermediate (Class XII)',
        institution: 'G.S.V.S Inter College, Maharajganj',
        duration: '2022',
        score: 'Percentage: 67%',
        description: 'Mathematics, Physics, Chemistry, and Computer Science foundation with consistent analytical academic engagement.',
        order: 2
      },
      {
        degree: 'High School (Class X)',
        institution: 'S.P.K.I.C.J.B.T.N., Maharajganj',
        duration: '2020',
        score: 'Percentage: 77.33%',
        description: 'Secondary school education focusing on science, mathematics, and analytical reasoning.',
        order: 3
      }
    ];

    for (const edu of educationData) {
      await models.Education.create(edu);
    }
    console.log(' - Education records seeded');

    // 8. Certifications
    const certsData = [
      {
        name: 'GenAI Powered Data Analytics Job Simulation',
        issuer: 'Tata',
        issueDate: '2024',
        credentialUrl: 'https://www.theforage.com/simulations/tata/data-analytics',
        order: 1,
        isEnabled: true
      },
      {
        name: 'SQL for Data Analysis',
        issuer: 'Coursera / Stanford Online',
        issueDate: '2024',
        credentialUrl: '',
        order: 2,
        isEnabled: true
      },
      {
        name: 'Data Labeling',
        issuer: 'Forage Academy',
        issueDate: '2024',
        credentialUrl: '',
        order: 3,
        isEnabled: true
      },
      {
        name: 'Power BI Data Modeling',
        issuer: 'Simplilearn',
        issueDate: '2024',
        credentialUrl: '',
        order: 4,
        isEnabled: true
      },
      {
        name: 'Data Visualization',
        issuer: 'Tata',
        issueDate: '2024',
        credentialUrl: '',
        order: 5,
        isEnabled: true
      },
      {
        name: 'Data Analytics Job Simulation',
        issuer: 'Deloitte',
        issueDate: '2024',
        credentialUrl: '',
        order: 6,
        isEnabled: true
      }
    ];

    for (const cert of certsData) {
      await models.Certification.create(cert);
    }
    console.log(' - Certifications seeded');

    // 9. Social Links
    const socialLinks = [
      { platform: 'LinkedIn', url: 'https://www.linkedin.com/in/neeraj-maurya', icon: 'linkedin', isEnabled: true, order: 1 },
      { platform: 'GitHub', url: 'https://github.com/erneerajmaurya', icon: 'github', isEnabled: true, order: 2 },
      { platform: 'Instagram', url: 'https://www.instagram.com/erneerajmaurya/', icon: 'instagram', isEnabled: true, order: 3 },
      { platform: 'Facebook', url: 'https://www.facebook.com/erneerajmaurya', icon: 'facebook', isEnabled: true, order: 4 },
      { platform: 'Email', url: 'mailto:erneerajmaurya01@gmail.com', icon: 'mail', isEnabled: true, order: 5 },
      { platform: 'Phone', url: 'tel:+919369279641', icon: 'phone', isEnabled: true, order: 6 }
    ];

    for (const link of socialLinks) {
      await models.SocialLink.create(link);
    }
    console.log(' - Social links seeded');

    // 10. Website Settings
    await models.WebsiteSettings.create({
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
    });

    // 11. Appearance
    await models.Appearance.create({
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
    });

    // 12. SEO Settings
    await models.SeoSettings.create({
      metaTitle: 'Neeraj Maurya | Data Analyst & MIS Executive Portfolio',
      metaDescription: 'Explore the technical portfolio, data dashboards, machine learning analytics, and MIS reporting pipelines of Neeraj Maurya.',
      metaKeywords: 'Neeraj Maurya, Data Analyst, MIS Executive, Power BI, Advanced Excel, Python, SQL, Dr. APJ Abdul Kalam Technical University',
      ogTitle: 'Neeraj Maurya - Data Analytics & MIS Portfolio',
      ogDescription: 'Computer Science and Engineering graduate with practical experience in MIS reporting, data analysis, business intelligence, and technical operations.',
      ogImage: '/uploads/images/og-preview.png',
      canonicalUrl: 'https://neerajmaurya.onrender.com',
      robots: 'index, follow'
    });

    // 13. Create sample resume record and sample file
    const sampleResumePath = path.join(__dirname, '..', 'uploads', 'resumes', 'Neeraj_Maurya_Resume.pdf');
    if (!fs.existsSync(sampleResumePath)) {
      // Create a valid placeholder PDF file
      const pdfHeader = `%PDF-1.4\n%âãÏÓ\n1 0 obj\n<< /Title (Neeraj Maurya Resume) /Author (Neeraj Maurya) >>\nendobj\n2 0 obj\n<< /Type /Catalog /Pages 3 0 R >>\nendobj\n3 0 obj\n<< /Type /Pages /Kids [4 0 R] /Count 1 >>\nendobj\n4 0 obj\n<< /Type /Page /Parent 3 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>\nendobj\n5 0 obj\n<< /Length 135 >>\nstream\nBT\n/F1 18 Tf\n50 720 Td\n(Neeraj Maurya - Computer Science & Engineering Graduate) Tj\n/F1 12 Tf\n0 -30 Td\n(Email: erneerajmaurya01@gmail.com | Phone: +91 9369279641) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000015 00000 n \n0000000096 00000 n \n0000000147 00000 n \n0000000210 00000 n \n0000000295 00000 n \ntrailer\n<< /Size 6 /Root 2 0 R >>\nstartxref\n480\n%%EOF`;
      fs.writeFileSync(sampleResumePath, pdfHeader, 'utf-8');
    }

    await models.Resume.create({
      fileName: 'Neeraj_Maurya_Resume.pdf',
      originalName: 'Neeraj_Maurya_Resume.pdf',
      filePath: '/uploads/resumes/Neeraj_Maurya_Resume.pdf',
      fileSizeBytes: 98400,
      version: '1.0',
      isPublished: true,
      uploadedAt: new Date()
    });

    // 14. Seed realistic visitor analytics for dashboard charts
    const today = new Date();
    for (let i = 14; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split('T')[0];
      const count = Math.floor(Math.random() * 25) + 12;
      for (let j = 0; j < count; j++) {
        await models.VisitorAnalytics.create({
          ip: `192.168.1.${Math.floor(Math.random() * 200) + 10}`,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130.0.0.0 Safari/537.36',
          page: j % 3 === 0 ? '/resources' : '/',
          referer: j % 2 === 0 ? 'https://google.com' : 'https://linkedin.com',
          dateString,
          timestamp: d
        });
      }
    }

    // 15. Initial sample contact messages
    await models.Message.create({
      name: 'Rohan Sharma',
      email: 'rohan.sharma@techcorp.in',
      subject: 'Inquiry for MIS / Data Analyst Role',
      message: 'Hi Neeraj, saw your portfolio and impressed by your Power BI bank loan dashboard and MIS experience. Are you available for a technical discussion this week?',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000 * 4)
    });

    await models.Message.create({
      name: 'Priya Verma',
      email: 'priya.v@analyticsconsulting.com',
      subject: 'Data Analytics Opportunity',
      message: 'Hello Neeraj, we are expanding our analytics team and looking for candidates proficient in Python, SQL, and Power BI. Would love to review your latest resume.',
      isRead: true,
      replyNotes: 'Replied with resume download link on LinkedIn.',
      createdAt: new Date(Date.now() - 3600000 * 24)
    });

    // 16. Initial Activity Logs
    await models.ActivityLog.create({
      adminId: 'system',
      adminEmail: 'system@neerajmaurya.com',
      adminName: 'System Setup',
      action: 'INITIALIZE',
      module: 'System',
      description: 'Portfolio database seeded with Neeraj Maurya resume details and initial configuration.',
      ipAddress: '127.0.0.1',
      timestamp: new Date()
    });

    console.log('[Seed]: Database successfully populated with all master records!');
  } catch (error) {
    console.error('[Seed Error]:', error);
  }
}

if (require.main === module) {
  require('dotenv').config();
  const { connectDB } = require('./db');
  (async () => {
    await connectDB();
    await seedDatabase(true);
    process.exit(0);
  })();
}

module.exports = { seedDatabase };
