import Image from "next/image";
import { heroGallery } from "@/data/hero-gallery";
import { GalleryPlayback } from "@/components/animations/gallery-playback";
import type { Dictionary } from "@/i18n/dictionaries";

export function HeroGallery({ copy }: { copy: Dictionary["hero"] }) {
  return (
    <GalleryPlayback pauseLabel={copy.pauseGallery} playLabel={copy.playGallery}>
      <div className="gallery-plane">
        {Array.from({ length: 5 }, (_, column) => (
          <div className="gallery-column" key={column}>
            <div className="gallery-track">
              {/* Three identical groups keep the diagonal loop covered at every viewport ratio. */}
              {[0, 1, 2].map((repeat) => (
                <div className="gallery-group" key={repeat}>
                  {heroGallery.map((_, index) => {
                    const item = heroGallery[(index + column * 2) % heroGallery.length];
                    return (
                      <div className="gallery-tile" key={item.id}>
                        <Image src={item.src} alt="" fill sizes="(max-width: 899px) 280px, 440px" quality={75} />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </GalleryPlayback>
  );
}
