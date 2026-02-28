import { API_AUCTIONS_PROFILES } from "../constants.js";
import { apiFetch } from "../request.js";
import { apiError } from "../apiError.js";

// Fetch a profile by name
export async function fetchProfile(name) {
  return apiError(
    () => apiFetch(`${API_AUCTIONS_PROFILES}/${name}`, { auth: true }),
    "Failed to fetch profile",
  );
}

// Fetch all listings created by a user
export async function fetchListingsByProfile(name) {
  return apiError(
    () =>
      apiFetch(`${API_AUCTIONS_PROFILES}/${name}/listings`, {
        auth: true,
      }),
    "Failed to fetch profile listings",
  );
}

// Fetch all bids placed by a user
export async function fetchBidsByProfile(name) {
  return apiError(
    () =>
      apiFetch(`${API_AUCTIONS_PROFILES}/${name}/bids?_listings=true`, {
        auth: true,
      }),
    "Failed to fetch profile bids",
  );
}
