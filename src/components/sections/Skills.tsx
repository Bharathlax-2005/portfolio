import Section from "../layout/Section";
import Reveal from "../ui/Reveal";
import content from "../../data/content.json";
import {
  Code, BarChart3, PieChart, Library, Brain, Database, Wrench, Users,
} from "lucide-react";
import { ReactNode } from "react";

const iconMap: Record<string, ReactNode> = {
  code: <Code size={20} />,
  "bar-chart": <BarChart3 size={20} />,
  "pie-chart": <PieChart size={20} />,
  library: <Library size={20} />,
  brain: <Brain size={20} />,
  database: <Database size={20} />,
  wrench: <Wrench size={20} />,
  users: <Users size={20} />,
};

const colors = [
  { bg: "bg-signal/10", text: "text-signal", border: "border-signal/20" },
  { bg: "bg-accent/10", text: "text-accent", border: "border-accent/20" },
  { bg: "bg-signal-light/10", text: "text-signal-light", border: "border-signal-light/20" },
  { bg: "bg-accent-warm/10", text: "text-accent-warm", border: "border-accent-warm/20" },
];

export default function Skills() {
  const { skills } = content;

  return (
    <Section id="skills" dataset="skills.json" count={skills.length} title="Core Skills">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {skills.map((group, i) => {
          const color = colors[i % colors.length];
          return (
            <Reveal key={group.category} delay={i * 0.06}>
              <div className="glass-card rounded-2xl p-5 h-full group">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${color.bg} flex items-center justify-center ${color.text} group-hover:scale-110 transition-transform duration-300`}>
                    {iconMap[(group as any).icon] || <Code size={20} />}
                  </div>
                  <h3 className="font-display text-sm font-semibold text-ink/90">{group.category}</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className={`skill-tag relative inline-flex items-center rounded-lg border ${color.border} px-2.5 py-1 text-xs font-mono text-muted hover:text-ink cursor-default`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Areas of Interest */}
      <Reveal delay={0.3}>
        <div className="mt-12">
          <h3 className="font-display text-xl font-semibold mb-5 flex items-center gap-2">
            <Brain size={20} className="text-signal" />
            Areas of Interest
          </h3>
          <div className="flex flex-wrap gap-2">
            {content.areasOfInterest.map((area: string, i: number) => (
              <span
                key={area}
                className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 border border-line px-4 py-2 text-sm font-mono text-muted hover:text-signal hover:border-signal/30 transition-all duration-300 cursor-default"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-signal/50" />
                {area}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
