import { api } from "./api";

import { Announcement } from "../types/announcement";

export async function getAnnouncementDetail(id: number) {
  return api<Announcement>(`/announcements/${id}`, {
    method: "GET",
  });
}
