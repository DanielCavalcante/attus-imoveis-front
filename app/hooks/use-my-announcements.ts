"use client";

import { useQuery } from "@tanstack/react-query";

import { getMyAnnouncements } from "../services/announcements-me.service";

/** Página única: a lista da conta não cresce como o acervo. */
export function useMyAnnouncements() {
  return useQuery({
    queryKey: ["announcements", "me"],
    queryFn: () => getMyAnnouncements(),
  });
}
