import { API_AUTH_REGISTER, API_AUTH_LOGIN } from "./constants.js";
import { apiFetch } from "./request.js";

// Registers a new user in the API
export async function registerUser(name, email, password) {
  try {
    const body = { name, email, password };

    return await apiFetch(API_AUTH_REGISTER, {
      method: "POST",
      body,
    });
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
}

// Logs user in
export function loginUser({ email, password }) {
  if (!email?.trim() || !password?.trim()) {
    throw new Error("Email and password are required.");
  }

  return apiFetch(API_AUTH_LOGIN, {
    method: "POST",
    body: {
      email: email.trim(),
      password: password.trim(),
    },
  });
}
