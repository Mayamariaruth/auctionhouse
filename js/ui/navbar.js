import { isLoggedIn, getProfile } from "../utils/auth.js";

// Mobile menu toggle
export function initMobileMenu() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document.getElementById("menu-icon");

  if (!toggleBtn || !mobileMenu || !menuIcon) return;

  toggleBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("d-none");
    menuIcon.classList.toggle("fa-bars");
    menuIcon.classList.toggle("fa-xmark");
  });
}

// Update navbar links based on user state and add credits element
export function updateNavbar() {
  const loggedIn = isLoggedIn();
  const profile = getProfile();

  // Desktop links
  const loggedInDesktop = document.querySelectorAll(".desktop-nav .logged-in");
  const loggedOutDesktop = document.querySelectorAll(
    ".desktop-nav .logged-out"
  );

  // Mobile links
  const loggedInMobile = document.querySelectorAll(".mobile-nav .logged-in");
  const loggedOutMobile = document.querySelectorAll(".mobile-nav .logged-out");

  // User credits (desktop + mobile)
  const userCreditsDesktop = document.getElementById("user-credits-desktop");
  const userCreditsMobile = document.getElementById("user-credits-mobile");

  if (loggedIn) {
    // Show logged-in links
    loggedInDesktop.forEach((el) => el.classList.remove("d-none"));
    loggedOutDesktop.forEach((el) => el.classList.add("d-none"));

    loggedInMobile.forEach((el) => el.classList.remove("d-none"));
    loggedOutMobile.forEach((el) => el.classList.add("d-none"));

    // Update credits
    const creditsText = `${profile?.credits ?? 0} credits`;
    if (userCreditsDesktop) {
      userCreditsDesktop.textContent = creditsText;
      userCreditsDesktop.classList.remove("d-none");
    }
    if (userCreditsMobile) {
      userCreditsMobile.textContent = creditsText;
      userCreditsMobile.classList.remove("d-none");
    }
  } else {
    // Show logged-out links
    loggedInDesktop.forEach((el) => el.classList.add("d-none"));
    loggedOutDesktop.forEach((el) => el.classList.remove("d-none"));

    loggedInMobile.forEach((el) => el.classList.add("d-none"));
    loggedOutMobile.forEach((el) => el.classList.remove("d-none"));

    // Hide credits
    if (userCreditsDesktop) userCreditsDesktop.classList.add("d-none");
    if (userCreditsMobile) userCreditsMobile.classList.add("d-none");
  }
}
