import { api } from "./api";

type SignInData = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
};

export async function authenticate(data: SignInData) {
  return api<LoginResponse>("/auth/authenticate", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
