"use client";

import { Announcement } from "../types/announcement";
import { Page } from "../types/pagination";
import { api } from "./api";
import { AnnouncementQuery, buildAnnouncementsQuery } from "./announcements.service";
import { AnnouncementQuota } from "../types/quota";

export async function getMyAnnouncements(query: AnnouncementQuery = {}) {
  return api<Page<Announcement>>(
    `/announcements/me${buildAnnouncementsQuery(query)}`,
    { method: "GET", auth: true },
  );
}

export async function getMyQuota() {
  return api<AnnouncementQuota>("/announcements/me/quota", {
    method: "GET",
    auth: true,
  });
}

export async function inativarAnuncio(id: number) {
  return api<void>(`/announcements/${id}/inativar`, {
    method: "PATCH",
    auth: true,
  });
}

export async function reativarAnuncio(id: number) {
  return api<void>(`/announcements/${id}/reativar`, {
    method: "PATCH",
    auth: true,
  });
}

export async function excluirAnuncio(id: number) {
  return api<void>(`/announcements/${id}`, { method: "DELETE", auth: true });
}
