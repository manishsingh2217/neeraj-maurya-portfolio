import React from 'react';
import { Navbar } from '../components/Navbar';
import { StickyProfileCard } from '../components/StickyProfileCard';
import { HeroSection } from '../sections/HeroSection';
import { AboutSection } from '../sections/AboutSection';
import { SkillsSection } from '../sections/SkillsSection';
import { ExperienceSection } from '../sections/ExperienceSection';
import { ProjectsSection } from '../sections/ProjectsSection';
import { EducationSection } from '../sections/EducationSection';
import { CertificationsSection } from '../sections/CertificationsSection';
import { ContactSection } from '../sections/ContactSection';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { Footer } from '../components/Footer';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative transition-colors duration-200">
      {/* Top Ambient Glow */}
      <div className="ambient-glow" />

      {/* Top Fixed Navigation */}
      <Navbar />

      {/* Main Two-Column Asymmetrical Container - Minimized Margins, Enhanced Width */}
      <div className="w-full max-w-[1560px] 2xl:max-w-[1680px] mx-auto px-3.5 sm:px-6 lg:px-8 xl:px-10 pt-24 sm:pt-28 pb-12 sm:pb-16">
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 items-start">
          {/* Left Column: Sticky Profile Card (Sticks throughout scrolling across all sections) */}
          <StickyProfileCard />

          {/* Right Column: Main Content Flow */}
          <main className="flex-1 w-full min-w-0">
            <HeroSection />
            <AboutSection />
            <SkillsSection />
            <ExperienceSection />
            <ProjectsSection />
            <EducationSection />
            <CertificationsSection />
            <ContactSection />
          </main>
        </div>
      </div>

      {/* Ambient Mail FAB */}
      <FloatingActionButton />

      {/* Global Minimal Footer */}
      <Footer />
    </div>
  );
};
