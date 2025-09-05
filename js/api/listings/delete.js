import { API_AUCTIONS_LISTINGS } from "../constants.js";
import { apiFetch } from "../request.js";

// Delete listing by ID
export async function deleteListing(id) {
  try {
    return await apiFetch(`${API_AUCTIONS_LISTINGS}/${id}`, {
      method: "DELETE",
      auth: true,
    });
  } catch (error) {
    console.error(`Failed to delete listing with ID ${id}:`, error);
    throw error;
  }
}
