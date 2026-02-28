// Check if a user is logged in
export function isLoggedIn() {
  const token = localStorage.getItem("accessToken");
  const profile = localStorage.getItem("profile");

  return !!(token && profile);
}

// Store logged in user details
export function setAuth({ accessToken, profile }) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("profile", JSON.stringify(profile));
}

// Get the current logged-in profile
export function getProfile() {
  try {
    return JSON.parse(localStorage.getItem("profile")) || null;
  } catch {
    return null;
  }
}

// Clear user data from storage
export function clearAuth() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("profile");
}
