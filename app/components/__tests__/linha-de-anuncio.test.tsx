import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { LinhaDeAnuncio } from "../linha-de-anuncio";
import { Announcement } from "../../types/announcement";

const BASE: Announcement = {
  id: 7,
  title: "Apartamento com varanda",
  description: "",
  city: "João Pessoa",
  state: "PB",
  image: "https://exemplo.test/foto.jpg",
  street: "Rua do Sol",
  streetNumber: 100,
  cep: "58038-000",
  propertyType: "APARTMENT",
  reason: "SALE",
  rooms: 2,
  bathRooms: 1,
  area: 70,
  price: 300000,
  active: true,
  neighborhood: "Manaíra",
};

function montar(announcement: Announcement, acoes = {}) {
  const props = {
    onInativar: vi.fn(),
    onReativar: vi.fn(),
    onExcluir: vi.fn(),
    ...acoes,
  };

  render(
    <LinhaDeAnuncio announcement={announcement} ocupado={false} {...props} />,
  );

  return props;
}

describe("linha de anuncio (spec 23)", () => {
  it("C3 - anuncio no ar mostra que esta no ar", () => {
    montar(BASE);

    expect(screen.getByText("NO AR")).toBeInTheDocument();
  });

  it("C3 - anuncio inativo mostra que esta fora do ar", () => {
    montar({ ...BASE, active: false });

    expect(screen.getByText("FORA DO AR")).toBeInTheDocument();
  });

  it("C4 - a acao de editar leva ao formulario daquele anuncio", () => {
    montar(BASE);

    expect(screen.getByRole("link", { name: "Editar" })).toHaveAttribute(
      "href",
      "/anuncie/edit/7",
    );
  });

  it("C5 - anuncio ativo oferece tirar do ar", async () => {
    const usuario = userEvent.setup();
    const props = montar(BASE);

    await usuario.click(screen.getByRole("button", { name: "Tirar do ar" }));

    expect(props.onInativar).toHaveBeenCalledWith(7);
    expect(
      screen.queryByRole("button", { name: "Voltar ao ar" }),
    ).not.toBeInTheDocument();
  });

  it("C6 - anuncio inativo oferece voltar ao ar", async () => {
    const usuario = userEvent.setup();
    const props = montar({ ...BASE, active: false });

    await usuario.click(screen.getByRole("button", { name: "Voltar ao ar" }));

    expect(props.onReativar).toHaveBeenCalledWith(7);
    expect(
      screen.queryByRole("button", { name: "Tirar do ar" }),
    ).not.toBeInTheDocument();
  });

  it("C7 - cada anuncio oferece excluir", async () => {
    const usuario = userEvent.setup();
    const props = montar(BASE);

    await usuario.click(screen.getByRole("button", { name: "Excluir" }));

    expect(props.onExcluir).toHaveBeenCalledWith(BASE);
  });

  it("C14 - as acoes tem nome escrito, nao icone sozinho", () => {
    montar(BASE);

    expect(screen.getByRole("link", { name: "Editar" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Tirar do ar" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Excluir" })).toBeInTheDocument();
  });

  it("C15 - as acoes sao alcancaveis por teclado", async () => {
    const usuario = userEvent.setup();

    montar(BASE);

    await usuario.tab();
    expect(screen.getByRole("link", { name: "Editar" })).toHaveFocus();

    await usuario.tab();
    expect(screen.getByRole("button", { name: "Tirar do ar" })).toHaveFocus();

    await usuario.tab();
    expect(screen.getByRole("button", { name: "Excluir" })).toHaveFocus();
  });
});
