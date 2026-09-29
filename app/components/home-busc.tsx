"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { TIPOS_DE_IMOVEL, type PropertyType } from "@/app/lib/property";
import { buildAnnouncementsQuery } from "@/app/services/announcements.service";
import { useBairros, useCidades } from "@/app/hooks/use-locations";
import { CampoComSugestoes } from "./campo-com-sugestoes";

/** A cidade onde o produto começa. Campo digitável: só o valor inicial. */
const CIDADE_INICIAL = "João Pessoa";

/** Ausência de filtro, não um valor: o seletor não nasce ligado. */
const QUALQUER_TIPO = "";

/**
 * Primeiro viewport da home.
 *
 * A fotografia e a unica fonte de luz da tela e por isso ocupa a sangria
 * inteira, sem card por cima: o mundo visual proibe foto dentro de caixa
 * sombreada. Formulario a esquerda, manchete a direita, e a foto aparecendo
 * entre os dois.
 *
 * A porta de entrada pergunta tres coisas: onde, em que bairro e que tipo.
 * Preco e o resto do detalhe moram em /imoveis, e o termo livre tambem — ele
 * nao deixou de existir no produto, deixou de ser a primeira pergunta.
 *
 * A home nao consulta acervo nenhum: ela so navega.
 */
export default function BuscaHero() {
  const router = useRouter();

  const [cidade, setCidade] = useState(CIDADE_INICIAL);
  const [bairro, setBairro] = useState("");
  const [tipo, setTipo] = useState<PropertyType | typeof QUALQUER_TIPO>(
    QUALQUER_TIPO,
  );

  /*
    As sugestões são o que existe no acervo. Falha ao carregar não bloqueia
    nada: `data` fica indefinido, a lista vem vazia e o que foi digitado
    continua sendo enviado ao submeter.
  */
  const cidades = useCidades();
  const bairros = useBairros(cidade);

  function buscar(evento: React.FormEvent) {
    evento.preventDefault();

    // buildAnnouncementsQuery ja omite campo em branco, que e a mesma regra
    // que o servidor aplica: ausente nao restringe nada.
    const consulta = buildAnnouncementsQuery({
      city: cidade,
      neighborhood: bairro,
      type: tipo === QUALQUER_TIPO ? undefined : tipo,
    });

    router.push(`/imoveis${consulta}`);
  }

  /*
    Formulário à esquerda, manchete à direita, sobre a mesma fotografia.

    O fio âmbar de horizonte saiu daqui: ele separava céu de chão numa
    composição empilhada, e neste arranjo lado a lado não separa nada. O âmbar
    continua no botão e na marca de verificação; perde só o papel estrutural,
    que esta composição não tem onde exercer.
  */
  return (
    <section className="relative flex min-h-[88vh] items-center overflow-hidden">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/image/register.jpg"
          alt=""
          className="revelar-luz h-full w-full object-cover object-[50%_42%]"
        />

        {/*
          Dois véus, e cada um resolve um problema diferente.

          O vertical assenta a foto no chão índigo em cima e embaixo. O
          horizontal escurece as duas bordas e deixa o meio respirar: agora há
          conteúdo dos dois lados, e a fotografia fica sendo a luz que passa
          entre eles em vez de disputar espaço com um dos dois.
        */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(12,18,32,0.72) 0%, rgba(12,18,32,0.34) 40%, rgba(12,18,32,0.52) 72%, #0C1220 100%)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(12,18,32,0.9) 0%, rgba(12,18,32,0.55) 32%, rgba(12,18,32,0.3) 50%, rgba(12,18,32,0.68) 74%, rgba(12,18,32,0.88) 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-20">
        {/*
          Os campos vão empilhados, um por linha: onde, em que bairro, que
          tipo, e então a ação.
        */}
        <form
          onSubmit={buscar}
          className="order-2 flex flex-col gap-4 lg:order-1"
        >
          <CampoComSugestoes
            id="busca-cidade"
            name="city"
            rotulo="CIDADE"
            valor={cidade}
            onChange={setCidade}
            sugestoes={cidades.data ?? []}
            placeholder="Onde você procura"
          />

          <CampoComSugestoes
            id="busca-bairro"
            name="neighborhood"
            rotulo="BAIRRO"
            valor={bairro}
            onChange={setBairro}
            sugestoes={bairros.data ?? []}
            placeholder="Qualquer bairro"
          />

          <div>
            <label
              htmlFor="busca-tipo"
              className="mb-2 block text-xs tracking-[0.1em] text-muted-foreground"
            >
              TIPO
            </label>

            <select
              id="busca-tipo"
              name="type"
              value={tipo}
              onChange={(evento) =>
                setTipo(
                  evento.target.value as PropertyType | typeof QUALQUER_TIPO,
                )
              }
              className="min-h-14 w-full border border-border bg-card px-4 text-lg outline-none"
            >
              <option value={QUALQUER_TIPO}>Qualquer tipo</option>

              {TIPOS_DE_IMOVEL.map(({ valor, rotulo }) => (
                <option key={valor} value={valor}>
                  {rotulo}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="flex min-h-14 items-center justify-center gap-2 bg-primary px-10 font-medium text-primary-foreground transition-colors hover:bg-brand-light"
          >
            <Search className="h-5 w-5" aria-hidden />
            Buscar
          </button>
        </form>

        <div className="order-1 lg:order-2">
          <h1 className="max-w-[20ch] font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[0.94]">
            Toda imobiliária aqui passou por uma pessoa antes de passar por
            você.
          </h1>

          <p className="mt-7 max-w-[56ch] text-lg leading-relaxed text-foreground/85">
            CRECI conferido, razão social conferida, responsável legal
            conferido. Quem não passa, não publica. E quem vende o próprio
            imóvel tem uma equipe do lado.
          </p>
        </div>
      </div>
    </section>
  );
}
