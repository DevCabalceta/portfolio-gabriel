export function ArrowIcon({ direction = "diagonal" }: { direction?: "diagonal" | "down" }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={direction === "down" ? "arrow-down" : undefined}>
      <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
