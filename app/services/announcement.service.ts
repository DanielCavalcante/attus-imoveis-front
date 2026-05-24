import { api } from "./api";

import { Announcement } from "../types/announcement";

export async function getAnnouncements() {
  return api<Announcement[]>("/announcements", {
    method: "GET",
  });
}
