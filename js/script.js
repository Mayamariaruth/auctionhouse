import { initMobileMenu, updateNavbar } from "./ui/navbar.js";
import { initLoginForm } from "./ui/auth/login.js";
import { initRegisterForm } from "./ui/auth/register.js";
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
  initRegisterForm();
  initLoginForm();
  logoutListener();
  setupSearch();
  initListingsPage();

  if (document.getElementById("listing-details")) {
    loadListingDetails();
  }

  if (document.getElementById("profile-page")) {
    loadProfile();
  }
});
