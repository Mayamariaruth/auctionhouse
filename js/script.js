import { initMobileMenu, updateNavbar } from "./ui/navbar.js";
import { onLogin } from "./ui/auth/login.js";
import { onRegister } from "./ui/auth/register.js";
import { showStoredNotification } from "./utils/notifications.js";
import { logoutListener } from "./ui/auth/logout.js";
import { initListingsPage } from "./ui/listings/read.js";
import { loadListingDetails } from "./ui/listings/details.js";

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  updateNavbar();
  showStoredNotification();
  logoutListener();
  initListingsPage();

  if (document.getElementById("listing-details")) {
    loadListingDetails();
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
