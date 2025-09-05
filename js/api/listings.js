import { API_AUCTIONS_LISTINGS } from "./constants.js";
import { apiFetch } from "./request.js";

// Fetch listings by title or tags
export async function readListings(search = "") {
  const url = new URL(API_AUCTIONS_LISTINGS);

  if (search) {
    url.searchParams.append("_tag", search); // filter by tag
    url.searchParams.append("_title", search); // filter by title
  }

  try {
    const listings = await apiFetch(url.toString());
    return listings;
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    throw error;
  }
}
