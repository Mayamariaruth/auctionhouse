import { editProfile } from "../../api/profile/edit.js";
import { fetchProfile } from "../../api/profile/fetch.js";
import { isValidImageUrl, setError, clearErrors } from "../../utils/errors.js";

// Load Edit profile modal HTML
export async function loadEditProfileModal() {
  const container = document.getElementById("modal-container");
  if (!container) return;

  try {
    const response = await fetch("../../../html/modals/edit-profile.html");
    const html = await response.text();
    container.insertAdjacentHTML("beforeend", html);
    return true;
  } catch (err) {
    console.error("Failed to load Edit Profile modal:", err);
  }
}

// Initialize Edit profile modal
export function initEditProfileModal() {
  const editBtn = document.getElementById("edit-profile-btn");
  if (!editBtn) return;

  editBtn.addEventListener("click", async () => {
    const params = new URLSearchParams(window.location.search);
    const username = params.get("user");
    if (!username) return;

    const profile = await fetchProfile(username);

    // Pre-populate form fields
    document.getElementById("edit-profile-banner").value =
      typeof profile.banner === "object"
        ? profile.banner?.url
        : profile.banner || "";
    document.getElementById("edit-profile-avatar").value =
      typeof profile.avatar === "object"
        ? profile.avatar?.url
        : profile.avatar || "";
    document.getElementById("edit-profile-bio").value = profile.bio || "";

    // Show modal
    const modalEl = document.getElementById("edit-profile-modal");
    const bsModal = new bootstrap.Modal(modalEl);
    bsModal.show();
  });
}

// Form submission
export function initEditProfileForm() {
  const form = document.getElementById("edit-profile-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors(form);

    const banner = document.getElementById("edit-profile-banner").value.trim();
    const avatar = document.getElementById("edit-profile-avatar").value.trim();
    const bio = document.getElementById("edit-profile-bio").value.trim();

    let hasError = false;

    // Banner URL validation
    if (banner && !isValidImageUrl(banner)) {
      setError(form, "banner", "Invalid Banner URL, it must start with 'http'");
      hasError = true;
    }

    // Avatar URL validation
    if (avatar && !isValidImageUrl(avatar)) {
      setError(form, "avatar", "Invalid Avatar UR, it must start with 'http'L");
      hasError = true;
    }

    // Bio validation
    if (bio.length > 150) {
      setError(form, "bio", "Bio cannot exceed 150 characters");
      hasError = true;
    }

    if (hasError) return;

    const params = new URLSearchParams(window.location.search);
    const username = params.get("user");
    const token = localStorage.getItem("accessToken");

    const updatedData = {};
    if (banner) updatedData.banner = { url: banner };
    if (avatar) updatedData.avatar = { url: avatar };
    if (bio) updatedData.bio = bio;

    try {
      await editProfile(username, updatedData, token);

      // Close modal
      const modalEl = document.getElementById("edit-profile-modal");
      const bsModal = bootstrap.Modal.getInstance(modalEl);
      bsModal.hide();

      // Refresh profile
      window.location.reload();
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(form, "bio", err.message || "Failed to update profile");
    }
  });
}
