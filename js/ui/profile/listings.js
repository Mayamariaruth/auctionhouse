import { fetchListingsByProfile } from "../../api/profile/fetch.js";

// Fetch listings
export async function displayProfileListings(username) {
  const container = document.getElementById("user-listings");
  if (!container) return;

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

  return `
    <div class="col-12">
      <div class="listing-card p-3 pt-2">
        
        <!-- Image + text -->
        <div class="d-flex flex-row">
          <div class="listing-image flex-shrink-0 me-3">
            <a href="/html/listing.html?id=${listing.id}">
              <img src="${
                listing.media?.[0]?.url ||
                "../../../assets/images/default-img.png"
              }" 
                  alt="${listing.title}" 
                  class="img-fluid" />
            </a>
          </div>

          <!-- Text content -->
          <div class="listing-text flex-grow-1">
            <h5 class="mb-1 profile-listing-heading">
              <a href="/html/listing.html?id=${
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
