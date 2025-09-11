import { updateNavbar } from "../navbar.js";
import { isLoggedIn } from "../../utils/auth.js";

// Clear user data from storage
export function clearAuthData() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("profile");
}

// Handle logging out
function handleLogout(event) {
  event.preventDefault();

  clearAuthData();
  updateNavbar();

  sessionStorage.setItem(
    "notification",
    JSON.stringify({
      type: "success",
      message: "Logged out successfully!",
    })
  );

  window.location.href = "index.html";
}

// Attach logout event listeners
export function logoutListener() {
  if (!isLoggedIn()) return;

  const logoutLinks = [
    document.querySelector("#logout"),
    document.querySelector("#logout-mobile"),
  ];

  logoutLinks.forEach((link) => {
    if (link) {
      link.addEventListener("click", handleLogout);
    }
  });
}
