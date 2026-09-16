import { categories } from "./content";

export type PlanId = "mensal" | "quinzenal" | "semanal";

export type Plan = {
  id: PlanId;
  name: string;
  frequency: string;
  postsPerMonth: string;
  postsPerSemester: string;
  installments: string;
  monthlyPrice: number;
  total: number;
  highlight?: boolean;
  notes: string[];
};

export const plans: Plan[] = [
  {
    id: "mensal",
    name: "Mensal",
    frequency: "1 publicação por mês",
    postsPerMonth: "1 publicação/mês",
    postsPerSemester: "6 publicações no semestre",
    installments: "6x R$ 100",
    monthlyPrice: 100,
    total: 600,
    notes: [
      "Contratação mínima de 6 meses",
      "1 artigo por mês na revista digital",
    ],
  },
  {
    id: "quinzenal",
    name: "Quinzenal",
    frequency: "2 publicações por mês",
    postsPerMonth: "2 publicações/mês",
    postsPerSemester: "12 publicações no semestre",
    installments: "6x R$ 180",
    monthlyPrice: 180,
    total: 1080,
    highlight: true,
    notes: [
      "Contratação mínima de 6 meses",
      "1 artigo por mês na revista digital; os demais no portal",
    ],
  },
  {
    id: "semanal",
    name: "Semanal",
    frequency: "Publicação semanal",
    postsPerMonth: "aprox. 4 publicações/mês",
    postsPerSemester: "26 publicações no calendário semestral",
    installments: "6x R$ 300",
    monthlyPrice: 300,
    total: 1800,
    notes: [
      "Contratação mínima de 6 meses",
      "1 artigo por mês na revista digital; os demais no portal",
    ],
  },
];

export const planById = (id: string | undefined): Plan | undefined =>
  plans.find((plan) => plan.id === id);

export const currency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

export const benefits = [
  {
    title: "Página profissional do colunista",
    text: "Um espaço na Évoluer que reúne todos os seus artigos publicados, com sua apresentação profissional.",
  },
  {
    title: "Revisão e formatação editorial",
    text: "Revisamos e formatamos o conteúdo que você envia, seguindo o padrão editorial da revista.",
  },
  {
    title: "Publicação na frequência escolhida",
    text: "Seus artigos entram no portal conforme o plano contratado: mensal, quinzenal ou semanal.",
  },
  {
    title: "Uma arte por artigo",
    text: "Cada artigo publicado recebe uma arte de capa produzida na identidade visual da Évoluer.",
  },
  {
    title: "Calendário e acompanhamento",
    text: "Você recebe um calendário de conteúdo para o semestre e acompanhamento das entregas.",
  },
  {
    title: "Presença na revista digital",
    text: "Em todos os planos, um artigo por mês é publicado na revista digital. As publicações extras ficam no portal.",
  },
];

export const flowSteps = [
  {
    title: "Inscrição",
    text: "Você preenche o formulário com seu perfil profissional, temas de domínio e a frequência desejada. A inscrição não é pagamento e não gera cobrança.",
  },
  {
    title: "Relatório de direcionamento editorial",
    text: "Ao final do formulário, geramos um relatório com a categoria da Évoluer mais próxima do seu perfil e sugestões de temas, montado a partir das suas próprias respostas.",
  },
  {
    title: "Avaliação e proposta",
    text: "A equipe editorial analisa a inscrição e responde por e-mail com a proposta de participação, o plano e as condições do semestre.",
  },
  {
    title: "Calendário de conteúdo",
    text: "Com o plano definido, organizamos o calendário do semestre: datas de envio, revisão e publicação de cada artigo.",
  },
  {
    title: "Publicação",
    text: "Cada texto passa por revisão e formatação, recebe uma arte e é publicado no portal na frequência contratada; um artigo por mês vai para a revista digital.",
  },
  {
    title: "Divulgação editorial",
    text: "Os artigos publicados circulam nos espaços editoriais da Évoluer: capa, categoria correspondente e a sua página de colunista.",
  },
];

