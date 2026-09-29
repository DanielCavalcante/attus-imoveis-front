/**
 * Saldo de anúncios no ar.
 *
 * Conta sem teto tem saldo e não tem limite: `limite` e `restantes` vêm nulos
 * de propósito, em vez de um número que ninguém definiu.
 */
export type AnnouncementQuota = {
  ilimitado: boolean;
  limite: number | null;
  usados: number | null;
  restantes: number | null;
};
