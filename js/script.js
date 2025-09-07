import { initMobileMenu, updateNavbar } from "./ui/navbar.js";
import { onLogin } from "./ui/auth/login.js";
import { onRegister } from "./ui/auth/register.js";
import { showStoredNotification } from "./utils/notifications.js";

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  updateNavbar();
  showStoredNotification();
  logoutListener();

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
