import { api } from "./api";

export async function getAnnouncementDetail(id: number) {
  const response = await api(`/announcements/${id}`, {
    method: "GET",
  });

  return response;
}
