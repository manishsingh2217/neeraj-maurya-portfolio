import React, { useState } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { defaultProjects } from '../data/defaultPortfolioData';
import { ExternalLink, Github, ArrowUpRight, CheckCircle2, ChevronDown } from 'lucide-react';

export const ProjectsSection = () => {
  const { projects } = usePortfolio();
  const effectiveProjects = (projects && projects.length > 0) ? projects : defaultProjects;
  const [visibleCount, setVisibleCount] = useState(4);

  const defaultThumbnails = [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80', // Financial Dashboard / Charts
    'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80', // E-Commerce Analytics
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', // MIS Reporting & Spreadsheets
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80', // Retail Forecasting / Machine Learning
    'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=800&q=80'
  ];

  const publishedProjects = effectiveProjects.filter((p) => p.isPublished !== false);
  const displayedProjects = publishedProjects.slice(0, visibleCount);
  const hasMore = publishedProjects.length > visibleCount;

  return (
    <section id="projects" className="py-8 sm:py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Selected Work
          </h2>
          <p className="mt-2 text-sm sm:text-lg text-primary font-medium">
            Projects worth <span className="text-primary">a look.</span>
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Data products, business intelligence dashboards, and predictive models built end to end.
          </p>
        </div>
      </div>

      {/* Projects Responsive Grid (4 shown initially) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {displayedProjects.map((proj, idx) => {
          const previewImg =
            proj.image && proj.image.length > 5
              ? proj.image
              : defaultThumbnails[idx % defaultThumbnails.length];

          return (
            <div
              key={proj._id || proj.id || idx}
              className="bg-card rounded-2xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                {/* Project Preview Image with Zoom-on-Hover */}
                <div className="w-full h-44 sm:h-52 overflow-hidden bg-muted relative">
                  <img
                    src={previewImg}
                    alt={proj.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultThumbnails[idx % defaultThumbnails.length];
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-black/75 backdrop-blur-md text-primary font-bold shadow-sm">
                      {proj.category || 'Data Analytics'}
                    </span>
                  </div>
                  {proj.isFeatured && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-primary text-primary-foreground shadow-sm">
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading text-base sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {proj.title}
                    </h3>
                    {(proj.liveUrl || proj.githubUrl) && (
                      <a
                        href={proj.liveUrl || proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors shrink-0"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-2 sm:mt-2.5 line-clamp-3">
                    {proj.description}
                  </p>

                  {/* Highlights / Features (if available) */}
                  {proj.features && proj.features.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {proj.features.slice(0, 2).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-1.5 text-xs text-foreground/80">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Technology Pills */}
                  <div className="flex flex-wrap gap-1.5 mt-3 sm:mt-4">
                    {(proj.technologies || []).map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] font-mono uppercase bg-muted text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action Links */}
              <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                {proj.githubUrl ? (
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground font-medium transition-colors"
                  >
                    <Github className="w-3.5 h-3.5 shrink-0" />
                    <span>Source Code</span>
                  </a>
                ) : (
                  <span />
                )}

                {proj.liveUrl && (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary hover:underline font-bold"
                  >
                    <span>View Project</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Projects Button (shown only when total projects > 4) */}
      {hasMore && (
        <div className="text-center mt-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-card hover:bg-muted text-foreground text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-md cursor-pointer"
          >
            <span>Load More Projects</span>
            <ChevronDown className="w-4 h-4 text-primary" />
          </button>
        </div>
      )}
    </section>
  );
};
