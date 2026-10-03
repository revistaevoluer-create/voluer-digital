export type Produto = "entrevista" | "materia" | "combo";

export type ProdutoInfo = {
  id: Produto;
  nome: string;
  preco: number;
  resumo: string;
  itens: string[];
  selo?: string;
  pagamento: string;
};

export const produtos: ProdutoInfo[] = [
  {
    id: "entrevista",
    nome: "ENTREVISTA ÉVOLUER",
    preco: 149,
    resumo:
      "2 páginas: capa + uma página de entrevista em perguntas e respostas (4 a 5 perguntas) + uma foto da pessoa com os contatos.",
    itens: [
      "PDF da publicação",
      "Publicação no portal",
      "Presença na biblioteca",
      "Capa em imagem",
      "1 story",
      "Até 2 fotos",
    ],
    pagamento: "https://www.asaas.com/c/zw9b8a0skcrzdof0",
  },
  {
    id: "materia",
    nome: "MATÉRIA ÉVOLUER",
    preco: 299,
    resumo:
      "6 páginas: capa, quatro páginas internas e contracapa, com 4 fotos na diagramação.",
    itens: [
      "PDF da publicação",
      "Publicação no portal",
      "Presença na biblioteca",
      "Capa em imagem",
      "Carrossel de 5 cards",
      "3 stories",
      "Até 8 fotos enviadas",
    ],
    pagamento: "https://www.asaas.com/c/a7y5riti9tws5ckh",
  },
  {
    id: "combo",
    nome: "COMBO MATÉRIA + ENTREVISTA",
    preco: 399,
    selo: "Mais vantagem para você",
    resumo:
      "Os dois produtos completos, com pautas complementares, capas próprias e duas publicações no portal.",
    itens: [
      "Tudo da Entrevista Évoluer",
      "Tudo da Matéria Évoluer",
      "Pautas complementares",
      "Capas próprias",
      "Duas publicações no portal",
      "Economia de R$ 49,00 sobre R$ 448,00",
    ],
    pagamento: "https://www.asaas.com/c/8xkfsz6sp86x2u7i",
  },
];

export const comparativo: { item: string; valores: [string, string, string] }[] = [
  { item: "Páginas", valores: ["2", "6", "2 + 6"] },
  { item: "Formato", valores: ["Perguntas e respostas", "Reportagem", "Os dois"] },
  { item: "Fotos enviadas", valores: ["Até 2", "Até 8", "Até 2 + até 8"] },
  { item: "Capa em imagem", valores: ["1", "1", "2"] },
  { item: "Carrossel", valores: ["—", "5 cards", "5 cards"] },
  { item: "Stories", valores: ["1", "3", "4"] },
  { item: "Publicações no portal", valores: ["1", "1", "2"] },
  { item: "Valor", valores: ["R$ 149,00", "R$ 299,00", "R$ 399,00"] },
];

export const categoriasMateria = [
  "Personalidades",
  "Carreiras",
  "Negócios",
  "Tecnologia & Inovação",
  "Lifestyle",
  "Cultura",
];

export const LIMITE_FOTOS_ENTREVISTA = 2;
export const LIMITE_FOTOS_MATERIA = 8;

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
