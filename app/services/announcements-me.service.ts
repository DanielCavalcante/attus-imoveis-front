"use client";

import { Announcement } from "../types/announcement";
import { Page } from "../types/pagination";
import { api } from "./api";
import { AnnouncementQuery, buildAnnouncementsQuery } from "./announcements.service";

export async function getMyAnnouncements(query: AnnouncementQuery = {}) {
  return api<Page<Announcement>>(
    `/announcements/me${buildAnnouncementsQuery(query)}`,
    { method: "GET", auth: true },
  );
}
