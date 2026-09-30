"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { TIPOS_DE_IMOVEL, type PropertyType } from "@/app/lib/property";
import { buildAnnouncementsQuery } from "@/app/services/announcements.service";
import { useBairros, useCidades } from "@/app/hooks/use-locations";
import { CampoComSugestoes } from "./campo-com-sugestoes";
import { CIDADE_PADRAO } from "../lib/cidade";

/** A cidade onde o produto começa. Campo digitável: só o valor inicial. */
const CIDADE_INICIAL = CIDADE_PADRAO;

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

  /**
   * Trocar a cidade zera o bairro.
   *
   * Sem isso um bairro de João Pessoa ficaria preso no filtro depois de a
   * pessoa mudar para Recife, e a busca voltaria vazia sem explicar por quê.
   */
  function trocarCidade(nova: string) {
    setCidade(nova);

    if (bairro) setBairro("");
  }

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
        <div className="veu-vertical absolute inset-0" />

        <div className="veu-lateral absolute inset-0" />
      </div>

      {/*
        No celular a ordem é manchete, busca, e só depois o parágrafo de apoio.

        Com o parágrafo antes do formulário, o botão "Buscar" começava em 929px
        numa dobra de 844: a ação da porta de entrada ficava fora da tela. O
        parágrafo é detalhe e pode esperar uma rolagem; o botão não.

        No desktop nada disso se aplica — lá são duas colunas, e a colocação
        explícita de linha e coluna recompõe manchete e parágrafo juntos à
        direita, com o formulário à esquerda.
      */}
      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-8 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:grid-rows-[auto_auto] lg:gap-x-20 lg:gap-y-7 lg:py-24">
        <h1 className="order-1 max-w-[20ch] font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[0.94] lg:order-none lg:col-start-2 lg:row-start-1 lg:self-end">
          Toda imobiliária aqui passou por uma pessoa antes de passar por você.
        </h1>

        <form
          onSubmit={buscar}
          className="order-2 flex flex-col gap-4 lg:order-none lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-center"
        >
          <CampoComSugestoes
            id="busca-cidade"
            name="city"
            rotulo="CIDADE"
            valor={cidade}
            onChange={trocarCidade}
            sugestoes={cidades.data ?? []}
            placeholder="Onde você procura"
          />

          {/*
            Estrito: o bairro sai da lista, e só. A cidade continua livre logo
            acima, porque só João Pessoa tem catálogo — travar a cidade numa
            lista impediria procurar em qualquer outra.
          */}
          <CampoComSugestoes
            id="busca-bairro"
            name="neighborhood"
            rotulo="BAIRRO"
            valor={bairro}
            onChange={setBairro}
            sugestoes={bairros.data ?? []}
            placeholder="Qualquer bairro"
            estrito
            desabilitado={!cidade.trim()}
            motivoDesabilitado="Escolha a cidade primeiro"
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

        <p className="order-3 max-w-[56ch] text-lg leading-relaxed text-foreground/85 lg:order-none lg:col-start-2 lg:row-start-2 lg:self-start">
          CRECI conferido, razão social conferida, responsável legal conferido.
          Quem não passa, não publica. E quem vende o próprio imóvel tem uma
          equipe do lado.
        </p>
      </div>
    </section>
  );
}
