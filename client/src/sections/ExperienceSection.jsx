import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export const ExperienceSection = () => {
  const { experiences } = usePortfolio();

  return (
    <section id="experience" className="py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
          Experience
        </h2>
        <p className="mt-2 text-sm sm:text-lg text-primary font-medium">
          Where I've <span className="text-primary">worked.</span>
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Professional experience in corporate MIS execution, reporting automation, and data analytics.
        </p>
      </div>

      {/* Experience Cards */}
      <div className="space-y-4 sm:space-y-6">
        {(experiences || []).map((exp, idx) => (
          <div
            key={exp._id || exp.id || idx}
            className="bg-card rounded-2xl p-4 sm:p-6 sm:p-7 shadow-lg transition-all duration-300 relative group overflow-hidden"
          >
            {/* Top Row: Role, Company, Duration */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 pb-3 sm:pb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-heading text-base sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {exp.role}
                  </h3>
                  {exp.isCurrent && (
                    <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-primary/15 text-primary">
                      CURRENT
                    </span>
                  )}
                  {exp.employmentType && (
                    <span className="px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-muted text-muted-foreground">
                      {exp.employmentType}
                    </span>
                  )}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-accent mt-1">
                  {exp.company}
                </div>
              </div>

              <div className="flex flex-col sm:items-end text-xs text-muted-foreground gap-1 font-mono">
                <div className="flex items-center gap-1.5 text-foreground bg-muted/80 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs w-fit">
                  <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>
                    {exp.startDate} – {exp.endDate || 'Present'}
                  </span>
                </div>
                {exp.location && (
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                    <MapPin className="w-3 h-3 text-primary shrink-0" />
                    <span>{exp.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Responsibilities List */}
            <div className="mt-4 sm:mt-5 space-y-2.5">
              {exp.responsibilities && exp.responsibilities.length > 0 ? (
                exp.responsibilities.map((resp, rIdx) => (
                  <div key={rIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{resp}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">Key responsibilities managed directly.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
