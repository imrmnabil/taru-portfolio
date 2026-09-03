import { Education } from "@/types/contents.types";
import Link from "next/link";
import React from "react";
import { BiMap } from "react-icons/bi";
import { RiArrowRightUpLine } from "react-icons/ri";

interface EducationSectionProps {
  heading: string;
  items: Education[];
}

const EducationSection = ({ heading, items }: EducationSectionProps) => {
  return (
    <div>
      <h2 className="text-2xl font-medium mb-8">{heading}</h2>
      <div className="flex flex-col gap-6 sm:gap-12">
        {items.map((edu, index) => (
          <EducationCard key={index} education={edu} />
        ))}
      </div>
    </div>
  );
};

export default EducationSection;

interface EducationCardProps {
  // Define props for individual education items
  education: Education;
}

const EducationCard = ({ education }: EducationCardProps) => {
  return (
    <div className="w-full flex flex-col gap-2 border-l-1 border-gray-400 pl-4">
      <div>
        <div className="sm:text-md text-xs flex gap-1 items-center text-secondary">
          <BiMap />
          {education.location}
        </div>
        <div className="flex  sm:text-xl font-medium justify-between">
          <div className="relative group">
            <Link
              href={education.institutionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              {education.institution}
              <RiArrowRightUpLine className="ml-1 translate-y-1 -translate-x-1 scale-0 group-hover:scale-100 group-hover:translate-0 transition-transform duration-300" />
            </Link>
            <div className="left-0 bottom-0 h-[1px] w-0 bg-black hover:w-full transition-all duration-300 group-hover:w-full"></div>
          </div>
          <div className="text-right text-nowrap">
            <span className="sm:text-base text-xs text-secondary">
              {education.startDate} -{" "}
              {education.endDate ? education.endDate : "Present"}
            </span>
          </div>
        </div>
        <div className="text-sm sm:text-lg text-secondary">{education.degree}</div>
      </div>
      <div className="text-secondary text-sm sm:text-lg">
        <div className="">Grade: {education.grade}</div>
        {education.achievements && education.achievements.length > 0 && (
          <ul className="list-disc list-inside space-y-1">
            {education.achievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
