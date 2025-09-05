import { API_AUCTIONS_LISTINGS } from "../constants.js";
import { apiFetch } from "../request.js";

// Create a new listing
export async function createListing(listingData) {
  try {
    return await apiFetch(API_AUCTIONS_LISTINGS, {
      method: "POST",
      body: listingData,
      auth: true,
    });
  } catch (error) {
    console.error("Failed to create listing:", error);
    throw error;
  }
}
