import { isLoggedIn, getProfile } from "../../utils/auth.js";
import { createListing } from "../../api/listings/create.js";
import { showNotification } from "../../utils/notifications.js";
import { displayListings } from "./read.js";
import { isValidImageUrl, setError, clearErrors } from "../../utils/errors.js";
import { showModalSpinner, hideModalSpinner } from "../../utils/spinner.js";

// Add Listing form submission
export function initAddListingForm() {
  const form = document.getElementById("add-listing-form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showModalSpinner();

    clearErrors(form);

    if (!isLoggedIn()) return setError(form, "title", "You must be logged in");

    const profile = getProfile();
    if (!profile) return setError(form, "title", "Profile not found");

    // Form elements
    const title = form.querySelector("#listing-title").value.trim();
    const description = form.querySelector("#listing-description").value.trim();
    const mediaInput = form.querySelector("#listing-image").value.trim();
    const media = mediaInput
      ? mediaInput
          .split(",")
          .map((url, i) => ({ url: url.trim(), alt: `Listing image ${i + 1}` }))
          .filter((m) => isValidImageUrl(m.url))
      : [];
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
    if (mediaInput) {
      const urls = mediaInput
        .split(",")
        .map((u) => u.trim())
        .filter(Boolean);

      const invalid = urls.find((url) => !isValidImageUrl(url));
      if (invalid) {
        setError(form, "image", `Invalid image URL: ${invalid}`);
        hasError = true;
      }
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
          .map((t) => t.trim().replace(/^#/, ""))
          .filter(Boolean)
      : [];

    // Listing data
    const listingData = {
      title,
      description,
      media,
      tags,
      endsAt,
    };

    try {
      await createListing(listingData);

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
    } finally {
      hideModalSpinner();
    }
  });
}
