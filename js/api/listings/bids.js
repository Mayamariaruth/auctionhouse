import { API_AUCTIONS_LISTINGS } from "../constants.js";
import { apiFetch } from "../request.js";

// Place a bid on a listing
export async function placeBid(id, bidData) {
  const url = `${API_AUCTIONS_LISTINGS}/${id}/bids`;
  return apiFetch(url, {
    method: "POST",
    body: bidData,
    auth: true,
  });
}
