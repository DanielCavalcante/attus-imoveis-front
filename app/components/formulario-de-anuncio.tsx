"use client";

import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ChevronDown, Save } from "lucide-react";

import {
  announcementSchema,
  AnnouncementFormData,
} from "../schemas/announcement";
import { TIPOS_DE_IMOVEL } from "../lib/property";
import { CampoDeImagem } from "./campo-de-imagem";
import { CampoComSugestoes } from "./campo-com-sugestoes";
import { useBairros } from "../hooks/use-locations";
import { useEnderecoPorCep } from "../hooks/use-endereco";

const CAMPO =
  "min-h-13 w-full border border-input bg-card px-4 text-base outline-none placeholder:text-muted-foreground";

const ROTULO = "mb-2 block text-sm text-foreground/85";

type Props = {
  /** O que preencher ao abrir. Vazio na criação, o anúncio na edição. */
  valoresIniciais?: Partial<AnnouncementFormData>;
  fotosIniciais?: string[];
  capaInicial?: number;
  rotuloDoBotao: string;
  rotuloSalvando: string;
  /** Texto abaixo do botão, quando a tela tem algo a dizer ali. */
  rodape?: string;
  /** Lança em caso de falha: a mensagem vira toast e o formulário fica de pé. */
  aoSalvar: (dados: AnnouncementFormData) => Promise<void>;
};

/**
 * O formulário do anúncio, usado para criar e para editar.
 *
 * Um só, e não dois. Antes a edição era outro arquivo, com `Card`,
 * `rounded-3xl` e `shadow-sm` -- vocabulário de outro projeto -- e ficou para
 * trás a ponto de não carregar o anúncio e não salvar nada. Toda regra nova
 * nascia duas vezes, e uma das duas era esquecida.
 */
