import { Link } from "@tanstack/react-router";
import { categories, categoryDescriptions, editorialPillars, slugify } from "@/data/content";
import { Logo } from "./Logo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Footer() {
  return (
    <footer className="border-t border-gold-deep/20 bg-ink">
      <div className="mx-auto max-w-6xl px-4 pb-8 pt-16 md:pt-20">
        <div className="flex flex-col items-center">
          <Logo size="sm" />

          <p className="label-mono mt-7 flex flex-wrap justify-center gap-x-3 gap-y-2 text-center text-gold-deep">
            {editorialPillars.map((pillar, index) => (
              <span key={pillar} className="inline-flex items-center gap-3">
                {index > 0 && <span aria-hidden="true">•</span>}
                {pillar}
              </span>
            ))}
          </p>

          <TooltipProvider delayDuration={150}>
            <nav aria-label="Editorias" className="mt-10">
              <ul className="flex flex-wrap justify-center gap-x-5 gap-y-3">
                {categories.map((category) => (
                  <li key={category}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to="/categoria/$slug"
                          params={{ slug: slugify(category) }}
                          className="label-mono text-muted-foreground transition-colors hover:text-gold"
                        >
                          {category}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
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

          <div className="mt-10 w-full border-t border-border/70 pt-6">
            <div className="flex flex-col items-center justify-between gap-5 md:flex-row">
              <p className="label-mono text-center text-muted-foreground/60 md:text-left">
                © {new Date().getFullYear()} Revista Évoluer. Todos os direitos reservados.
              </p>
              <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
                <a href="#anunciar" className="label-mono text-muted-foreground transition-colors hover:text-gold">
                  Anuncie
                </a>
                <a href="mailto:contato@revistaevoluer.com.br" className="label-mono text-muted-foreground transition-colors hover:text-gold">
                  Contato
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
