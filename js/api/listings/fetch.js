import { API_AUCTIONS_LISTINGS } from "../constants.js";
import { apiFetch } from "../request.js";

// Fetch listings from API, including bids and optionally filtered by search
export async function fetchListings({ search } = {}) {
  try {
    const baseUrl = `${API_AUCTIONS_LISTINGS}?_bids=true&_seller=true&sort=created&sortOrder=desc`;
    const url = search ? `${baseUrl}&q=${encodeURIComponent(search)}` : baseUrl;

    const listings = await apiFetch(url);
    return listings;
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    return [];
  }
}

// Fetch a single listing by ID
export async function fetchListingById(id) {
  try {
    const url = `${API_AUCTIONS_LISTINGS}/${id}?_bids=true&_seller=true`;
    return await apiFetch(url);
  } catch (error) {
    console.error(`Failed to fetch listing with ID ${id}:`, error);
    throw error;
  }
}
