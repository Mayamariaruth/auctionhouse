// Show a notification
export function showNotification(message, type = "success") {
  const container = document.getElementById("notifications");
  if (!container) return;

  // Map type to custom classes
  const typeClass =
    type === "success" ? "notification-success" : "notification-error";

  const notification = document.createElement("div");
  notification.className = `notification ${typeClass}`;
  notification.textContent = message;

  container.appendChild(notification);

  // Auto-remove after 5s
  setTimeout(() => {
    if (notification && notification.parentNode) {
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}
