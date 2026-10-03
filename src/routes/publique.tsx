import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import {
  produtos,
  comparativo,
  categoriasMateria,
  formatBRL,
  LIMITE_FOTOS_ENTREVISTA,
  LIMITE_FOTOS_MATERIA,
  type Produto,
} from "@/data/publique";

export const Route = createFileRoute("/publique")({
  head: () => ({
    meta: [
      { title: "Publique sua matéria — Revista Évoluer" },
      {
        name: "description",
        content:
          "Escolha entre Entrevista, Matéria ou Combo Évoluer e envie suas informações para a equipe redigir sua publicação.",
      },
      { property: "og:title", content: "Publique sua matéria — Revista Évoluer" },
      {
        property: "og:description",
        content: "Entrevista, Matéria ou Combo: envie sua história para a Revista Évoluer.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PubliquePage,
});

type Etapa =
  | "dados"
  | "sobreVoce"
  | "fotosEntrevista"
  | "sobreMateria"
  | "fotosMateria"
  | "contatos"
  | "revisao"
  | "resumo";

const etapasPorProduto: Record<Produto, Etapa[]> = {
  entrevista: ["dados", "sobreVoce", "fotosEntrevista", "contatos", "revisao", "resumo"],
  materia: ["dados", "sobreMateria", "fotosMateria", "contatos", "revisao", "resumo"],
  combo: [
    "dados",
    "sobreVoce",
    "fotosEntrevista",
    "sobreMateria",
    "fotosMateria",
    "contatos",
    "revisao",
    "resumo",
  ],
};

const tituloEtapa: Record<Etapa, string> = {
  dados: "Seus dados",
  sobreVoce: "Entrevista · Conte sobre você",
  fotosEntrevista: "Entrevista · Fotos",
  sobreMateria: "Matéria · Sobre o que será a matéria",
  fotosMateria: "Matéria · Fotos",
  contatos: "Contatos na publicação",
  revisao: "Revisão",
  resumo: "Resumo e envio",
};

type Campo = {
  key: string;
  label: string;
  ajuda: string;
  max: number;
  opcional?: boolean;
};

const camposEntrevista: Campo[] = [
  { key: "quemE", label: "Quem é você e o que faz hoje", ajuda: "Apresente-se como gostaria de ser apresentado(a) ao leitor.", max: 800 },
  { key: "trajetoria", label: "Sua trajetória", ajuda: "Como chegou até aqui: formação, escolhas e momentos marcantes.", max: 1200 },
  { key: "desafio", label: "Maior desafio e como superou", ajuda: "Uma situação difícil e o que você fez para atravessá-la.", max: 1000 },
  { key: "conquista", label: "Principal conquista ou diferencial", ajuda: "O que distingue o seu trabalho ou do que mais se orgulha.", max: 800 },
  { key: "mensagem", label: "Mensagem para quem vai ler", ajuda: "Um recado, conselho ou reflexão para o leitor.", max: 600 },
  { key: "extra", label: "Algo mais", ajuda: "Qualquer informação que ajude a equipe a montar a entrevista.", max: 800, opcional: true },
];

const camposMateria: Campo[] = [
  { key: "tema", label: "Tema principal", ajuda: "Em poucas linhas, qual é o assunto central da matéria.", max: 400 },
  { key: "publico", label: "Público", ajuda: "Para quem a matéria é escrita.", max: 400 },
  { key: "pontos", label: "Principais pontos", ajuda: "Os tópicos que não podem ficar de fora.", max: 1500 },
  { key: "historia", label: "Sua história ou do seu negócio ligada ao tema", ajuda: "Como a sua trajetória se relaciona com o assunto.", max: 1500 },
  { key: "dadosNumeros", label: "Dados, números ou depoimentos", ajuda: "Informações verificáveis que reforçam a matéria.", max: 1000, opcional: true },
  { key: "mensagemFinal", label: "Mensagem final", ajuda: "Como você gostaria que a matéria terminasse.", max: 600 },
];

type FotoEntrevista = { file: File; preview: string };
type FotoMateria = { file: File; preview: string; legenda: string; credito: string };

const emailSchema = z.string().trim().email().max(255);
const MAX_BYTES = 10 * 1024 * 1024;
const TIPOS_IMG = ["image/jpeg", "image/png"];
const MIN_TEXTO = 20;

function onlyDigits(v: string) {
  return v.replace(/\D/g, "");
}
function whatsappValido(v: string) {
  const d = onlyDigits(v);
  return d.length >= 10 && d.length <= 13;
}

function PubliquePage() {
  const [produto, setProduto] = useState<Produto | null>(null);
  const [idx, setIdx] = useState(0);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [dados, setDados] = useState({ nome: "", email: "", whatsapp: "", profissao: "", cidade: "" });
  const [entrevista, setEntrevista] = useState<Record<string, string>>({});
  const [materia, setMateria] = useState<Record<string, string>>({ categoria: "" });
  const [docx, setDocx] = useState<File | null>(null);
  const [fotosE, setFotosE] = useState<FotoEntrevista[]>([]);
  const [fotosM, setFotosM] = useState<FotoMateria[]>([]);
  const [capaIdx, setCapaIdx] = useState(0);
  const [contatos, setContatos] = useState({ instagram: "", site: "", whatsapp: "", email: "" });
  const [aceite, setAceite] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [avisoFoto, setAvisoFoto] = useState("");

  const info = produtos.find((p) => p.id === produto);
  const etapas = produto ? etapasPorProduto[produto] : [];
  const etapa = etapas[idx];

  const topo = () => window.scrollTo({ top: 0, behavior: "smooth" });

  function escolher(p: Produto) {
    setProduto(p);
    setIdx(0);
    setErros({});
    topo();
  }

  function validar(e: Etapa): Record<string, string> {
    const out: Record<string, string> = {};
    if (e === "dados") {
      if (dados.nome.trim().length < 3) out["nome"] = "Informe seu nome completo.";
      if (!emailSchema.safeParse(dados.email).success) out["email"] = "Informe um e-mail válido.";
      if (!whatsappValido(dados.whatsapp)) out["whatsapp"] = "Informe um WhatsApp válido com DDD.";
      if (dados.profissao.trim().length < 2) out["profissao"] = "Informe sua profissão ou empresa.";
      if (dados.cidade.trim().length < 2) out["cidade"] = "Informe sua cidade.";
    }
    if (e === "sobreVoce") {
      for (const c of camposEntrevista)
        if (!c.opcional && (entrevista[c.key] ?? "").trim().length < MIN_TEXTO)
          out[c.key] = `Escreva pelo menos ${MIN_TEXTO} caracteres.`;
    }
    if (e === "sobreMateria") {
      for (const c of camposMateria)
        if (!c.opcional && (materia[c.key] ?? "").trim().length < MIN_TEXTO)
          out[c.key] = `Escreva pelo menos ${MIN_TEXTO} caracteres.`;
      if (!materia["categoria"]) out["categoria"] = "Escolha uma categoria sugerida.";
    }
    if (e === "fotosEntrevista" && fotosE.length < 1) out["fotos"] = "Envie ao menos 1 foto.";
    if (e === "fotosMateria" && fotosM.length < 1) out["fotos"] = "Envie ao menos 1 foto.";
    if (e === "contatos") {
      const algum = Object.values(contatos).some((v) => v.trim());
      if (!algum) out["contatos"] = "Informe pelo menos um contato para a publicação.";
      if (contatos.email.trim() && !emailSchema.safeParse(contatos.email).success)
        out["cemail"] = "E-mail inválido.";
      if (contatos.whatsapp.trim() && !whatsappValido(contatos.whatsapp))
        out["cwhatsapp"] = "WhatsApp inválido.";
    }
    if (e === "resumo" && !aceite) out["aceite"] = "É preciso autorizar o uso de texto e imagens.";
    return out;
  }

  function avancar() {
    if (!etapa) return;
    const v = validar(etapa);
    setErros(v);
    if (Object.keys(v).length) return;
    setIdx((i) => Math.min(i + 1, etapas.length - 1));
    topo();
  }
  function voltar() {
    setErros({});
    if (idx === 0) {
      setProduto(null);
    } else setIdx((i) => i - 1);
    topo();
  }
  function irPara(e: Etapa) {
    const i = etapas.indexOf(e);
    if (i >= 0) {
      setIdx(i);
      topo();
    }
  }

  function filtrarImagens(files: FileList | null): File[] {
    const lista = Array.from(files ?? []);
    const ok = lista.filter((f) => TIPOS_IMG.includes(f.type) && f.size <= MAX_BYTES);
    if (ok.length < lista.length) setAvisoFoto("Use apenas JPG ou PNG de até 10 MB.");
    else setAvisoFoto("");
    return ok;
  }

  function addFotosE(files: FileList | null) {
    const ok = filtrarImagens(files);
    const livre = LIMITE_FOTOS_ENTREVISTA - fotosE.length;
    if (ok.length > livre)
      setAvisoFoto(`A entrevista aceita no máximo ${LIMITE_FOTOS_ENTREVISTA} fotos.`);
    setFotosE((p) => [
      ...p,
      ...ok.slice(0, Math.max(0, livre)).map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
  }
  function addFotosM(files: FileList | null) {
    const ok = filtrarImagens(files);
    const livre = LIMITE_FOTOS_MATERIA - fotosM.length;
    if (ok.length > livre) setAvisoFoto(`A matéria aceita no máximo ${LIMITE_FOTOS_MATERIA} fotos.`);
    setFotosM((p) => [
      ...p,
      ...ok
        .slice(0, Math.max(0, livre))
        .map((file) => ({ file, preview: URL.createObjectURL(file), legenda: "", credito: "" })),
    ]);
  }
  function trocarFotoE(i: number, files: FileList | null) {
    const [f] = filtrarImagens(files);
    if (!f) return;
    setFotosE((p) => p.map((x, j) => (j === i ? { file: f, preview: URL.createObjectURL(f) } : x)));
  }
  function trocarFotoM(i: number, files: FileList | null) {
    const [f] = filtrarImagens(files);
    if (!f) return;
    setFotosM((p) => p.map((x, j) => (j === i ? { ...x, file: f, preview: URL.createObjectURL(f) } : x)));
  }

  async function enviar() {
    if (!produto || !info) return;
    const v = validar("resumo");
    setErros(v);
    if (Object.keys(v).length) return;
    setEnviando(true);
    setErroEnvio("");
    try {
      const id = crypto.randomUUID();
      const upload = async (file: File, nome: string) => {
        const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
        const path = `${id}/${nome}.${ext}`;
        const { error } = await supabase.storage
          .from("solicitacoes")
          .upload(path, file, { contentType: file.type || undefined, upsert: false });
        if (error) throw error;
        return path;
      };
      const fotos: Record<string, unknown>[] = [];
      for (let i = 0; i < fotosE.length; i++) {
        const path = await upload(fotosE[i]!.file, `entrevista-${i + 1}`);
        fotos.push({ produto: "entrevista", papel: i === 0 ? "capa" : "foto com contatos", path });
      }
      for (let i = 0; i < fotosM.length; i++) {
        const f = fotosM[i]!;
        const path = await upload(f.file, `materia-${i + 1}`);
        fotos.push({ produto: "materia", legenda: f.legenda, credito: f.credito, capa: i === capaIdx, path });
      }
      let docxPath: string | null = null;
      if (docx) docxPath = await upload(docx, "texto-proprio");

      const respostas: Record<string, unknown> = {};
      if (produto !== "materia") respostas["entrevista"] = entrevista;
      if (produto !== "entrevista") respostas["materia"] = { ...materia, docx: docxPath };

      const { error } = await supabase.from("solicitacoes").insert({
        id,
        produto,
        valor: info.preco,
        nome: dados.nome.trim(),
        email: dados.email.trim(),
        whatsapp: dados.whatsapp.trim(),
        profissao: dados.profissao.trim(),
        cidade: dados.cidade.trim(),
        respostas: respostas as never,
        contatos: contatos as never,
        fotos: fotos as never,
        autorizacao: true,
      });
      if (error) throw error;
      setEnviado(true);
      topo();
    } catch (e) {
      console.error(e);
      setErroEnvio("Não foi possível enviar agora. Verifique sua conexão e tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-12">
        {enviado && info ? (
          <Confirmacao nome={dados.nome} link={info.pagamento} produto={info.nome} preco={info.preco} />
        ) : !produto || !etapa ? (
          <Escolha onEscolher={escolher} />
        ) : (
          <section>
            <p className="label-mono text-gold">{info?.nome} · {formatBRL(info?.preco ?? 0)}</p>
            <div className="mt-4 flex items-center justify-between gap-4">
              <h1 className="font-display text-2xl md:text-3xl">{tituloEtapa[etapa]}</h1>
              <span className="label-mono text-muted-foreground">
                Etapa {idx + 1} de {etapas.length}
              </span>
            </div>
            <Progress
              value={((idx + 1) / etapas.length) * 100}
              className="mt-4 h-1.5"
              aria-label="Progresso do envio"
            />
            {produto === "combo" && (etapa === "sobreVoce" || etapa === "sobreMateria") && (
              <p className="mt-6 border-l-2 border-gold bg-card p-4 text-sm text-muted-foreground">
                No combo, a entrevista e a matéria têm pautas diferentes e complementares. Evite repetir as
                mesmas informações nos dois blocos.
              </p>
            )}

            <div className="mt-8 space-y-6">
              {etapa === "dados" && (
                <div className="grid gap-5 md:grid-cols-2">
                  <TextField id="nome" label="Nome completo" value={dados.nome} erro={erros["nome"]}
                    onChange={(v) => setDados({ ...dados, nome: v })} max={150} />
                  <TextField id="email" label="E-mail" type="email" value={dados.email} erro={erros["email"]}
                    onChange={(v) => setDados({ ...dados, email: v })} max={255} />
                  <TextField id="whatsapp" label="WhatsApp (com DDD)" type="tel" value={dados.whatsapp}
                    erro={erros["whatsapp"]} onChange={(v) => setDados({ ...dados, whatsapp: v })} max={20}
                    placeholder="(21) 99999-9999" />
                  <TextField id="profissao" label="Profissão / empresa" value={dados.profissao}
                    erro={erros["profissao"]} onChange={(v) => setDados({ ...dados, profissao: v })} max={200} />
                  <TextField id="cidade" label="Cidade" value={dados.cidade} erro={erros["cidade"]}
                    onChange={(v) => setDados({ ...dados, cidade: v })} max={120} />
                </div>
              )}

              {etapa === "sobreVoce" && (
                <>
                  <p className="text-sm text-muted-foreground">
                    Você não precisa escrever perguntas. A equipe Évoluer monta as perguntas e respostas a partir
                    do que você contar aqui.
                  </p>
                  {camposEntrevista.map((c) => (
                    <AreaField key={c.key} campo={c} value={entrevista[c.key] ?? ""} erro={erros[c.key]}
                      onChange={(v) => setEntrevista({ ...entrevista, [c.key]: v })} />
                  ))}
                </>
              )}

              {etapa === "sobreMateria" && (
                <>
                  <p className="text-sm text-muted-foreground">
                    A equipe Évoluer redige o texto da matéria a partir destas informações.
                  </p>
                  {camposMateria.map((c) => (
                    <AreaField key={c.key} campo={c} value={materia[c.key] ?? ""} erro={erros[c.key]}
                      onChange={(v) => setMateria({ ...materia, [c.key]: v })} />
                  ))}
                  <fieldset>
                    <legend className="text-sm font-medium">Categoria sugerida</legend>
                    <div className="mt-3 flex flex-wrap gap-2" role="radiogroup">
                      {categoriasMateria.map((cat) => (
                        <button key={cat} type="button" role="radio" aria-checked={materia["categoria"] === cat}
                          onClick={() => setMateria({ ...materia, categoria: cat })}
                          className={`label-mono border px-3 py-2 transition-colors ${
                            materia["categoria"] === cat
                              ? "border-gold bg-gold text-primary-foreground"
                              : "border-border text-muted-foreground hover:border-gold hover:text-gold"
                          }`}>
                          {cat}
                        </button>
                      ))}
                    </div>
                    {erros["categoria"] && <Erro msg={erros["categoria"]} />}
                  </fieldset>
                  <div>
                    <Label htmlFor="docx">Texto próprio em .docx (opcional)</Label>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Se já tiver um texto, envie-o para a equipe usar como base.
                    </p>
                    <Input id="docx" type="file" className="mt-2"
                      accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={(e) => {
                        const f = e.target.files?.[0] ?? null;
                        if (f && (!f.name.toLowerCase().endsWith(".docx") || f.size > MAX_BYTES)) {
                          setErros({ ...erros, docx: "Envie um arquivo .docx de até 10 MB." });
                          e.target.value = "";
                          return;
                        }
                        setDocx(f);
                      }} />
                    {docx && (
                      <p className="mt-2 text-sm text-gold">
                        {docx.name}{" "}
                        <button type="button" className="underline" onClick={() => setDocx(null)}>remover</button>
                      </p>
                    )}
                    {erros["docx"] && <Erro msg={erros["docx"]} />}
                  </div>
                </>
              )}

              {etapa === "fotosEntrevista" && (
                <>
                  <p className="text-sm text-muted-foreground">
                    Envie de 1 até {LIMITE_FOTOS_ENTREVISTA} fotos (JPG ou PNG): a primeira para a capa e a
                    segunda para a página com seus contatos.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {fotosE.map((f, i) => (
                      <div key={f.preview} className="border border-border bg-card p-3">
                        <img src={f.preview} alt={`Foto ${i + 1}`} className="aspect-[4/5] w-full object-cover object-top" />
                        <p className="label-mono mt-2 text-gold">{i === 0 ? "Capa" : "Foto com contatos"}</p>
                        <div className="mt-2 flex gap-3 text-sm">
                          <TrocarBotao id={`trocaE${i}`} onFiles={(fl) => trocarFotoE(i, fl)} />
                          <button type="button" className="text-muted-foreground underline"
                            onClick={() => setFotosE((p) => p.filter((_, j) => j !== i))}>Remover</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <UploadArea id="fotosE" cheio={fotosE.length >= LIMITE_FOTOS_ENTREVISTA}
                    limite={LIMITE_FOTOS_ENTREVISTA} atual={fotosE.length} onFiles={addFotosE} />
                  {avisoFoto && <Erro msg={avisoFoto} />}
                  {erros["fotos"] && <Erro msg={erros["fotos"]} />}
                </>
              )}

              {etapa === "fotosMateria" && (
                <>
                  <p className="text-sm text-muted-foreground">
                    Envie de 1 até {LIMITE_FOTOS_MATERIA} fotos (JPG ou PNG). Quatro serão usadas na
                    diagramação e a equipe faz a escolha. Marque a sua preferida para a capa. Se tiver menos
                    fotos, pode seguir normalmente.
                  </p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {fotosM.map((f, i) => (
                      <div key={f.preview} className="border border-border bg-card p-3">
                        <img src={f.preview} alt={`Foto ${i + 1}`} className="aspect-[4/3] w-full object-cover object-top" />
                        <label className="mt-3 flex items-center gap-2 text-sm">
                          <input type="radio" name="capa" checked={capaIdx === i} onChange={() => setCapaIdx(i)}
                            className="accent-[var(--gold)]" />
                          Preferida para a capa
                        </label>
                        <Input className="mt-2" placeholder="Legenda" maxLength={200} value={f.legenda}
                          aria-label={`Legenda da foto ${i + 1}`}
                          onChange={(e) => setFotosM((p) => p.map((x, j) => (j === i ? { ...x, legenda: e.target.value } : x)))} />
                        <Input className="mt-2" placeholder="Crédito (fotógrafo)" maxLength={120} value={f.credito}
                          aria-label={`Crédito da foto ${i + 1}`}
                          onChange={(e) => setFotosM((p) => p.map((x, j) => (j === i ? { ...x, credito: e.target.value } : x)))} />
                        <div className="mt-2 flex gap-3 text-sm">
                          <TrocarBotao id={`trocaM${i}`} onFiles={(fl) => trocarFotoM(i, fl)} />
                          <button type="button" className="text-muted-foreground underline"
                            onClick={() => {
                              setFotosM((p) => p.filter((_, j) => j !== i));
                              setCapaIdx((c) => (c === i ? 0 : c > i ? c - 1 : c));
                            }}>Remover</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <UploadArea id="fotosM" cheio={fotosM.length >= LIMITE_FOTOS_MATERIA}
                    limite={LIMITE_FOTOS_MATERIA} atual={fotosM.length} onFiles={addFotosM} />
                  {avisoFoto && <Erro msg={avisoFoto} />}
                  {erros["fotos"] && <Erro msg={erros["fotos"]} />}
                </>
              )}

              {etapa === "contatos" && (
                <>
                  <p className="text-sm text-muted-foreground">
                    Estes contatos sairão na publicação. Preencha pelo menos um.
                  </p>
                  <div className="grid gap-5 md:grid-cols-2">
                    <TextField id="instagram" label="Instagram" value={contatos.instagram} placeholder="@seuperfil"
                      onChange={(v) => setContatos({ ...contatos, instagram: v })} max={100} />
                    <TextField id="site" label="Site" value={contatos.site} placeholder="www.seusite.com.br"
                      onChange={(v) => setContatos({ ...contatos, site: v })} max={200} />
                    <TextField id="cwhatsapp" label="WhatsApp" type="tel" value={contatos.whatsapp}
                      erro={erros["cwhatsapp"]} onChange={(v) => setContatos({ ...contatos, whatsapp: v })} max={20} />
                    <TextField id="cemail" label="E-mail" type="email" value={contatos.email} erro={erros["cemail"]}
                      onChange={(v) => setContatos({ ...contatos, email: v })} max={255} />
                  </div>
                  {erros["contatos"] && <Erro msg={erros["contatos"]} />}
                </>
              )}

              {etapa === "revisao" && (
                <div className="space-y-6">
                  <Bloco titulo="Seus dados" onEditar={() => irPara("dados")}>
                    <Linha k="Nome" v={dados.nome} /><Linha k="E-mail" v={dados.email} />
                    <Linha k="WhatsApp" v={dados.whatsapp} /><Linha k="Profissão / empresa" v={dados.profissao} />
                    <Linha k="Cidade" v={dados.cidade} />
                  </Bloco>
                  {produto !== "materia" && (
                    <>
                      <Bloco titulo="Entrevista · Conte sobre você" onEditar={() => irPara("sobreVoce")}>
                        {camposEntrevista.map((c) => <Linha key={c.key} k={c.label} v={entrevista[c.key] ?? ""} />)}
                      </Bloco>
                      <Bloco titulo="Entrevista · Fotos" onEditar={() => irPara("fotosEntrevista")}>
                        <Miniaturas srcs={fotosE.map((f) => f.preview)} />
                      </Bloco>
                    </>
                  )}
                  {produto !== "entrevista" && (
                    <>
                      <Bloco titulo="Matéria · Conteúdo" onEditar={() => irPara("sobreMateria")}>
                        {camposMateria.map((c) => <Linha key={c.key} k={c.label} v={materia[c.key] ?? ""} />)}
                        <Linha k="Categoria sugerida" v={materia["categoria"] ?? ""} />
                        <Linha k="Texto próprio" v={docx?.name ?? ""} />
                      </Bloco>
                      <Bloco titulo="Matéria · Fotos" onEditar={() => irPara("fotosMateria")}>
                        <Miniaturas srcs={fotosM.map((f) => f.preview)} destaque={capaIdx} />
                      </Bloco>
                    </>
                  )}
                  <Bloco titulo="Contatos na publicação" onEditar={() => irPara("contatos")}>
                    <Linha k="Instagram" v={contatos.instagram} /><Linha k="Site" v={contatos.site} />
                    <Linha k="WhatsApp" v={contatos.whatsapp} /><Linha k="E-mail" v={contatos.email} />
                  </Bloco>
                </div>
              )}

              {etapa === "resumo" && info && (
                <div className="space-y-6">
                  <div className="border border-gold/60 bg-card p-6">
                    <p className="label-mono text-gold">Produto escolhido</p>
                    <p className="mt-2 font-display text-2xl">{info.nome}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{info.resumo}</p>
                    {produto === "combo" && (
                      <p className="mt-3 text-sm text-gold">
                        Economia de R$ 49,00 sobre R$ 448,00 (Entrevista R$ 149,00 + Matéria R$ 299,00).
                      </p>
                    )}
                    <p className="mt-4 font-display text-3xl text-gold">{formatBRL(info.preco)}</p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {fotosE.length + fotosM.length} foto(s) anexada(s). O pagamento é feito após o envio.
                    </p>
                  </div>
                  <label className="flex items-start gap-3 text-sm">
                    <Checkbox checked={aceite} onCheckedChange={(v) => setAceite(v === true)} className="mt-0.5"
                      aria-describedby="aceite-erro" />
                    <span>
                      Autorizo a Revista Évoluer a usar os textos e as imagens enviados para redigir, diagramar,
                      publicar e divulgar o conteúdo, e declaro ter direito de uso sobre eles.
                    </span>
                  </label>
                  {erros["aceite"] && <Erro id="aceite-erro" msg={erros["aceite"]} />}
                  {erroEnvio && <Erro msg={erroEnvio} />}
                </div>
              )}
            </div>

            <div className="mt-10 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
              <Button variant="outline" onClick={voltar} disabled={enviando}>
                {idx === 0 ? "Trocar produto" : "Voltar"}
              </Button>
              {etapa === "resumo" ? (
                <Button onClick={enviar} disabled={enviando} size="lg">
                  {enviando ? "Enviando..." : "Enviar solicitação"}
                </Button>
              ) : (
                <Button onClick={avancar}>{etapa === "revisao" ? "Ir para o resumo" : "Continuar"}</Button>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Escolha({ onEscolher }: { onEscolher: (p: Produto) => void }) {
  return (
    <section>
      <p className="label-mono text-gold">Publique sua matéria</p>
      <h1 className="mt-3 font-display text-3xl md:text-5xl">Escolha como contar sua história</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Você envia as informações e as fotos; a equipe Évoluer redige o conteúdo e envia para sua aprovação.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {produtos.map((p) => (
          <article key={p.id}
            className={`relative flex flex-col border bg-card p-6 ${p.selo ? "border-gold" : "border-border"}`}>
            {p.selo && (
              <span className="label-mono absolute -top-3 left-6 bg-gold px-2 py-1 text-primary-foreground">
                {p.selo}
              </span>
            )}
            <h2 className="label-mono text-gold">{p.nome}</h2>
            <p className="mt-3 font-display text-3xl">{formatBRL(p.preco)}</p>
            <p className="mt-3 text-sm text-muted-foreground">{p.resumo}</p>
            <ul className="mt-5 flex-1 space-y-2 text-sm">
              {p.itens.map((it) => (
                <li key={it} className="flex gap-2"><span className="text-gold">—</span>{it}</li>
              ))}
            </ul>
            <Button className="mt-6" variant={p.selo ? "default" : "outline"} onClick={() => onEscolher(p.id)}>
              Escolher {p.id === "combo" ? "o combo" : p.id === "materia" ? "a matéria" : "a entrevista"}
            </Button>
          </article>
        ))}
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        Os produtos incluem uma rodada de ajustes antes da publicação. As peças de divulgação são entregues ao
        cliente.
      </p>
      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <caption className="label-mono mb-3 text-left text-gold">Comparativo</caption>
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-normal text-muted-foreground">Item</th>
              <th className="py-2 pr-4">Entrevista</th>
              <th className="py-2 pr-4">Matéria</th>
              <th className="py-2 text-gold">Combo</th>
            </tr>
          </thead>
          <tbody>
            {comparativo.map((r) => (
              <tr key={r.item} className="border-b border-border/60">
                <td className="py-2 pr-4 text-muted-foreground">{r.item}</td>
                {r.valores.map((v, i) => <td key={i} className="py-2 pr-4">{v}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Confirmacao({ nome, link, produto, preco }: { nome: string; link: string; produto: string; preco: number }) {
  return (
    <section className="mx-auto max-w-2xl border border-gold/60 bg-card p-8 text-center">
      <p className="label-mono text-gold">Solicitação enviada</p>
      <h1 className="mt-3 font-display text-3xl">Obrigado, {nome.split(" ")[0]}!</h1>
      <p className="mt-4 text-muted-foreground">
        Recebemos suas informações. A equipe Évoluer vai redigir o conteúdo e enviar para sua aprovação, com uma
        rodada de ajustes antes da publicação.
      </p>
      <p className="mt-6 text-sm">{produto} · <span className="text-gold">{formatBRL(preco)}</span></p>
      <p className="mt-1 text-xs text-muted-foreground">Status: aguardando pagamento</p>
      <Button asChild size="lg" className="mt-8 px-10 text-base">
        <a href={link} target="_blank" rel="noopener noreferrer">Pagar agora</a>
      </Button>
    </section>
  );
}

function TextField(props: {
  id: string; label: string; value: string; onChange: (v: string) => void;
  erro?: string; type?: string; max: number; placeholder?: string;
}) {
  return (
    <div>
      <Label htmlFor={props.id}>{props.label}</Label>
      <Input id={props.id} type={props.type ?? "text"} value={props.value} maxLength={props.max}
        placeholder={props.placeholder} className="mt-2" aria-invalid={!!props.erro}
        aria-describedby={props.erro ? `${props.id}-erro` : undefined}
        onChange={(e) => props.onChange(e.target.value)} />
      {props.erro && <Erro id={`${props.id}-erro`} msg={props.erro} />}
    </div>
  );
}

function AreaField({ campo, value, onChange, erro }: {
  campo: Campo; value: string; onChange: (v: string) => void; erro?: string;
}) {
  return (
    <div>
      <Label htmlFor={campo.key}>
        {campo.label} {campo.opcional && <span className="text-muted-foreground">(opcional)</span>}
      </Label>
      <p className="mt-1 text-xs text-muted-foreground">{campo.ajuda}</p>
      <Textarea id={campo.key} value={value} maxLength={campo.max} rows={4} className="mt-2"
        aria-invalid={!!erro} aria-describedby={erro ? `${campo.key}-erro` : undefined}
        onChange={(e) => onChange(e.target.value)} />
      <div className="mt-1 flex justify-between gap-2">
        {erro ? <Erro id={`${campo.key}-erro`} msg={erro} /> : <span />}
        <span className="label-mono text-muted-foreground">{value.length}/{campo.max}</span>
      </div>
    </div>
  );
}

function UploadArea({ id, cheio, limite, atual, onFiles }: {
  id: string; cheio: boolean; limite: number; atual: number; onFiles: (f: FileList | null) => void;
}) {
  if (cheio)
    return (
      <p className="border border-dashed border-border p-4 text-sm text-muted-foreground" role="status">
        Limite de {limite} fotos atingido. Remova uma foto para adicionar outra.
      </p>
    );
  return (
    <label htmlFor={id}
      className="block cursor-pointer border border-dashed border-gold/60 p-6 text-center text-sm hover:bg-card">
      <span className="text-gold">Adicionar fotos</span>{" "}
      <span className="text-muted-foreground">({atual}/{limite} · JPG ou PNG, até 10 MB)</span>
      <input id={id} type="file" accept="image/jpeg,image/png" multiple className="sr-only"
        onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
    </label>
  );
}

function TrocarBotao({ id, onFiles }: { id: string; onFiles: (f: FileList | null) => void }) {
  return (
    <label htmlFor={id} className="cursor-pointer text-gold underline">
      Trocar
      <input id={id} type="file" accept="image/jpeg,image/png" className="sr-only"
        onChange={(e) => { onFiles(e.target.files); e.target.value = ""; }} />
    </label>
  );
}

function Bloco({ titulo, onEditar, children }: { titulo: string; onEditar: () => void; children: React.ReactNode }) {
  return (
    <div className="border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="label-mono text-gold">{titulo}</h2>
        <button type="button" onClick={onEditar} className="text-sm text-gold underline">Editar</button>
      </div>
      <dl className="mt-4 space-y-3 text-sm">{children}</dl>
    </div>
  );
}

function Linha({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="whitespace-pre-line break-words">{v.trim() || "—"}</dd>
    </div>
  );
}

function Miniaturas({ srcs, destaque }: { srcs: string[]; destaque?: number }) {
  return (
    <div className="flex flex-wrap gap-3">
      {srcs.map((s, i) => (
        <img key={s} src={s} alt={`Foto ${i + 1}`}
          className={`h-20 w-20 object-cover object-top ${destaque === i ? "ring-2 ring-gold" : ""}`} />
      ))}
    </div>
  );
}

function Erro({ msg, id }: { msg: string; id?: string }) {
  return <p id={id} role="alert" className="mt-1 text-sm text-destructive">{msg}</p>;
}
