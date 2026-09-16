import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  buildEditorialDirection,
  currency,
  planById,
  plans,
  type PlanId,
} from "@/data/colunistas";

type Search = { plano?: PlanId };

export const Route = createFileRoute("/colunistas/inscricao")({
  validateSearch: (search: Record<string, unknown>): Search => {
    const plano = String(search.plano ?? "");
    return plans.some((p) => p.id === plano) ? { plano: plano as PlanId } : {};
  },
  head: () => ({
    meta: [
      { title: "Inscrição de colunista — Revista Évoluer" },
      {
        name: "description",
        content:
          "Formulário de inscrição para colunistas da Revista Évoluer: perfil profissional, temas de domínio e frequência de publicação. A inscrição não é pagamento.",
      },
      { property: "og:title", content: "Inscrição de colunista — Revista Évoluer" },
      {
        property: "og:description",
        content:
          "Envie seu perfil profissional e temas de domínio para participar do programa de colunistas da Revista Évoluer.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/colunistas/inscricao" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/colunistas/inscricao" }],
  }),
  component: InscricaoPage,
});

type FormState = {
  name: string;
  email: string;
  network: string;
  profession: string;
  area: string;
  presentation: string;
  themes: string;
  audience: string;
  goal: string;
  writing: string;
  pitch: string;
  plan: PlanId | "";
};

const emptyForm: FormState = {
  name: "",
  email: "",
  network: "",
  profession: "",
  area: "",
  presentation: "",
  themes: "",
  audience: "",
  goal: "",
  writing: "",
  pitch: "",
  plan: "",
};

const stepTitles = [
  "Seus dados",
  "Perfil profissional",
  "Temas e objetivo",
  "Frequência",
  "Revisão",
];

const writingOptions = [
  "Nunca publiquei textos",
  "Escrevo ocasionalmente (redes, blog, newsletter)",
  "Já publiquei em veículos ou revistas",
  "Escrevo com regularidade (coluna, livro, artigos acadêmicos)",
];

function InscricaoPage() {
  const { plano } = Route.useSearch();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>({ ...emptyForm, plan: plano ?? "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [downloaded, setDownloaded] = useState(false);
  const [emailOpened, setEmailOpened] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);

  const set = (key: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const plan = planById(form.plan);

  const direction = useMemo(
    () =>
      buildEditorialDirection({
        area: `${form.profession} ${form.area}`,
        presentation: form.presentation,
        themes: form.themes,
        audience: form.audience,
        goal: form.goal,
        pitch: form.pitch,
      }),
    [form],
  );

  function validate(current: number) {
    const next: Record<string, string> = {};
    if (current === 0) {
      if (form.name.trim().length < 3) next.name = "Informe seu nome completo.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
        next.email = "Informe um e-mail válido para contato.";
    }
    if (current === 1) {
      if (!form.profession.trim()) next.profession = "Informe sua profissão.";
      if (!form.area.trim()) next.area = "Informe sua área de atuação.";
      if (form.presentation.trim().length < 40)
        next.presentation = "Escreva ao menos algumas linhas de apresentação (mín. 40 caracteres).";
    }
    if (current === 2) {
      if (form.themes.trim().length < 5) next.themes = "Liste pelo menos um tema de domínio.";
      if (!form.audience.trim()) next.audience = "Descreva o público que você quer alcançar.";
      if (!form.goal.trim()) next.goal = "Conte qual é o seu objetivo com a coluna.";
      if (!form.writing) next.writing = "Selecione sua experiência com escrita.";
    }
    if (current === 3) {
      if (!form.plan) next.plan = "Escolha a frequência de publicação.";
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      requestAnimationFrame(() => errorRef.current?.focus());
      return false;
    }
    return true;
  }

  const summaryText = useMemo(() => {
    const lines = [
      "INSCRIÇÃO DE COLUNISTA — REVISTA ÉVOLUER",
      "",
      `Nome: ${form.name}`,
      `E-mail: ${form.email}`,
      form.network ? `Rede profissional: ${form.network}` : null,
      `Profissão: ${form.profession}`,
      `Área de atuação: ${form.area}`,
      "",
      "Apresentação profissional:",
      form.presentation,
      "",
      `Temas de domínio: ${form.themes}`,
      `Público-alvo: ${form.audience}`,
      `Objetivo com a coluna: ${form.goal}`,
      `Experiência com escrita: ${form.writing}`,
      form.pitch ? `Sugestão de pauta: ${form.pitch}` : null,
      "",
      "PLANO ESCOLHIDO",
      plan
        ? `${plan.name} — ${plan.frequency} · ${plan.postsPerSemester}`
        : "não informado",
      plan
        ? `Valor: ${plan.installments} (${currency(plan.monthlyPrice)}/mês) · total ${currency(plan.total)} · contratação mínima de 6 meses`
        : "",
      "",
      "DIRECIONAMENTO EDITORIAL (gerado a partir das respostas acima)",
      `Categoria sugerida: ${direction.category}`,
      direction.matchedTerms.length
        ? `Palavras-chave encontradas: ${direction.matchedTerms.join(", ")}`
        : "Nenhuma palavra-chave das categorias foi encontrada; sugestão padrão.",
      direction.suggestedThemes.length
        ? `Temas para o calendário: ${direction.suggestedThemes.join(" · ")}`
        : "",
      "",
      "Esta inscrição é uma manifestação de interesse. Não representa pagamento, contratação ou aprovação.",
    ];
    return lines.filter((line) => line !== null && line !== "").join("\n");
  }, [form, plan, direction]);

  function download() {
    const blob = new Blob([summaryText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `inscricao-colunista-evoluer-${form.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
  }

  const mailtoHref = `mailto:contato@revistaevoluer.com.br?subject=${encodeURIComponent(
    `Inscrição de colunista — ${form.name}`,
  )}&body=${encodeURIComponent(summaryText)}`;

  const inputClass = "bg-white text-wine-foreground border-wine/25 focus-visible:ring-wine/40";

  const fieldError = (key: string) =>
    errors[key] ? (
      <p id={`${key}-error`} className="mt-1.5 text-sm text-wine">
        {errors[key]}
      </p>
    ) : null;

  const aria = (key: string) => ({
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `${key}-error` : undefined,
  });

  return (
    <div className="min-h-screen">
      <Header />

      <main className="bg-paper px-4 py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <nav aria-label="Trilha" className="label-mono text-wine/70">
            <Link to="/colunistas" className="underline underline-offset-4 hover:text-wine">
              Seja nosso colunista
            </Link>
            <span aria-hidden="true"> / </span>
            <span>Inscrição</span>
          </nav>

          <h1 className="mt-6 font-display text-3xl leading-tight text-wine md:text-5xl">
            Inscrição de colunista
          </h1>
          <p className="mt-4 leading-relaxed text-wine-foreground/80">
            Cinco etapas curtas. Coletamos apenas o necessário para avaliar o seu perfil editorial.
            Preencher este formulário não gera pagamento nem contratação.
          </p>

          <ol className="mt-8 flex flex-wrap gap-x-4 gap-y-2" aria-label="Etapas">
            {stepTitles.map((title, index) => (
              <li
                key={title}
                aria-current={index === step ? "step" : undefined}
                className={`label-mono ${
                  index === step
                    ? "text-wine"
                    : index < step
                      ? "text-wine/60"
                      : "text-wine-foreground/40"
                }`}
              >
                {index + 1}. {title}
              </li>
            ))}
          </ol>

          <div
            ref={errorRef}
            tabIndex={-1}
            role={Object.keys(errors).length ? "alert" : undefined}
            className="mt-6 outline-none"
          >
            {Object.keys(errors).length > 0 && (
              <div className="border border-wine/40 bg-wine/5 p-4 text-sm text-wine">
                Revise os campos destacados para continuar.
              </div>
            )}
          </div>

          <form
            className="mt-6 border border-wine/20 bg-white p-6 md:p-8"
            onSubmit={(event) => event.preventDefault()}
          >
            {step === 0 && (
              <fieldset className="space-y-6">
                <legend className="font-display text-2xl text-wine">Seus dados</legend>
                <div>
                  <Label htmlFor="name" className="text-wine-foreground">
                    Nome completo
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => set("name")(e.target.value)}
                    className={inputClass}
                    autoComplete="name"
                    {...aria("name")}
                  />
                  {fieldError("name")}
                </div>
                <div>
                  <Label htmlFor="email" className="text-wine-foreground">
                    E-mail
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email")(e.target.value)}
                    className={inputClass}
                    autoComplete="email"
                    {...aria("email")}
                  />
                  {fieldError("email")}
                </div>
                <div>
                  <Label htmlFor="network" className="text-wine-foreground">
                    Rede profissional <span className="text-wine-foreground/60">(opcional)</span>
                  </Label>
                  <Input
                    id="network"
                    value={form.network}
                    onChange={(e) => set("network")(e.target.value)}
                    className={inputClass}
                    placeholder="LinkedIn, site ou portfólio"
                  />
                </div>
              </fieldset>
            )}

            {step === 1 && (
              <fieldset className="space-y-6">
                <legend className="font-display text-2xl text-wine">Perfil profissional</legend>
                <div>
                  <Label htmlFor="profession" className="text-wine-foreground">
                    Profissão
                  </Label>
                  <Input
                    id="profession"
                    value={form.profession}
                    onChange={(e) => set("profession")(e.target.value)}
                    className={inputClass}
                    {...aria("profession")}
                  />
                  {fieldError("profession")}
                </div>
                <div>
                  <Label htmlFor="area" className="text-wine-foreground">
                    Área de atuação
                  </Label>
                  <Input
                    id="area"
                    value={form.area}
                    onChange={(e) => set("area")(e.target.value)}
                    className={inputClass}
                    placeholder="Ex.: direito de família, gestão de pessoas, nutrição"
                    {...aria("area")}
                  />
                  {fieldError("area")}
                </div>
                <div>
                  <Label htmlFor="presentation" className="text-wine-foreground">
                    Apresentação profissional
                  </Label>
                  <Textarea
                    id="presentation"
                    rows={5}
                    value={form.presentation}
                    onChange={(e) => set("presentation")(e.target.value)}
                    className={inputClass}
                    placeholder="Formação, tempo de atuação e o que você faz hoje."
                    {...aria("presentation")}
                  />
                  {fieldError("presentation")}
                </div>
              </fieldset>
            )}

            {step === 2 && (
              <fieldset className="space-y-6">
                <legend className="font-display text-2xl text-wine">Temas e objetivo</legend>
                <div>
                  <Label htmlFor="themes" className="text-wine-foreground">
                    Temas de domínio
                  </Label>
                  <Textarea
                    id="themes"
                    rows={3}
                    value={form.themes}
                    onChange={(e) => set("themes")(e.target.value)}
                    className={inputClass}
                    placeholder="Separe por vírgulas."
                    {...aria("themes")}
                  />
                  {fieldError("themes")}
                </div>
                <div>
                  <Label htmlFor="audience" className="text-wine-foreground">
                    Público que você quer alcançar
                  </Label>
                  <Input
                    id="audience"
                    value={form.audience}
                    onChange={(e) => set("audience")(e.target.value)}
                    className={inputClass}
                    {...aria("audience")}
                  />
                  {fieldError("audience")}
                </div>
                <div>
                  <Label htmlFor="goal" className="text-wine-foreground">
                    Objetivo com a coluna
                  </Label>
                  <Input
                    id="goal"
                    value={form.goal}
                    onChange={(e) => set("goal")(e.target.value)}
                    className={inputClass}
                    {...aria("goal")}
                  />
                  {fieldError("goal")}
                </div>
                <div>
                  <span className="text-sm font-medium text-wine-foreground">
                    Experiência com escrita
                  </span>
                  <div
                    role="radiogroup"
                    aria-label="Experiência com escrita"
                    className="mt-2 space-y-2"
                    {...aria("writing")}
                  >
                    {writingOptions.map((option) => (
                      <label
                        key={option}
                        className="flex cursor-pointer items-center gap-3 text-sm text-wine-foreground"
                      >
                        <input
                          type="radio"
                          name="writing"
                          value={option}
                          checked={form.writing === option}
                          onChange={() => set("writing")(option)}
                          className="accent-wine"
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  {fieldError("writing")}
                </div>
                <div>
                  <Label htmlFor="pitch" className="text-wine-foreground">
                    Sugestão de pauta <span className="text-wine-foreground/60">(opcional)</span>
                  </Label>
                  <Textarea
                    id="pitch"
                    rows={3}
                    value={form.pitch}
                    onChange={(e) => set("pitch")(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </fieldset>
            )}

            {step === 3 && (
              <fieldset className="space-y-5">
                <legend className="font-display text-2xl text-wine">
                  Frequência de publicação
                </legend>
                <p className="text-sm leading-relaxed text-wine-foreground/80">
                  Todos os planos têm contratação mínima de 6 meses, com pagamento em 6 parcelas.
                </p>
                <div role="radiogroup" aria-label="Plano" className="space-y-3" {...aria("plan")}>
                  {plans.map((option) => (
                    <label
                      key={option.id}
                      className={`flex cursor-pointer gap-4 border p-4 ${
                        form.plan === option.id ? "border-wine bg-wine/5" : "border-wine/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="plan"
                        value={option.id}
                        checked={form.plan === option.id}
                        onChange={() => set("plan")(option.id)}
                        className="mt-1 accent-wine"
                      />
                      <span className="text-sm text-wine-foreground">
                        <strong className="font-display text-lg text-wine">{option.name}</strong>
                        <span className="mt-1 block">
                          {option.frequency} · {option.postsPerSemester}
                        </span>
                        <span className="mt-1 block">
                          {option.installments} ({currency(option.monthlyPrice)}/mês) · total{" "}
                          {currency(option.total)} · mínimo de 6 meses
                        </span>
                        <span className="mt-1 block">1 artigo por mês na revista digital</span>
                      </span>
                    </label>
                  ))}
                </div>
                {fieldError("plan")}
              </fieldset>
            )}

            {step === 4 && (
              <div className="space-y-8">
                <div>
                  <h2 className="font-display text-2xl text-wine">Revise sua inscrição</h2>
                  <dl className="mt-4 divide-y divide-wine/15 text-sm text-wine-foreground">
                    {[
                      ["Nome", form.name],
                      ["E-mail", form.email],
                      ["Rede profissional", form.network || "—"],
                      ["Profissão", form.profession],
                      ["Área de atuação", form.area],
                      ["Apresentação", form.presentation],
                      ["Temas de domínio", form.themes],
                      ["Público-alvo", form.audience],
                      ["Objetivo", form.goal],
                      ["Experiência com escrita", form.writing],
                      ["Sugestão de pauta", form.pitch || "—"],
                    ].map(([label, value]) => (
                      <div key={label} className="grid gap-1 py-3 sm:grid-cols-[10rem_1fr]">
                        <dt className="label-mono text-wine/70">{label}</dt>
                        <dd className="leading-relaxed">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                {plan && (
                  <div className="border border-wine/25 p-5">
                    <h3 className="font-display text-xl text-wine">Plano {plan.name}</h3>
                    <ul className="mt-3 space-y-1 text-sm text-wine-foreground">
                      <li>{plan.frequency}</li>
                      <li>{plan.postsPerSemester}</li>
                      <li>1 artigo por mês na revista digital</li>
                      <li>
                        Preço mensal: <strong>{currency(plan.monthlyPrice)}</strong>
                      </li>
                      <li>
                        Total do semestre: <strong>{currency(plan.total)}</strong> ({plan.installments})
                      </li>
                      <li>Contratação mínima de 6 meses</li>
                    </ul>
                  </div>
                )}

                <div className="border border-wine/25 bg-wine/5 p-5">
                  <h3 className="font-display text-xl text-wine">
                    Relatório de direcionamento editorial
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-wine-foreground/80">
                    Sugestão calculada diretamente das suas respostas, comparando as palavras que
                    você escreveu com as descrições das categorias da Évoluer. Não é avaliação,
                    aprovação nem análise por inteligência artificial.
                  </p>
                  <p className="mt-4 text-sm text-wine-foreground">
                    <span className="label-mono block text-wine/70">Categoria sugerida</span>
                    <strong className="font-display text-lg text-wine">{direction.category}</strong>
                  </p>
                  {direction.isFallback ? (
                    <p className="mt-3 text-sm text-wine-foreground/80">
                      Nenhuma palavra-chave das categorias apareceu nas suas respostas, então
                      indicamos a categoria mais ampla. A equipe editorial define a categoria final.
                    </p>
                  ) : (
                    <p className="mt-3 text-sm text-wine-foreground/80">
                      Palavras encontradas: {direction.matchedTerms.join(", ")}.
                      {direction.alternatives.length > 0 && (
                        <>
                          {" "}
                          Alternativas possíveis:{" "}
                          {direction.alternatives.map((alt) => alt.category).join(", ")}.
                        </>
                      )}
                    </p>
                  )}
                  {direction.suggestedThemes.length > 0 && (
                    <div className="mt-3 text-sm text-wine-foreground/80">
                      Temas que você indicou e que podem abrir o calendário:
                      <ul className="mt-1 list-disc pl-5">
                        {direction.suggestedThemes.map((theme) => (
                          <li key={theme}>{theme}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="border border-wine/25 p-5">
                  <h3 className="font-display text-xl text-wine">Enviar a inscrição</h3>
                  <p className="mt-2 text-sm leading-relaxed text-wine-foreground/80">
                    Esta inscrição ainda não foi enviada. Baixe o resumo e clique em “Abrir e-mail
                    para enviar”: isso abre o seu aplicativo de e-mail com a mensagem pronta para
                    contato@revistaevoluer.com.br. A inscrição só chega até nós quando você
                    efetivamente enviar esse e-mail.
                  </p>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={download}
                      className="label-mono border border-wine px-6 py-3 text-wine transition-colors hover:bg-wine/10"
                    >
                      Baixar resumo (.txt)
                    </button>
                    <a
                      href={mailtoHref}
                      onClick={() => setEmailOpened(true)}
                      className="label-mono bg-wine px-6 py-3 text-center text-white transition-opacity hover:opacity-90"
                    >
                      Abrir e-mail para enviar
                    </a>
                  </div>
                  {downloaded && (
                    <p className="mt-4 text-sm text-wine-foreground/80" role="status">
                      Resumo baixado. Você pode anexá-lo ao e-mail se preferir.
                    </p>
                  )}
                  {emailOpened && (
                    <p className="mt-2 text-sm text-wine-foreground/80" role="status">
                      Abrimos o seu aplicativo de e-mail. Confirme o envio por lá — sem isso, a
                      inscrição não é recebida. Se nada abrir, envie o resumo manualmente para
                      contato@revistaevoluer.com.br.
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-wine/15 pt-6 sm:flex-row sm:justify-between">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setErrors({});
                    setStep((s) => s - 1);
                  }}
                  className="label-mono border border-wine/40 px-6 py-3 text-wine transition-colors hover:border-wine"
                >
                  Voltar
                </button>
              ) : (
                <Link
                  to="/colunistas"
                  className="label-mono border border-wine/40 px-6 py-3 text-center text-wine transition-colors hover:border-wine"
                >
                  Voltar
                </Link>
              )}
              {step < 4 && (
                <button
                  type="button"
                  onClick={() => {
                    if (validate(step)) setStep((s) => s + 1);
                  }}
                  className="label-mono bg-wine px-6 py-3 text-white transition-opacity hover:opacity-90"
                >
                  Continuar
                </button>
              )}
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
