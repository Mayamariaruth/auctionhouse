// Mobile menu toggle
export function initMobileMenu() {
  const toggleBtn = document.getElementById("mobile-menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuIcon = document.getElementById("menu-icon");

  toggleBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("d-none");
    menuIcon.classList.toggle("fa-bars");
    menuIcon.classList.toggle("fa-xmark");
  });
}

// Update navbar links based on user state and add credits element
export function updateNavbar() {
  const token = localStorage.getItem("accessToken");
  const profile = JSON.parse(localStorage.getItem("profile"));

  // Desktop links
  const loggedInDesktop = document.querySelectorAll(".desktop-nav .logged-in");
  const loggedOutDesktop = document.querySelectorAll(
    ".desktop-nav .logged-out"
  );
  const creditsDesktop = document.querySelector(".desktop-nav #user-credits");

  // Mobile links
  const loggedInMobile = document.querySelectorAll(".mobile-nav .logged-in");
  const loggedOutMobile = document.querySelectorAll(".mobile-nav .logged-out");
  const creditsMobile = document.querySelector(".mobile-nav #user-credits");

  if (token && profile) {
    // Show logged-in links
    loggedInDesktop.forEach((el) => el.classList.remove("d-none"));
    loggedOutDesktop.forEach((el) => el.classList.add("d-none"));

    loggedInMobile.forEach((el) => el.classList.remove("d-none"));
    loggedOutMobile.forEach((el) => el.classList.add("d-none"));

    if (creditsDesktop) {
      creditsDesktop.textContent = `Credits: ${profile.credits ?? 0}`;
      creditsDesktop.classList.remove("d-none");
    }
    if (creditsMobile) {
      creditsMobile.textContent = `Credits: ${profile.credits ?? 0}`;
      creditsMobile.classList.remove("d-none");
    }
  } else {
    // Show logged-out links
    loggedInDesktop.forEach((el) => el.classList.add("d-none"));
    loggedOutDesktop.forEach((el) => el.classList.remove("d-none"));

    loggedInMobile.forEach((el) => el.classList.add("d-none"));
    loggedOutMobile.forEach((el) => el.classList.remove("d-none"));

    if (creditsDesktop) creditsDesktop.classList.add("d-none");
    if (creditsMobile) creditsMobile.classList.add("d-none");
  }
}
