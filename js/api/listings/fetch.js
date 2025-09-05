import { API_AUCTIONS_LISTINGS } from "../constants.js";
import { apiFetch } from "../request.js";

// Fetch listings from API, including bids and optionally filtered by search
export async function fetchListings({ search } = {}) {
  try {
    const url = search
      ? `${API_AUCTIONS_LISTINGS}?q=${encodeURIComponent(
          search
        )}&tags_like=${encodeURIComponent(search)}&_bids=true`
      : `${API_AUCTIONS_LISTINGS}?_bids=true`;

    const data = await apiFetch(url);
    return data?.data || [];
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    throw error;
  }
}

// Fetch a single listing by ID
export async function fetchListingById(id) {
  const url = `${API_AUCTIONS_LISTINGS}/${id}?_bids=true&_seller=true`;
  return apiFetch(url);
}
