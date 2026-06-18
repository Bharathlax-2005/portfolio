import Container from "./Container";
import content from "../../data/content.json";

export default function Footer() {
  return (
    <footer className="border-t border-line/50 bg-surface-1/30 py-10 backdrop-blur-sm">
      <Container className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-muted">
        <span>© {new Date().getFullYear()} {content.profile.name}</span>
        <span className="text-center md:text-right">
          Designed &amp; Developed by <span className="text-signal font-semibold">{content.profile.name}</span> · AI &amp; Data Science Graduate
        </span>
      </Container>
    </footer>
  );
}
