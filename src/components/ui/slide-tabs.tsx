'use client'
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Section } from "@/types/sections.types";

// export const SlideTabsExample = ({ activeSection }: { activeSection?: string }) => {
//   return (
//     <div className="w-full">
//       <SlideTabs 
//         sections={["Home", "Pricing", "Features", "Docs", "Blog"]} 
//         activeSection={activeSection}
//       />
//     </div>
//   );
// };

export { SlideTabs };

interface SlideTabsProps {
  sections: Section[];
  activeSection?: Section;
  onSectionChange?: (section: string) => void;
}

const SlideTabs = ({ sections, activeSection, onSectionChange }: SlideTabsProps) => {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const tabsRef = useRef<Map<string, HTMLLIElement>>(new Map());

  // Function to update cursor position based on active section
  const updateCursorForActiveSection = (sectionName: string) => {
    const activeTabElement = tabsRef.current.get(sectionName);

    if (activeTabElement) {
      const { width } = activeTabElement.getBoundingClientRect();

      setPosition({
        left: activeTabElement.offsetLeft,
        width,
        opacity: 1,
      });
    }
  };

  // Effect to update cursor when activeSection changes
  useEffect(() => {
    if (activeSection && tabsRef.current.has(activeSection.id)) {
      updateCursorForActiveSection(activeSection.id);
    }
  }, [activeSection]);

  return (
    <ul
      onMouseLeave={() => {
        // Only hide cursor if no active section is specified
        if (!activeSection) {
          setPosition((pv) => ({
            ...pv,
            opacity: 0,
          }));
        } else {
          // Return to active section position when mouse leaves
          updateCursorForActiveSection(activeSection.id);
        }
      }}
      className="relative flex w-fit"
    >
      {sections.map((section) => (
        <Tab
          key={section.id}
          section={section.label}
          isActive={activeSection?.id === section.id}
          setPosition={setPosition}
          onClick={() => {
            updateCursorForActiveSection(section.id);
            if (onSectionChange) {
              onSectionChange(section.id);
            }
          }}
          registerTabRef={(el) => {
            if (el) tabsRef.current.set(section.id, el);
            else tabsRef.current.delete(section.id);
          }}
        />
      ))}

      <Cursor position={position} />
    </ul>
  );
};

interface TabProps {
  section: string;
  isActive?: boolean;
  setPosition: React.Dispatch<React.SetStateAction<{ left: number; width: number; opacity: number }>>;
  onClick?: () => void;
  registerTabRef: (element: HTMLLIElement | null) => void;
}

const Tab = ({ section, isActive, setPosition, onClick, registerTabRef }: TabProps) => {
  const ref = useRef<HTMLLIElement>(null);

  // Register the ref with parent component
  useEffect(() => {
    if (ref.current) {
      registerTabRef(ref.current);
    }

    return () => {
      registerTabRef(null);
    };
  }, [registerTabRef]);

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return;

        const { width } = ref.current.getBoundingClientRect();

        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      onClick={onClick}
      className={`relative  z-10 block cursor-pointer px-3 py-1.5 md:text-sm text-xs uppercase text-white mix-blend-difference ${isActive ? 'font-medium' : ''}`}
    >
      {section}
    </li>
  );
};

interface CursorProps {
  position: {
    left: number;
    width: number;
    opacity: number;
  };
}

const Cursor = ({ position }: CursorProps) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      className="absolute z-0 h-full rounded-full bg-black"
    />
  );
};