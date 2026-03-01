import { loginUser } from "../../api/auth.js";
import { showNotification } from "../../utils/notifications.js";
import { showSpinner, hideSpinner } from "../../utils/spinner.js";
import { setAuth } from "../../utils/auth.js";
import { getProfile } from "../../utils/auth.js";
import { fetchProfile } from "../../api/profile/fetch.js";

// Redirect logged-in users
export function redirectIfLoggedIn() {
  const user = getProfile();
  if (user) {
    window.location.href = `profile.html?user=${user.name}`;
    return true;
  }
  return false;
}

// Validate login input
function validateLoginInput(email, password) {
  const trimmedEmail = email?.trim().toLowerCase();
  const trimmedPassword = password?.trim();

  const errors = {};
  if (!trimmedEmail) errors.email = "Email is required";
  if (!trimmedPassword) errors.password = "Password is required";

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    values: { email: trimmedEmail, password: trimmedPassword },
  };
}

export async function onLogin(event) {
  event.preventDefault();

  const form = event.target;
  const emailField = form.email;
  const passwordField = form.password;

  // Reset input styles
  [emailField, passwordField].forEach((f) => f.classList.remove("input-error"));

  const { isValid, errors, values } = validateLoginInput(
    emailField.value,
    passwordField.value,
  );

  if (!isValid) {
    if (errors.email) emailField.classList.add("input-error");
    if (errors.password) passwordField.classList.add("input-error");
    showNotification("Please enter both email and password", "error");
    return;
  }

  try {
    showSpinner();
    const user = await loginUser(values);

    // Store token & profile
    setAuth({
      accessToken: user.accessToken,
      profile: user,
    });

    const fullProfile = await fetchProfile(user.name);

    setAuth({
      accessToken: user.accessToken,
      profile: fullProfile,
    });

    sessionStorage.setItem(
      "notification",
      JSON.stringify({
        type: "success",
        message: `Welcome back, ${user.name}!`,
      }),
    );

    window.location.href = "../index.html";
  } catch (error) {
    showNotification(error.message, "error");
  } finally {
    hideSpinner();
  }
}

export function initLoginForm() {
  if (redirectIfLoggedIn()) return;
  const form = document.getElementById("login");
  if (!form) return;
  form.addEventListener("submit", onLogin);
}
