import { initMobileMenu, updateNavbar } from "./ui/navbar.js";
import { onLogin } from "./ui/auth/login.js";
import { onRegister } from "./ui/auth/register.js";
import { showStoredNotification } from "./utils/notifications.js";
import { logoutListener } from "./ui/auth/logout.js";
import { initListingsPage } from "./ui/listings/read.js";
import { loadListingDetails } from "./ui/listings/details.js";
import { loadProfile } from "./ui/profile/read.js";
import { setupSearch } from "./utils/search.js";

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  updateNavbar();
  showStoredNotification();
  logoutListener();
  setupSearch();
  initListingsPage();

  if (document.getElementById("listing-details")) {
    loadListingDetails();
  }

  if (document.getElementById("profile-page")) {
    loadProfile();
  }

  // Form submissions (register + login)
  const registerForm = document.getElementById("register");
  if (registerForm) {
    registerForm.addEventListener("submit", onRegister);
  }

  const loginForm = document.getElementById("login");
  if (loginForm) {
    loginForm.addEventListener("submit", onLogin);
  }
});
