import { API_AUCTIONS_PROFILES } from "./constants.js";
import { apiFetch } from "./request.js";

// Fetch a profile by name
export async function readProfile(name) {
  try {
    const profile = await apiFetch(`${API_AUCTIONS_PROFILES}/${name}`);
    return profile;
  } catch (error) {
    console.error("Failed to fetch user's profile:", error);
    throw error;
  }
}
