# Neeraj Maurya — Dynamic Portfolio & Full Admin Dashboard

A full-stack, responsive, and dynamic portfolio website recreated with an integrated professional Admin Dashboard. Built with a modern tech stack (React + Vite, Tailwind CSS, Node.js, Express, MongoDB / Mongoose, JWT Authentication).

---

## 🌟 Architecture & Features

### 1. Public Portfolio
- **Design System & Theme**: Dark mode default (`#171717` background, elevated `#242424` cards, sunset orange `#fb8236` and amber `#f8af26` accents, Space Grotesk / Inter typography) with dynamic light mode toggle.
- **Fixed Glassmorphism Navigation**: Monogram logo **NM**, smooth scrolling links ("Skills", "Projects", "Experience", "Education", "Contact", "Resources"), theme toggle, and Admin portal lock button.
- **Desktop Two-Column Asymmetrical Layout**:
  - **Sticky Profile Card (`<aside>`)**: Portrait squircle, pulsing `● OPEN TO OPPORTUNITIES` status badge, full name, professional title, location pill, direct social links (LinkedIn, GitHub, Mail, Phone), "Download CV" outline CTA, and "Contact Me" primary CTA.
  - **Dynamic Content Flow (`<main>`)**:
    - **Hero Section**: Dynamic typewriter text animation cycling across analytical titles ("Data Analyst", "MIS Executive", "Business Intelligence Specialist", "Computer Science Graduate") with blinking cursor, narrative bio, and technology chips.
    - **About Section**: Professional summary, key career focus, languages, and statistical cards (1+ Years, 8+ End-to-End Projects, 6 Industry Certifications).
    - **Skills & Toolkit**: 28 technical skills with category tab filtering (Database and Tools, Programming Languages, Data Analysis, Python Libraries, Excel, Machine Learning, Core Concepts, Web Technologies) and proficiency bars.
    - **Experience Timeline**:
      - *MIS Executive* at **Indiavision Realty & Infrastructure Pvt. Ltd.** (June 2026 – Present, Noida, India).
      - *Data Analytics Intern* at **GRAStech Institute** (1 December 2025 – 30 May 2026, Noida, India).
    - **Projects Showcase**:
      - *Featured Project*: **Bank Loan Analysis Dashboard** (Power BI, Excel, DAX, Financial KPIs).
      - *E-Commerce Sales Analysis* (Python, Pandas, NumPy, Matplotlib, Seaborn).
      - *MIS Cross-Departmental Reporting Automation* (Advanced Excel, SQL).
      - *Retail Store Inventory & Sales Forecasting* (Python, Scikit-learn).
    - **Education**: Dr. A.P.J. Abdul Kalam Technical University (B.Tech CSE, 2022 – 2026, CGPA: 7.9/10), Intermediate (67%), High School (77.33%).
    - **Certifications**: Tata GenAI Data Analytics, SQL for Data Analysis, Forage Data Labeling, Simplilearn Power BI Data Modeling, Tata Data Visualization, Deloitte Data Analytics.
    - **Contact Section**: Direct mailto card + validated interactive contact form with instant MongoDB persistence and notification alerts.
- **Resources Subpage (`/resources`)**: Study materials, cheat sheets, and project files download hub.
- **Floating Action Button (FAB)**: Smooth-scrolling quick-mail button.

---

### 2. Complete Professional Admin Dashboard (`/admin`)
- **Protected Routing & Security**: JWT token authentication with bcrypt password hashing and role-based permissions (`superadmin`, `admin`, `editor`).
- **Dashboard Overview**: Summary KPI cards (Total Visitors, Total Projects, Skills, Experiences, Certifications, Contact Messages with unread badge), interactive 7-day visitor traffic bar chart, top page views breakdown, and recent activity audit feed.
- **Profile Management**: Edit full name, title, email, phone, location, bio summary, avatar upload, typing roles, and career interests.
- **About Management**: Edit headline, bio narrative paragraphs, career objectives, and statistical metrics.
- **Skills Management**: Full CRUD, category assignment, proficiency adjusters, display order, and active/inactive toggles.
- **Experience Management**: Full CRUD, company, role, type, exact employment dates, current toggle, and bulleted responsibilities.
- **Project Management**: Full CRUD, image uploads, descriptions, technology tags, GitHub/Live demo links, featured toggle, and publish draft status.
- **Education Management**: Full CRUD, degree, institution, duration, and score/CGPA.
- **Certifications Management**: Full CRUD, issuer, issue date, verification link, and certificate files.
- **Resume Management**: Upload/replace resume PDF, download current published resume, version tracking, and file size metrics.
- **Contact Messages Management**: Inbox with unread message counter, message drawer, read/unread toggling, reply notes, and deletion.
- **Social Media Links Management**: Full CRUD for LinkedIn, GitHub, Mail, Phone, and custom links.
- **Appearance Customization**: Font typography switcher, accent color picker, and section visibility toggles.
- **SEO & Open Graph Settings**: Page titles, meta descriptions, search keywords, OG titles, and robots directives.
- **Website Settings**: Site title, monogram logo, maintenance mode, and contact routing.
- **Admin User Management (Super Admin)**: Create and manage administrators, assign roles, and change passwords.
- **Activity Logs**: Full audit trail of admin logins, edits, creations, and deletions with timestamps and IP logging.
- **Backup & Restore (Super Admin)**: One-click JSON database snapshot export and restore capability.

