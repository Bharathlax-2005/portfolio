import { Github, Linkedin, Mail, MapPin, Send } from "lucide-react";
import Section from "../layout/Section";
import Reveal from "../ui/Reveal";
import { LinkButton } from "../ui/Button";
import content from "../../data/content.json";

export default function Contact() {
  const { socials } = content;

  return (
    <Section id="contact" dataset="contact.json" title="Let's Connect">
      <div className="grid md:grid-cols-2 gap-10">
        <Reveal>
          <div className="space-y-6">
            <p className="text-lg text-muted leading-relaxed">
              I'm actively seeking opportunities in Data Analytics, Business Intelligence, 
              AI/ML Engineering, and Software Development. Open to connecting for roles, 
              collaborations, or conversations about data and AI.
            </p>
            <div className="space-y-4">
              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-card rounded-xl p-4 flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-signal/10 flex items-center justify-center group-hover:bg-signal/20 transition-colors">
                    <Linkedin size={20} className="text-signal" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink group-hover:text-signal transition-colors">LinkedIn</p>
                    <p className="text-xs text-muted">Professional networking & career updates</p>
                  </div>
                  <Send size={16} className="text-muted group-hover:text-signal transition-all duration-300 group-hover:translate-x-1" />
                </a>
              )}
              {socials.github && (
                <a
                  href={socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-card rounded-xl p-4 flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Github size={20} className="text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink group-hover:text-accent transition-colors">GitHub</p>
                    <p className="text-xs text-muted">Source code & project repositories</p>
                  </div>
                  <Send size={16} className="text-muted group-hover:text-accent transition-all duration-300 group-hover:translate-x-1" />
                </a>
              )}
              {socials.email && (
                <a
                  href={`mailto:${socials.email}`}
                  className="glass-card rounded-xl p-4 flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-signal-light/10 flex items-center justify-center group-hover:bg-signal-light/20 transition-colors">
                    <Mail size={20} className="text-signal-light" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink group-hover:text-signal-light transition-colors">Email</p>
                    <p className="text-xs text-muted">{socials.email}</p>
                  </div>
                  <Send size={16} className="text-muted group-hover:text-signal-light transition-all duration-300 group-hover:translate-x-1" />
                </a>
              )}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="glass-card rounded-2xl p-6 h-full">
            <h3 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-signal" />
              Availability
            </h3>
            <p className="text-sm text-muted mb-5">Open to the following opportunities:</p>
            <div className="space-y-2.5">
              {[
                "Data Analyst Roles",
                "Business Analyst Roles",
                "Data Science Associate Roles",
                "AI/ML Engineer Roles",
                "Software Developer Roles",
                "Graduate Trainee Programs",
              ].map((role) => (
                <div
                  key={role}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg bg-surface-2/50 border border-line/30 hover:border-signal/20 transition-all duration-300"
                >
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-sm text-ink/80">{role}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-line/30">
              <div className="flex items-center gap-2 text-sm text-muted">
                <MapPin size={14} className="text-signal" />
                <span>Tamil Nadu, India</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
