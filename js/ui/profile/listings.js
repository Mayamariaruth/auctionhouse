import { fetchListingsByProfile } from "../../api/profile/fetch.js";
import {
  initEditListingModal,
  loadEditListingModal,
} from "../listings/edit.js";
import { openDeleteListingModal, loadDeleteModal } from "../listings/delete.js";

// Fetch listings in tabs section
export async function displayProfileListings(username) {
  const container = document.getElementById("user-listings");
  if (!container || !username) return;

  try {
    const listings = await fetchListingsByProfile(username);
    container.innerHTML = "";

    if (!listings.length) {
      container.innerHTML = `<p class="text-center fs-5">No listings found.</p>`;
      return;
    }

    listings.forEach((listing) => {
      container.innerHTML += renderListingCard(listing);
    });

    // Load modals
    await loadEditListingModal();
    await loadDeleteModal();

    // Attach button listeners
    listings.forEach((listing) => {
      const card = container.querySelector(`[data-id="${listing.id}"]`);
      if (!card) return;

      // Delete button event listener
      const deleteBtn = card.querySelector(".profile-delete-btn");
      if (deleteBtn) {
        deleteBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          openDeleteListingModal(listing.id, username);
        });
      }

      // Edit button event listener
      const editBtn = card.querySelector(".profile-edit-listing-btn");
      if (editBtn) {
        editBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          initEditListingModal(listing, username);
        });
      }
    });
  } catch (err) {
    container.innerHTML = `<p class="text-danger text-center fs-5">Failed to load listings</p>`;
    console.error(err);
  }
}

// Render profile listings
function renderListingCard(listing) {
  const endsAt = new Date(listing.endsAt);
  const isActive = endsAt > new Date();
  const bids = listing._count?.bids || 0;

  // Profile HTML
  return `
    <div class="col-12" data-id="${listing.id}">
      <div class="profile-listing-card p-3 pt-2">
        
        <!-- Image + text -->
        <div class="d-flex flex-row">
          <div class="listing-image flex-shrink-0 me-3">
            <a href="/auctionhouse/html/listing.html?id=${listing.id}">
              <img src="${
                listing.media?.[0]?.url ||
                "/auctionhouse/assets/images/default-img.png"
              }" 
                  alt="${listing.title}" 
                  class="img-fluid" />
            </a>
          </div>

          <!-- Text content -->
          <div class="profile-listing-text flex-grow-1">
            <h5 class="mb-1 profile-listing-heading">
              <a href="/auctionhouse/html/listing.html?id=${
                listing.id
              }" class="text-decoration-none text-dark">
                ${listing.title}
              </a>
            </h5>
            <p class="mb-2 text-truncate profile-listing-desc">${
              listing.description || "No description"
            }</p>
            <p class="mb-1 profile-listing-deadline">Ends ${endsAt.toLocaleString()}</p>
            <div class="d-flex gap-4">
              <p class="profile-auction-status ${
                isActive ? "active" : "ended"
              }">
                ${isActive ? "Active" : "Ended"}
              </p>
              <strong>${bids} bid${bids !== 1 ? "s" : ""}</strong>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div class="profile-listing-btns d-flex flex-row flex-sm-column mt-2 mt-sm-0 gap-2">
          <button class="profile-delete-btn">Delete</button>
          <button class="profile-edit-listing-btn">Edit</button>
        </div>

      </div>
      <hr>
    </div>

  `;
}
