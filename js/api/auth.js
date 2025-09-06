import {
  API_AUTH_REGISTER,
  API_AUTH_LOGIN,
  API_AUCTIONS_PROFILES,
} from "./constants.js";
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

// Authenticates user login and returns profile details
export async function loginUser({ email, password }) {
  try {
    const data = await apiFetch(API_AUTH_LOGIN, {
      method: "POST",
      body: { email, password },
    });

    // Store access token
    localStorage.setItem("accessToken", data.data.accessToken);

    // Fetch full profile details from login response
    const profile = await apiFetch(
      `${API_AUCTIONS_PROFILES}/${data.data.name}`,
      {
        auth: true,
      }
    );
    localStorage.setItem("profile", JSON.stringify(profile));

    return profile;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
}
