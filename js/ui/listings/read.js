import { isLoggedIn } from "../../utils/auth.js";

// Initialize listings grid and button
export function initListingsPage() {
  toggleListingButton();
}

// Toggle Add Listing button
function toggleListingButton() {
  const addBtnContainer = document.querySelector(".add-btn-container");
  if (!addBtnContainer) return;

  if (isLoggedIn()) {
    addBtnContainer.classList.remove("d-none");
    addBtnContainer.classList.add("d-flex");
  } else {
    addBtnContainer.classList.add("d-none");
    addBtnContainer.classList.remove("d-flex");
  }
}
