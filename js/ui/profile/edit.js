import { editProfile } from "../../api/profile/edit.js";
import { fetchProfile } from "../../api/profile/fetch.js";

// Load Edit profile modal HTML
export async function loadEditProfileModal() {
  const container = document.getElementById("modal-container");
  if (!container) return;

  try {
    const response = await fetch("/html/modals/edit-profile.html");
    const html = await response.text();
    container.insertAdjacentHTML("beforeend", html);
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
