import Image from "next/image";
import type { ProjectMedia as Media } from "@/types/content";
import type { Locale } from "@/i18n/config";

export function ProjectMedia({ media, locale, sizes = "(max-width: 699px) 100vw, (max-width: 1099px) 50vw, 33vw" }: { media: Media; locale: Locale; sizes?: string }) {
  return (
    <div className="project-media">
      {media.type === "video" ? (
        <video controls playsInline preload="none" poster={media.poster} aria-label={media.alt[locale]}>
          <source src={media.src} />
        </video>
      ) : (
        <Image src={media.src} alt={media.alt[locale]} fill sizes={sizes} quality={85} unoptimized={media.type === "gif"} />
      )}
    </div>
  );
}
