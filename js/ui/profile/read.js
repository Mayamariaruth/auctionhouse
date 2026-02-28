import { fetchProfile } from "../../api/profile/fetch.js";
import { displayProfileListings } from "./listings.js";
import { displayProfileBids } from "./bids.js";
import {
  loadEditProfileModal,
  initEditProfileModal,
  initEditProfileForm,
} from "./edit.js";
import { getProfile } from "../../utils/auth.js";
import { showSpinner, hideSpinner } from "../../utils/spinner.js";

// Redirect users not logged in or logged in users accessing the wrong profile
export function requireProfileOwner() {
  const user = getProfile();
  if (!user) {
    window.location.href = "login.html";
    return false;
  }

  const params = new URLSearchParams(window.location.search);
  let username = params.get("user");

  // If no user param, assume it's the logged-in user
  if (!username) {
    window.location.href = `profile.html?user=${user.name}`;
    return false;
  }

  // Logged in but wrong profile
  if (username !== user.name) {
    window.location.href = "login.html";
    return false;
  }

  return true;
}

// Load profile details
export async function loadProfile() {
  if (!requireProfileOwner()) return;

  const params = new URLSearchParams(window.location.search);
  const username = params.get("user");
  if (!username) return;

  try {
    showSpinner();
    const profile = await fetchProfile(username);

    localStorage.setItem("profile", JSON.stringify(profile));

    document.getElementById("profile-name").textContent = profile.name;
    document.getElementById("profile-bio").textContent =
      profile.bio || "No bio provided";
    document.getElementById("profile-credits").textContent =
      `Credits: ${profile.credits}`;
    document.getElementById("profile-avatar").src =
      (typeof profile.avatar === "object"
        ? profile.avatar?.url
        : profile.avatar) || "../assets/images/default-avatar.png";

    document.getElementById("profile-banner").src =
      (typeof profile.banner === "object"
        ? profile.banner?.url
        : profile.banner) || "../assets/images/default-banner.jpg";

    // Load tabs content
    await displayProfileListings(username);
    await displayProfileBids(username);

    // Initialize Edit modal
    await loadEditProfileModal();
    initEditProfileModal();
    initEditProfileForm();
  } catch (err) {
    console.error("Failed to load profile:", err);
  } finally {
    hideSpinner();
  }
}
