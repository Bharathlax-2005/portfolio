export default function Tag({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line/80 bg-surface-2/40 px-3 py-1 text-xs font-mono text-muted hover:border-signal/30 hover:text-signal transition-colors duration-200 cursor-default">
      {children}
    </span>
  );
}
