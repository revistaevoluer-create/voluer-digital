import { Link } from "@tanstack/react-router";
import type { Article } from "@/data/content";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="group flex flex-col">
      <Link
        to="/materia/$slug"
        params={{ slug: article.slug }}
        className="block overflow-hidden"
      >
        <img
          src={article.image}
          alt={article.title}
          loading="lazy"
          width={1200}
          height={800}
          className="aspect-[3/2] w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </Link>
      <span className="label-mono mt-4 text-gold">{article.category}</span>
      <h3 className="mt-2 text-xl leading-snug text-foreground">
        <Link
          to="/materia/$slug"
          params={{ slug: article.slug }}
          className="transition-colors hover:text-gold"
        >
          {article.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
      <span className="label-mono mt-3 text-muted-foreground/60">
        {article.date} · {article.readingTime}
      </span>
    </article>
  );
}
