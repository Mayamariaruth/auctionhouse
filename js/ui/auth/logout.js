import { updateNavbar } from "../navbar.js";
import { isLoggedIn, clearAuth } from "../../utils/auth.js";

// Handle logging out
function handleLogout(event) {
  event.preventDefault();

  clearAuth();
  updateNavbar();

  sessionStorage.setItem(
    "notification",
    JSON.stringify({
      type: "success",
      message: "Logged out successfully!",
    })
  );

  window.location.href = "../index.html";
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
