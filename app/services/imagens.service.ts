"use client";

import { api } from "./api";

export type ImagemEnviada = {
  /** A referência que o anúncio guarda. */
  nome: string;
  /** O caminho por onde a imagem é servida. */
  caminho: string;
};

/** Tipos que o servidor aceita. Repetidos aqui para a recusa vir antes do upload. */
export const TIPOS_ACEITOS = ["image/jpeg", "image/png", "image/webp"] as const;

export const TAMANHO_MAXIMO = 5 * 1024 * 1024;

export async function enviarImagem(arquivo: File) {
  const corpo = new FormData();

  corpo.append("arquivo", arquivo);

  return api<ImagemEnviada>("/imagens", {
    method: "POST",
    auth: true,
    body: corpo,
  });
}
