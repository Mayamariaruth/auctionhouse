import { editListing } from "../../api/listings/edit.js";
import { openDeleteListingModal } from "./delete.js";
import { isValidImageUrl, setError, clearErrors } from "../../utils/errors.js";
import { renderListingDetails } from "./details.js";
import { displayListings } from "./read.js";
import { showModalSpinner, hideModalSpinner } from "../../utils/spinner.js";

let currentListingId = null;

// Load Edit listing modal HTML
export async function loadEditListingModal() {
  const container = document.getElementById("modal-container");
  if (!container) return;

  try {
    const response = await fetch("html/modals/edit-listing.html");
    const html = await response.text();
    container.insertAdjacentHTML("beforeend", html);
  } catch (err) {
    console.error("Failed to load Edit Listing modal:", err);
  }
}

// Initialize Edit listing modal
export function initEditListingModal(listing, onSuccess) {
  if (!listing) return;

  const form = document.getElementById("edit-listing-form");
  if (!form) return;

  currentListingId = listing.id;

  form.querySelector("#edit-listing-title").value = listing.title || "";
  form.querySelector("#edit-listing-description").value =
    listing.description || "";
  form.querySelector("#edit-listing-image").value =
    listing.media?.map((m) => m.url).join(", ") || "";
  form.querySelector("#edit-listing-tags").value =
    listing.tags?.join(", ") || "";

  // Show deadline but disable input
  const deadlineInput = form.querySelector("#edit-listing-deadline");
  if (deadlineInput) {
    deadlineInput.value = listing.endsAt ? listing.endsAt.slice(0, 16) : "";
    deadlineInput.disabled = true;
  }

  clearErrors(form);

  // Show modal
  const modalEl = document.getElementById("edit-listing-modal");
  const bsModal = new bootstrap.Modal(modalEl);
  bsModal.show();

  form.dataset.onSuccess = onSuccess ? true : "";
}

// Edit listing form submission
export function initEditListingForm() {
  const form = document.getElementById("edit-listing-form");
  if (!form) return;

  // Delete listing button
  const editDeleteBtn = form.querySelector("#edit-delete-btn");
  if (editDeleteBtn) {
    editDeleteBtn.addEventListener("click", () => {
      if (!currentListingId) return;
      openDeleteListingModal(currentListingId);
    });
  }

  // Event listener
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    showModalSpinner();
    clearErrors(form);

    if (!currentListingId) return;

    const title = form.querySelector("#edit-listing-title").value.trim();
    const description = form
      .querySelector("#edit-listing-description")
      .value.trim();
    const mediaInput = form.querySelector("#edit-listing-image").value.trim();
    const media = mediaInput
      ? mediaInput
          .split(",")
          .map((url, i) => ({ url: url.trim(), alt: `Listing image ${i + 1}` }))
          .filter((m) => isValidImageUrl(m.url))
      : [];
    const tagsInput = form.querySelector("#edit-listing-tags").value.trim();

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

    if (hasError) return;

    // Tags cleanup
    const tags = tagsInput
      ? tagsInput
          .split(",")
          .map((t) => t.trim().replace(/^#/, ""))
          .filter(Boolean)
      : [];

    // Updated data
    const updatedData = {
      title,
      description,
      media,
      tags,
    };

    try {
      await editListing(currentListingId, updatedData);

      // Hide modal
      const modalEl = document.getElementById("edit-listing-modal");
      const bsModal = bootstrap.Modal.getInstance(modalEl);
      bsModal.hide();

      await displayListings();

      const detailsContainer = document.querySelector(
        "#listing-details article"
      );
      if (detailsContainer) {
        const updatedListing = await fetchListingById(currentListingId);
        renderListingDetails(updatedListing);
      }
      // Show success notification
      showNotification("Listing updated successfully!", "success");
    } catch (err) {
      setError(form, "title", err.message || "Failed to update listing");
    } finally {
      hideModalSpinner();
    }
  });
}
