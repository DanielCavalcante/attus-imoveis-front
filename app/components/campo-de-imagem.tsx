"use client";

import { useEffect, useId, useRef, useState } from "react";
import { ImagePlus, Loader2, Star, X } from "lucide-react";

import {
  enviarImagem,
  TAMANHO_MAXIMO,
  TIPOS_ACEITOS,
} from "../services/imagens.service";
import { urlDaImagem } from "../lib/imagem";

type Props = {
  /** As fotos já escolhidas, na ordem. */
  valor: string[];
  onChange: (fotos: string[]) => void;
  /** Qual delas é a capa. */
  capa: number;
  onCapa: (indice: number) => void;
  /** Sobe enquanto o envio está em curso, para o formulário não submeter. */
  onEnviando?: (enviando: boolean) => void;
  /** Teto do servidor, repetido aqui para a recusa vir antes do upload. */
  maximo?: number;
};

const MB = TAMANHO_MAXIMO / 1024 / 1024;

/**
 * As fotos do anúncio: arquivos enviados, nunca endereços colados.
 *
 * A validação daqui não substitui a do servidor, antecipa: mandar 5 MB para
 * receber recusa é gastar a rede de quem anuncia. Quem recusa de verdade é a
 * spec 32, e é por isso que tirar este componente não reabre nada.
 */
export function CampoDeImagem({
  valor,
  onChange,
  capa,
  onCapa,
  onEnviando,
  maximo = 12,
}: Props) {
  const id = useId();
  const entrada = useRef<HTMLInputElement>(null);

  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  /**
   * Prévias locais das que ainda estão subindo: a pessoa vê a foto antes de o
   * upload terminar. Revogadas ao sair, senão cada escolha vaza um blob.
   */
  const [subindo, setSubindo] = useState<string[]>([]);

  useEffect(() => {
    return () => subindo.forEach((url) => URL.revokeObjectURL(url));
  }, [subindo]);

  function recusar(mensagem: string) {
    setErro(mensagem);
    return false;
  }

  function aceita(arquivo: File) {
    if (!TIPOS_ACEITOS.includes(arquivo.type as (typeof TIPOS_ACEITOS)[number])) {
      return recusar("Formato não aceito. Envie JPEG, PNG ou WebP.");
    }

    if (arquivo.size > TAMANHO_MAXIMO) {
      return recusar(`A imagem deve ter no máximo ${MB} MB.`);
    }

    return true;
  }

  async function escolher(lista: FileList | null) {
    const arquivos = Array.from(lista ?? []);

    if (arquivos.length === 0) return;

    setErro("");

    if (valor.length + arquivos.length > maximo) {
      recusar(`Um anúncio aceita no máximo ${maximo} fotos.`);
      return;
    }

    const validos = arquivos.filter(aceita);

    if (validos.length === 0) return;

    const previas = validos.map((arquivo) => URL.createObjectURL(arquivo));

    setSubindo(previas);
    setEnviando(true);
    onEnviando?.(true);

    try {
      // Em paralelo: quem escolhe seis fotos não espera seis idas em fila.
      const enviadas = await Promise.all(
        validos.map((arquivo) => enviarImagem(arquivo)),
      );

      onChange([...valor, ...enviadas.map((enviada) => enviada.caminho)]);
    } catch (falha) {
      setErro(
        falha instanceof Error && falha.message
          ? falha.message
          : "Não foi possível enviar a imagem.",
      );
    } finally {
      previas.forEach((url) => URL.revokeObjectURL(url));
      setSubindo([]);
      setEnviando(false);
      onEnviando?.(false);

      // Sem isto, escolher o mesmo arquivo de novo não dispara `change`.
      if (entrada.current) entrada.current.value = "";
    }
  }

  function remover(indice: number) {
    const restantes = valor.filter((_, i) => i !== indice);

    onChange(restantes);

    // A capa não pode apontar para uma foto que saiu.
    if (indice === capa) {
      onCapa(0);
    } else if (indice < capa) {
      onCapa(capa - 1);
    }
  }

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm text-foreground/85">
        Fotos do imóvel
      </label>

      <input
        ref={entrada}
        id={id}
        type="file"
        multiple
        accept={TIPOS_ACEITOS.join(",")}
        onChange={(evento) => escolher(evento.target.files)}
        disabled={enviando}
        className="block w-full text-sm text-muted-foreground file:mr-4 file:min-h-11 file:cursor-pointer file:border file:border-border file:bg-card file:px-5 file:text-sm file:font-medium file:text-foreground hover:file:border-foreground/40"
      />

      <p className="mt-2 text-sm text-muted-foreground">
        JPEG, PNG ou WebP, até {MB} MB cada. A capa é a foto que abre o anúncio.
      </p>

      {enviando && (
        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Enviando…
        </p>
      )}

      {erro && (
        <p className="mt-2 text-sm font-medium text-destructive" role="alert">
          {erro}
        </p>
      )}

      {valor.length === 0 && subindo.length === 0 && !erro && (
        <div className="mt-4 flex aspect-[16/9] w-full max-w-sm items-center justify-center border border-dashed border-border bg-secondary">
          <p className="flex items-center gap-2 px-6 text-center text-sm text-muted-foreground">
            <ImagePlus className="h-4 w-4 shrink-0" aria-hidden />
            As fotos aparecem aqui assim que você escolher.
          </p>
        </div>
      )}

      {(valor.length > 0 || subindo.length > 0) && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {valor.map((foto, indice) => (
            <li key={foto} className="relative">
              <div
                className={`aspect-[4/3] overflow-hidden border ${
                  indice === capa ? "border-brand" : "border-border"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={urlDaImagem(foto)}
                  alt={`Foto ${indice + 1} do imóvel`}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="mt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onCapa(indice)}
                  aria-pressed={indice === capa}
                  className={`flex items-center gap-1.5 text-xs transition-colors ${
                    indice === capa
                      ? "text-brand"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Star
                    className="h-3.5 w-3.5"
                    fill={indice === capa ? "currentColor" : "none"}
                    aria-hidden
                  />
                  {indice === capa ? "Capa" : "Usar como capa"}
                </button>

                <button
                  type="button"
                  onClick={() => remover(indice)}
                  aria-label={`Remover foto ${indice + 1}`}
                  className="text-muted-foreground transition-colors hover:text-destructive"
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            </li>
          ))}

          {subindo.map((previa) => (
            <li key={previa} className="aspect-[4/3] overflow-hidden border border-border opacity-60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previa}
                alt="Foto sendo enviada"
                className="h-full w-full object-cover"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
