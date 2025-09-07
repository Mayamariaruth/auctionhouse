import { isLoggedIn, getProfile } from "../../utils/auth.js";
import { API_AUCTIONS_LISTINGS } from "../../api/constants.js";
import { apiFetch } from "../../api/request.js";
import { showNotification } from "../../utils/notifications.js";
import { displayListings } from "./read.js";

// Add Listing form submission
export function initAddListingForm() {
  const form = document.getElementById("add-listing-form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!isLoggedIn()) {
      showNotification("You must be logged in to add a listing", "error");
      return;
    }

    const profile = getProfile();
    if (!profile) {
      showNotification("Profile not found", "error");
      return;
    }

    // Form fields
    const title = form.querySelector("#listing-title").value.trim();
    const description = form.querySelector("#listing-description").value.trim();
    const mediaInput = form.querySelector("#listing-image").value.trim();
    const tagsInput = form.querySelector("#listing-tags").value.trim();
    const endsAt = form.querySelector("#listing-deadline").value;

    // Basic validation
    if (!title || !description || !endsAt) {
      showNotification(
        "Title, description, and deadline are required",
        "error"
      );
      return;
    }

    const tags = tagsInput ? tagsInput.split(",").map((t) => t.trim()) : [];

    // Listing data
    const listingData = {
      title,
      description,
      media: mediaInput ? [{ url: mediaInput, alt: "Listing image" }] : [],
      tags,
      endsAt,
    };

    try {
      await apiFetch(API_AUCTIONS_LISTINGS, {
        method: "POST",
        body: listingData,
        auth: true,
      });

      showNotification("Listing added successfully!", "success");

      form.reset();

      // Close modal
      const modalEl = document.getElementById("add-listing-modal");
      const bsModal = bootstrap.Modal.getInstance(modalEl);
      bsModal.hide();

      displayListings();
    } catch (err) {
      console.error(err);
      showNotification(err.message || "Failed to add listing", "error");
    }
  });
}
