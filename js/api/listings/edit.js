import { API_AUCTIONS_LISTINGS } from "../constants.js";
import { apiFetch } from "../request.js";

// Update an existing listing by ID
export async function editListing(id, listingData) {
  try {
    const url = `${API_AUCTIONS_LISTINGS}/${id}`;
    return await apiFetch(url, {
      method: "PUT",
      body: listingData,
      auth: true,
    });
  } catch (error) {
    console.error(`Failed to edit listing with ID ${id}:`, error);
    throw error;
  }
}
