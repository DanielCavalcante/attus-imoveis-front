/**
 * Saldo de anúncios no ar, e se a conta pode publicar agora.
 *
 * Conta sem teto tem saldo e não tem limite: `limite` e `restantes` vêm nulos
 * de propósito, em vez de um número que ninguém definiu.
 *
 * `motivo` é código estável, não frase: quem consome escolhe o texto, e texto
 * reescrito no servidor nunca quebra a tela. `QUOTA_CHEIA` é falta de vaga —
 * a conta pode publicar, só precisa abrir uma. Os demais são portão.
 */
export type AnnouncementQuota = {
  ilimitado: boolean;
  limite: number | null;
  usados: number | null;
  restantes: number | null;
  podePublicar: boolean;
  motivo: string | null;
};
