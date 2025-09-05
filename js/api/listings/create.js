import { API_AUCTIONS_LISTINGS } from "../constants.js";
import { apiFetch } from "../request.js";

// Create a new listing
export async function createListing(listingData) {
  return apiFetch(API_AUCTIONS_LISTINGS, {
    method: "POST",
    body: listingData,
    auth: true,
  });
}
