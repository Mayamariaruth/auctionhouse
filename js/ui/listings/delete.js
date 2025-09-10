import { deleteListing } from "../../api/listings/delete.js";
import { displayListings } from "./read.js";
import { displayProfileListings } from "../profile/listings.js";

let currentDeleteListingId = null;

// Load Delete Listing modal HTML
export async function loadDeleteModal() {
  const container = document.getElementById("modal-container");
  if (!container) return;

  try {
    const response = await fetch("/html/modals/delete-listing.html");
    const html = await response.text();
    container.insertAdjacentHTML("beforeend", html);
  } catch (err) {
    console.error("Failed to load Delete Listing modal:", err);
  }
}

// Initialize Delete Listing modal
export function initDeleteListingModal() {
  const deleteModalEl = document.getElementById("delete-listing-modal");
  if (!deleteModalEl) return console.warn("Delete Listing modal not found");

  const bsDeleteModal = new bootstrap.Modal(deleteModalEl);

  const confirmBtn = deleteModalEl.querySelector("#delete-btn");
  if (!confirmBtn) return;

  // Event listener
  confirmBtn.addEventListener("click", async () => {
    if (!currentDeleteListingId) return;

    try {
      await deleteListing(currentDeleteListingId);

      bsDeleteModal.hide();
      currentDeleteListingId = null;

      window.location.reload();
    } catch (err) {
      console.error("Failed to delete listing:", err);
    }
  });
}

// Open Delete Listing modal
export function openDeleteListingModal(listingId) {
  currentDeleteListingId = listingId;

  // Close Edit Listing modal if it's open
  const editModalEl = document.getElementById("edit-listing-modal");
  const bsEditModal = bootstrap.Modal.getInstance(editModalEl);
  if (bsEditModal) bsEditModal.hide();

  // Show Delete Listing modal
  const deleteModalEl = document.getElementById("delete-listing-modal");
  const bsDeleteModal =
    bootstrap.Modal.getInstance(deleteModalEl) ||
    new bootstrap.Modal(deleteModalEl);
  bsDeleteModal.show();
}
