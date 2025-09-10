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
}
