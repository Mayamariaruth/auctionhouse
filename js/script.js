import { initMobileMenu, updateNavbar } from "./ui/navbar.js";
import { onRegister } from "./ui/auth/register.js";

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  updateNavbar();

  // Form submissions
  const registerForm = document.getElementById("register");
  if (registerForm) {
    registerForm.addEventListener("submit", onRegister);
  }
});
