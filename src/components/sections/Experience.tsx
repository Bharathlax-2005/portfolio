import Section from "../layout/Section";
import Reveal from "../ui/Reveal";
import content from "../../data/content.json";
import { Rocket, TrendingUp, Eye, Cpu, Zap, GraduationCap, Target, ArrowRight, ExternalLink } from "lucide-react";
import { ReactNode } from "react";

const journeyIcons: Record<string, ReactNode> = {
  rocket: <Rocket size={20} />,
  "trending-up": <TrendingUp size={20} />,
  eye: <Eye size={20} />,
  cpu: <Cpu size={20} />,
  zap: <Zap size={20} />,
};

const stageColors = [
  { bg: "bg-signal/10", text: "text-signal", ring: "ring-signal/30" },
  { bg: "bg-accent/10", text: "text-accent", ring: "ring-accent/30" },
  { bg: "bg-signal-light/10", text: "text-signal-light", ring: "ring-signal-light/30" },
  { bg: "bg-accent-warm/10", text: "text-accent-warm", ring: "ring-accent-warm/30" },
  { bg: "bg-signal/10", text: "text-signal", ring: "ring-signal/30" },
];

export default function Experience() {
  const { education, learningJourney, careerGoals } = content;

  return (
    <Section id="journey" dataset="journey.json" count={(learningJourney as any[]).length} title="Education & Journey">
      {/* Education */}
      <Reveal>
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-signal/10 flex items-center justify-center">
              <GraduationCap size={20} className="text-signal" />
            </div>
            <h3 className="font-display text-xl font-semibold">Education</h3>
          </div>
          {education.map((edu) => (
            <div key={edu.id} className="glass-card rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-display text-lg font-semibold text-ink">{edu.institution}</h4>
                  <p className="text-sm text-muted mt-1">{edu.degree}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm text-muted">{edu.startDate} — {edu.endDate}</span>
                  <span className="inline-flex items-center rounded-full bg-accent/10 border border-accent/20 px-3 py-0.5 text-xs font-mono text-accent">
                    {edu.detail}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Learning Journey Timeline */}
      <Reveal delay={0.1}>
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Rocket size={20} className="text-accent" />
            </div>
            <h3 className="font-display text-xl font-semibold">Learning Journey</h3>
          </div>

          <div className="relative">
            {/* Timeline vertical line */}
            <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-signal via-accent to-signal-light hidden md:block" />

            <div className="space-y-6">
              {(learningJourney as any[]).map((stage, i) => {
                const color = stageColors[i % stageColors.length];
                return (
                  <Reveal key={stage.stage} delay={i * 0.08}>
                    <div className="flex gap-5 md:ml-0">
                      {/* Timeline dot */}
                      <div className="hidden md:flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-xl ${color.bg} flex items-center justify-center ${color.text} ring-2 ${color.ring} z-10 bg-paper`}>
                          {journeyIcons[stage.icon] || <Zap size={20} />}
                        </div>
                      </div>
                      {/* Content */}
                      <div className="glass-card rounded-xl p-5 flex-1 group">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`md:hidden w-8 h-8 rounded-lg ${color.bg} flex items-center justify-center ${color.text}`}>
                              {journeyIcons[stage.icon] || <Zap size={16} />}
                            </div>
                            <h4 className="font-display text-base font-semibold text-ink group-hover:text-signal transition-colors duration-300">
                              {stage.title}
                            </h4>
                          </div>
                          {stage.timeline && (
                            <span className="font-mono text-xs text-muted uppercase tracking-[0.2em]">
                              {stage.timeline}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted leading-relaxed">{stage.description}</p>
                        {stage.link && (
                          <a
                            href={stage.link}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-flex items-center gap-2 text-signal font-mono text-sm hover:text-accent transition-colors duration-200"
                          >
                            View LinkedIn Experience
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </Reveal>

      {/* Career Goals */}
      <Reveal delay={0.3}>
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-signal-light/10 flex items-center justify-center">
              <Target size={20} className="text-signal-light" />
            </div>
            <h3 className="font-display text-xl font-semibold">Career Goals</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Short Term */}
            <div className="glass-card rounded-2xl p-6">
              <h4 className="font-display text-base font-semibold text-signal mb-4 flex items-center gap-2">
                <ArrowRight size={16} />
                Short-Term Goals
              </h4>
              <ul className="space-y-3">
                {(careerGoals as any).shortTerm.map((goal: string, idx: number) => (
                  <li key={idx} className="text-sm text-muted leading-relaxed pl-5 relative flex items-start gap-2">
                    <span className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-signal shrink-0" />
                    {goal}
                  </li>
                ))}
              </ul>
            </div>

            {/* Long Term */}
            <div className="glass-card rounded-2xl p-6">
              <h4 className="font-display text-base font-semibold text-accent mb-4 flex items-center gap-2">
                <Zap size={16} />
                Long-Term Goals
              </h4>
              <ul className="space-y-3">
                {(careerGoals as any).longTerm.map((goal: string, idx: number) => (
                  <li key={idx} className="text-sm text-muted leading-relaxed pl-5 relative flex items-start gap-2">
                    <span className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
