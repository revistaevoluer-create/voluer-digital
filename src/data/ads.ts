import editoraJuridis from "@/assets/editora-juridis.jpg.asset.json";

export type Ad = {
  /** Nome do anunciante (usado no texto alternativo da imagem) */
  advertiser: string;
  /** Imagem da publicidade */
  image: string;
  /** Site, rede social ou WhatsApp do anunciante */
  href: string;
};

/**
 * Todo espaço publicitário com imagem precisa ter um destino (href).
 * Sem href, o espaço é exibido como reservado, sem link.
 */
export const topAd: Ad = {
  advertiser: "Editora Juridis",
  image: editoraJuridis.url,
  href: "",
};
