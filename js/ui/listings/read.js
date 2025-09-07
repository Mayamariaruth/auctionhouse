import { isLoggedIn } from "../../utils/auth.js";
import { fetchListings } from "../../api/listings/fetch.js";

// Initialize listings grid and button
export async function initListingsPage() {
  toggleListingButton();
  await loadAddListingModal();
  initAddListingModal();
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

  if (!addBtn) return console.warn("Add Listing button not found");
  if (!modalEl) return console.warn("Add Listing modal not found");

  const bsModal = new bootstrap.Modal(modalEl);

  addBtn.addEventListener("click", () => bsModal.show());
}

// Display all listings in the grid
async function displayListings(search = "") {
  const listingsContainer = document.getElementById("listings");
  if (!listingsContainer) return;

  try {
    const listings = await fetchListings({ search });
    listingsContainer.innerHTML = "";

    if (!listings.length) {
      listingsContainer.innerHTML = `<p class="text-center fs-4">No listings found.</p>`;
      return;
    }

    listings.forEach((listing) => {
      const listingEl = createListingCard(listing);
      listingsContainer.appendChild(listingEl);
    });
  } catch (err) {
    listingsContainer.innerHTML = `<p class="text-danger text-center fs-4">Failed to load listings</p>`;
    console.error(err);
  }
}
