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
export function renderListingDetails(listing) {
  const container = document.querySelector("#listing-details article");

  const imageUrls = listing.media?.length
    ? listing.media.map((m, i) => ({
        url: m.url,
        alt: m.alt || `Listing image ${i + 1}`,
      }))
    : [
        {
          url: "/auctionhouse/assets/images/default-img.png",
          alt: "Listing image",
        },
      ];
  const title = listing.title;
  const description = listing.description?.trim() || "No description provided.";
  const seller = listing.seller || { name: "Unknown seller" };
  const tags = listing.tags || [];
  const endsAt = new Date(listing.endsAt);
  const deadline = endsAt.toLocaleString();
  const isActive = endsAt > new Date();

  // Check if current user is seller
  const userProfile = JSON.parse(localStorage.getItem("profile") || "{}");
  const isSeller = isLoggedIn() && seller.name === userProfile?.name;

  // Build carousel HTML
  const galleryHtml =
    imageUrls.length > 0
      ? `
        <div id="listing-gallery" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            ${imageUrls
              .map(
                (img, i) => `
              <div class="carousel-item ${i === 0 ? "active" : ""}">
                <img src="${img.url}" class="d-block w-100" alt="${
                  img.alt || "Listing image"
                }">
              </div>
            `
              )
              .join("")}
          </div>
          <button class="carousel-control-prev bg-dark bg-opacity-50 p-3" type="button" data-bs-target="#listing-gallery" data-bs-slide="prev">
            <span class="carousel-control-prev-icon"></span>
            <span class="visually-hidden">Previous</span>
          </button>

          <button class="carousel-control-next bg-dark bg-opacity-50 p-3" type="button" data-bs-target="#listing-gallery" data-bs-slide="next">
            <span class="carousel-control-next-icon"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      `
      : `<img src="/auctionhouse/assets/images/default-img.png" alt="Listing image" />`;

  container.innerHTML = `
    <div class="detail-container">
      <div class="detail-left mt-4 mt-md-0">
        ${galleryHtml}
        <p class="seller-details mt-3">Posted by <span id="seller-name">${
          seller.name
        }</span></p>
      </div>

      <div class="detail-right">
        <div class="detail-header">
          <h1>${title.charAt(0).toUpperCase() + title.slice(1)}</h1>
          ${
            isSeller
              ? `<button class="edit-detail-btn" title="Edit">
                    <i class="fa-solid fa-pen"></i>
                  </button>`
              : ""
          }
        </div>
        <p class="desc-details mt-2">${description}</p>
        <p class="deadline-details">
          Ends ${deadline} 
          <span class="auction-status ${isActive ? "active" : "ended"}">
            ${isActive ? "Active" : "Ended"}
          </span>
        </p>

        <div class="listing-tags mb-4">
          ${renderTags(tags)}
        </div>
        <hr>
        <div id="bidding-section">
          <div id="bid-history"></div>
          <hr>
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

// Display the bidding section with different logged in/logged out prompts
export function renderBiddingSection(listing) {
  const bidHistoryEl = document.getElementById("bid-history");
  const loggedInEl = document.querySelector("#bidding-section .logged-in");
  const loggedOutEl = document.querySelector("#bidding-section .logged-out");

  renderBidHistory(listing.bids || [], bidHistoryEl);

  const endsAt = new Date(listing.endsAt);
  const isActive = endsAt > new Date();
  const userProfile = JSON.parse(localStorage.getItem("profile") || "{}");
  const isSeller = listing.seller?.name === userProfile?.name;
  const loggedIn = isLoggedIn();

  loggedInEl.classList.add("d-none");
  loggedOutEl.classList.add("d-none");

  if (!isActive) {
    // Listing ended — show message to everyone
    loggedInEl.classList.remove("d-none");
    loggedInEl.innerHTML = `<p class="fw-semibold">This auction has ended. Bidding is closed.</p>`;
  } else if (isSeller) {
    // Active listing but user is seller — no bid form
    loggedInEl.classList.remove("d-none");
    loggedInEl.innerHTML = `<p class="fw-semibold">You cannot bid on your own listing.</p>`;
  } else if (loggedIn) {
    // Active listing & logged in user (not seller) — show bid form
    loggedInEl.classList.remove("d-none");
    loggedInEl.innerHTML = `
      <form id="bid-form">
        <input type="number" min="1" name="amount" placeholder="Enter your bid" required />
        <button type="submit" class="bid-btn">Bid</button>
      </form>
    `;
    initBidForm(listing.id, async () => {
      const updatedListing = await fetchListingById(listing.id);
      renderBidHistory(updatedListing.bids || [], bidHistoryEl);
    });
  } else {
    // Active listing & not logged in — show login prompt
    loggedOutEl.classList.remove("d-none");
    loggedOutEl.innerHTML = `
      <div class="d-flex flex-column mt-4">
        <p class="fw-semibold details-login-text">Login to place a bid on this listing</p>
        <a href="/auctionhouse/html/login.html" id="details-login-btn">Login</a>
      </div>
    `;
  }
}
