export function Logo({ size = "md" }: { size?: "sm" | "md" }) {
  return (
    <div className="flex flex-col items-center leading-none">
      <div className="flex w-full items-center justify-center gap-2">
        <span className="h-px w-6 bg-gold-deep/70" />
        <span className="label-mono text-gold-deep" style={{ fontSize: "0.5rem" }}>
          Revista
        </span>
        <span className="h-px w-6 bg-gold-deep/70" />
      </div>
      <span
        className={`font-display font-normal tracking-[0.02em] text-foreground ${
          size === "md" ? "text-4xl md:text-5xl" : "text-2xl"
        }`}
      >
        ÉVOLUER
      </span>
    </div>
  );
}
