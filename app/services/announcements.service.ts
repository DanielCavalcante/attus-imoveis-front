import { api } from "./api";

import { Announcement } from "../types/announcement";
import { Page } from "../types/pagination";

export type AnnouncementQuery = {
  page?: number;
  size?: number;
  /** Termo de busca. Vazio significa sem filtro, e não é enviado. */
  q?: string;
  /** Campo e direção, no formato do Spring: `price,asc`. */
  sort?: string;
};

/**
 * Monta a consulta que vai para a API.
 *
 * Termo em branco é omitido de propósito: o servidor trata ausência como "sem
 * filtro", e mandar `q=` vazio seria pedir a mesma coisa com mais ruído.
 */
export function buildAnnouncementsQuery(query: AnnouncementQuery = {}) {
  const params = new URLSearchParams();

  if (query.page != null) params.set("page", String(query.page));
  if (query.size != null) params.set("size", String(query.size));
  if (query.q?.trim()) params.set("q", query.q.trim());
  if (query.sort) params.set("sort", query.sort);

  const texto = params.toString();

  return texto ? `?${texto}` : "";
}

export async function getAnnouncements(query: AnnouncementQuery = {}) {
  return api<Page<Announcement>>(`/announcements${buildAnnouncementsQuery(query)}`, {
    method: "GET",
  });
}
