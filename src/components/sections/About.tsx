import Section from "../layout/Section";
import Reveal from "../ui/Reveal";
import content from "../../data/content.json";
import { MapPin, Briefcase, Target, Lightbulb } from "lucide-react";

export default function About() {
  const { profile, personalInfo, careerObjective } = content;

  return (
    <Section id="about" dataset="profile.json" title="About Me">
      <div className="grid md:grid-cols-5 gap-10">
        {/* Bio */}
        <Reveal className="md:col-span-3">
          <div className="space-y-4">
            {profile.bio.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-base leading-relaxed text-ink/80">
                {paragraph}
              </p>
            ))}
          </div>
          {/* Motto */}
          <div className="mt-8 p-5 rounded-2xl bg-signal/5 border border-signal/10">
            <div className="flex items-start gap-3">
              <Lightbulb size={20} className="text-signal shrink-0 mt-0.5" />
              <p className="text-signal font-display text-lg italic">
                "{(profile as any).motto}"
              </p>
            </div>
          </div>
        </Reveal>

        {/* Info cards */}
        <Reveal delay={0.1} className="md:col-span-2">
          <div className="space-y-3">
            <div className="glass-card rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-signal/10 flex items-center justify-center">
                <MapPin size={18} className="text-signal" />
              </div>
              <div>
                <p className="text-xs font-mono text-muted uppercase tracking-wider">Location</p>
                <p className="text-sm text-ink font-medium">{personalInfo.location}</p>
              </div>
            </div>

            <div className="glass-card rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <Briefcase size={18} className="text-accent" />
              </div>
              <div>
                <p className="text-xs font-mono text-muted uppercase tracking-wider">Status</p>
                <p className="text-sm text-ink font-medium">{personalInfo.currentStatus}</p>
              </div>
            </div>

            <div className="glass-card rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-signal-light/10 flex items-center justify-center">
                <Target size={18} className="text-signal-light" />
              </div>
              <div>
                <p className="text-xs font-mono text-muted uppercase tracking-wider">Career Level</p>
                <p className="text-sm text-ink font-medium">{personalInfo.careerLevel}</p>
              </div>
            </div>

            {/* Preferred Roles */}
            <div className="glass-card rounded-xl p-4">
              <p className="text-xs font-mono text-muted uppercase tracking-wider mb-3">Preferred Roles</p>
              <div className="flex flex-wrap gap-1.5">
                {personalInfo.preferredRoles.map((role: string) => (
                  <span
                    key={role}
                    className="inline-flex items-center rounded-full border border-signal/20 bg-signal/5 px-2.5 py-0.5 text-xs font-mono text-signal"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Career Objective */}
      <Reveal delay={0.2}>
        <div className="mt-12 p-6 rounded-2xl bg-surface-2/50 border border-line/50">
          <h3 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
            <Target size={18} className="text-accent" />
            Career Objective
          </h3>
          <p className="text-muted leading-relaxed">{careerObjective}</p>
        </div>
      </Reveal>
    </Section>
  );
}
