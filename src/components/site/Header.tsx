import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { categories, slugify } from "@/data/content";
import { Logo } from "./Logo";

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
          <nav className="hidden items-center gap-4 md:flex">
            {["Newsletter", "Anuncie", "Assinar"].map((item) => (
              <a
                key={item}
                href="#newsletter"
                className="label-mono text-muted-foreground transition-colors hover:text-gold"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-4 py-7 md:flex-row md:justify-between">
        <div className="hidden w-40 md:block" />
        <Link to="/" aria-label="Revista Évoluer — página inicial">
          <Logo />
        </Link>
        <a
          href="#newsletter"
          className="label-mono bg-gold px-6 py-3 text-primary-foreground transition-colors hover:bg-gold-deep"
        >
          Assinar
        </a>
      </div>

      <nav
        aria-label="Categorias"
        className="mx-auto max-w-6xl overflow-x-auto border-t border-border px-4"
      >
        <ul className="flex min-w-max items-center gap-6 py-3.5">
          {categories.map((category) => (
            <li key={category}>
              <Link
                to="/categoria/$slug"
                params={{ slug: slugify(category) }}
                className="label-mono whitespace-nowrap text-muted-foreground transition-colors hover:text-gold"
                activeProps={{ className: "label-mono whitespace-nowrap text-gold" }}
              >
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="overflow-hidden bg-gold py-2">
        <div className="ticker-track">
          {[0, 1].map((copy) => (
            <span key={copy} className="label-mono px-6 text-primary-foreground">
              Bem-vindo à Revista Évoluer · Jornalismo editorial · Nova edição disponível ·
              Assine a newsletter semanal ·
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
