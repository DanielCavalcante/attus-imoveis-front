import { AnnouncementFormData } from "../schemas/announcement";

/**
 * O que a API devolve, que é o formulário mais o que o servidor acrescenta.
 *
 * `active` e `neighborhood` são opcionais porque nem toda resposta os traz: a
 * listagem pública só mostra anúncios no ar, e bairro é nulo quando o CEP não
 * resolveu.
 */
export type Announcement = AnnouncementFormData & {
  id: number;
  active?: boolean;
  neighborhood?: string | null;
  /**
   * Todas as fotos, na ordem. A listagem não traz — ela só precisa da capa,
   * que continua em `image`.
   */
  imagens?: string[];
};
