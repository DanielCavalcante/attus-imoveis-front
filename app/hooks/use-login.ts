"use client";

import { useMutation } from "@tanstack/react-query";
import { authenticate } from "../services/auth.service";

export function useLogin() {
  return useMutation({
    mutationFn: authenticate,
  });
}
