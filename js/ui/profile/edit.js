/* global bootstrap */
import { editProfile } from "../../api/profile/edit.js";
import { isValidImageUrl, setError, clearErrors } from "../../utils/errors.js";
import { showModalSpinner, hideModalSpinner } from "../../utils/spinner.js";
import { getProfile } from "../../utils/auth.js";
import { showNotification } from "../../utils/notifications.js";
import { fetchPath } from "../../utils/fetchPath.js";

// Load Edit profile modal HTML
let editProfileModalLoaded = false;
export async function loadEditProfileModal() {
  const container = document.getElementById("modal-container");
  if (!container || editProfileModalLoaded) return;

  try {
    const response = await fetchPath("html/modals/edit-profile.html");
    const html = await response.text();
    container.insertAdjacentHTML("beforeend", html);
    editProfileModalLoaded = true;
  } catch (err) {
    console.error("Failed to load Edit Profile modal:", err);
  }
}

// Initialize Edit profile modal
export function initEditProfileModal() {
  const editBtn = document.getElementById("edit-profile-btn");
  if (!editBtn) return;

  // Event listener
  editBtn.addEventListener("click", () => {
    const user = getProfile();
    if (!user) return;

    // Pre-populate form fields
    document.getElementById("edit-profile-banner").value =
      typeof user.banner === "object" ? user.banner?.url : user.banner || "";
    document.getElementById("edit-profile-avatar").value =
      typeof user.avatar === "object" ? user.avatar?.url : user.avatar || "";
    document.getElementById("edit-profile-bio").value = user.bio || "";

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

  // Event listener
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showModalSpinner();
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
      setError(form, "avatar", "Invalid Avatar URL, it must start with 'http'");
      hasError = true;
    }

    // Bio validation
    if (bio.length > 150) {
      setError(form, "bio", "Bio cannot exceed 150 characters");
      hasError = true;
    }

    if (hasError) return;

    const user = getProfile();
    if (!user) return;

    // Updated data
    const updatedData = {};
    if (banner) updatedData.banner = { url: banner };
    if (avatar) updatedData.avatar = { url: avatar };
    if (bio) updatedData.bio = bio;

    try {
      await editProfile(user.name, updatedData);

      // Update profile object in localStorage
      const updatedProfile = { ...user, ...updatedData };
      localStorage.setItem("profile", JSON.stringify(updatedProfile));

      // Update profile details
      if (banner) document.getElementById("profile-banner").src = banner;
      if (avatar) document.getElementById("profile-avatar").src = avatar;
      if (bio) document.getElementById("profile-bio").textContent = bio;

      // Close modal
      const modalEl = document.getElementById("edit-profile-modal");
      const bsModal = bootstrap.Modal.getInstance(modalEl);
      bsModal.hide();

      // Show success notification
      showNotification("Profile updated successfully!", "success");
    } catch (err) {
      console.error("Failed to update profile:", err);
      setError(form, "bio", err.message || "Failed to update profile");
    } finally {
      hideModalSpinner();
    }
  });
}
