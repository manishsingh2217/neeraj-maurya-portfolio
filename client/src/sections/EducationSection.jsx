import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { defaultEducation } from '../data/defaultPortfolioData';
import { GraduationCap, Award, Calendar } from 'lucide-react';

export const EducationSection = () => {
  const { education } = usePortfolio();
  const effectiveEducation = (education && education.length > 0) ? education : defaultEducation;

  return (
    <section id="education" className="py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
          Education
        </h2>
        <p className="mt-2 text-sm sm:text-lg text-primary font-medium">
          How I <span className="text-primary">learned it.</span>
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Academic credentials, computer science foundation, and analytical coursework.
        </p>
      </div>

      {/* Timeline Layout */}
      <div className="relative border-l border-primary/20 ml-2 sm:ml-6 space-y-6 sm:space-y-8 pl-4 sm:pl-8">
        {effectiveEducation.map((edu, idx) => (
          <div key={edu._id || edu.id || idx} className="relative group">
            {/* Glowing Timeline Node */}
            <div className="absolute -left-[23px] sm:-left-[39px] top-2 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-primary ring-4 ring-primary/20 group-hover:scale-125 transition-transform duration-200" />

            <div className="bg-card rounded-2xl p-4 sm:p-6 transition-all duration-300 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-muted text-primary flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm sm:text-lg text-foreground group-hover:text-primary transition-colors">
                      {edu.degree}
                    </h3>
                    <p className="text-xs text-accent font-semibold mt-0.5">
                      {edu.institution}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-start sm:self-center font-mono">
                  <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-muted text-foreground flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{edu.duration}</span>
                  </span>
                  <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold bg-primary/15 text-primary">
                    {edu.score}
                  </span>
                </div>
              </div>

              {edu.description && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-3 leading-relaxed">
                  {edu.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
