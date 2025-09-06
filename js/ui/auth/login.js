import { loginUser } from "../../api/auth.js";
import { showNotification } from "../../utils/notifications.js";

export async function onLogin(event) {
  event.preventDefault();

  const form = event.target;
  const emailField = form.email;
  const passwordField = form.password;

  const email = emailField.value.trim().toLowerCase();
  const password = passwordField.value;

  // Clear previous validation styling
  [emailField, passwordField].forEach((field) =>
    field.classList.remove("input-error")
  );

  // Input validation
  let hasError = false;
  if (!email) {
    emailField.classList.add("input-error");
    hasError = true;
  }
  if (!password) {
    passwordField.classList.add("input-error");
    hasError = true;
  }

  if (hasError) {
    showNotification("Please enter both email and password", "error");
    return;
  }

  try {
    const user = await loginUser({ email, password });

    // Store success message for display after redirect
    sessionStorage.setItem(
      "notification",
      JSON.stringify({
        type: "success",
        message: `Welcome back, ${user.name}!`,
      })
    );

    window.location.href = "/index.html";
  } catch (error) {
    showNotification(error.message, "error");
  }
}
