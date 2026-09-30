"use client";

import { api } from "./api";

export type Endereco = {
  cep: string;
  logradouro: string | null;
  /** Nulo de verdade: cidade com CEP único não tem bairro. */
  bairro: string | null;
  cidade: string;
  uf: string;
};

export async function getEndereco(cep: string) {
  return api<Endereco>(`/enderecos/${cep}`, { method: "GET", auth: true });
}
