"use client";

import { Announcement } from "../types/announcement";
import { api } from "./api";

export async function getMyAnnouncements() {
  return api<Announcement[]>("/announcements/me", {
    method: "GET",
    auth: true,
  });
}
