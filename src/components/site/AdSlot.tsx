type AdSlotProps = {
  format: "leaderboard" | "billboard" | "vertical" | "square";
  id?: string;
  /** Imagem da publicidade (opcional). Sempre acompanhada de um destino. */
  image?: string;
  /** Site, rede social ou WhatsApp do anunciante. */
  href?: string;
  /** Nome do anunciante, usado no texto alternativo. */
  advertiser?: string;
};

const sizes: Record<AdSlotProps["format"], { className: string; label: string }> = {
  leaderboard: { className: "h-[90px] md:h-[100px]", label: "728 x 90" },
  billboard: { className: "h-[180px] md:h-[240px]", label: "970 x 250" },
  vertical: { className: "h-[420px] md:h-[600px]", label: "300 x 600" },
  square: { className: "h-[250px]", label: "300 x 250" },
};

export function AdSlot({ format, id, image, href, advertiser }: AdSlotProps) {
  const { className, label } = sizes[format];

  if (image) {
    const content = (
      <img
        src={image}
        alt={advertiser ? `Publicidade — ${advertiser}` : "Publicidade"}
        loading="lazy"
        className={`h-full w-full bg-white object-contain ${className}`}
      />
    );

    return (
      <aside id={id} aria-label="Espaço publicitário" className="w-full">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block border border-border transition-opacity hover:opacity-90"
          >
            {content}
          </a>
        ) : (
          <div className="border border-border">{content}</div>
        )}
      </aside>
    );
  }

  return (
    <aside
      id={id}
      aria-label="Espaço publicitário"
      className={`flex w-full flex-col items-center justify-center gap-2 border border-dashed border-border bg-card/40 ${className}`}
    >
      <span className="label-mono text-muted-foreground">Publicidade</span>
      <span className="font-mono text-[0.6rem] text-muted-foreground/60">{label}</span>
    </aside>
  );
}
