// Show a notification
export function showNotification(message, type = "success") {
  const container = document.getElementById("notifications");
  if (!container) return;

  // Map type to custom classes and icons
  const typeClass =
    type === "success" ? "notification-success" : "notification-error";
  const iconClass =
    type === "success"
      ? "fa-solid fa-circle-check"
      : "fa-solid fa-triangle-exclamation";

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${typeClass} d-flex align-items-center justify-content-between gap-2`;

  // Add icon and text
  const content = document.createElement("div");
  content.className = "d-flex align-items-center gap-2";

  const icon = document.createElement("i");
  icon.className = iconClass;

  const text = document.createElement("span");
  text.textContent = message;

  content.appendChild(icon);
  content.appendChild(text);

  // Add close button
  const dismissBtn = document.createElement("button");
  dismissBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
  dismissBtn.addEventListener("click", () => notification.remove());

  // Merge content
  notification.appendChild(content);
  notification.appendChild(dismissBtn);
  container.appendChild(notification);

  // Auto-remove after 5s
  setTimeout(() => notification.remove(), 5000);
}

// Display a notification stored in sessionStorage
export function showStoredNotification() {
  const stored = sessionStorage.getItem("notification");
  if (stored) {
    try {
      const { type, message } = JSON.parse(stored);
      showNotification(message, type);
    } catch (e) {
      console.error("Invalid stored notification", e);
    }
    sessionStorage.removeItem("notification");
  }
}
