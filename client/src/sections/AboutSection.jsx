import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const AboutSection = () => {
  const { about, profile } = usePortfolio();

  const bioParagraphs = about?.bioParagraphs || [
    'I am a Computer Science and Engineering graduate with practical experience in MIS reporting, data analysis, business intelligence, and technical operations. Through hands-on roles as an MIS Executive and Data Analytics Intern, I have developed expertise in transforming complex data into clear, actionable insights.',
    'My technical repertoire includes Python (Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn), SQL, Power BI, and Advanced Excel (XLOOKUP, Pivot Tables, Data Modeling). I have a proven track record of creating automated reporting pipelines, designing interactive executive dashboards, and uncovering operational bottlenecks.'
  ];

  return (
    <section id="about" className="py-8 sm:py-12">
      <div className="mb-6">
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
          About
        </h2>
        <p className="mt-2 text-sm sm:text-lg text-primary font-medium">
          {about?.headline || 'Dedicated to turning raw data into strategic business intelligence.'}
        </p>
      </div>

      {/* Bio Paragraphs */}
      <div className="mt-4 sm:mt-6 space-y-3.5 sm:space-y-4 text-xs sm:text-base text-muted-foreground leading-relaxed">
        {bioParagraphs.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>

      {/* Metrics & Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8">
        <div className="bg-card rounded-2xl p-4 sm:p-5 text-center shadow-sm">
          <div className="font-heading text-2xl sm:text-3xl font-extrabold text-primary">
            {about?.yearsOfExperience || '1+'}
          </div>
          <div className="text-[11px] sm:text-xs font-medium text-muted-foreground mt-1 uppercase tracking-wider">
            Hands-on Experience
          </div>
        </div>
        <div className="bg-card rounded-2xl p-4 sm:p-5 text-center shadow-sm">
          <div className="font-heading text-2xl sm:text-3xl font-extrabold text-accent">
            {about?.projectsCompleted || '8+'}
          </div>
          <div className="text-[11px] sm:text-xs font-medium text-muted-foreground mt-1 uppercase tracking-wider">
            End-to-End Projects
          </div>
        </div>
        <div className="bg-card rounded-2xl p-4 sm:p-5 text-center shadow-sm">
          <div className="font-heading text-2xl sm:text-3xl font-extrabold text-primary">
            {about?.certificationsCount || '6'}
          </div>
          <div className="text-[11px] sm:text-xs font-medium text-muted-foreground mt-1 uppercase tracking-wider">
            Industry Certifications
          </div>
        </div>
      </div>
    </section>
  );
};
