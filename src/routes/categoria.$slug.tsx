import { createFileRoute, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { AdSlot } from "@/components/site/AdSlot";
import { ArticleCard } from "@/components/site/ArticleCard";
import { articles, categories, slugify } from "@/data/content";

export const Route = createFileRoute("/categoria/$slug")({
  loader: ({ params }) => {
    const category = categories.find((item) => slugify(item) === params.slug);
    if (!category) throw notFound();
    return { category, posts: articles.filter((a) => a.category === category) };
  },
  head: ({ params, loaderData }) => {
    const name = loaderData?.category ?? "Categoria";
    return {
      meta: [
        { title: `${name} — Revista Évoluer` },
        {
          name: "description",
          content: `Reportagens e análises de ${name} publicadas pela Revista Évoluer.`,
        },
        { property: "og:title", content: `${name} — Revista Évoluer` },
        {
          property: "og:description",
          content: `Reportagens e análises de ${name} na Revista Évoluer.`,
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/categoria/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/categoria/${params.slug}` }],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category, posts } = Route.useLoaderData();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-12">
        <span className="label-mono text-gold">Categoria</span>
        <h1 className="mt-3 text-4xl md:text-5xl">{category}</h1>
        <div className="rule-gold mt-6" />

        <div className="mt-10">
          <AdSlot format="leaderboard" />
        </div>

        {posts.length > 0 ? (
          <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        ) : (
          <p className="mt-12 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Ainda não publicamos matérias nesta editoria. As primeiras reportagens de {category}{" "}
            chegam em breve.
          </p>
        )}
      </main>
      <Footer />
    </div>
  );
}
