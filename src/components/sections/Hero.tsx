import { motion, useReducedMotion } from "framer-motion";
import Container from "../layout/Container";
import { LinkButton } from "../ui/Button";
import content from "../../data/content.json";
import { ArrowDown, Github, Linkedin, Sparkles, Mail } from "lucide-react";

const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const { profile, socials } = content;

  const transition = (delay: number) =>
    shouldReduceMotion ? { duration: 0 } : { duration: 0.7, delay, ease: EASE_OUT };

  return (
    <section id="top" className="relative min-h-screen flex items-center particle-bg overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-signal/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-signal/3 rounded-full blur-[120px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(108, 99, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(108, 99, 255, 0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <Container className="relative z-10 py-20 md:py-0">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Profile Photo - Square with curved corners */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={variants}
            transition={transition(0)}
            className="shrink-0"
          >
            <div className="relative group">
              {/* Animated border glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-signal via-accent to-signal-light rounded-3xl blur-sm opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-gradient" style={{ backgroundSize: "200% 200%" }} />
              <div className="relative">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-3xl border-2 border-surface-2 shadow-2xl"
                />
                {/* Status badge */}
                <div className="absolute -bottom-3 -right-3 bg-surface-2 border border-signal/30 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-lg">
                  <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span className="text-xs font-mono text-accent">Open to Work</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <div className="text-center md:text-left flex-1">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={variants}
              transition={transition(0.1)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-signal/10 border border-signal/20 mb-6"
            >
              <Sparkles size={14} className="text-signal" />
              <span className="text-sm font-mono text-signal">{profile.eyebrow}</span>
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="visible"
              variants={variants}
              transition={transition(0.2)}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]"
            >
              Hi, I'm{" "}
              <span className="gradient-text">{profile.name}</span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="visible"
              variants={variants}
              transition={transition(0.3)}
              className="mt-5 text-base md:text-lg text-muted max-w-xl leading-relaxed"
            >
              {profile.tagline}
            </motion.p>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={variants}
              transition={transition(0.4)}
              className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-3"
            >
              <LinkButton href="#work" variant="primary">
                <Sparkles size={16} />
                View Projects
              </LinkButton>
              <LinkButton href="#certificates" variant="secondary">
                View Certifications
              </LinkButton>
              <LinkButton href="#contact" variant="ghost">
                Contact Me
              </LinkButton>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={variants}
              transition={transition(0.5)}
              className="mt-8 flex items-center justify-center md:justify-start gap-4"
            >
              {socials.linkedin && (
                <a
                  href={socials.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted hover:text-signal transition-all duration-300 hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={20} />
                </a>
              )}
              {socials.github && (
                <a
                  href={socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted hover:text-signal transition-all duration-300 hover:scale-110"
                  aria-label="GitHub"
                >
                  <Github size={20} />
                </a>
              )}
              {socials.email && (
                <a
                  href={`mailto:${socials.email}`}
                  className="text-muted hover:text-signal transition-all duration-300 hover:scale-110"
                  aria-label="Email"
                >
                  <Mail size={20} />
                </a>
              )}
              <span className="w-px h-5 bg-line/50" />
              <span className="text-xs font-mono text-muted/60">Tamil Nadu, India</span>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-12 hidden md:flex flex-col items-center gap-2"
        >
          <span className="text-xs font-mono text-muted/50">Scroll to explore</span>
          <ArrowDown size={16} className="text-signal animate-bounce" />
        </motion.div>
      </Container>
    </section>
  );
}
