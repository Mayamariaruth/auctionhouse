import { API_AUCTIONS_PROFILES } from "../constants.js";
import { apiFetch } from "../request.js";

// Fetch a profile by username
export async function fetchProfile(username) {
  try {
    const data = await apiFetch(`${API_AUCTIONS_PROFILES}/${username}`);
    return data;
  } catch (error) {
    console.error(`Failed to fetch profile for ${username}:`, error);
    throw error;
  }
}
