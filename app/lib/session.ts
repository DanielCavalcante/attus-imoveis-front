import { jwtDecode } from "jwt-decode";

export type AccountType = "PF" | "PJ" | "INTERNO";
export type UserRole = "COMUM" | "INTERNO";

export type SessionUser = {
  id: number;
  email: string;
  fullname: string;
  photo: string;
  phone: string;
  /** Claims emitidas pelo JwtService desde a spec 01 de contas tipadas. */
  accountType?: AccountType;
  role?: UserRole;
};

/**
 * Campos que descrevem quem a pessoa é para efeito de autorização. Só o token
 * assinado pode defini-los.
 */
const IDENTITY_FIELDS = ["id", "email", "accountType", "role"] as const;

/**
 * O token é a única fonte da sessão.
 *
 * Antes havia uma cópia em localStorage["user"] que tinha precedência sobre o
 * token. Qualquer gravação nela — inclusive a do próprio app ao salvar o perfil,
 * com um DTO sem `role` — apagava o papel e trancava a conta interna para fora
 * do painel. E era um blob editável pelo visitante decidindo o que a interface
 * mostrava.
 */
export function decodeSession(token: string | null): SessionUser | null {
  if (!token) return null;

  try {
    return jwtDecode<SessionUser>(token);
  } catch {
    return null;
  }
}

/**
 * Atualização de perfil mexe no que aparece na tela, nunca na identidade.
 * `id`, `email`, `accountType` e `role` continuam vindo do token.
 */
export function mergeProfileIntoSession(
  session: SessionUser | null,
  profile: Partial<SessionUser>,
): SessionUser | null {
  if (!session) return null;

  const merged: SessionUser = { ...session, ...profile };

  for (const field of IDENTITY_FIELDS) {
    (merged as Record<string, unknown>)[field] = session[field];
  }

  return merged;
}

/**
 * Apaga a sessão guardada no navegador.
 *
 * Mora aqui, e não só dentro do contexto de autenticação, porque quem descobre
 * que a sessão acabou é a camada de rede — e ela não é componente para usar
 * hook. As duas chamam o mesmo lugar em vez de cada uma apagar o que lembra.
 */
export function encerrarSessao() {
  try {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch {
    // Navegador com armazenamento bloqueado: não há sessão para apagar.
  }
}