export function FormularioDeAnuncio({
  valoresIniciais,
  fotosIniciais = [],
  capaInicial = 0,
  rotuloDoBotao,
  rotuloSalvando,
  rodape,
  aoSalvar,
}: Props) {
  const [enviandoImagem, setEnviandoImagem] = useState(false);

  /** As fotos vivem aqui, e a capa vai espelhada para o campo `image`. */
  const [fotos, setFotos] = useState<string[]>(fotosIniciais);
  const [capa, setCapa] = useState(capaInicial);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { propertyType: "HOUSE", reason: "SALE", ...valoresIniciais },
  });

  /**
   * O CEP preenche o resto do endereço.
   *
   * Só o que o servidor sabe entra; campo que ele devolve vazio fica como
   * está, porque cidade com CEP único não tem bairro e apagar o que a pessoa
   * digitou seria pior que não preencher.
   */
  const endereco = useEnderecoPorCep((achado) => {
    const preencher = (campo: "street" | "neighborhood" | "city" | "state", valor?: string | null) => {
      if (valor) setValue(campo, valor, { shouldValidate: true });
    };

    preencher("street", achado.logradouro);
    preencher("neighborhood", achado.bairro);
    preencher("city", achado.cidade);
    preencher("state", achado.uf);
  });

  // As sugestões de bairro seguem a cidade que está no formulário.
  const cidade = watch("city");
  const bairro = watch("neighborhood");
  const bairros = useBairros(cidade ?? "");

  async function onSubmit(data: AnnouncementFormData) {
    try {
      await aoSalvar({ ...data, imagens: fotos, capa });
    } catch (error) {
      console.error(error);

      const mensagem =
        error instanceof Error && error.message
          ? error.message
          : "Erro ao criar anúncio";

      toast.error(mensagem);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <form onSubmit={handleSubmit(onSubmit)} className="pt-10">
        <Secao
          titulo="O imóvel"
          aberturaInicial
          temErro={Boolean(
            errors.title ||
            errors.description ||
            errors.propertyType ||
            errors.reason,
          )}
        >
          <div className="sm:col-span-2">
            <label htmlFor="title" className={ROTULO}>
              Título do anúncio
            </label>

            <input
              {...register("title")}
              id="title"
              className={CAMPO}
              placeholder="Apartamento com varanda integrada"
            />

            <Erro>{errors.title?.message}</Erro>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="description" className={ROTULO}>
              Descrição
            </label>

            <textarea
              {...register("description")}
              id="description"
              rows={6}
              className={`${CAMPO} py-3 leading-relaxed`}
              placeholder="Conte o que a foto não mostra: o andar, a vista, o que fica."
            />

            <Erro>{errors.description?.message}</Erro>
          </div>

          <div>
            <label htmlFor="propertyType" className={ROTULO}>
              Tipo do imóvel
            </label>

            <select
              {...register("propertyType")}
              id="propertyType"
              className={CAMPO}
            >
              {TIPOS_DE_IMOVEL.map(({ valor, rotulo }) => (
                <option key={valor} value={valor}>
                  {rotulo}
                </option>
              ))}
            </select>

            <Erro>{errors.propertyType?.message}</Erro>
          </div>

          <div>
            <label htmlFor="reason" className={ROTULO}>
              Finalidade
            </label>

            <select {...register("reason")} id="reason" className={CAMPO}>
              <option value="SALE">Venda</option>
              <option value="RENT">Aluguel</option>
            </select>

            <Erro>{errors.reason?.message}</Erro>
          </div>
        </Secao>

        <Secao
          titulo="Medidas e preço"
          temErro={Boolean(
            errors.rooms || errors.bathRooms || errors.area || errors.price,
          )}
        >
          <Numero
            id="rooms"
            rotulo="Quartos"
            registro={register("rooms", { valueAsNumber: true })}
            erro={errors.rooms?.message}
            placeholder="3"
          />

          <Numero
            id="bathRooms"
            rotulo="Banheiros"
            registro={register("bathRooms", { valueAsNumber: true })}
            erro={errors.bathRooms?.message}
            placeholder="2"
          />

          <Numero
            id="area"
            rotulo="Área (m²)"
            registro={register("area", { valueAsNumber: true })}
            erro={errors.area?.message}
            placeholder="112"
          />

          <Numero
            id="price"
            rotulo="Preço (R$)"
            registro={register("price", { valueAsNumber: true })}
            erro={errors.price?.message}
            placeholder="890000"
            step="0.01"
          />
        </Secao>

        <Secao
          titulo="Onde fica"
          temErro={Boolean(
            errors.cep ||
            errors.street ||
            errors.streetNumber ||
            errors.city ||
            errors.state ||
            errors.complement,
          )}
        >
          <div>
            <label htmlFor="cep" className={ROTULO}>
              CEP
            </label>

            <input
              {...register("cep", {
                onChange: (evento) => endereco.aoDigitar(evento.target.value),
              })}
              id="cep"
              className={CAMPO}
              placeholder="58038-000"
              aria-describedby="estado-do-cep"
            />

            {/*
              `role="status"` para o preenchimento ser anunciado a quem usa
              leitor de tela: quatro campos mudam de valor sem a pessoa tocar
              em nenhum deles, e sem isso ela não fica sabendo.
            */}
            <p id="estado-do-cep" role="status" className="mt-2 text-sm text-muted-foreground">
              {endereco.buscando && "Buscando o endereço…"}
              {endereco.naoEncontrado &&
                "Não encontramos esse CEP. Preencha o endereço à mão."}
            </p>

            <Erro>{errors.cep?.message}</Erro>
          </div>

          <div>
            <label htmlFor="street" className={ROTULO}>
              Rua
            </label>

            <input
              {...register("street")}
              id="street"
              className={CAMPO}
              placeholder="Avenida João Maurício"
            />

            <Erro>{errors.street?.message}</Erro>
          </div>

          <div>
            <label htmlFor="streetNumber" className={ROTULO}>
              Número
            </label>

            <input
              {...register("streetNumber", { valueAsNumber: true })}
              id="streetNumber"
              type="number"
              className={CAMPO}
              placeholder="1200"
            />

            <Erro>{errors.streetNumber?.message}</Erro>
          </div>

          <div>
            <label htmlFor="complement" className={ROTULO}>
              Complemento
            </label>

            <input
              {...register("complement")}
              id="complement"
              className={CAMPO}
              placeholder="Apartamento 203"
            />

            <Erro>{errors.complement?.message}</Erro>
          </div>

          <div>
            <label htmlFor="city" className={ROTULO}>
              Cidade
            </label>

            <input
              {...register("city")}
              id="city"
              className={CAMPO}
              placeholder="João Pessoa"
            />

            <Erro>{errors.city?.message}</Erro>
          </div>

          {/*
            Sugestões, sem modo estrito.

            Estrito trancaria quem anuncia em cidade sem catálogo: a lista dela
            sai do `distinct` sobre os anúncios, que começa vazia, e a pessoa
            não teria como informar bairro nenhum. É o oposto do que este campo
            existe para resolver.
          */}
          <div>
            <input type="hidden" {...register("neighborhood")} />

            <CampoComSugestoes
              id="neighborhood"
              rotulo="Bairro"
              valor={bairro ?? ""}
              onChange={(valor) =>
                setValue("neighborhood", valor, { shouldValidate: true })
              }
              sugestoes={bairros.data ?? []}
              placeholder="Manaíra"
            />

            <Erro>{errors.neighborhood?.message}</Erro>
          </div>

          <div>
            <label htmlFor="state" className={ROTULO}>
              Estado
            </label>

            <input
              {...register("state")}
              id="state"
              className={CAMPO}
              placeholder="PB"
            />

            <Erro>{errors.state?.message}</Erro>
          </div>
        </Secao>

        <Secao titulo="Foto" temErro={Boolean(errors.image)}>
          {/*
            A foto e enviada, nao linkada.

            Ate a spec 32 este campo era texto: quem anunciava colava o
            endereco de uma imagem hospedada em qualquer lugar, e o site
            carregava do host que viesse. O `register` do campo continua
            existindo, escondido, porque quem valida o formulario e o schema --
            o que mudou e de onde o valor vem.
          */}
          <div className="sm:col-span-2">
            <input type="hidden" {...register("image")} />

            <CampoDeImagem
              valor={fotos}
              onChange={(escolhidas) => {
                setFotos(escolhidas);
                // A capa espelhada no campo que o schema valida: sem ela o
                // formulario passaria sem foto nenhuma.
                setValue("image", escolhidas[capa] ?? escolhidas[0] ?? "", {
                  shouldValidate: true,
                });
              }}
              capa={capa}
              onCapa={(indice) => {
                setCapa(indice);
                setValue("image", fotos[indice] ?? "", { shouldValidate: true });
              }}
              onEnviando={setEnviandoImagem}
            />

            <Erro>{errors.image?.message}</Erro>
          </div>
        </Secao>

        <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-border pt-8">
          <button
            type="submit"
            disabled={isSubmitting || enviandoImagem}
            className="flex min-h-14 items-center gap-2 bg-primary px-9 font-medium text-primary-foreground transition-colors hover:bg-brand-light disabled:pointer-events-none disabled:opacity-60"
          >
            <Save className="h-4 w-4" aria-hidden />
            {isSubmitting ? rotuloSalvando : rotuloDoBotao}
          </button>

          {rodape && <p className="text-sm text-muted-foreground">{rodape}</p>}
        </div>
      </form>
    </div>
  );
}

