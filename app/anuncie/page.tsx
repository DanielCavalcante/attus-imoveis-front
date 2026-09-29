"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save } from "lucide-react";

import { useCreateAnnouncement } from "@/app/hooks/use-create-announcement";
import {
  announcementSchema,
  AnnouncementFormData,
} from "../schemas/announcement";
import { PrivateRoute } from "../components/private-route";
import { TIPOS_DE_IMOVEL } from "../lib/property";

const CAMPO =
  "min-h-13 w-full border border-input bg-card px-4 text-base outline-none placeholder:text-muted-foreground";

const ROTULO = "mb-2 block text-sm text-foreground/85";

export default function CreateAnnouncementPage() {
  return (
    <PrivateRoute>
      <FormularioDeAnuncio />
    </PrivateRoute>
  );
}

function FormularioDeAnuncio() {
  const createAnnouncementMutation = useCreateAnnouncement();
  const router = useRouter();

  const [previa, setPrevia] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { propertyType: "HOUSE", reason: "SALE" },
  });

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
        <Secao titulo="O imóvel">
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

            <select {...register("propertyType")} id="propertyType" className={CAMPO}>
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

        <Secao titulo="Medidas e preço">
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

        <Secao titulo="Onde fica">
          <div>
            <label htmlFor="cep" className={ROTULO}>
              CEP
            </label>

            <input {...register("cep")} id="cep" className={CAMPO} placeholder="58038-000" />

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

            <input {...register("city")} id="city" className={CAMPO} placeholder="João Pessoa" />

            <Erro>{errors.city?.message}</Erro>
          </div>

          <div>
            <label htmlFor="state" className={ROTULO}>
              Estado
            </label>

            <input {...register("state")} id="state" className={CAMPO} placeholder="PB" />

            <Erro>{errors.state?.message}</Erro>
          </div>
        </Secao>

        <Secao titulo="Foto">
          <div className="sm:col-span-2">
            <label htmlFor="image" className={ROTULO}>
              Link da imagem
            </label>

            <input
              {...register("image")}
              id="image"
              className={CAMPO}
              placeholder="https://…"
              onChange={(evento) => {
                register("image").onChange(evento);
                setPrevia(evento.target.value.trim());
              }}
            />

            <Erro>{errors.image?.message}</Erro>

            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              A foto entra por link, não por upload — é assim que o sistema
              funciona hoje. Cole o endereço de uma imagem já publicada.
            </p>
          </div>

          {/*
            Prévia da foto que a pessoa informou, e não uma galeria.

            Aqui existiam três fotos fixas do Unsplash exibidas como se fossem
            do imóvel, mais um botão "Adicionar imagem" que não fazia nada — e
            que, sem `type`, era `submit` dentro do formulário: clicar nele
            publicava o anúncio.
          */}
          <div className="sm:col-span-2">
            <p className={ROTULO}>Prévia</p>

            <div className="flex aspect-[16/9] max-w-xl items-center justify-center overflow-hidden border border-dashed border-border bg-secondary">
              {previa ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={previa}
                  alt="Prévia da foto informada"
                  className="h-full w-full object-cover"
                  onError={(evento) => {
                    evento.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <p className="px-6 text-center text-sm text-muted-foreground">
                  A foto aparece aqui assim que você colar o link.
                </p>
              )}
            </div>
          </div>
        </Secao>

        <div className="mt-12 flex flex-wrap items-center gap-6 border-t border-border pt-8">
          <button
            type="submit"
            disabled={isSubmitting}
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

/** Blocos separados por fio, como nas outras telas — sem card sombreado. */
function Secao({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="mb-6 font-display text-2xl font-semibold">{titulo}</h2>

      <div className="grid gap-6 sm:grid-cols-2">{children}</div>
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
  registro: ReturnType<ReturnType<typeof useForm<AnnouncementFormData>>["register"]>;
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
