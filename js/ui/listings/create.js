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

    clearErrors(form);

    if (!isLoggedIn()) return setError(form, "title", "You must be logged in");

    const profile = getProfile();
    if (!profile) return setError(form, "title", "Profile not found");

    // Form elements
    const title = form.querySelector("#listing-title").value.trim();
    const description = form.querySelector("#listing-description").value.trim();
    const mediaInput = form.querySelector("#listing-image").value.trim();
    const tagsInput = form.querySelector("#listing-tags").value.trim();
    const endsAt = form.querySelector("#listing-deadline").value;

    let hasError = false;

    // Title validation
    if (!title) {
      setError(form, "title", "Title is required");
      hasError = true;
    } else if (title.length < 3) {
      setError(form, "title", "Title must be at least 3 characters");
      hasError = true;
    }

    // Description validation
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

    // Image validation
    if (mediaInput && !isValidImageUrl(mediaInput)) {
      setError(form, "image", "Invalid image URL");
      hasError = true;
    }

    // Deadline validation
    if (!endsAt) {
      setError(form, "deadline", "Deadline is required");
      hasError = true;
    } else if (new Date(endsAt) <= new Date()) {
      setError(form, "deadline", "Deadline must be in the future");
      hasError = true;
    }

    if (hasError) return;

    // Tags cleanup
    const tags = tagsInput
      ? tagsInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];

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

// Validate image URL
function isValidImageUrl(url) {
  try {
    new URL(url);
    return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
  } catch {
    return false;
  }
}

// Set error message and highlight field
function setError(form, fieldId, message) {
  const field = form.querySelector(`#listing-${fieldId}`);
  const errorEl = form.querySelector(`#${fieldId}-error`);
  if (field) field.classList.add("input-error");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add("active");
  }
}

// Clear all errors from the form
function clearErrors(form) {
  const errorEls = form.querySelectorAll(".error-message");
  errorEls.forEach((el) => {
    el.textContent = "";
    el.classList.remove("active");
  });
  const fields = form.querySelectorAll(".form-control");
  fields.forEach((el) => el.classList.remove("input-error"));
}
