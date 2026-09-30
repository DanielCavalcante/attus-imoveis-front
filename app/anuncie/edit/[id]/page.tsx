"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileQuestion } from "lucide-react";

import { PrivateRoute } from "@/app/components/private-route";
import { FormularioDeAnuncio } from "@/app/components/formulario-de-anuncio";
import { useAnnouncementDetail } from "@/app/hooks/use-detail-announcement";
import { useUpdateAnnouncement } from "@/app/hooks/use-update-announcement";

export default function EditAnnouncementPage() {
  return (
    <PrivateRoute>
      <Edicao />
    </PrivateRoute>
  );
}

/**
 * Editar é a mesma tela de criar, com os campos preenchidos.
 *
 * Antes era outro formulário, com outro vocabulário visual, que mostrava
 * "Apartamento 203" fixo e não salvava nada. Um formulário só é o que faz as
 * duas telas não divergirem de novo.
 */
function Edicao() {
  const parametros = useParams<{ id: string }>();
  const id = Number(parametros.id);
  const router = useRouter();

  const anuncio = useAnnouncementDetail(id);
  const salvar = useUpdateAnnouncement(id);

  // Nada de formulário antes dos dados: montá-lo vazio e preenchê-lo depois
  // faria a pessoa ver campos em branco que não são os do anúncio dela.
  if (anuncio.isLoading) {
    return <Carregando />;
  }

  if (anuncio.isError || !anuncio.data) {
    return <NaoEncontrado />;
  }

  const dados = anuncio.data;
  const fotos = dados.imagens?.length ? dados.imagens : [dados.image];
  const capa = Math.max(0, fotos.indexOf(dados.image));

  /**
   * `null` vira ausência.
   *
   * A API devolve `null` para campo não preenchido -- bairro e complemento --
   * e `z.string().optional()` aceita `undefined`, não `null`. Passados como
   * vieram, o formulário reprovava em campos que a pessoa nem vê, e o botão
   * de salvar não fazia nada sem dizer por quê.
   */
  const valoresIniciais = Object.fromEntries(
    Object.entries(dados).filter(([, valor]) => valor !== null),
  );

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6">
      <div className="border-b border-border pb-6">
        <h1 className="font-display text-4xl font-semibold leading-[1.05] sm:text-5xl">
          Editar anúncio
        </h1>

        <p className="mt-3 text-muted-foreground">
          As alterações valem assim que você salvar.
        </p>
      </div>

      <FormularioDeAnuncio
        valoresIniciais={valoresIniciais}
        // A foto é o único campo que não se digita: sem trazê-la, abrir a
        // edição e salvar sem tocar em nada apagaria a capa do anúncio.
        fotosIniciais={fotos}
        capaInicial={capa}
        rotuloDoBotao="Salvar alterações"
        rotuloSalvando="Salvando…"
        aoSalvar={async (novos) => {
          await salvar.mutateAsync(novos);

          toast.success("Anúncio atualizado.");
          router.push("/portal/anuncios");
        }}
      />
    </div>
  );
}

function Carregando() {
  return (
    <div
      className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6"
      aria-busy="true"
    >
      <div className="h-12 w-80 animate-pulse bg-secondary" />
      <div className="mt-4 h-5 w-52 animate-pulse bg-secondary" />
      <div className="mt-10 h-64 w-full animate-pulse bg-secondary" />
    </div>
  );
}

/**
 * Anúncio que não existe — ou que não é seu.
 *
 * A API responde 404 nos dois casos desde a spec 22, de propósito: dizer
 * "existe, mas não é seu" contaria ao curioso que aquele id existe.
 */
function NaoEncontrado() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
      <FileQuestion className="h-10 w-10 text-muted-foreground" aria-hidden />

      <h1 className="mt-6 font-display text-3xl font-semibold">
        Anúncio não encontrado
      </h1>

      <p className="mt-3 max-w-md text-muted-foreground">
        Ele pode ter sido excluído, ou não ser um anúncio da sua conta.
      </p>
    </div>
  );
}
