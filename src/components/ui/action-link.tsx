import { ArrowIcon } from "./arrow-icon";

export function ActionLink({ href, children, download = false, primary = false }: {
  href: string; children: React.ReactNode; download?: boolean; primary?: boolean;
}) {
  return (
    <a href={href} download={download || undefined} tabIndex={0}
      className={`action-link ${primary ? "action-primary" : "action-secondary"}`}>
      <span>{children}</span><ArrowIcon direction={download ? "down" : "diagonal"} />
    </a>
  );
}
