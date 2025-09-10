import { API_AUCTIONS_PROFILES } from "../constants.js";
import { apiFetch } from "../request.js";

// Fetch a profile by name
export async function fetchProfile(name) {
  try {
    const data = await apiFetch(`${API_AUCTIONS_PROFILES}/${name}`, {
      auth: true,
    });
    return data;
  } catch (error) {
    console.error(`Failed to fetch profile for ${name}:`, error);
    throw error;
  }
}

// Fetch all listings created by a user
export async function fetchListingsByProfile(name) {
  try {
    return await apiFetch(`${API_AUCTIONS_PROFILES}/${name}/listings`, {
      auth: true,
    });
  } catch (error) {
    console.error("Failed to fetch listings for profile:", error);
    throw error;
  }
}

// Fetch all bids placed by a user
export async function fetchBidsByProfile(name) {
  try {
    return await apiFetch(`${API_AUCTIONS_PROFILES}/${name}/bids`, {
      auth: true,
    });
  } catch (error) {
    console.error("Failed to fetch bids for profile:", error);
    throw error;
  }
}
