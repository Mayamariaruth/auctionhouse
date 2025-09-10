// Display bidding history
export function renderBidHistory(bids, container) {
  if (!container) return;

  if (!bids || bids.length === 0) {
    container.innerHTML = "<p>No bids yet</p>";
    return;
  }

  // Sort bids descending by amount
  const sortedBids = bids.slice().sort((a, b) => b.amount - a.amount);

  container.innerHTML = `
    <h2>Bids</h2>
    <div class="bid-history-wrapper">
      <table class="bid-table">
        <thead>
          <tr>
            <th>Bidder</th>
            <th>Date</th>
            <th>Credits</th>
          </tr>
        </thead>
        <tbody>
          ${sortedBids
            .map(
              (bid) => `
            <tr>
              <td>${bid.bidder?.name || "Unknown"}</td>
              <td>${new Date(bid.created).toLocaleString()}</td>
              <td>${bid.amount}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}
