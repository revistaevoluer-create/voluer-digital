type AdSlotProps = {
  format: "leaderboard" | "billboard" | "vertical" | "square";
  id?: string;
};

const sizes: Record<AdSlotProps["format"], { className: string; label: string }> = {
  leaderboard: { className: "h-[90px] md:h-[100px]", label: "728 x 90" },
  billboard: { className: "h-[140px] md:h-[180px]", label: "970 x 250" },
  vertical: { className: "h-[420px] md:h-[600px]", label: "300 x 600" },
  square: { className: "h-[250px]", label: "300 x 250" },
};

export function AdSlot({ format, id }: AdSlotProps) {
  const { className, label } = sizes[format];

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
