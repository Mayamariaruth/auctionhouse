import { fetchListingById } from "../../api/listings/fetch.js";
import { showNotification } from "../../utils/notifications.js";
import { isLoggedIn } from "../../utils/auth.js";
import { renderTags } from "./read.js";

// Fetch listing ID from URL
function getListingIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// Load listing details from ID
export async function loadListingDetails() {
  const id = getListingIdFromUrl();
  if (!id) {
    showNotification("No listing ID found in URL", "error");
    return;
  }

  try {
    const listing = await fetchListingById(id);
    renderListingDetails(listing);
  } catch (error) {
    console.error(error);
    showNotification("Failed to load listing details", "error");
  }
}

// Display listing details
function renderListingDetails(listing) {
  const container = document.querySelector("#listing-details article");

  const imageUrl =
    listing.media?.[0]?.url ||
    "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0";
  const title = listing.title;
  const description = listing.description?.trim() || "No description provided.";
  const seller = listing.seller?.name || "Unknown seller";
  const deadline = new Date(listing.endsAt).toLocaleString();
  const tags = listing.tags || [];

  container.innerHTML = `
    <div class="detail-container">
      <div class="detail-left">
        <img src="${imageUrl}" alt="${
    listing.media?.[0]?.alt || "Listing image"
  }" />
        <p class="seller-details mt-3">Posted by <span id="seller-name">${seller}</span></p>
      </div>

      <div class="detail-right">
        <h1>${title}</h1>
        <p class="desc-details">${description}</p>
        <p class="deadline-details">Ends ${deadline}</p>
        <div class="listing-tags mb-4">
          ${renderTags(tags)}
        </div>
      </div>

      <div id="bidding-section">
        <div id="bid-history"></div>
        <div class="logged-in d-none"></div>
        <div class="logged-out d-none"></div>
      </div>
    </div>
  `;
}
