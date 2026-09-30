import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ConfirmarLiberacaoDePlano } from "../confirmar-liberacao-de-plano";
import type { CompanyPlan, ImpactoDoPlano, Plan } from "@/app/types/backoffice";

const EMPRESA: CompanyPlan = {
  companyId: 7,
  razaoSocial: "Imobiliária Aurora LTDA",
  nomeFantasia: "Aurora Imóveis",
  cnpj: "11222333000181",
  planoNome: "Cinco anúncios",
  limiteAnuncios: 5,
  anunciosNoAr: 4,
};

const PLANO_MENOR: Plan = {
  id: 2,
  nome: "Dois anúncios",
  descricao: null,
  precoMensal: 99,
  limiteAnuncios: 2,
  anunciosIlimitados: false,
  ativo: true,
};

const PLANO_SEM_TETO: Plan = {
  ...PLANO_MENOR,
  id: 3,
  nome: "Sem teto",
  limiteAnuncios: null,
  anunciosIlimitados: true,
};

function montar(destino: Plan, impacto?: ImpactoDoPlano) {
  const onConfirmar = vi.fn();
  const onCancelar = vi.fn();

  render(
    <ConfirmarLiberacaoDePlano
      empresa={EMPRESA}
      destino={destino}
      impacto={impacto}
      carregandoImpacto={false}
      confirmando={false}
      onConfirmar={onConfirmar}
      onCancelar={onCancelar}
    />,
  );

  return { onConfirmar, onCancelar };
}

const EXCEDE: ImpactoDoPlano = {
  anunciosNoAr: 4,
  planoAtual: "Cinco anúncios",
  limiteAtual: 5,
  planoDestino: "Dois anúncios",
  limiteDestino: 2,
  excede: true,
};

const NAO_EXCEDE: ImpactoDoPlano = {
  ...EXCEDE,
  planoDestino: "Sem teto",
  limiteDestino: null,
  excede: false,
};

describe("confirmacao de liberacao de plano (spec 31)", () => {
  it("C4 - downgrade mostra o aviso com os dois numeros", () => {
    montar(PLANO_MENOR, EXCEDE);

    const aviso = screen.getByRole("alert");

    expect(aviso).toHaveTextContent("4");
    expect(aviso).toHaveTextContent("2");
  });

  it("C5 - o aviso diz que nenhum anuncio sai do ar", () => {
    montar(PLANO_MENOR, EXCEDE);

    expect(screen.getByRole("alert")).toHaveTextContent(
      /nenhum anúncio será tirado do ar/i,
    );
  });

  it("C6 - o aviso nao desabilita a confirmacao", async () => {
    const { onConfirmar } = montar(PLANO_MENOR, EXCEDE);

    const botao = screen.getByRole("button", { name: /liberar plano/i });

    expect(botao).toBeEnabled();

    await userEvent.click(botao);

    expect(onConfirmar).toHaveBeenCalledOnce();
  });

  it("C7 - plano de limite nulo nao acusa excesso", () => {
    montar(PLANO_SEM_TETO, NAO_EXCEDE);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("C11 - o aviso e anunciado a leitor de tela", () => {
    montar(PLANO_MENOR, EXCEDE);

    // role="alert" é o que faz o leitor de tela falar sem a pessoa navegar
    // até ali: o aviso aparece depois que a escolha já foi feita.
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("o dialogo e nomeado pelo proprio titulo", () => {
    montar(PLANO_MENOR, EXCEDE);

    expect(screen.getByRole("dialog")).toHaveAccessibleName(
      /liberar dois anúncios/i,
    );
  });
});
