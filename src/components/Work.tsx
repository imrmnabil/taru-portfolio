import React from "react";
import { Work } from "@/types/contents.types";
import { BiMap } from "react-icons/bi";
import Link from "next/link";
import { RiArrowRightUpLine } from "react-icons/ri";

interface WorkSectionProps {
  heading: string;
  items: Work[];
}

const WorkSection = ({ heading, items }: WorkSectionProps) => {
  return (
    <div>
      <h2 className="text-2xl font-medium mb-8">{heading}</h2>
      <div className="flex flex-col gap-6 sm:gap-12">
        {items.map((work, index) => (
          <WorkCard key={index} work={work} />
        ))}
      </div>
    </div>
  );
};

export default WorkSection;

interface WorkCardProps {
  work: Work;
}
const WorkCard = ({ work }: WorkCardProps) => {
  return (
    <div className="w-full flex flex-col gap-2 sm:gap-6 border-l-1 border-gray-400 pl-4">
      <div>
        <div className="sm:text-md text-xs flex gap-1 items-center text-secondary">
          <BiMap /> {work.location}
        </div>
        <div className="flex sm:text-xl font-medium justify-between">
          <div className="relative group">
            <Link
              href={work.companyLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
            >
              {work.company}
              <RiArrowRightUpLine className="ml-1 translate-y-1 -translate-x-1 scale-0 group-hover:scale-100 group-hover:translate-0 transition-transform duration-300" />
            </Link>
            <div className="left-0 bottom-0 h-[1px] w-0 bg-black hover:w-full transition-all duration-300 group-hover:w-full"></div>
          </div>
          <div className="text-right text-nowrap">
            <span className="sm:text-base text-xs text-secondary">
              {work.startDate} - {work.endDate ? work.endDate : "Present"}
            </span>
          </div>
        </div>
        <div className="text-sm sm:text-lg text-secondary">{work.position}</div>
      </div>
      <div className="text-secondary sm:text-lg text-sm">
        {work.description && <p className="mb-2">{work.description}</p>}
        {work.bullets && work.bullets.length > 0 && (
          <ul className="list-disc list-inside space-y-1">
            {work.bullets.map((bullet, index) => (
              <li key={index}>{bullet}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
