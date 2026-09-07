import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AdSlot } from "@/components/site/AdSlot";
import { ArticleCard } from "@/components/site/ArticleCard";
import { editorialPillars, featured, latest, secondary, slugify } from "@/data/content";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Revista Évoluer — jornalismo editorial brasileiro" },
      {
        name: "description",
        content:
          "Revista eletrônica com reportagens de saúde, moda, negócios, tecnologia, cultura, esporte e mais.",
      },
      { property: "og:title", content: "Revista Évoluer — jornalismo editorial brasileiro" },
      {
        property: "og:description",
        content: "Reportagens, entrevistas e análises publicadas semanalmente.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <h2 className="label-mono whitespace-nowrap text-gold">{children}</h2>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-6xl px-4">
        <section className="grid gap-8 py-10 lg:grid-cols-[1.75fr_1fr]">
          <article className="self-start border border-border">
            <Link to="/materia/$slug" params={{ slug: featured.slug }} className="block">
              <img
                src={featured.image}
                alt={featured.title}
                width={1600}
                height={1104}
                className="aspect-[16/10] w-full object-cover"
              />
            </Link>
            <div className="p-6 md:p-8">
              <Link
                to="/categoria/$slug"
                params={{ slug: slugify(featured.category) }}
                className="label-mono bg-gold px-3 py-1.5 text-primary-foreground"
              >
                {featured.category}
              </Link>
              <h1 className="mt-5 text-3xl leading-tight md:text-[2.6rem]">
                <Link
                  to="/materia/$slug"
                  params={{ slug: featured.slug }}
                  className="transition-colors hover:text-gold"
                >
                  {featured.title}
                </Link>
              </h1>
              <p className="mt-4 leading-relaxed text-muted-foreground">{featured.excerpt}</p>
              <p className="label-mono mt-5 text-gold-deep">
                {featured.author} · {featured.date} · {featured.readingTime}
              </p>
            </div>
          </article>

          <div className="flex flex-col gap-6">
            <div className="border border-border">
              <div className="border-b border-border px-5 py-4">
                <span className="label-mono text-gold">Últimas</span>
              </div>
              <ul>
                {latest.map((article, index) => (
                  <li key={article.slug} className="border-b border-border last:border-b-0">
                    <div className="flex gap-4 p-5">
                      <span className="font-display text-2xl text-gold-deep/50">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <Link
                          to="/categoria/$slug"
                          params={{ slug: slugify(article.category) }}
                          className="label-mono text-gold"
                        >
                          {article.category}
                        </Link>
                        <h3 className="mt-2 text-base leading-snug">
                          <Link
                            to="/materia/$slug"
                            params={{ slug: article.slug }}
                            className="transition-colors hover:text-gold"
                          >
                            {article.title}
                          </Link>
                        </h3>
                        <span className="label-mono mt-2 block text-muted-foreground/60">
                          {article.date}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <AdSlot format="square" />
          </div>
        </section>

        <div className="pb-12">
          <AdSlot format="billboard" />
        </div>

        <section className="pb-14">
          <SectionTitle>Em destaque</SectionTitle>
          <div className="grid gap-10 md:grid-cols-3">
            {secondary.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>

        <section className="grid gap-10 border-t border-border py-14 lg:grid-cols-[1.75fr_1fr]">
          <div>
            <SectionTitle>Também nesta edição</SectionTitle>
            <div className="grid gap-10 sm:grid-cols-2">
              {latest.slice(3).map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
          <div className="hidden lg:block">
            <AdSlot format="vertical" />
          </div>
        </section>

      </main>

      <section id="newsletter" className="border-t border-gold-deep/20 bg-ink px-4 py-12 md:py-20">
        <div className="relative mx-auto max-w-6xl border border-gold-deep/50 px-6 py-14 text-center md:px-16 md:py-20">
          <span aria-hidden="true" className="absolute left-4 top-4 h-5 w-5 border-l border-t border-gold" />
          <span aria-hidden="true" className="absolute right-4 top-4 h-5 w-5 border-r border-t border-gold" />
          <span aria-hidden="true" className="absolute bottom-4 left-4 h-5 w-5 border-b border-l border-gold" />
          <span aria-hidden="true" className="absolute bottom-4 right-4 h-5 w-5 border-b border-r border-gold" />

          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-gold-deep/60 md:w-16" />
            <span className="label-mono text-gold">Assine a Évoluer</span>
            <span className="h-px w-8 bg-gold-deep/60 md:w-16" />
          </div>
          <h2 className="mt-6 text-3xl leading-tight md:text-5xl">Conteúdo que transforma.</h2>
          <p className="mt-3 font-display text-lg italic text-gold-deep md:text-2xl">
            {editorialPillars.join(" · ")}
          </p>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Receba nossa seleção editorial e acompanhe as histórias que movem pessoas e negócios.
          </p>
          <form
            className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="sr-only" htmlFor="newsletter-email">Seu e-mail</label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="seu@email.com"
              className="min-w-0 flex-1 border border-border bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-gold"
            />
            <button
              type="submit"
              className="label-mono bg-gold px-7 py-3 text-primary-foreground transition-colors hover:bg-gold-deep"
            >
              Quero receber
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
