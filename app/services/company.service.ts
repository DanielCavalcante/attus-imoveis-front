"use client";

import { api } from "./api";
import { Company } from "../types/company";
import { CompanyFormData } from "../schemas/company";

export async function getMyCompany() {
  return api<Company>("/companies/me", {
    method: "GET",
    auth: true,
  });
}

export async function updateMyCompany(data: CompanyFormData) {
  return api<Company>("/companies/me", {
    method: "PUT",
    auth: true,
    body: JSON.stringify(data),
  });
}
