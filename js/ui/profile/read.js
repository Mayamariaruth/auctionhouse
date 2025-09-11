import { fetchProfile } from "../../api/profile/fetch.js";
import { displayProfileListings } from "./listings.js";
import { displayProfileBids } from "./bids.js";
import {
  loadEditProfileModal,
  initEditProfileModal,
  initEditProfileForm,
} from "./edit.js";

// Load profile details
export async function loadProfile() {
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
        : profile.avatar) || "../../../assets/images/default-avatar.png";

    document.getElementById("profile-banner").src =
      (typeof profile.banner === "object"
        ? profile.banner?.url
        : profile.banner) || "../../../assets/images/default-banner.jpg";

    // Load tabs content
    await displayProfileListings(username);
    await displayProfileBids(username);

    // Initialize Edit modal
    loadEditProfileModal();
    initEditProfileModal();
    initEditProfileForm();
  } catch (err) {
    console.error("Failed to load profile:", err);
  }
}