function Secao({
  titulo,
  children,
  aberturaInicial = false,
  temErro = false,
}: {
  titulo: string;
  children: React.ReactNode;
  aberturaInicial?: boolean;
  temErro?: boolean;
}) {
  const conteudoId = useId();
  const [aberta, setAberta] = useState(aberturaInicial);

  /*
    Derivado, não sincronizado por efeito: com `setAberta` dentro de um
    useEffect, abrir a seção por causa de um erro dispara renderização em
    cascata. Assim a seção com erro aparece enquanto o erro existir e volta a
    obedecer a escolha da pessoa quando ele some.
  */
  const mostrando = aberta || temErro;

  return (
    <section className="mb-8 border-b border-border pb-8 lg:mb-12 lg:border-0 lg:pb-0">
      <button
        type="button"
        onClick={() => setAberta((estava) => !estava)}
        aria-expanded={mostrando}
        aria-controls={conteudoId}
        className="flex min-h-12 w-full items-center justify-between gap-4 text-left lg:pointer-events-none lg:min-h-0"
      >
        <h2 className="font-display text-2xl font-semibold">{titulo}</h2>

        <ChevronDown
          className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform lg:hidden ${
            mostrando ? "rotate-180" : ""
          }`}
          aria-hidden
        />
      </button>

      <div
        id={conteudoId}
        className={`gap-6 pt-6 sm:grid-cols-2 lg:grid ${mostrando ? "grid" : "hidden"}`}
      >
        {children}
      </div>
    </section>
  );
}

function Numero({
  id,
  rotulo,
  registro,
  erro,
  placeholder,
  step,
}: {
  id: string;
  rotulo: string;
  registro: ReturnType<
    ReturnType<typeof useForm<AnnouncementFormData>>["register"]
  >;
  erro?: string;
  placeholder?: string;
  step?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={ROTULO}>
        {rotulo}
      </label>

      <input
        {...registro}
        id={id}
        type="number"
        step={step}
        className={`${CAMPO} tabular`}
        placeholder={placeholder}
      />

      <Erro>{erro}</Erro>
    </div>
  );
}

function Erro({ children }: { children?: React.ReactNode }) {
  if (!children) return null;

  return (
    <p className="mt-2 text-sm font-medium text-destructive" role="alert">
      {children}
    </p>
  );
}

