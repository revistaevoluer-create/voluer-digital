import heroNegocios from "@/assets/hero-negocios.jpg";
import artSaude from "@/assets/art-saude.jpg";
import artModa from "@/assets/art-moda.jpg";
import artTecnologia from "@/assets/art-tecnologia.jpg";
import artEsporte from "@/assets/art-esporte.jpg";
import artCinema from "@/assets/art-cinema.jpg";
import nairSaboia from "@/assets/nair-saboia-hero-reframed.jpg.asset.json";

export const categories = [
  "PERSONALIDADES",
  "CARREIRAS",
  "NEGÓCIOS",
  "TECNOLOGIA & INOVAÇÃO",
  "LIFESTYLE",
  "CULTURA",
  "COMPORTAMENTO",
  "EDUCAÇÃO & SOCIEDADE",
];

export const categoryDescriptions: Record<string, string> = {
  PERSONALIDADES: "Pessoas que têm uma trajetória, uma história ou algo relevante para contar.",
  CARREIRAS:
    "Profissões, trajetórias profissionais, mudanças de carreira, conquistas, desafios e novos caminhos.",
  NEGÓCIOS:
    "Empreendedorismo, empresas, liderança, gestão, marcas e histórias de quem construiu algo.",
  "TECNOLOGIA & INOVAÇÃO":
    "Inteligência artificial, transformação digital, novas ferramentas, ideias, soluções e pessoas que estão fazendo diferente.",
  LIFESTYLE:
    "Estilo de vida, experiências, escolhas, viagens, gastronomia, moda, beleza, bem-estar e tendências do cotidiano.",
  CULTURA:
    "Livros, literatura, arte, música, cinema, eventos, manifestações culturais e pessoas que movimentam a cultura.",
  COMPORTAMENTO:
    "Relações, hábitos, tendências sociais, mudanças de comportamento e temas que ajudam a compreender a sociedade.",
  "EDUCAÇÃO & SOCIEDADE":
    "Educação, projetos sociais, cidadania, instituições, iniciativas transformadoras e temas relevantes para a vida coletiva.",
};

export const editorialPillars = ["Negócios", "Carreira", "Liderança", "Personalidade"];

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export type Article = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readingTime: string;
  image: string;
  body: string[];
};

