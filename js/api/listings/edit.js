import { API_AUCTIONS_LISTINGS } from "../constants.js";
import { apiFetch } from "../request.js";

// Update an existing listing by ID
export async function editListing(id, listingData) {
  const url = `${API_AUCTIONS_LISTINGS}/${id}`;
  return apiFetch(url, {
    method: "PUT",
    body: listingData,
    auth: true,
  });
}
