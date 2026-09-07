import { Link } from "@tanstack/react-router";
import { categories, slugify } from "@/data/content";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-ink">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-col items-center gap-6">
          <Logo size="sm" />
          <p className="max-w-md text-center text-sm text-muted-foreground">
            Revista eletrônica independente. Reportagens, entrevistas e análises publicadas
            semanalmente.
          </p>
          <div className="rule-gold w-full max-w-2xl" />
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {categories.map((category) => (
              <li key={category}>
                <Link
                  to="/categoria/$slug"
                  params={{ slug: slugify(category) }}
                  className="label-mono text-muted-foreground transition-colors hover:text-gold"
                >
                  {category}
                </Link>
              </li>
            ))}
          </ul>
          <p className="label-mono text-muted-foreground/60">
            © {new Date().getFullYear()} Revista Évoluer
          </p>
        </div>
      </div>
    </footer>
  );
}
