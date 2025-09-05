import { API_AUCTIONS_LISTINGS } from "./constants.js";
import { apiFetch } from "./request.js";

// Fetch listings from API
export async function fetchListings({ search } = {}) {
  if (!search) {
    // Return all listings with bids
    return await apiFetch(`${API_AUCTIONS_LISTINGS}?_bids=true`);
  }

  // Search by title/description
  const byQuery = await apiFetch(
    `${API_AUCTIONS_LISTINGS}?q=${encodeURIComponent(search)}&_bids=true`
  );

  // Search by tags
  const byTags = await apiFetch(
    `${API_AUCTIONS_LISTINGS}?tags_like=${encodeURIComponent(
      search
    )}&_bids=true`
  );

  // Merge search results
  const merged = [...byQuery, ...byTags];
  const unique = merged.filter(
    (item, index, self) => index === self.findIndex((i) => i.id === item.id)
  );

  return unique;
}

// Fetch a single listing by ID
export async function fetchListingById(id) {
  const url = `${API_AUCTIONS_LISTINGS}/${id}?_bids=true&_seller=true`;
  return apiFetch(url);
}
