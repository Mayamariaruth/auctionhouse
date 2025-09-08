import { API_AUCTIONS_LISTINGS } from "../../api/constants.js";
import { apiFetch } from "../../api/request.js";
import { displayListings } from "./read.js";

let currentDeleteListingId = null;

// Load Delete Listing modal HTML
export async function loadDeleteModal() {
  const container = document.getElementById("modal-container");
  if (!container) return;

  try {
    const response = await fetch("/html/modals/delete-listing.html");
    const html = await response.text();
    container.innerHTML += html;
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
  if (confirmBtn) {
    confirmBtn.addEventListener("click", async () => {
      if (!currentDeleteListingId) return;

      try {
        await apiFetch(`${API_AUCTIONS_LISTINGS}/${currentDeleteListingId}`, {
          method: "DELETE",
          auth: true,
        });

        bsDeleteModal.hide();
        currentDeleteListingId = null;

        displayListings();
      } catch (err) {
        console.error("Failed to delete listing:", err);
      }
    });
  }
}
