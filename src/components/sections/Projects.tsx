import Section from "../layout/Section";
import ProjectCard from "./ProjectCard";
import projects from "../../data/projects.json";
import { Project } from "../../types";

export default function Projects() {
  const data = projects as Project[];

  return (
    <Section id="work" dataset="projects.json" count={data.length} title="Featured Projects">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((project, i) => (
          <ProjectCard key={project.id} project={project} delay={i * 0.08} index={i} />
        ))}
      </div>
    </Section>
  );
}
