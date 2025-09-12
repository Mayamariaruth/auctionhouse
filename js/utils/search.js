import { displayListings } from "../ui/listings/read.js";

// Search functionality
export function setupSearch() {
  const searchForms = document.querySelectorAll(".search-form");

  searchForms.forEach((form) => {
    const input = form.querySelector(".search-input");
    if (!input) return;

    // Form submission
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = input.value.trim();
      displayListings(query, true);
      input.value = "";

      // Close mobile menu after search
      const mobileMenu = document.getElementById("mobile-menu");
      const menuIcon = document.getElementById("menu-icon");
      if (mobileMenu && !mobileMenu.classList.contains("d-none")) {
        mobileMenu.classList.add("d-none");
        menuIcon.classList.toggle("fa-bars");
        menuIcon.classList.toggle("fa-xmark");
      }
    });
  });
}
