import { api } from "./api";

import { AnnouncementFormData } from "../schemas/announcement";

export async function createAnnouncement(data: AnnouncementFormData) {
  return api("/announcements", {
    method: "POST",
    body: JSON.stringify(data),
    auth: true,
  });
}
