import { registerUser } from "../../api/auth.js";
import { showNotification } from "../../utils/notifications.js";
import { showSpinner, hideSpinner } from "../../utils/spinner.js";

// Handle register event
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

  // Empty field validation
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

  // Name validation
  const punctuationMatches = name.match(/[^\w\s]/g);
  if (
    punctuationMatches &&
    punctuationMatches.length > 0 &&
    !name.includes("_")
  ) {
    nameField.classList.add("input-error");
    showNotification(
      "Name can only contain letters, numbers, and underscores",
      "error"
    );
    return;
  }

  // Email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email) || !email.endsWith("@stud.noroff.no")) {
    emailField.classList.add("input-error");
    showNotification("Email must be a valid @stud.noroff.no address", "error");
    return;
  }

  // Password validation
  if (password.length < 8) {
    passwordField.classList.add("input-error");
    showNotification("Password must be at least 8 characters", "error");
    return;
  }

  try {
    showSpinner();
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

      window.location.href = "html/login.html";
    }
  } catch (error) {
    showNotification(error.message, "error");
  } finally {
    hideSpinner();
  }
}
