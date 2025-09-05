import { API_AUTH_REGISTER, API_AUTH_LOGIN } from "./constants.js";
import { apiFetch } from "./request.js";

// Registers a new user in the API
export function registerUser(username, email, password) {
  return apiFetch(API_AUTH_REGISTER, {
    method: "POST",
    body: JSON.stringify({ name: username, email, password }),
  });
}

// Authenticates user login and returns a valid access token
export async function loginUser({ email, password }) {
  const credentials = { email, password };

  const data = await request(API_AUTH_LOGIN, {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  // Store access token and user data in local storage
  localStorage.setItem("accessToken", data.data.accessToken);
  localStorage.setItem("profile", JSON.stringify(data.data));

  return data.data;
}
