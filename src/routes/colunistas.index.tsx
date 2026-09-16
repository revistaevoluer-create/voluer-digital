import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { benefits, currency, faq, flowSteps, plans } from "@/data/colunistas";

export const Route = createFileRoute("/colunistas/")({
  head: () => ({
    meta: [
      { title: "Seja nosso colunista — Revista Évoluer" },
      {
        name: "description",
        content:
          "Assine uma coluna na Revista Évoluer: publicação no portal na frequência escolhida, revisão editorial, arte por artigo e calendário semestral de conteúdo.",
      },
      { property: "og:title", content: "Seja nosso colunista — Revista Évoluer" },
      {
        property: "og:description",
        content:
          "Planos mensal, quinzenal e semanal com contratação mínima de 6 meses, revisão editorial e página profissional de colunista.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/colunistas" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/colunistas" }],
  }),
  component: ColunistasPage,
});

function SectionTitle({ children }: { children: string }) {
  return (
    <div className="mb-8 flex items-center gap-4">
      <h2 className="label-mono whitespace-nowrap text-gold">{children}</h2>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

function ColunistasPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <section className="border-b border-gold-deep/20 bg-ink px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-8 bg-gold-deep/60 md:w-16" />
              <span className="label-mono text-gold">Programa de colunistas</span>
              <span className="h-px w-8 bg-gold-deep/60 md:w-16" />
            </div>
            <h1 className="mt-6 text-4xl leading-tight md:text-6xl">Seja nosso colunista</h1>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">
              Um espaço editorial fixo na Revista Évoluer para profissionais que têm algo
              consistente a dizer. Você escreve; nós revisamos, formatamos, produzimos a arte e
              publicamos dentro de um calendário planejado para o semestre.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/colunistas/inscricao"
                className="label-mono bg-gold px-7 py-3 text-primary-foreground transition-colors hover:bg-gold-deep"
              >
                Quero me inscrever
              </Link>
              <a
                href="#planos"
                className="label-mono border border-gold-deep/60 px-7 py-3 text-gold transition-colors hover:border-gold"
              >
                Ver planos
              </a>
            </div>
            <p className="label-mono mt-6 text-muted-foreground/70">
              Inscrição gratuita · não é pagamento nem contratação
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4">
          <section className="py-14">
            <SectionTitle>Como você participa</SectionTitle>
            <p className="max-w-3xl leading-relaxed text-muted-foreground">
              O colunista assina uma coluna dentro de uma das categorias editoriais da Évoluer e
              envia os textos na frequência do plano contratado. Cada artigo passa por revisão e
              formatação, recebe uma arte de capa e é publicado no portal. Em todos os planos, um
              artigo por mês é publicado na revista digital; as publicações adicionais ficam no
              portal. A autoria é sempre sua.
            </p>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {benefits.map((benefit) => (
                <article key={benefit.title} className="border-t border-gold-deep/40 pt-5">
                  <h3 className="text-xl leading-snug">{benefit.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {benefit.text}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section id="planos" className="scroll-mt-24 border-t border-border py-14">
            <SectionTitle>Planos</SectionTitle>
            <p className="max-w-3xl leading-relaxed text-muted-foreground">
              Todos os planos têm <strong className="text-foreground">contratação mínima de 6
              meses</strong>, com pagamento parcelado em 6 vezes. Os valores abaixo mostram o preço
              mensal e o total do semestre.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {plans.map((plan) => (
                <article
                  key={plan.id}
                  className={`flex flex-col border p-6 ${
                    plan.highlight ? "border-gold" : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="label-mono text-gold">{plan.name}</span>
                    {plan.highlight && (
                      <span className="label-mono bg-gold px-2 py-1 text-primary-foreground">
                        mais escolhido
                      </span>
                    )}
                  </div>
                  <p className="mt-4 font-display text-3xl">{currency(plan.monthlyPrice)}<span className="text-base text-muted-foreground">/mês</span></p>
                  <p className="label-mono mt-2 text-gold-deep">
                    {plan.installments} · total {currency(plan.total)}
                  </p>
                  <p className="label-mono mt-1 text-muted-foreground/70">
                    Contratação mínima de 6 meses
                  </p>
                  <ul className="mt-5 space-y-2 text-sm leading-relaxed text-muted-foreground">
                    <li>{plan.frequency}</li>
                    <li>{plan.postsPerSemester}</li>
                    {plan.notes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                  <Link
                    to="/colunistas/inscricao"
                    search={{ plano: plan.id }}
                    className={`label-mono mt-7 block px-5 py-3 text-center transition-colors ${
                      plan.highlight
                        ? "bg-gold text-primary-foreground hover:bg-gold-deep"
                        : "border border-gold-deep/60 text-gold hover:border-gold"
                    }`}
                  >
                    Escolher {plan.name}
                  </Link>
                </article>
              ))}
            </div>

            <div className="mt-10 overflow-x-auto border border-border">
              <table className="w-full min-w-max text-sm">
                <caption className="sr-only">Comparação dos planos de coluna</caption>
                <thead>
                  <tr className="border-b border-border bg-ink">
                    <th scope="col" className="label-mono px-5 py-4 text-left text-gold">
                      Comparação
                    </th>
                    {plans.map((plan) => (
                      <th key={plan.id} scope="col" className="label-mono px-5 py-4 text-left text-gold">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    { label: "Frequência", value: (p: typeof plans[number]) => p.frequency },
                    { label: "No semestre", value: (p: typeof plans[number]) => p.postsPerSemester },
                    {
                      label: "Revista digital",
                      value: () => "1 artigo por mês",
                    },
                    { label: "Arte por artigo", value: () => "Incluída" },
                    { label: "Revisão e formatação", value: () => "Incluída" },
                    { label: "Página de colunista", value: () => "Incluída" },
                    {
                      label: "Preço mensal",
                      value: (p: typeof plans[number]) => currency(p.monthlyPrice),
                    },
                    {
                      label: "Total do semestre",
                      value: (p: typeof plans[number]) => `${p.installments} · ${currency(p.total)}`,
                    },
                    { label: "Contratação mínima", value: () => "6 meses" },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-border/70 last:border-b-0">
                      <th scope="row" className="px-5 py-4 text-left font-normal text-foreground">
                        {row.label}
                      </th>
                      {plans.map((plan) => (
                        <td key={plan.id} className="px-5 py-4">
                          {row.value(plan)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="border-t border-border py-14">
            <SectionTitle>Como funciona, etapa por etapa</SectionTitle>
            <ol className="grid gap-8 md:grid-cols-2">
              {flowSteps.map((step, index) => (
                <li key={step.title} className="flex gap-5">
                  <span className="font-display text-3xl text-gold-deep/50">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="text-xl leading-snug">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="border-t border-border py-14">
            <SectionTitle>Perguntas frequentes</SectionTitle>
            <Accordion type="single" collapsible className="max-w-3xl">
              {faq.map((item, index) => (
                <AccordionItem key={item.q} value={`item-${index}`}>
                  <AccordionTrigger className="text-left text-base">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        </div>

        <section className="border-t border-gold-deep/20 bg-ink px-4 py-14 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl leading-tight md:text-4xl">Pronto para escrever na Évoluer?</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Preencha a inscrição em poucos minutos. No fim, você recebe um relatório de
              direcionamento editorial montado a partir das suas respostas.
            </p>
            <Link
              to="/colunistas/inscricao"
              className="label-mono mt-8 inline-block bg-gold px-7 py-3 text-primary-foreground transition-colors hover:bg-gold-deep"
            >
              Fazer minha inscrição
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
