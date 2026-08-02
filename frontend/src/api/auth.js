import apiClient from "./client";

export async function registerUser({ username, email, password }) {
  const { data } = await apiClient.post("/auth/register", {
    username,
    email,
    password,
  });
  return data; // { token, username }
}

export async function loginUser({ username, password }) {
  const { data } = await apiClient.post("/auth/login", {
    username,
    password,
  });
  return data; // { token, username }
}