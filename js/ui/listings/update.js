import { isLoggedIn } from "../../utils/auth.js";
import { API_AUCTIONS_LISTINGS } from "../../api/constants.js";
import { apiFetch } from "../../api/request.js";
import { displayListings } from "./read.js";

// Initialize Edit Listing form
export function initEditListingForm() {
  const form = document.getElementById("edit-listing-form");
  if (!form) return;

  let currentListingId = null;

  // Function to open the modal with existing data
  window.openEditListingModal = async (listing) => {
    if (!listing) return;

    currentListingId = listing.id;

    // Pre-fill form fields
    form.querySelector("#edit-listing-title").value = listing.title || "";
    form.querySelector("#edit-listing-description").value =
      listing.description || "";
    form.querySelector("#edit-listing-image").value =
      listing.media?.[0]?.url || "";
    form.querySelector("#edit-listing-tags").value =
      listing.tags?.join(", ") || "";
    form.querySelector("#edit-listing-deadline").value = listing.endsAt
      ? new Date(listing.endsAt).toISOString().slice(0, 16)
      : "";

    clearErrors(form);

    // Show modal
    const modalEl = document.getElementById("edit-listing-modal");
    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearErrors(form);

    if (!currentListingId) return;

    const title = form.querySelector("#edit-listing-title").value.trim();
    const description = form
      .querySelector("#edit-listing-description")
      .value.trim();
    const mediaInput = form.querySelector("#edit-listing-image").value.trim();
    const tagsInput = form.querySelector("#edit-listing-tags").value.trim();
    const endsAt = form.querySelector("#edit-listing-deadline").value;

    let hasError = false;

    try {
      await apiFetch(`${API_AUCTIONS_LISTINGS}/${currentListingId}`, {
        method: "PATCH",
        body: updatedData,
        auth: true,
      });

      // Close modal
      const modalEl = document.getElementById("edit-listing-modal");
      const bsModal = bootstrap.Modal.getInstance(modalEl);
      bsModal.hide();

      displayListings();
    } catch (err) {
      console.error(err);
      setError(form, "title", err.message || "Failed to update listing");
    }
  });
}