export const faq = [
  {
    q: "De quem é a autoria dos artigos?",
    a: "A autoria é sempre do colunista. Seu nome assina o texto e ele fica reunido na sua página de colunista. A Évoluer faz revisão e formatação, sem alterar a sua opinião.",
  },
  {
    q: "Com que periodicidade eu publico?",
    a: "Conforme o plano: 1 publicação por mês (Mensal), 2 por mês (Quinzenal) ou publicação semanal, com 26 publicações no calendário semestral (Semanal).",
  },
  {
    q: "Por que a contratação é de 6 meses?",
    a: "A coluna é planejada em calendário semestral, com temas encadeados. Todos os planos têm contratação mínima de 6 meses, parcelada em 6 vezes.",
  },
  {
    q: "Quem escreve o texto?",
    a: "O texto é escrito e enviado pelo colunista. Nós revisamos, formatamos e produzimos a arte de capa de cada artigo.",
  },
  {
    q: "Qual a diferença entre a revista digital e o portal?",
    a: "Nos três planos, um artigo por mês é publicado na edição da revista digital. As publicações adicionais do seu plano ficam no portal.",
  },
  {
    q: "Como funciona a página de colunista?",
    a: "É uma página da Évoluer com a sua apresentação profissional e a lista dos seus artigos publicados, atualizada a cada nova publicação.",
  },
  {
    q: "Preencher o formulário já é uma contratação?",
    a: "Não. A inscrição é uma manifestação de interesse: não há cobrança, pagamento ou compromisso nessa etapa. Qualquer contratação acontece depois, com a proposta enviada por e-mail.",
  },
];

/* ---------------------------------------------------------------------------
 * Direcionamento editorial determinístico.
 * Nenhuma avaliação automática, IA ou aprovação: apenas contagem de palavras
 * -chave informadas pelo próprio candidato, exibida de forma transparente.
 * ------------------------------------------------------------------------- */

const categoryKeywords: Record<string, string[]> = {
  PERSONALIDADES: ["trajetoria", "historia de vida", "biografia", "perfil", "superacao", "legado"],
  CARREIRAS: [
    "carreira",
    "profissao",
    "recolocacao",
    "mercado de trabalho",
    "transicao",
    "curriculo",
    "rh",
    "recursos humanos",
    "emprego",
    "concurso",
  ],
  NEGÓCIOS: [
    "negocio",
    "negocios",
    "empreendedorismo",
    "empresa",
    "gestao",
    "lideranca",
    "marca",
    "vendas",
    "financas",
    "franquia",
    "juridico",
    "direito",
    "contabilidade",
    "investimento",
  ],
  "TECNOLOGIA & INOVAÇÃO": [
    "tecnologia",
    "inovacao",
    "inteligencia artificial",
    "ia",
    "dados",
    "software",
    "digital",
    "automacao",
    "startup",
    "seguranca da informacao",
  ],
  LIFESTYLE: [
    "lifestyle",
    "estilo de vida",
    "viagem",
    "gastronomia",
    "moda",
    "beleza",
    "bem-estar",
    "bem estar",
    "fitness",
    "nutricao",
    "saude",
    "tendencia",
  ],
  CULTURA: [
    "cultura",
    "livro",
    "literatura",
    "arte",
    "musica",
    "cinema",
    "teatro",
    "evento",
    "fotografia",
  ],
  COMPORTAMENTO: [
    "comportamento",
    "relacoes",
    "relacionamento",
    "psicologia",
    "habito",
    "familia",
    "maternidade",
    "emocional",
    "terapia",
    "autoconhecimento",
  ],
  "EDUCAÇÃO & SOCIEDADE": [
    "educacao",
    "escola",
    "professor",
    "ensino",
    "projeto social",
    "cidadania",
    "sociedade",
    "voluntariado",
    "inclusao",
    "instituicao",
  ],
};

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export type EditorialDirection = {
  category: string;
  matchedTerms: string[];
  alternatives: { category: string; score: number }[];
  suggestedThemes: string[];
  isFallback: boolean;
};

export function buildEditorialDirection(input: {
  area: string;
  presentation: string;
  themes: string;
  audience: string;
  goal: string;
  pitch: string;
}): EditorialDirection {
  const haystack = normalize(
    [input.area, input.presentation, input.themes, input.audience, input.goal, input.pitch].join(
      " | ",
    ),
  );

  const scored = categories.map((category) => {
    const matched = (categoryKeywords[category] ?? []).filter((term) =>
      haystack.includes(term),
    );
    return { category, score: matched.length, matched };
  });

  const ranked = [...scored].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return categories.indexOf(a.category) - categories.indexOf(b.category);
  });

  const best = ranked[0];
  const isFallback = !best || best.score === 0;

  const suggestedThemes = input.themes
    .split(/[,;\n•]+/)
    .map((theme) => theme.trim())
    .filter((theme) => theme.length > 2)
    .slice(0, 5);

  return {
    category: isFallback ? "PERSONALIDADES" : best.category,
    matchedTerms: isFallback ? [] : best.matched,
    alternatives: ranked.filter((item) => item.score > 0).slice(1, 3),
    suggestedThemes,
    isFallback,
  };
}
