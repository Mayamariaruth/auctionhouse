import { API_AUTH_REGISTER } from "./constants.js";

// Registers a new user and returns the server response
export function registerUser(username, email, password) {
  return apiFetch(API_AUTH_REGISTER, {
    method: "POST",
    body: JSON.stringify({ name: username, email, password }),
  });
}
