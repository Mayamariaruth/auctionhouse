import { initMobileMenu, updateNavbar } from "./ui/navbar.js";
import { onRegister } from "./ui/auth/register.js";
import { showStoredNotification } from "./utils/notifications.js";

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  updateNavbar();
  showStoredNotification();

  // Form submissions
  const registerForm = document.getElementById("register");
  if (registerForm) {
    registerForm.addEventListener("submit", onRegister);
  }
});
