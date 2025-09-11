import { isLoggedIn } from "../../utils/auth.js";
import { fetchListings } from "../../api/listings/fetch.js";
import { initAddListingForm } from "./create.js";
import {
  initEditListingForm,
  initEditListingModal,
  loadEditListingModal,
} from "./edit.js";
import { loadDeleteModal, initDeleteListingModal } from "./delete.js";

// Initialize landing page with button, listings grid and modals
export async function initListingsPage() {
  toggleListingButton();
  await loadAddListingModal();
  await loadEditListingModal();
  await loadDeleteModal();
  initAddListingModal();
  initAddListingForm();
  initEditListingModal();
  initEditListingForm();
  initDeleteListingModal();
  await displayListings();
}

// Toggle Add Listing button
function toggleListingButton() {
  const addBtnContainer = document.querySelector(".add-btn-container");
  if (!addBtnContainer) return;

  if (isLoggedIn()) {
    addBtnContainer.classList.remove("d-none");
    addBtnContainer.classList.add("d-flex");
  } else {
    addBtnContainer.classList.add("d-none");
    addBtnContainer.classList.remove("d-flex");
  }
}

// Load Add listing modal HTML
async function loadAddListingModal() {
  const container = document.getElementById("modal-container");
  if (!container) return;

  try {
    const response = await fetch("/html/modals/add-listing.html");
    const html = await response.text();
    container.innerHTML = html;
  } catch (err) {
    console.error("Failed to load Add Listing modal:", err);
  }
}

// Initialize Add listing modal
export function initAddListingModal() {
  const addBtn = document.getElementById("add-listing-btn");
  const modalEl = document.getElementById("add-listing-modal");

  if (!addBtn) return;
  if (!modalEl) return;

  const bsModal = new bootstrap.Modal(modalEl);

  addBtn.addEventListener("click", () => bsModal.show());
}

// Display all listings in the grid
export async function displayListings(search = "") {
  const listingsContainer = document.getElementById("listings");
  if (!listingsContainer) return;

  try {
    const listings = await fetchListings({ search });
    listingsContainer.innerHTML = "";

    if (!listings.length) {
      listingsContainer.innerHTML = `<p class="text-center fs-5">No listings found.</p>`;
      return;
    }

    listings.forEach((listing) => {
      createListingCard(listing, listingsContainer);
    });
  } catch (err) {
    listingsContainer.innerHTML = `<p class="text-danger text-center fs-5">Failed to load listings</p>`;
    console.error(err);
  }
}

// Create each listing card
export function createListingCard(listing, container) {
  if (!listing || !container) return;

  // Destructure listing data
  const {
    id,
    title,
    description,
    media,
    endsAt,
    tags,
    _count: { bids } = { bids: 0 },
    seller,
  } = listing;

  const fallbackImage = "/assets/images/default-img.png";
  const imageUrl =
    media && media.length
      ? typeof media[0] === "string"
        ? media[0]
        : media[0]?.url || fallbackImage
      : fallbackImage;

  const imageAlt = title;
  const sellerName = seller?.name || "Unknown";
  const safeDescription =
    description && description.trim().length
      ? description
      : "No description provided.";

  // Check if current user is seller
  const userProfile = JSON.parse(localStorage.getItem("profile") || "{}");
  const isSeller = isLoggedIn() && seller?.name === userProfile?.name;

  // Check is listing is active or ended
  const isActive = new Date(endsAt) > new Date();

  // Create card column
  const col = document.createElement("div");
  col.className = "col-sm-6 col-md-4 col-lg-3";

  // Card HTML
  col.innerHTML = `
  <div class="card listing-card">
    <div class="listing-image-wrapper position-relative">
      <img src="${imageUrl}" class="card-img-top" alt="${imageAlt}" />
      <div class="bids-box position-absolute top-0 start-0 m-2 px-2 py-1">
        ${bids} bid${bids !== 1 ? "s" : ""}
      </div>
      <div class="status-badge position-absolute top-0 end-0 m-2 px-2 py-1 ${
        isActive ? "active" : "ended"
      }">
        ${isActive ? "Active" : "Ended"}
      </div>

      <div class="seller-box position-absolute bottom-0 start-0 end-0 px-4 py-2">
        Posted by <strong>${sellerName}</strong>
      </div>
    </div>
    <div class="card-body">
      <h5 class="card-title">${
        title.charAt(0).toUpperCase() + title.slice(1)
      }</h5>
      ${
        isSeller
          ? `<button class="edit-listing-btn" title="Edit">
                   <i class="fa-solid fa-pen"></i>
                 </button>`
          : ""
      }
      <p class="card-text">${safeDescription}</p>
      <p class="mb-2 date-text">Ends ${new Date(endsAt).toLocaleString()}</p>
      <div class="listing-tags mb-3">
        ${renderTags(tags)}
      </div>
      <button class="listing-btn">
        ${isLoggedIn() ? "Bid" : "See Listing"}
      </button>
    </div>
  </div>
`;

  container.appendChild(col);

  // Open edit listing modal if current user is the seller
  if (isSeller) {
    const editBtn = col.querySelector(".edit-listing-btn");
    if (editBtn) {
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        initEditListingModal(listing);
      });
    }
  }

  // Fallback for images
  const img = col.querySelector("img");
  if (img) {
    img.onerror = () => {
      img.onerror = null;
      img.src = "/assets/images/default-img.png";
      img.alt = "Image unavailable";
    };
  }

  // Image handler
  const imageWrapper = col.querySelector(".listing-image-wrapper");
  if (imageWrapper) {
    imageWrapper.addEventListener("click", () => {
      window.location.href = `/html/listing.html?id=${id}`;
    });
  }

  // Listing Button handler
  const btn = col.querySelector(".listing-btn");
  btn.addEventListener("click", () => {
    window.location.href = `/html/listing.html?id=${id}`;
  });
}

// Render tags as boxes
export function renderTags(tags = []) {
  if (!tags.length) return '<span class="tag-box">No tags</span>';

  return tags.map((tag) => `<span class="tag-box">${tag}</span>`).join(" ");
}
