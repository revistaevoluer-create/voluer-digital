import { useEffect, useState } from "react";
import type { Ad } from "@/data/ads";

const ROTATE_MS = 4000;

/**
 * Carrossel de logos de anunciantes ativos.
 * Cada logo é clicável e abre o destino do anunciante em nova aba.
 */
export function AdRotator({ ads }: { ads: Ad[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (ads.length < 2) return;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % ads.length);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [ads.length]);

  const ad = ads[index % ads.length];
  if (!ad) return null;

  return (
    <a
      key={ad.advertiser + index}
      href={ad.href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="block w-40 animate-in fade-in duration-700"
      aria-label={`Publicidade — ${ad.advertiser}`}
    >
      <span className="label-mono mb-1 block text-[9px] text-muted-foreground/70">
        Publicidade
      </span>
      <span className="block border border-border bg-white p-2 transition-opacity hover:opacity-80">
        <img
          src={ad.image}
          alt={`Publicidade — ${ad.advertiser}`}
          loading="lazy"
          className="h-14 w-full object-contain"
        />
      </span>
    </a>
  );
}