---


Admin Login URL: `http://localhost:5000/admin/login` (or navigate via lock icon in the navbar)

---

## 🛠️ Project Structure

```
neeraj-portfolio/
├── client/                     # Frontend Application (React + Vite + Tailwind CSS)
│   ├── public/
│   │   └── favicon.svg         # Monogram SVG Favicon
│   ├── src/
│   │   ├── admin/              # Complete Admin Panel Modules
│   │   │   ├── ActivityLogsManagement.jsx
│   │   │   ├── AdminHeader.jsx
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── AdminUsersManagement.jsx
│   │   │   ├── AppearanceManagement.jsx
│   │   │   ├── BackupRestoreManagement.jsx
│   │   │   ├── CertificationsManagement.jsx
│   │   │   ├── DashboardOverview.jsx
│   │   │   ├── EducationManagement.jsx
│   │   │   ├── ExperienceManagement.jsx
│   │   │   ├── MessagesManagement.jsx
│   │   │   ├── ProfileManagement.jsx
│   │   │   ├── ProjectsManagement.jsx
│   │   │   ├── ResumeManagement.jsx
│   │   │   ├── SeoManagement.jsx
│   │   │   ├── SkillsManagement.jsx
│   │   │   ├── SocialLinksManagement.jsx
│   │   │   └── WebsiteSettingsManagement.jsx
│   │   ├── components/         # Reusable Public Components
│   │   │   ├── FloatingActionButton.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── StickyProfileCard.jsx
│   │   ├── context/            # AuthContext, ThemeContext, PortfolioContext
│   │   ├── pages/              # HomePage.jsx, ResourcesPage.jsx
│   │   ├── sections/           # HeroSection, AboutSection, SkillsSection, ExperienceSection, ProjectsSection, EducationSection, CertificationsSection, ContactSection
│   │   ├── services/           # Unified API Service Layer
│   │   ├── App.jsx             # React Router Setup
│   │   ├── index.css           # Tailwind + Custom Design System CSS
│   │   └── main.jsx            # Entry Point
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Backend API & Storage Engine (Node.js + Express + Mongoose)
│   ├── config/
│   │   ├── db.js               # MongoDB Connection + Embedded Fallback Engine
│   │   └── seed.js             # Initial Master Database Seeder
│   ├── controllers/            # Auth, Portfolio, Profile, Skills, Projects, Messages, etc.
│   ├── middleware/             # JWT auth, upload (multer), rate limiting
│   ├── models/                 # Mongoose Schemas & Unified Store Wrappers
│   ├── routes/                 # Express API Routes
│   ├── uploads/                # Persistent uploads (resumes, images, certificates)
│   ├── data/                   # Persistent local JSON data store (when running without Atlas)
│   ├── .env                    # Environment configuration
│   ├── .env.example
│   ├── index.js                # Server entry point + static frontend serving
│   └── package.json
└── README.md
```

---

## 🚀 Running Locally

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### 2. Setup Server
```bash
cd server
npm install
npm run seed     # Seeds default data for Neeraj Maurya and Super Admin
npm start        # Starts server on http://localhost:5000
```

### 3. Setup Client (Development Mode)
```bash
cd client
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173 with API proxy
```

### 4. Unified Production Build
When running `npm run build` in `client`, the built static bundle is located in `client/dist`. The server at `server/index.js` automatically serves `client/dist` directly, allowing the entire application to be run seamlessly on a single port (`http://localhost:5000`).

---

## 🌐 Production Deployment Guide

### Option 1: Render Deployment (Recommended)

