import { API_AUCTIONS_LISTINGS } from "../constants.js";
import { apiFetch } from "../request.js";

// Place a bid on a listing
export async function placeBid(id, bidData) {
  try {
    const url = `${API_AUCTIONS_LISTINGS}/${id}/bids`;
    return await apiFetch(url, {
      method: "POST",
      body: bidData,
      auth: true,
    });
  } catch (error) {
    console.error(`Failed to place bid on listing with ID ${id}:`, error);
    throw error;
  }
}
