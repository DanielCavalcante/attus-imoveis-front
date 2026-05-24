"use client";

import { useMutation } from "@tanstack/react-query";
import { createAnnouncement } from "../services/announcement-create.service";

export function useCreateAnnouncement() {
  return useMutation({
    mutationFn: createAnnouncement,
  });
}
