import { fetchListingById } from "../../api/listings/fetch.js";
import { showNotification } from "../../utils/notifications.js";
import { isLoggedIn } from "../../utils/auth.js";
import { renderTags } from "./read.js";
import { initBidForm } from "../bids/place.js";
import { renderBidHistory } from "../bids/history.js";
import { initEditListingModal } from "./edit.js";

// Fetch listing ID from URL
function getListingIdFromUrl() {
  return new URLSearchParams(window.location.search).get("id");
}

// Load listing details
export async function loadListingDetails() {
  const id = getListingIdFromUrl();
  if (!id) return showNotification("No listing ID found in URL", "error");

  try {
    const listing = await fetchListingById(id);
    renderListingDetails(listing);
    initImageModal();
    renderBiddingSection(listing);
  } catch (err) {
    console.error(err);
    showNotification("Failed to load listing details", "error");
  }
}

// Render listing details
export function renderListingDetails(listing) {
  const container = document.querySelector("#listing-details article");
  const userProfile = JSON.parse(localStorage.getItem("profile") || "{}");
  const isSeller = isLoggedIn() && listing.seller?.name === userProfile?.name;

  // Base HTML + image carousel
  container.innerHTML = `
    <div class="detail-container">
      <div class="detail-left mt-4 mt-md-0">
        <div id="listing-gallery" class="carousel slide">
          <div class="carousel-inner"></div>
          <button class="carousel-control-prev" type="button" data-bs-target="#listing-gallery" data-bs-slide="prev">
            <span class="carousel-control-prev-icon"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#listing-gallery" data-bs-slide="next">
            <span class="carousel-control-next-icon"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
        <p class="seller-details mt-3">
          Posted by <span id="seller-name">${
            listing.seller?.name || "Unknown"
          }</span>
        </p>
      </div>

      <div class="detail-right">
        <div class="detail-header">
          <h1>${
            listing.title.charAt(0).toUpperCase() + listing.title.slice(1)
          }</h1>
          ${
            isSeller
              ? `<button class="edit-detail-btn" title="Edit"><i class="fa-solid fa-pen"></i></button>`
              : ""
          }
        </div>
        <p class="desc-details mt-2">${
          listing.description?.trim() || "No description provided."
        }</p>
        <p class="deadline-details">
          Ends ${new Date(listing.endsAt).toLocaleString()}
          <span class="auction-status ${
            new Date(listing.endsAt) > new Date() ? "active" : "ended"
          }">
            ${new Date(listing.endsAt) > new Date() ? "Active" : "Ended"}
          </span>
        </p>
        <div class="listing-tags mb-4">${renderTags(listing.tags || [])}</div>
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

  // Populate carousel items dynamically
  const innerEl = container.querySelector("#listing-gallery .carousel-inner");
  const images = listing.media?.length
    ? listing.media
    : [
        {
          url: "/auctionhouse/assets/images/default-img.png",
          alt: "Listing image",
        },
      ];

  innerEl.innerHTML = images
    .map(
      (img, i) => `
      <div class="carousel-item${i === 0 ? " active" : ""}">
        <img src="${img.url}" class="d-block w-100 carousel-img" alt="${
        img.alt || "Listing image"
      }">
      </div>`
    )
    .join("");

  // Edit button
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

// Render bidding section
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
    loggedInEl.classList.remove("d-none");
    loggedInEl.innerHTML = `<p class="fw-semibold">This auction has ended. Bidding is closed.</p>`;
  } else if (isSeller) {
    loggedInEl.classList.remove("d-none");
    loggedInEl.innerHTML = `<p class="fw-semibold">You cannot bid on your own listing.</p>`;
  } else if (loggedIn) {
    loggedInEl.classList.remove("d-none");
    loggedInEl.innerHTML = `
      <form id="bid-form">
        <input type="number" min="1" name="amount" placeholder="Enter your bid" required />
        <button type="submit" class="bid-btn">Bid</button>
      </form>
    `;
    initBidForm(listing.id, async () => {
      const updated = await fetchListingById(listing.id);
      renderBidHistory(updated.bids || [], bidHistoryEl);
    });
  } else {
    loggedOutEl.classList.remove("d-none");
    loggedOutEl.innerHTML = `
      <div class="d-flex flex-column mt-4">
        <p class="fw-semibold details-login-text">Login to place a bid on this listing</p>
        <a href="/auctionhouse/html/login.html" id="details-login-btn">Login</a>
      </div>
    `;
  }
}

// Image modal
function initImageModal() {
  const existingModal = document.getElementById("image-modal");
  if (existingModal) existingModal.remove();

  const modalHtml = `
    <div class="modal fade" id="image-modal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content bg-transparent border-0">
          <div class="modal-body p-0">
            <img id="modal-image" src="" alt="Full image" class="img-fluid w-100" />
          </div>
        </div>
      </div>
    </div>
  `;
  document
    .getElementById("modal-container")
    .insertAdjacentHTML("beforeend", modalHtml);

  document.querySelectorAll("#listing-gallery .carousel-img").forEach((img) => {
    img.addEventListener("click", (e) => {
      e.stopPropagation();
      const modalImage = document.getElementById("modal-image");
      modalImage.src = img.src;
      modalImage.alt = img.alt;
      bootstrap.Modal.getOrCreateInstance(
        document.getElementById("image-modal")
      ).show();
    });
  });
}
