"use client";

import { useMutation } from "@tanstack/react-query";
import { createUser } from "../services/user.service";

export function useCreateUser() {
  return useMutation({
    mutationFn: createUser,
  });
}
