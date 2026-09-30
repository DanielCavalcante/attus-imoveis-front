/**
 * Como falar com a equipe.
 *
 * Vem do ambiente e não de literal espalhado por tela: o endereço muda sem
 * deploy de código, e um literal repetido teria de ser caçado em cada lugar
 * que o copiou. O padrão existe para a tela nunca oferecer um contato vazio —
 * quem está esperando aprovação precisa de alguém para procurar.
 */
export const CONTATO = {
  email: process.env.NEXT_PUBLIC_CONTATO_EMAIL || "contato@encontrei.com.br",
  telefone: process.env.NEXT_PUBLIC_CONTATO_TELEFONE || "",
} as const;

/** `mailto:` pronto, com assunto que já situa quem recebe. */
export function mailtoDoContato(assunto: string) {
  return `mailto:${CONTATO.email}?subject=${encodeURIComponent(assunto)}`;
}
