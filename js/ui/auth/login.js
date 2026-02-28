import { loginUser } from "../../api/auth.js";
import { showNotification } from "../../utils/notifications.js";
import { showSpinner, hideSpinner } from "../../utils/spinner.js";
import { getProfile } from "../../utils/auth.js";
import { setAuth } from "../../utils/auth.js";

// Redirect logged-in users from login
export function redirectIfLoggedIn() {
  const user = getProfile();
  if (user) {
    window.location.href = `profile.html?user=${user.name}`;
    return true;
  }
  return false;
}

// Handle login event
export async function onLogin(event) {
  event.preventDefault();

  const form = event.target;
  const emailField = form.email;
  const passwordField = form.password;

  const email = emailField.value.trim().toLowerCase();
  const password = passwordField.value;

  // Clear previous validation styling
  [emailField, passwordField].forEach((field) =>
    field.classList.remove("input-error"),
  );

  // Input validation
  if (!email || !password) {
    if (!email) emailField.classList.add("input-error");
    if (!password) passwordField.classList.add("input-error");
    showNotification("Please enter both email and password", "error");
    return;
  }

  try {
    showSpinner();
    const user = await loginUser({ email, password });
    console.log("LOGIN RESULT:", user);

    // Store token and profile
    setAuth({
      accessToken: user.accessToken,
      profile: user,
    });

    // Store success message for display after redirect
    sessionStorage.setItem(
      "notification",
      JSON.stringify({
        type: "success",
        message: `Welcome back, ${user.name}!`,
      }),
    );

    window.location.href = "../index.html";
  } catch (error) {
    if (error.message.includes("Email must be a valid email")) {
      emailField.classList.add("input-error");
      showNotification(error.message, "error");
    } else if (error.message.includes("Invalid email or password")) {
      passwordField.classList.add("input-error");
      showNotification("Password is incorrect", "error");
    } else {
      showNotification(error.message, "error");
    }
  } finally {
    hideSpinner();
  }
}

// Form submission
export function initLoginForm() {
  // Redirect if already logged in
  if (redirectIfLoggedIn()) return;

  const form = document.getElementById("login");
  if (!form) return;
  form.addEventListener("submit", onLogin);
}
