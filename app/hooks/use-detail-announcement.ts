"use client";

import { useQuery } from "@tanstack/react-query";
import { getAnnouncementDetail } from "../services/announcements-detail.service";

export function useAnnouncementDetail(id: number) {
  return useQuery({
    queryKey: ["announcement-detail", id],
    queryFn: () => getAnnouncementDetail(id),
    enabled: !!id,
  });
}
