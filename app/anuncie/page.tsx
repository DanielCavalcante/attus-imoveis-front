"use client";

import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown, Save } from "lucide-react";

import { useCreateAnnouncement } from "@/app/hooks/use-create-announcement";
import {
  announcementSchema,
  AnnouncementFormData,
} from "../schemas/announcement";
import { PrivateRoute } from "../components/private-route";
import { CampoDeImagem } from "../components/campo-de-imagem";
import {
  CadastroEmAprovacao,
  type MotivoDoBloqueio,
} from "../components/cadastro-em-aprovacao";
import { useCompany } from "../hooks/use-company";
import { useMyQuota } from "../hooks/use-my-announcements";
import { TIPOS_DE_IMOVEL } from "../lib/property";

const CAMPO =
  "min-h-13 w-full border border-input bg-card px-4 text-base outline-none placeholder:text-muted-foreground";

const ROTULO = "mb-2 block text-sm text-foreground/85";

export default function CreateAnnouncementPage() {
  return (
    <PrivateRoute>
      <PortaoDaAprovacao />
    </PrivateRoute>
  );
}

/**
 * Quem pode anunciar vê o formulário; quem não pode vê o porquê.
 *
 * O portão de verdade é o servidor -- esta tela existe para a pessoa não
 * preencher quinze campos antes de descobrir. Por isso ela pergunta à mesma
 * rota que o servidor consulta (`podePublicar` e `motivo`), em vez de refazer
 * a regra aqui e arriscar discordar dela.
 *
 * Quota cheia não entra: ali a conta PODE publicar, o que falta é vaga, e
 * esconder o formulário por isso trocaria um 409 explicável por uma porta
 * fechada sem explicação.
 */
function PortaoDaAprovacao() {
  const quota = useMyQuota();

  // Nada de formulário antes da resposta: mostrá-lo e recolhê-lo é pior que
  // esperar, porque quem já começou a digitar perde o que digitou.
  if (quota.isPending) {
    return <Carregando />;
  }

  const motivo = quota.data?.motivo;
  const bloqueado =
    !!motivo && (motivo.startsWith("EMPRESA_") || motivo === "SEM_PLANO");

  if (!bloqueado) {
    return <FormularioDeAnuncio />;
  }

  return <TelaDoBloqueio motivo={motivo} />;
}

/**
 * O motivo da quota vira a tela, e o texto da reprovação vem junto.
 *
 * A empresa só é consultada quando o motivo é reprovação: é o único caso em
 * que há algo escrito para mostrar.
 */
function TelaDoBloqueio({ motivo }: { motivo: string }) {
  const reprovada = motivo === "EMPRESA_REPROVADA";
  const empresa = useCompany(reprovada);

  const status = (
    motivo === "SEM_PLANO" ? "SEM_PLANO" : motivo.replace("EMPRESA_", "")
  ) as MotivoDoBloqueio;

  return (
    <CadastroEmAprovacao
      status={status}
      motivo={empresa.data?.rejectionReason}
    />
  );
}

function Carregando() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-20 sm:px-6" aria-busy="true">
      <div className="h-10 w-10 animate-pulse bg-secondary" />
      <div className="mt-6 h-12 w-full animate-pulse bg-secondary" />
      <div className="mt-4 h-5 w-3/4 animate-pulse bg-secondary" />
    </div>
  );
}

function FormularioDeAnuncio() {
  const createAnnouncementMutation = useCreateAnnouncement();
  const router = useRouter();

  const [enviandoImagem, setEnviandoImagem] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { propertyType: "HOUSE", reason: "SALE" },
  });

  const imagemAtual = watch("image");

  async function onSubmit(data: AnnouncementFormData) {
    try {
      await createAnnouncementMutation.mutateAsync(data);

      toast.success("Anúncio publicado.");
      router.push("/portal/anuncios");
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
      <div className="border-b border-border pb-6">
        <h1 className="font-display text-4xl font-semibold leading-[1.05] sm:text-5xl">
          Criar anúncio
        </h1>

        <p className="mt-3 text-muted-foreground">
          O anúncio nasce no ar e ocupa uma vaga da sua quota. Você pode tirá-lo
          do ar depois, sem perdê-lo.
        </p>
      </div>

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
              {...register("cep")}
              id="cep"
              className={CAMPO}
              placeholder="58038-000"
            />

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
              valor={imagemAtual}
              onChange={(caminho) =>
                setValue("image", caminho, { shouldValidate: true })
              }
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
            {isSubmitting ? "Publicando…" : "Publicar anúncio"}
          </button>

          <p className="text-sm text-muted-foreground">
            Sem vaga na quota, a publicação é recusada e o anúncio não é
            gravado.
          </p>
        </div>
      </form>
    </div>
  );
}

/**
 * Blocos separados por fio, como nas outras telas — sem card sombreado.
 *
 * No celular eles recolhem. O formulário inteiro media 3.543px de altura num
 * aparelho de 844: quatro telas de rolagem para publicar um imóvel, que é onde
 * a pessoa desiste. A estrutura é a mesma nos dois tamanhos — mesmas seções, na
 * mesma ordem, com os mesmos campos; o que muda é poder fechar o que já foi
 * preenchido.
 *
 * Seção com erro de validação abre sozinha: campo reprovado dentro de bloco
 * fechado é erro que a pessoa não encontra.
 */
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