export const articles: Article[] = [
  {
    slug: "do-direito-a-psicologia-a-trajetoria-de-nair-saboia",
    category: "CARREIRAS",
    title: "Do Direito à Psicologia: a trajetória de Nair Saboia",
    excerpt:
      "Na prática do Direito de Família, Nair Saboia percebeu que muitos conflitos que chegam ao Judiciário carregam dores emocionais que a aplicação da lei, sozinha, não consegue resolver.",
    author: "Revista Évoluer",
    date: "8 set. 2026",
    readingTime: "8 min",
    image: nairSaboia.url,
    body: [
      "Divórcios, disputas de guarda, partilhas e outros conflitos familiares frequentemente revelam algo que vai além da controvérsia jurídica: rupturas, medos, ressentimentos e histórias que ainda não foram elaboradas.",
      "Foi nesse cotidiano que Nair compreendeu que o advogado pode exercer um papel que ultrapassa o domínio técnico da legislação. Identificar a dimensão emocional do conflito permite construir caminhos mais conscientes e, muitas vezes, evitar que a disputa se transforme em um litígio ainda mais doloroso.",
      "“Muitas vezes, o que chega ao balcão do Judiciário como um pedido de partilha ou de pensão é, na verdade, um pedido de socorro emocional ou a dor de uma ruptura não elaborada.”",
      "Para ampliar essa perspectiva, Nair ingressou na faculdade de Psicologia. A proposta não é abandonar a advocacia, mas somar conhecimentos e construir uma ponte entre a razão jurídica e uma escuta mais sensível.",
      "A nova etapa dessa trajetória ganha forma com o projeto Atendimento Conectado, concebido como um modelo de consultoria jurídica voltado à gestão de conflitos emocionais no período pré-litígio. A iniciativa pretende acolher famílias em momentos de crise antes mesmo do ajuizamento de uma ação, criando um espaço seguro para que os aspectos jurídicos e humanos do conflito sejam compreendidos com mais profundidade.",
      "Com a formação em Psicologia em andamento, Nair busca qualificar ainda mais sua atuação: mediar acordos com empatia, compreender melhor as necessidades envolvidas e ajudar seus clientes a atravessar transições familiares dolorosas com estabilidade e dignidade.",
      "Sua trajetória reafirma uma premissa essencial: o Direito é feito por pessoas e para pessoas. E, em sua forma mais nobre, exige conhecimento, responsabilidade e, sobretudo, humanidade.",
    ],
  },
  {
    slug: "o-poder-silencioso-das-mulheres-que-redesenham-o-capitalismo-brasileiro",
    category: "NEGÓCIOS",
    title: "O poder silencioso das mulheres que redesenham o capitalismo brasileiro",
    excerpt:
      "De Minas Gerais ao Nordeste, líderes femininas constroem impérios longe dos holofotes e provam que a nova geração de executivas joga com outras regras.",
    author: "Redação Évoluer",
    date: "7 set. 2026",
    readingTime: "14 min",
    image: heroNegocios,
    body: [
      "Elas não aparecem nos rankings de bilionários nem disputam capas de revistas de negócios. Ainda assim, comandam operações que movimentam cadeias inteiras de fornecedores, empregam milhares de pessoas e definem o ritmo de setores que, até pouco tempo, eram descritos como territórios masculinos.",
      "A reportagem da Évoluer ouviu executivas de cinco estados para entender o que muda quando a liderança deixa de ser performance e passa a ser método: decisões mais lentas, times mais estáveis e uma leitura de risco que privilegia a continuidade sobre o espetáculo.",
      "O resultado é um capitalismo menos ruidoso, mas mais resiliente — e uma geração de gestoras que aprendeu a transformar invisibilidade em vantagem competitiva.",
    ],
  },
  {
    slug: "a-nova-medicina-preventiva-chega-ao-interior",
    category: "LIFESTYLE",
    title: "A nova medicina preventiva chega ao interior",
    excerpt:
      "Programas de rastreamento precoce começam a mudar indicadores em cidades com menos de 50 mil habitantes.",
    author: "Redação Évoluer",
    date: "6 set. 2026",
    readingTime: "8 min",
    image: artSaude,
    body: [
      "Longe dos grandes centros, equipes reduzidas apostam em diagnóstico precoce como principal ferramenta de saúde pública.",
      "A aposta é simples e difícil ao mesmo tempo: chegar antes do sintoma. Os primeiros números indicam queda em internações evitáveis.",
    ],
  },
  {
    slug: "o-minimalismo-brasileiro-que-conquistou-as-passarelas",
    category: "LIFESTYLE",
    title: "O minimalismo brasileiro que conquistou as passarelas",
    excerpt:
      "Alfaiataria leve, tecidos naturais e uma paleta contida definem a estação que aposta na permanência.",
    author: "Redação Évoluer",
    date: "5 set. 2026",
    readingTime: "6 min",
    image: artModa,
    body: [
      "A estação abandona o excesso e se organiza em torno de peças que atravessam anos, não temporadas.",
      "Estilistas falam de um luxo silencioso: caimento impecável, materiais honestos e nenhuma pressa.",
    ],
  },
  {
    slug: "inteligencia-artificial-nas-redacoes-brasileiras",
    category: "TECNOLOGIA & INOVAÇÃO",
    title: "Inteligência artificial nas redações brasileiras",
    excerpt:
      "Editores discutem os limites entre apuração humana e automação na produção de notícias.",
    author: "Redação Évoluer",
    date: "5 set. 2026",
    readingTime: "9 min",
    image: artTecnologia,
    body: [
      "A tecnologia acelerou tarefas repetitivas, mas escancarou uma pergunta antiga: quem responde pelo que é publicado?",
      "Nas redações ouvidas pela Évoluer, a resposta converge para o mesmo ponto — a assinatura continua sendo humana.",
    ],
  },
  {
    slug: "selecao-feminina-garante-vaga-na-final",
    category: "CULTURA",
    title: "Seleção feminina garante vaga na final do Sul-Americano",
    excerpt: "Vitória construída no segundo tempo coloca o Brasil de volta à decisão do torneio.",
    author: "Redação Évoluer",
    date: "4 set. 2026",
    readingTime: "5 min",
    image: artEsporte,
    body: [
      "Sob chuva forte, a equipe brasileira controlou o meio-campo e resolveu a partida em dez minutos decisivos.",
      "A final acontece no próximo fim de semana, com transmissão confirmada para todo o país.",
    ],
  },
  {
    slug: "filme-brasileiro-estreia-em-cannes",
    category: "CULTURA",
    title: "Filme brasileiro estreia em Cannes e conquista prêmio de documentário",
    excerpt: "Produção independente filmada no sertão emociona a crítica internacional.",
    author: "Redação Évoluer",
    date: "3 set. 2026",
    readingTime: "7 min",
    image: artCinema,
    body: [
      "Rodado ao longo de quatro anos, o documentário acompanha três famílias e a travessia de uma seca histórica.",
      "A premiação abre caminho para uma distribuição nacional ainda neste ano.",
    ],
  },
];

export const featured = articles[0]!;
export const secondary = articles.slice(1, 4);
export const latest = articles.slice(1);
