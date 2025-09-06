import { registerUser } from "../../api/auth.js";
import { showNotification } from "../../utils/notifications.js";

export async function onRegister(event) {
  event.preventDefault();

  const form = event.target;
  const nameField = form.name;
  const emailField = form.email;
  const passwordField = form.password;

  const name = nameField.value.trim();
  const email = emailField.value.trim();
  const password = passwordField.value;

  // Clear previous validation styling
  [nameField, emailField, passwordField].forEach((field) =>
    field.classList.remove("input-error")
  );

  let hasError = false;

  // Empty field check
  if (!name) {
    nameField.classList.add("input-error");
    hasError = true;
  }
  if (!email) {
    emailField.classList.add("input-error");
    hasError = true;
  }
  if (!password) {
    passwordField.classList.add("input-error");
    hasError = true;
  }

  if (hasError) {
    showNotification("Please fill in all fields", "error");
    return;
  }

  try {
    const result = await registerUser(name, email, password);

    if (result) {
      // Store success message for display after redirect
      sessionStorage.setItem(
        "notification",
        JSON.stringify({
          type: "success",
          message: "Registered successfully!",
        })
      );

      window.location.href = "/html/login.html";
    }
  } catch (error) {
    showNotification(error.message, "error");
  }
}
