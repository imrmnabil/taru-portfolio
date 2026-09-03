"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import ContactSection from "@/components/Contact";
import EducationSection from "@/components/Education";
import FeatureSection from "@/components/Features";
import Hero from "@/components/Hero";
import ProjectsSection from "@/components/Projects";
import PublicationSection from "@/components/Publications";
import ShowcaseSection from "@/components/Showcase";
import BlurEffect from "@/components/ui/glass-div";
import { SlideTabs } from "@/components/ui/slide-tabs";
import WorkSection from "@/components/Work";
import type { SiteContent } from "@/lib/content";
import type { Section } from "@/types/sections.types";

export default function HomePage({ content }: { content: SiteContent }) {
  const { sections } = content;
  const [activeSection, setActiveSection] = useState<Section | null>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: Array.from({ length: 11 }, (_, i) => i * 0.1), // [0, 0.1, ..., 1]
    };

    let visibleSections: { [id: string]: number } = {};

    const updateActiveSection = () => {
      // Manual check using getBoundingClientRect as fallback
      let maxVisible = 0;
      let currentSection: Section | null = null;
      sections.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const visible =
            Math.max(
              0,
              Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0),
            ) / rect.height;
          if (visible > maxVisible) {
            maxVisible = visible;
            currentSection = section;
          }
        }
      });
      if (currentSection) setActiveSection(currentSection);
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        visibleSections[entry.target.id] = entry.intersectionRatio;
      });
      const mostVisible = Object.entries(visibleSections).sort(
        (a, b) => b[1] - a[1],
      )[0];
      if (mostVisible) {
        const section = sections.find((s) => s.id === mostVisible[0]);
        if (section) {
          setActiveSection(section);
        }
      }
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    // Observe all section elements
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) {
        observer.observe(element);
      }
    });

    // Fallback: listen to scroll and update manually
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    // Cleanup observer on component unmount
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateActiveSection);
      visibleSections = {};
    };
  }, [sections]);

  const navBarRef = useRef<HTMLDivElement | null>(null);

  // Function to handle manual section changes from the tabs
  const handleSectionChange = (sectionId: string) => {
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      // Scroll to the section
      const element = document.getElementById(section.id);
      element?.scrollIntoView({ behavior: "smooth" });
      setActiveSection(section);
    }
  };

  const renderSection = (section: Section) => {
    switch (section.key) {
      case "intro":
        return (
          <Hero
            hero={content.hero}
            social={content.social}
            downloadCvLabel={content.labels.downloadCv}
          />
        );
      case "work":
        return (
          <WorkSection
            heading={section.heading}
            items={content.workExperience}
          />
        );
      case "education":
        return (
          <EducationSection
            heading={section.heading}
            items={content.education}
          />
        );
      case "publications":
        return (
          <PublicationSection
            heading={section.heading}
            items={content.publications}
          />
        );
      case "projects":
        return (
          <ProjectsSection heading={section.heading} items={content.projects} />
        );
      case "achievements":
        return (
          <FeatureSection
            heading={section.heading}
            achievements={content.achievements}
            testScores={content.testScores}
            testScoresHeading={content.labels.testScores}
          />
        );
      case "contact":
        return (
          <ContactSection
            heading={section.heading}
            contact={content.contact}
            reachOutLabel={content.labels.reachOut}
            formspreeId={content.formspreeId}
          />
        );
      default:
        return null;
    }
  };

  // The nav and showcase are not CMS sections; they sit directly under the
  // intro, or at the top when the intro is switched off.
  const navAndShowcase = (
    <>
      <div
        ref={navBarRef}
        className="sticky -translate-x-3 top-4 z-10 w-full bg-background p-2 rounded-full hidden sm:block"
      >
        <SlideTabs
          sections={sections}
          activeSection={activeSection ?? undefined}
          onSectionChange={handleSectionChange}
        />
      </div>

      <section className="scroll-mt-25 sm:mb-16 mb-2 ">
        <ShowcaseSection
          achievements={content.achievements}
          projects={content.projects}
          showcase={content.showcase}
          labels={content.labels}
        />
      </section>
    </>
  );

  const hasIntro = sections.some((s) => s.key === "intro");

  return (
    <main className="font-sans">
      <div className="mx-auto max-w-[1000px] sm:pt-[125px] pt-20 px-6 flex flex-col gap-6 justify-center">
        {!hasIntro && navAndShowcase}

        {sections.map((section) => (
          <Fragment key={section.id}>
            <section id={section.id} className="scroll-mt-25 sm:mb-16 mb-2 ">
              {renderSection(section)}
            </section>
            {section.key === "intro" && navAndShowcase}
          </Fragment>
        ))}

        <div className="fixed bottom-0 left-0 w-full h-32 pointer-events-none">
          <BlurEffect />
        </div>
      </div>
    </main>
  );
}
