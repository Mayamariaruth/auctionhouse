import { fetchProfile } from "../../api/profile/fetch.js";

// Load profile details
export async function loadProfile() {
  const params = new URLSearchParams(window.location.search);
  const username = params.get("user");
  if (!username) return;

  try {
    const profile = await fetchProfile(username);

    document.getElementById("profile-name").textContent = profile.name;
    document.getElementById("profile-bio").textContent = profile.bio || "";
    document.getElementById(
      "profile-credits"
    ).textContent = `${profile.credits} credits`;
    document.getElementById("profile-avatar").src =
      (typeof profile.avatar === "object"
        ? profile.avatar?.url
        : profile.avatar) || "../../../assets/images/default-avatar.png";

    document.getElementById("profile-banner").src =
      (typeof profile.banner === "object"
        ? profile.banner?.url
        : profile.banner) || "../../../assets/images/default-banner.jpg";
  } catch (err) {
    console.error("Failed to load profile:", err);
  }
}
