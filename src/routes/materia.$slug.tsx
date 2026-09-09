import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AdSlot } from "@/components/site/AdSlot";
import { articles, slugify } from "@/data/content";

export const Route = createFileRoute("/materia/$slug")({
  loader: ({ params }) => {
    const article = articles.find((item) => item.slug === params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ params, loaderData }) => {
    const article = loaderData?.article;
    return {
      meta: [
        { title: `${article?.title ?? "Matéria"} — Revista Évoluer` },
        { name: "description", content: article?.excerpt ?? "" },
        { property: "og:title", content: article?.title ?? "" },
        { property: "og:description", content: article?.excerpt ?? "" },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/materia/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/materia/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article?.title,
            description: article?.excerpt,
            author: { "@type": "Organization", name: "Revista Évoluer" },
            publisher: { "@type": "Organization", name: "Revista Évoluer" },
          }),
        },
      ],
    };
  },
  component: ArticlePage,
});

function ArticlePage() {
  const { article } = Route.useLoaderData();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <AdSlot format="billboard" />

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_300px]">
          <article>
            <Link
              to="/categoria/$slug"
              params={{ slug: slugify(article.category) }}
              className="label-mono bg-gold px-3 py-1.5 text-primary-foreground"
            >
              {article.category}
            </Link>
            <h1 className="mt-6 text-3xl leading-tight md:text-5xl">{article.title}</h1>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{article.excerpt}</p>
            <p className="label-mono mt-5 text-gold-deep">
              {article.author} · {article.date} · {article.readingTime}
            </p>

            <img
              src={article.image}
              alt={article.title}
              width={1200}
              height={800}
              className="mt-8 aspect-[3/2] w-full object-cover object-center"
            />

            <div className="mt-10 space-y-6">
              {article.body.map((paragraph) => (
                <p key={paragraph} className="text-[1.05rem] leading-8 text-foreground/85">
                  {paragraph}
                </p>
              ))}
            </div>
          </article>

          <aside className="hidden flex-col gap-6 lg:flex">
            <AdSlot format="vertical" />
            <AdSlot format="square" />
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

