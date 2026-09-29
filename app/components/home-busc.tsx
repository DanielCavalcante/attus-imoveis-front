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
 * sombreada. O fio ambar no pe da foto e o horizonte — o corte entre o ceu
 * (fotografia) e o chao (interface).
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

  return (
    <section className="relative flex min-h-[88vh] flex-col justify-end overflow-hidden">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/image/register.jpg"
          alt=""
          className="revelar-luz h-full w-full object-cover object-[50%_42%]"
        />

        {/*
          Dois veus, e cada um resolve um problema diferente.

          O vertical assenta a foto no chao indigo. O lateral existe porque a
          manchete caia direto sobre o assunto da foto: sem ele o texto disputa
          o mesmo espaco que os rostos e nenhum dos dois ganha. Com ele a luz
          passa a vir da direita e a tipografia ganha chao proprio a esquerda.
        */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(12,18,32,0.86) 0%, rgba(12,18,32,0.28) 38%, rgba(12,18,32,0.58) 66%, #0C1220 100%)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(12,18,32,0.88) 0%, rgba(12,18,32,0.62) 34%, rgba(12,18,32,0) 68%)",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6">
        <h1 className="max-w-[22ch] font-display text-[clamp(2.5rem,7vw,5.5rem)] font-semibold leading-[0.94]">
          Toda imobiliária aqui passou por uma pessoa antes de passar por você.
        </h1>

        <p className="mt-7 max-w-[60ch] text-lg leading-relaxed text-foreground/85">
          CRECI conferido, razão social conferida, responsável legal conferido.
          Quem não passa, não publica. E quem vende o próprio imóvel tem uma
          equipe do lado.
        </p>
      </div>

      <div className="relative">
        <div className="horizonte" />

        <form
          onSubmit={buscar}
          className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_1fr_14rem_auto] lg:items-end lg:gap-5"
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
                setTipo(evento.target.value as PropertyType | typeof QUALQUER_TIPO)
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
      </div>
    </section>
  );
}
