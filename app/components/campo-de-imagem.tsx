"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";

import {
  enviarImagem,
  TAMANHO_MAXIMO,
  TIPOS_ACEITOS,
} from "../services/imagens.service";
import { urlDaImagem } from "../lib/imagem";

type Props = {
  /** O que já está guardado: caminho da enviada, ou endereço antigo. */
  valor?: string;
  onChange: (caminho: string) => void;
  /** Sobe enquanto o envio está em curso, para o formulário não submeter. */
  onEnviando?: (enviando: boolean) => void;
};

const MB = TAMANHO_MAXIMO / 1024 / 1024;

/**
 * A imagem do anúncio: arquivo enviado, nunca endereço colado.
 *
 * A validação daqui não substitui a do servidor, antecipa: mandar 5 MB para
 * receber recusa é gastar a rede de quem anuncia. Quem recusa de verdade é a
 * spec 32, e é por isso que tirar este componente não reabre nada.
 */
export function CampoDeImagem({ valor, onChange, onEnviando }: Props) {
  const id = useId();
  const entrada = useRef<HTMLInputElement>(null);

  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  /**
   * A prévia é local e imediata: a pessoa confere a foto antes de o upload
   * terminar. O objeto é revogado na troca, senão cada escolha vaza um blob.
   */
  const [previaLocal, setPreviaLocal] = useState("");

  useEffect(() => {
    return () => {
      if (previaLocal) URL.revokeObjectURL(previaLocal);
    };
  }, [previaLocal]);

  const previa = previaLocal || urlDaImagem(valor);

  async function escolher(arquivo?: File) {
    if (!arquivo) return;

    setErro("");

    if (!TIPOS_ACEITOS.includes(arquivo.type as (typeof TIPOS_ACEITOS)[number])) {
      setErro("Formato não aceito. Envie JPEG, PNG ou WebP.");
      return;
    }

    if (arquivo.size > TAMANHO_MAXIMO) {
      setErro(`A imagem deve ter no máximo ${MB} MB.`);
      return;
    }

    setPreviaLocal((anterior) => {
      if (anterior) URL.revokeObjectURL(anterior);

      return URL.createObjectURL(arquivo);
    });

    setEnviando(true);
    onEnviando?.(true);

    try {
      const enviada = await enviarImagem(arquivo);

      onChange(enviada.caminho);
    } catch (falha) {
      setErro(
        falha instanceof Error && falha.message
          ? falha.message
          : "Não foi possível enviar a imagem.",
      );

      // A prévia local some quando o envio falha: deixá-la daria a impressão
      // de que a foto está no anúncio, e não está.
      setPreviaLocal((anterior) => {
        if (anterior) URL.revokeObjectURL(anterior);

        return "";
      });
    } finally {
      setEnviando(false);
      onEnviando?.(false);
    }
  }

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-foreground/85">
        Foto do imóvel
      </label>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex aspect-[16/9] w-full max-w-sm items-center justify-center overflow-hidden border border-dashed border-border bg-secondary">
          {previa ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={previa}
              alt="Prévia da foto do imóvel"
              className="h-full w-full object-cover"
            />
          ) : (
            <p className="px-6 text-center text-sm text-muted-foreground">
              A foto aparece aqui assim que você escolher o arquivo.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={entrada}
            id={id}
            type="file"
            accept={TIPOS_ACEITOS.join(",")}
            onChange={(evento) => escolher(evento.target.files?.[0])}
            disabled={enviando}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:min-h-11 file:cursor-pointer file:border file:border-border file:bg-card file:px-5 file:text-sm file:font-medium file:text-foreground hover:file:border-foreground/40"
          />

          <p className="text-sm text-muted-foreground">
            JPEG, PNG ou WebP, até {MB} MB.
          </p>

          {enviando && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Enviando a foto…
            </p>
          )}

          {erro && (
            <p className="text-sm font-medium text-destructive" role="alert">
              {erro}
            </p>
          )}

          {!previa && !erro && !enviando && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <ImagePlus className="h-4 w-4" aria-hidden />
              Escolha a foto que abre o anúncio.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
