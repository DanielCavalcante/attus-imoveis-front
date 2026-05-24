import { api } from "../services/api";
import { User } from "../types/user";
import { UserFormData } from "@/app/schemas/user";

export async function createUser(data: UserFormData) {
  return api<User>("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
