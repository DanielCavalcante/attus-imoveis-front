"use client";

import { useMutation } from "@tanstack/react-query";
import { updateUser } from "../services/user-update.service";

export function useUpdateUser() {
  return useMutation({
    mutationFn: updateUser,
  });
}
