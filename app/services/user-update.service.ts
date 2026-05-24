import { api } from "./api";
import { User } from "../types/user";
import { ProfileFormData } from "@/app/schemas/profile";

type UpdateUserParams = {
  id: number;
  data: ProfileFormData;
};

export async function updateUser({ id, data }: UpdateUserParams) {
  return api<User>(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    auth: true,
  });
}
