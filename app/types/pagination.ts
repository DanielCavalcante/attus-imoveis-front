/**
 * Envelope de página do Spring Data. Só o que o frontend realmente usa.
 *
 * Não se chama `page.ts` porque todo arquivo com esse nome dentro de `app/` é
 * tratado como rota pelo App Router, e o type check reprova.
 */
export type Page<T> = {
  content: T[];
  totalElements: number;
  /** Índice da página atual, começando em zero. */
  number: number;
  size: number;
  last: boolean;
};

/** Página vazia, para quando ainda não há resposta. */
export function emptyPage<T>(): Page<T> {
  return { content: [], totalElements: 0, number: 0, size: 0, last: true };
}
