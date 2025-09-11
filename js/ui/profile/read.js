import { fetchProfile } from "../../api/profile/fetch.js";
import { displayProfileListings } from "./listings.js";
import { displayProfileBids } from "./bids.js";
import {
  loadEditProfileModal,
  initEditProfileModal,
  initEditProfileForm,
} from "./edit.js";
import { getProfile } from "../../utils/auth.js";

// Redirect if user is not logged in or a logged in user accessing the wrong profile
export function requireProfileOwner() {
  const user = getProfile();
  // Logged out user
  if (!user) {
    window.location.href = "/auctionhouse/html/login.html";
    return false;
  }

  // Logged in user but wrong profile
  const params = new URLSearchParams(window.location.search);
  const username = params.get("user");
  if (!username || username !== user.name) {
    window.location.href = "/auctionhouse/html/login.html";
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
    const profile = await fetchProfile(username);

    document.getElementById("profile-name").textContent = profile.name;
    document.getElementById("profile-bio").textContent =
      profile.bio || "No bio provided";
    document.getElementById(
      "profile-credits"
    ).textContent = `Credits: ${profile.credits}`;
    document.getElementById("profile-avatar").src =
      (typeof profile.avatar === "object"
        ? profile.avatar?.url
        : profile.avatar) || "/auctionhouse/assets/images/default-avatar.png";

    document.getElementById("profile-banner").src =
      (typeof profile.banner === "object"
        ? profile.banner?.url
        : profile.banner) || "/auctionhouse/assets/images/default-banner.jpg";

    // Load tabs content
    await displayProfileListings(username);
    await displayProfileBids(username);

    // Initialize Edit modal
    await loadEditProfileModal();
    initEditProfileModal();
    initEditProfileForm();
  } catch (err) {
    console.error("Failed to load profile:", err);
  }
}
