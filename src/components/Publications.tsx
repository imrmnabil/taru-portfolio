import { Publication } from "@/types/contents.types";
import Link from "next/link";
import ViewLink from "./ui/view-link";
import { useState, useRef, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa6";

const PublicationCard = ({
  publication,
  index,
  isExpanded,
  onToggle,
}: {
  publication: Publication;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("auto");
  const [isSingleLine, setIsSingleLine] = useState(false);

  // Function to get first line of summary
  const getFirstLine = (text: string) => {
    if (!text) return "";
    const firstLineEnd = text.indexOf(". ") + 1;
    return firstLineEnd > 0 ? text.substring(0, firstLineEnd) : text;
  };

  useEffect(() => {
    if (contentRef.current) {
      const scrollHeight = contentRef.current.scrollHeight;
      const lineHeight = parseInt(
        window.getComputedStyle(contentRef.current).lineHeight
      );
      setIsSingleLine(scrollHeight <= lineHeight * 1.5);
      setHeight(isExpanded ? `${scrollHeight}px` : "1.5em");
    }
  }, [isExpanded, publication.summary]);

  return (
    <div style={{boxShadow:"rgba(0, 0, 0, 0.05) 0px 2.5px 12px 0px"}} className="w-full flex gap-4 bg-white py-5 pl-6 pr-4 rounded-lg">
      {/* <div className=" invisible md:block">
                <FaArrowRight className="text-primary" />
            </div> */}
      <div className="w-full">
        <div className="w-full">
          <div className="w-full flex gap-2 justify-between">
            <div>
              <p className="text-sm sm:text-lg  text-secondary">
                {publication.journalOrConference}{" "}
                <span className="text-secondary text-xs sm:text-sm italic">
                  {publication.date}
                </span>
              </p>
            </div>
            <div>
              {publication.link && (
                <ViewLink href={publication.link} text="View" />
              )}
            </div>
          </div>
          <div className="flex justify-between gap-4">
            <h3 className="sm:text-xl text-base font-medium">
              {publication.title}
            </h3>
          </div>
        </div>

        {publication.summary && (
          <div className="mt-2 w-full">
            <div className="relative w-full">
              <div
                ref={contentRef}
                className="text-secondary text-md text-justify overflow-hidden transition-all duration-500 ease-in-out"
                style={{ maxHeight: height }}
              >
                {publication.summary}
              </div>
              {!isSingleLine && (
                <span
                  className="cursor-pointer inline-block underline text-primary"
                  onClick={onToggle}
                >
                  {isExpanded ? "Read less" : "Read more"}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface PublicationSectionProps {
  heading: string;
  items: Publication[];
}

const PublicationSection = ({ heading, items }: PublicationSectionProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div>
      <h2 className="text-2xl font-medium mb-8">{heading}</h2>
      <div className="flex flex-col sm:gap-6 gap-3">
        {items.map((publication, index) => (
          <PublicationCard
            key={index}
            index={index}
            publication={publication}
            isExpanded={expandedIndex === index}
            onToggle={() => handleToggle(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default PublicationSection;
