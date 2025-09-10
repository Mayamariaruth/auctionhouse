import { placeBid } from "../../api/listings/bids.js";
import { showNotification } from "../../utils/notifications.js";

// Bid form submission on listing detail page
export function initBidForm(listingId, onSuccess) {
  const bidForm = document.getElementById("bid-form");
  if (!bidForm) return;

  bidForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const amount = bidForm.amount.value;

    // Validation
    if (!amount || isNaN(amount) || amount <= 0) {
      showNotification("Please enter a valid bid amount", "error");
      return;
    }

    try {
      await placeBid(listingId, { amount });
      showNotification("Bid placed successfully!", "success");
      bidForm.reset();

      if (onSuccess) onSuccess();
    } catch (error) {
      showNotification("Failed to place bid", "error");
      console.error(error);
    }
  });
}
