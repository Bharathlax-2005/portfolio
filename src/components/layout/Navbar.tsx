import { useEffect, useState } from "react";
import Container from "./Container";
import content from "../../data/content.json";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#work", label: "Projects" },
  { href: "#journey", label: "Journey" },
  { href: "#certificates", label: "Certifications" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-paper/80 backdrop-blur-xl border-b border-line/50 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" className="font-display text-lg font-bold tracking-tight group">
          <span className="gradient-text">BK</span>
          <span className="text-signal group-hover:text-accent transition-colors duration-300">.</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted hover:text-signal transition-colors duration-300 relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-signal rounded-full transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href={content.profile.resumeUrl}
            className="hidden md:inline-flex text-sm font-medium border border-signal/30 text-signal rounded-full px-4 py-1.5 hover:bg-signal hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-signal/20"
          >
            Résumé ↓
          </a>
          <button
            className="md:hidden text-muted hover:text-signal transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </Container>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-surface-1/95 backdrop-blur-xl border-b border-line/50 animate-slide-up">
          <Container className="py-4 flex flex-col gap-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-muted hover:text-signal transition-colors py-2 text-sm"
              >
                {link.label}
              </a>
            ))}
            <a
              href={content.profile.resumeUrl}
              className="text-sm font-medium border border-signal/30 text-signal rounded-full px-4 py-1.5 text-center hover:bg-signal hover:text-white transition-all duration-300 mt-2"
            >
              Résumé ↓
            </a>
          </Container>
        </div>
      )}
    </header>
  );
}