#### Backend Web Service (Render):
1. Create a new **Web Service** on [Render](https://render.com/).
2. Connect your Git repository.
3. Configure the service settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
4. Set Environment Variables in Render Dashboard:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: `mongodb+srv://<user>:<password>@cluster0.mongodb.net/neeraj_portfolio?retryWrites=true&w=majority`
   - `JWT_SECRET`: `<your_long_random_jwt_secret_key>`
   - `JWT_EXPIRES_IN`: `7d`
   - `CLIENT_URL`: `https://neeraj-maurya.onrender.com`
   - `ADMIN_EMAIL`: `nm9025127@gmail.com`
   - `ADMIN_PASSWORD`: `Neeraj@2005?`

### 🚀 Deploying to Vercel (Recommended with GitHub)

1. **Push your code to GitHub**:
   - The repository is connected at `https://github.com/manishsingh2217/neeraj-maurya-portfolio`.
2. **Import Project to Vercel**:
   - Log in to [Vercel](https://vercel.com) and click **"Add New..." > "Project"**.
   - Select and import `neeraj-maurya-portfolio`.
3. **Build & Output Settings**:
   - Framework Preset: **Other** (or **Vite**)
   - Root Directory: `./` (leave default)
   - Build Command: `npm run build`
   - Output Directory: `client/dist`
4. **Environment Variables**:
   Add the following in Vercel **Environment Variables**:
   - `MONGODB_URI`: `<your_mongodb_atlas_connection_string>`
   - `JWT_SECRET`: `super_secret_jwt_key_neeraj_portfolio_2026_secure` (or your custom random secret)
   - `ADMIN_EMAIL`: `nm9025127@gmail.com`
   - `ADMIN_PASSWORD`: `Neeraj@2005?`
   - `NODE_ENV`: `production`
5. **Deploy**:
   - Click **Deploy**. Vercel will build the React Vite frontend and configure the Node serverless API handler seamlessly via `vercel.json`!
6. **Access Admin**:
   - Open your deployed URL: `https://<your-project>.vercel.app/admin/login`
   - Log in with `nm9025127@gmail.com` and `Neeraj@2005?`.

#### Frontend Static Site (Render):
1. Create a new **Static Site** on Render.
2. Configure settings:
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
3. Add Rewrite Rule for SPA:
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`
4. In `client/vite.config.js` or environment variables, point `/api` proxy or `VITE_API_BASE_URL` to your Render Web Service URL.

---

## 📋 Comprehensive Requirements Checklist

- [x] Reference Website Analyzed & Recreated (`https://manish-singh.onrender.com/`)
- [x] Dark/Light Mode Theme System with Warm Sunset Orange Accents
- [x] Fixed Glassmorphism Navbar with "NM" Brand Monogram
- [x] Sticky Desktop Two-Column Profile Card with Pulsing Status Badge
- [x] Hero Section with Dynamic Typewriter Animation & Technology Chips
- [x] About Section with Bio & Statistical Metrics (1+ Years, 8+ Projects, 6 Certifications)
- [x] Skills & Tools Section with Category Filtering & All 28 Skills
- [x] Experience Section with Indiavision Realty & GRAStech Records (Exact Dates)
- [x] Projects Section with Bank Loan Analysis Hero & E-Commerce Sales Analysis
- [x] Education Section with Dr. APJ Abdul Kalam Technical University, Class XII, Class X
- [x] Certifications Section with 6 Verified Credentials
- [x] Contact Section with Direct Mailto Box & Interactive Form
- [x] Dedicated Resources Subpage (`/resources`) with Download Cards
- [x] Floating Action Mail Button (FAB)
- [x] Full-Featured Admin Dashboard (`/admin`)
- [x] Secure JWT Authentication & Password Hashing
- [x] Real Database-Backed Visitor Analytics & 7-Day Charts
- [x] Profile Management with Avatar Upload
- [x] Skills Management with CRUD & Active Toggles
- [x] Experience Management with CRUD & Date Management
- [x] Projects Management with CRUD, Publish, & Featured Toggles
- [x] Education & Certifications Management
- [x] Dedicated Resume Management (PDF Upload & Download Target)
- [x] Contact Messages Management (Read/Unread, Search, Reply Notes)
- [x] Social Links Management
- [x] Appearance Customization (Font, Colors, Section Toggles)
- [x] SEO & Social Open Graph Management
- [x] Admin User Management (Super Admin Role)
- [x] Admin Activity Logs Audit Trail
- [x] Database Backup & Disaster Recovery (JSON Export / Import)
- [x] Fully Verified across Browser & REST APIs
