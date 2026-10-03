import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { categories, categoryDescriptions, slugify } from "@/data/content";
import { Logo } from "./Logo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function useTodayLabel() {
  const [label, setLabel] = useState("");
  useEffect(() => {
    setLabel(
      new Intl.DateTimeFormat("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    );
  }, []);
  return label;
}

export function Header() {
  const today = useTodayLabel();

  return (
    <header className="border-b border-border bg-background">
      <div className="border-b border-border/60 bg-ink">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5">
          <span className="label-mono text-gold-deep">{today || "\u00a0"}</span>
          <nav className="flex items-center gap-4">
            <Link
              to="/publique"
              className="label-mono text-gold transition-colors hover:text-gold-deep"
            >
              PUBLIQUE SUA MATÉRIA
            </Link>
            <a
              href="#anunciar"
              className="label-mono hidden text-gold transition-colors hover:text-gold-deep md:inline"
            >
              ANUNCIE SUA MARCA
            </a>
          </nav>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-5 px-4 py-7">
        <Link to="/" aria-label="Revista Évoluer — página inicial">
          <Logo />
        </Link>
      </div>

      <TooltipProvider delayDuration={150}>
        <nav
          aria-label="Categorias"
          className="mx-auto max-w-6xl overflow-x-auto border-t border-border px-4"
        >
          <ul className="flex min-w-max items-center gap-6 py-3.5">
            {categories.map((category) => (
              <li key={category}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to="/categoria/$slug"
                      params={{ slug: slugify(category) }}
                      className="label-mono whitespace-nowrap text-muted-foreground transition-colors hover:text-gold"
                      activeProps={{ className: "label-mono whitespace-nowrap text-gold" }}
                    >
                      {category}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    sideOffset={8}
                    className="max-w-xs border border-gold-deep/40 bg-ink px-4 py-3 text-xs leading-relaxed text-gold shadow-gold/10"
                  >
                    {categoryDescriptions[category]}
                  </TooltipContent>
                </Tooltip>
              </li>
            ))}
          </ul>
        </nav>
      </TooltipProvider>

      <div className="overflow-hidden bg-gold py-2">
        <div className="ticker-track">
          {[0, 1].map((copy) => (
            <span key={copy} className="label-mono px-6 text-primary-foreground">
              Bem-vindo à Revista Évoluer · Jornalismo editorial · Nova edição disponível ·
              Anuncie sua marca ·
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}

