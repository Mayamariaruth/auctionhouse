import { fetchListingById } from "../../api/listings/fetch.js";
import { showNotification } from "../../utils/notifications.js";
import { isLoggedIn } from "../../utils/auth.js";
import { renderTags } from "./read.js";
import { initBidForm } from "../bids/place.js";
import { renderBidHistory } from "../bids/history.js";
import { initEditListingModal } from "./edit.js";

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
    renderBiddingSection(listing);
  } catch (error) {
    console.error(error);
    showNotification("Failed to load listing details", "error");
  }
}

// Display listing details
function renderListingDetails(listing) {
  const container = document.querySelector("#listing-details article");

  const imageUrl =
    listing.media?.[0]?.url || "../../../assets/images/default-img.png";
  const title = listing.title;
  const description = listing.description?.trim() || "No description provided.";
  const seller = listing.seller || { name: "Unknown seller" };
  const deadline = new Date(listing.endsAt).toLocaleString();
  const tags = listing.tags || [];

  // Check if current user is seller
  const userProfile = JSON.parse(localStorage.getItem("profile") || "{}");
  const isSeller = isLoggedIn() && seller.name === userProfile?.name;

  container.innerHTML = `
    <div class="detail-container">
      <div class="detail-left mt-4 mt-md-0">
        <img src="${imageUrl}" alt="${
    listing.media?.[0]?.alt || "Listing image"
  }" />
        <p class="seller-details mt-3">Posted by <span id="seller-name">${
          seller.name
        }</span></p>
      </div>

      <div class="detail-right">
        <div class="detail-header">
          <h1>${title}</h1>
          ${
            isSeller
              ? `<button class="edit-detail-btn" title="Edit">
                    <i class="fa-solid fa-pen"></i>
                  </button>`
              : ""
          }
        </div>
        <p class="desc-details">${description}</p>
        <p class="deadline-details">Ends ${deadline}</p>
        <div class="listing-tags mb-4">
          ${renderTags(tags)}
        </div>
        <hr>
        <div id="bidding-section">
          <div id="bid-history"></div>
          <div class="logged-in d-none"></div>
          <div class="logged-out d-none"></div>
        </div>
      </div>
    </div>
  `;

  // Open edit listing modal if current user is the seller
  if (isSeller) {
    const editBtn = container.querySelector(".edit-detail-btn");
    if (editBtn) {
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        initEditListingModal(listing);
      });
    }
  }
}

// Display the bidding section
export function renderBiddingSection(listing) {
  const bidHistoryEl = document.getElementById("bid-history");
  const loggedInEl = document.querySelector("#bidding-section .logged-in");
  const loggedOutEl = document.querySelector("#bidding-section .logged-out");

  // Render bid history
  renderBidHistory(listing.bids || [], bidHistoryEl);

  // Toggle sections
  if (isLoggedIn()) {
    loggedOutEl.classList.add("d-none");
    loggedInEl.classList.remove("d-none");

    loggedInEl.innerHTML = `
      <form id="bid-form">
        <input type="number" min="1" name="amount" placeholder="Enter your bid" required />
        <button type="submit" class="bid-btn">Bid</button>
      </form>
    `;

    // Form submission
    initBidForm(listing.id, async () => {
      const updatedListing = await fetchListingById(listing.id);
      renderBidHistory(updatedListing.bids || [], bidHistoryEl);
    });
  } else {
    loggedInEl.classList.add("d-none");
    loggedOutEl.classList.remove("d-none");

    loggedOutEl.innerHTML = `
      <p>Login to place a bid on this listing</p>
      <a href="../login.html" id="details-login-btn">Login</a>
    `;
  }
}
