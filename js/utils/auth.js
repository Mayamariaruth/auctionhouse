// Check if a user is logged in
export function isLoggedIn() {
  const token = localStorage.getItem("accessToken");
  const profile = localStorage.getItem("profile");

  return !!(token && profile);
}

// Get the current logged-in profile
export function getProfile() {
  try {
    return JSON.parse(localStorage.getItem("profile")) || null;
  } catch {
    return null;
  }
}
