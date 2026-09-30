import { describe, expect, it } from "vitest";

import { mergeProfileIntoSession, type SessionUser } from "../session";

const sessao: SessionUser = {
  id: 8,
  email: "interno@attus.dev",
  fullname: "Equipe interna",
  photo: "",
  phone: "11900000001",
  accountType: "INTERNO",
  role: "INTERNO",
};

describe("sessão derivada do token", () => {
  it("salvar o perfil preserva o papel, mesmo sem ele no corpo da resposta", () => {
    // Forma real do UserDetailDTO: tem accountType, nao tem role.
    const resposta = {
      id: 8,
      fullname: "Equipe interna",
      email: "interno@attus.dev",
      phone: "11911112222",
      photo: "",
      accountType: "INTERNO",
    } as Partial<SessionUser>;

    const atualizada = mergeProfileIntoSession(sessao, resposta);

    expect(atualizada?.role).toBe("INTERNO");
  });

  it("corpo de perfil não consegue elevar o papel nem o tipo", () => {
    const comum: SessionUser = { ...sessao, role: "COMUM", accountType: "PF" };

    const atualizada = mergeProfileIntoSession(comum, {
      role: "INTERNO",
      accountType: "INTERNO",
    });

    expect(atualizada?.role).toBe("COMUM");
    expect(atualizada?.accountType).toBe("PF");
  });

  it("campos de exibição são atualizados", () => {
    const atualizada = mergeProfileIntoSession(sessao, {
      fullname: "Equipe interna renomeada",
      phone: "11933334444",
    });

    expect(atualizada?.fullname).toBe("Equipe interna renomeada");
    expect(atualizada?.phone).toBe("11933334444");
  });

  it("sem sessão, não há o que mesclar", () => {
    expect(mergeProfileIntoSession(null, { fullname: "Alguem" })).toBeNull();
  });
});
