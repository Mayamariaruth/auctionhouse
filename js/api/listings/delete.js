import { API_AUCTIONS_LISTINGS } from "../constants.js";
import { apiFetch } from "../request.js";

// Delete listing by ID
export async function deleteListing(id) {
  return await apiFetch(`${API_AUCTIONS_LISTINGS}/${id}`, {
    method: "DELETE",
    auth: true,
  });
}
