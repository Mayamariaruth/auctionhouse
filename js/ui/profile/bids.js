import { fetchBidsByProfile } from "../../api/profile/fetch.js";

// Fetch profile bids
export async function displayProfileBids(username) {
  const container = document.getElementById("user-bids");
  if (!container) return;

  try {
    const bids = await fetchBidsByProfile(username);
    container.innerHTML = "";

    if (!bids.length) {
      container.innerHTML = `<p class="text-center fs-5">No bids found.</p>`;
      return;
    }

    bids.forEach((bid) => {
      container.innerHTML += renderBidCard(bid);
    });
  } catch (err) {
    container.innerHTML = `<p class="text-danger text-center fs-5">Failed to load bids</p>`;
    console.error(err);
  }
}

// Render bids
function renderBidCard(bid) {
  const listing = bid.listing;
  const endsAt = new Date(bid.listing.endsAt);
  const isActive = endsAt > new Date();

  return `
    <div class="col-12">
      <div class="card bid-card d-flex flex-row align-items-center p-3">
        <!-- Listing Image -->
        <div class="bid-image flex-shrink-0 mb-3 me-3">
          <a href="/auctionhouse/html/listing.html?id=${listing.id}">
            <img src="${
              listing.media?.[0]?.url ||
              "/auctionhouse/assets/images/default-img.png"
            }" 
                 alt="${listing.title}" class="img-fluid" />
          </a>
        </div>

        <!-- Text content -->
        <div class="bid-text flex-grow-1">
          <h5 class="mb-1">
            <a href="/auctionhouse/html/listing.html?id=${
              listing.id
            }" class="text-decoration-none text-dark">
              ${listing.title}
            </a>
          </h5>
          <p class="mb-2 text-truncate bid-desc">${
            listing.description || "No description"
          }</p>
          <strong class="mb-4 bid-amount">
            My bid: ${bid.amount}
          </strong>
          <p class="mt-2 bid-deadline pe-3">
            Ends ${endsAt.toLocaleString()} 
            <span class="profile-auction-status ms-3 ${
              isActive ? "active" : "ended"
            }">
              ${isActive ? "Active" : "Ended"}
            </span>
          </p>
        </div>
      </div>
      <hr>
    </div>
  `;
}
