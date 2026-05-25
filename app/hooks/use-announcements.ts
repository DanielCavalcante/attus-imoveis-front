"use client";

import { useQuery } from "@tanstack/react-query";
import { getAnnouncements } from "../services/announcements.service";
import { Announcement } from "../types/announcement";

export function useAnnouncements() {
  return useQuery<Announcement[]>({
    queryKey: ["announcements"],
    queryFn: getAnnouncements,
  });
}
