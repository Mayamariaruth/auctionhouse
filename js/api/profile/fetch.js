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

// Fetch all listings created by a user
export async function fetchListingsByProfile(username) {
  try {
    return await apiFetch(`${API_AUCTIONS_PROFILES}/${username}/listings`);
  } catch (error) {
    console.error("Failed to fetch listings for profile:", error);
    throw error;
  }
}

// Fetch all bids placed by a user
export async function fetchBidsByProfile(username) {
  try {
    return await apiFetch(`${API_AUCTIONS_PROFILES}/${username}/bids`);
  } catch (error) {
    console.error("Failed to fetch bids for profile:", error);
    throw error;
  }
}
