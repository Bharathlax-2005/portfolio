import { ExternalLink, Award } from "lucide-react";
import Section from "../layout/Section";
import Reveal from "../ui/Reveal";
import certificates from "../../data/certificates.json";
import { Certificate } from "../../types";

const cardColors = [
  "from-signal/5 to-transparent",
  "from-accent/5 to-transparent",
  "from-signal-light/5 to-transparent",
];

export default function Certificates() {
  const data = certificates as Certificate[];

  return (
    <Section id="certificates" dataset="certificates.json" count={data.length} title="Certifications">
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((cert, i) => (
          <Reveal key={cert.id} delay={i * 0.06}>
            <div className="glass-card rounded-2xl overflow-hidden h-full flex flex-col group">
              {/* Gradient top */}
              <div className={`h-1.5 bg-gradient-to-r ${cardColors[i % cardColors.length]}`} />
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-signal/10 flex items-center justify-center shrink-0">
                    <Award size={18} className="text-signal" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-sm font-semibold leading-snug text-ink group-hover:text-signal transition-colors duration-300">
                      {cert.title}
                    </h3>
                    <p className="text-xs text-muted mt-1">{cert.issuer}</p>
                  </div>
                </div>
                <div className="mt-auto pt-3 border-t border-line/30 flex items-center justify-between">
                  <span className="font-mono text-xs text-muted">{cert.date}</span>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`View credential: ${cert.title}`}
                      className="w-7 h-7 rounded-lg bg-surface-3 flex items-center justify-center text-muted hover:text-signal hover:bg-signal/10 transition-all duration-300"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
