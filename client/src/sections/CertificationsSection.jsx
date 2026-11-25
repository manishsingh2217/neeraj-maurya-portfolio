import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { Award, ExternalLink, CheckCircle } from 'lucide-react';

export const CertificationsSection = () => {
  const { certifications } = usePortfolio();
  const enabledCerts = (certifications || []).filter((c) => c.isEnabled !== false);

  return (
    <section id="certifications" className="py-8 sm:py-12">
      <div className="mb-6 sm:mb-8">
        <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
          Certifications
        </h2>
        <p className="mt-2 text-sm sm:text-lg text-primary font-medium">
          Verified <span className="text-primary">credentials.</span>
        </p>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Industry simulations, data engineering credentials, and business intelligence certifications.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {enabledCerts.map((cert, idx) => (
          <div
            key={cert._id || cert.id || idx}
            className="bg-card rounded-2xl p-4 sm:p-5 shadow-sm transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-sm">
                  <Award className="w-5 h-5" />
                </div>
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-muted-foreground hover:text-primary transition-colors p-1"
                    title="Verify Credential"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <h3 className="font-heading font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors mt-3">
                {cert.name}
              </h3>
              <p className="text-xs font-semibold text-accent mt-1">
                {cert.issuer}
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mt-4 pt-3">
              <span className="flex items-center gap-1 font-semibold text-primary">
                <CheckCircle className="w-3 h-3" />
                <span>Verified</span>
              </span>
              <span>{cert.issueDate || '2024'}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
