import { fetchListingById } from "../../api/listings/read.js";
import { showNotification } from "../../utils/notifications.js";
import { isLoggedIn } from "../../utils/auth.js";

// Fetch listing ID from URL
function getListingIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

async function loadListingDetails() {
  const id = getListingIdFromUrl();
  if (!id) {
    showNotification("No listing ID found in URL", "error");
    return;
  }

  try {
    const listing = await fetchListingById(id);
    renderListingDetails(listing);
    renderBiddingSection(listing);
  } catch (error) {
    showNotification("Failed to load listing details", "error");
  }
}
