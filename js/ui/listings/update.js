// update.js
import { API_AUCTIONS_LISTINGS } from "../../api/constants.js";
import { apiFetch } from "../../api/request.js";
import { displayListings } from "./read.js";
import { isValidImageUrl, setError, clearErrors } from "../../utils/errors.js";

let currentListingId = null;

// Load Edit listing modal HTML
export async function loadEditListingModal() {
  const container = document.getElementById("modal-container");
  if (!container) return;

  try {
    const response = await fetch("/html/modals/edit-listing.html");
    const html = await response.text();
    container.insertAdjacentHTML("beforeend", html);
  } catch (err) {
    console.error("Failed to load Edit Listing modal:", err);
  }
}

// Initialize Edit listing modal
export function initEditListingModal(listing) {
  if (!listing) return;

  const form = document.getElementById("edit-listing-form");
  if (!form) return console.warn("Edit listing form not found in DOM");

  currentListingId = listing.id;

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

  const modalEl = document.getElementById("edit-listing-modal");
  const bsModal = new bootstrap.Modal(modalEl);
  bsModal.show();
}

// Edit listing form submission
export function initEditListingForm() {
  const form = document.getElementById("edit-listing-form");
  if (!form) return;

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

    if (!title) {
      setError(form, "title", "Title is required");
      hasError = true;
    } else if (title.length < 3) {
      setError(form, "title", "Title must be at least 3 characters");
      hasError = true;
    }

    if (!description) {
      setError(form, "description", "Description is required");
      hasError = true;
    } else if (description.length < 10) {
      setError(
        form,
        "description",
        "Description must be at least 10 characters"
      );
      hasError = true;
    } else if (description.length > 150) {
      setError(form, "description", "Description cannot exceed 150 characters");
      hasError = true;
    }

    if (mediaInput && !isValidImageUrl(mediaInput)) {
      setError(form, "image", "Invalid image URL");
      hasError = true;
    }

    if (!endsAt) {
      setError(form, "deadline", "Deadline is required");
      hasError = true;
    } else if (new Date(endsAt) <= new Date()) {
      setError(form, "deadline", "Deadline must be in the future");
      hasError = true;
    }

    if (hasError) return;

    const tags = tagsInput
      ? tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

    const updatedData = {
      title,
      description,
      media: mediaInput ? [{ url: mediaInput, alt: "Listing image" }] : [],
      tags,
      endsAt,
    };

    try {
      await apiFetch(`${API_AUCTIONS_LISTINGS}/${currentListingId}`, {
        method: "PATCH",
        body: updatedData,
        auth: true,
      });

      const modalEl = document.getElementById("edit-listing-modal");
      const bsModal = bootstrap.Modal.getInstance(modalEl);
      bsModal.hide();

      displayListings();
    } catch (err) {
      setError(form, "title", err.message || "Failed to update listing");
    }
  });
}
