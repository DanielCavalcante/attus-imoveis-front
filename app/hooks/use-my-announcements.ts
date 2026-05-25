"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyAnnouncements } from "../services/announcements-me.service";

export function useMyAnnouncements() {
  return useQuery({
    queryKey: ["my-announcements"],
    queryFn: getMyAnnouncements,
  });
}
