import { ArrowUpRight, Github, Sparkles } from "lucide-react";
import { Project } from "../../types";
import Reveal from "../ui/Reveal";

const gradients = [
  "from-signal/20 to-accent/10",
  "from-accent/20 to-signal-light/10",
  "from-signal-light/20 to-accent-warm/10",
];

export default function ProjectCard({ project, delay = 0, index = 0 }: { project: Project; delay?: number; index?: number }) {
  return (
    <Reveal delay={delay}>
      <div className="group glass-card rounded-2xl overflow-hidden h-full flex flex-col">
        {/* Gradient header */}
        <div className={`h-2 bg-gradient-to-r ${gradients[index % gradients.length]}`} />

        <div className="p-6 flex flex-col flex-1">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-signal" />
                <span className="text-xs font-mono text-signal uppercase tracking-wider">Featured Project</span>
              </div>
              <h3 className="font-display text-lg font-semibold tracking-tight text-ink group-hover:text-signal transition-colors duration-300">
                {project.title}
              </h3>
            </div>
            <div className="flex gap-2 shrink-0">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${project.title} on GitHub`}
                  className="w-8 h-8 rounded-lg bg-surface-3 flex items-center justify-center text-muted hover:text-signal hover:bg-signal/10 transition-all duration-300"
                >
                  <Github size={16} />
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${project.title} live demo`}
                  className="w-8 h-8 rounded-lg bg-surface-3 flex items-center justify-center text-muted hover:text-accent hover:bg-accent/10 transition-all duration-300"
                >
                  <ArrowUpRight size={16} />
                </a>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="mt-3 text-sm text-muted leading-relaxed flex-1">{project.description}</p>

          {/* Highlights */}
          {(project as any).highlights && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {(project as any).highlights.map((h: string) => (
                <span
                  key={h}
                  className="inline-flex items-center rounded-full bg-accent/5 border border-accent/20 px-2.5 py-0.5 text-xs font-mono text-accent"
                >
                  {h}
                </span>
              ))}
            </div>
          )}

          {/* Tech stack */}
          <div className="mt-4 pt-4 border-t border-line/30 flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center rounded-lg border border-line/50 px-2.5 py-1 text-xs font-mono text-muted hover:text-signal hover:border-signal/30 transition-all duration-300"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Animated accent line */}
          <span className="mt-4 inline-block h-0.5 w-0 bg-gradient-to-r from-signal to-accent rounded-full transition-all duration-500 group-hover:w-16" />
        </div>
      </div>
    </Reveal>
  );
}
