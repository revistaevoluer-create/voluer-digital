import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AdSlot } from "@/components/site/AdSlot";
import { ArticleCard } from "@/components/site/ArticleCard";
import { featured, latest, secondary, slugify } from "@/data/content";

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

        <section
          id="newsletter"
          className="mb-16 border border-gold-deep/40 bg-card px-6 py-12 text-center md:px-16"
        >
          <span className="label-mono text-gold">Newsletter Évoluer</span>
          <h2 className="mx-auto mt-4 max-w-xl text-3xl leading-tight md:text-4xl">
            Receba a próxima edição antes de todo mundo
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Uma carta semanal com as reportagens que estamos apurando e os bastidores da redação.
          </p>
          <form
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="sr-only" htmlFor="newsletter-email">
              Seu e-mail
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="seu@email.com"
              className="flex-1 border border-border bg-background px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-gold"
            />
            <button
              type="submit"
              className="label-mono bg-gold px-6 py-3 text-primary-foreground transition-colors hover:bg-gold-deep"
            >
              Assinar
            </button>
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
