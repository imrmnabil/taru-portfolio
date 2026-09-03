import { Projects } from "@/types/contents.types";
import { RiArrowRightUpLine } from "react-icons/ri";
import ViewLink from "./ui/view-link";
import ExportedImage from "@/components/ui/exported-image";
import Markdown from "react-markdown";

const ProjectCard = ({ project }: { project: Projects }) => {
  return (
    <div
      style={{
        boxShadow: "rgba(0, 0, 0, 0.05) 0px 2.5px 12px 0px",
      }}
      className="bg-white rounded-xl overflow-hidden flex flex-col relative"
    >
      <div className="relative overflow-hidden w-full h-60">
        {project.poster && (
        <ExportedImage
          src={project.poster}
          alt={project.title}
          className="w-full aspect-video object-cover "
          fill
        />
      )}
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="sm:text-xl text-lg font-medium mb-2">{project.title}</h3>
        <div>
          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-800 sm:text-sm text-xs px-2 py-1 rounded-full"
                >
                  {tech.name}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="text-secondary flex-grow text-sm sm:text-base">
          <Markdown>{project.description}</Markdown>
        </div>
        {project.links && project.links.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {project.links.map((link, index) => (
              <ViewLink key={index} href={link.url} text={link.label} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface ProjectsSectionProps {
  heading: string;
  items: Projects[];
}

const ProjectsSection = ({ heading, items }: ProjectsSectionProps) => {
  return (
    <div className="h-fit">
      <h2 className="text-2xl font-medium mb-8">{heading}</h2>
      <div className="grid md:grid-cols-2 gap-8">
        {items.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </div>
    </div>
  );
};
export default ProjectsSection;
