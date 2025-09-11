import { placeBid } from "../../api/listings/bids.js";
import { showNotification } from "../../utils/notifications.js";
import { fetchProfile } from "../../api/profile/fetch.js";
import { getProfile } from "../../utils/auth.js";
import { updateNavbarCredits } from "../navbar.js";

// Bid form submission on listing detail page
export function initBidForm(listingId, onSuccess) {
  const bidForm = document.getElementById("bid-form");
  if (!bidForm) return;

  bidForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const amountValue = Number(bidForm.amount.value);

    if (!amountValue || isNaN(amountValue) || amountValue <= 0) {
      showNotification("Please enter a valid bid amount", "error");
      return;
    }

    try {
      await placeBid(listingId, { amount: amountValue });
      showNotification("Bid placed successfully!", "success");
      bidForm.reset();

      // Update navbar credits
      const user = getProfile();
      if (user?.name) {
        const profile = await fetchProfile(user.name);
        updateNavbarCredits(profile.credits);

        // Refresh profile bids tab
        const displayProfileBidsModule = await import("../profile/bids.js");
        await displayProfileBidsModule.displayProfileBids(user.name);
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      showNotification(error.message || "Failed to place bid", "error");
      console.error(error);
    }
  });
}
