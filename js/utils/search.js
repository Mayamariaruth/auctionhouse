import { displayListings } from "../ui/listings/read.js";

// Search functionality
export function setupSearch() {
  const searchForms = document.querySelectorAll(".search-form");

  searchForms.forEach((form) => {
    const input = form.querySelector(".search-input");
    if (!input) return;

    // Event listener
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const query = input.value.trim();
      if (!query) return;

      // If we’re on index.html, run search
      if (document.getElementById("listings")) {
        displayListings(query, true);
      } else {
        // Otherwise redirect to index.html with query param
        window.location.href = `../index.html?search=${encodeURIComponent(
          query
        )}`;
      }
      input.value = "";
    });
  });
}
