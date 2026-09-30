"use client";

import { api } from "./api";
import { Announcement } from "../types/announcement";
import { AnnouncementFormData } from "../schemas/announcement";

export async function updateAnnouncement(
  id: number,
  data: AnnouncementFormData,
) {
  return api<Announcement>(`/announcements/${id}`, {
    method: "PUT",
    auth: true,
    body: JSON.stringify(data),
  });
}
