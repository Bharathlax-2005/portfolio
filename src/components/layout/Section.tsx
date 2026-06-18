import { ReactNode } from "react";
import Container from "./Container";

interface SectionProps {
  id: string;
  dataset: string;
  count?: number;
  title: string;
  children: ReactNode;
  className?: string;
}

export default function Section({ id, dataset, count, title, children, className = "" }: SectionProps) {
  return (
    <section id={id} className={`py-20 md:py-28 relative ${className}`}>
      <Container>
        <div className="mb-10 md:mb-14">
          <div className="section-divider mb-8" />
          <h2 className="mt-3 font-display text-3xl md:text-4xl font-bold tracking-tight gradient-text inline-block">
            {title}
          </h2>
        </div>
        {children}
      </Container>
    </section>
  );
}
