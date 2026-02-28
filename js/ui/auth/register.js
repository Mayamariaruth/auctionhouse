import { registerUser } from "../../api/auth.js";
import { showNotification } from "../../utils/notifications.js";
import { showSpinner, hideSpinner } from "../../utils/spinner.js";
import { redirectIfLoggedIn } from "./login.js";

// Validate register inputs
function validateRegisterInput(name, email, password) {
  const trimmedName = name?.trim();
  const trimmedEmail = email?.trim();
  const trimmedPassword = password?.trim();

  const errors = {};
  if (!trimmedName) errors.name = "Name required";
  if (!trimmedEmail) errors.email = "Email required";
  if (!trimmedPassword) errors.password = "Password required";

  if (
    trimmedName &&
    /[^\w\s]/.test(trimmedName) &&
    !trimmedName.includes("_")
  ) {
    errors.name = "Name can only contain letters, numbers, and underscores";
  }

  if (
    trimmedEmail &&
    (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail) ||
      !trimmedEmail.endsWith("@stud.noroff.no"))
  ) {
    errors.email = "Email must be a valid @stud.noroff.no address";
  }

  if (trimmedPassword && trimmedPassword.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    values: {
      name: trimmedName,
      email: trimmedEmail,
      password: trimmedPassword,
    },
  };
}

export async function onRegister(event) {
  event.preventDefault();

  const form = event.target;
  const nameField = form.name;
  const emailField = form.email;
  const passwordField = form.password;

  [nameField, emailField, passwordField].forEach((f) =>
    f.classList.remove("input-error"),
  );

  const { isValid, errors, values } = validateRegisterInput(
    nameField.value,
    emailField.value,
    passwordField.value,
  );

  if (!isValid) {
    if (errors.name) nameField.classList.add("input-error");
    if (errors.email) emailField.classList.add("input-error");
    if (errors.password) passwordField.classList.add("input-error");
    showNotification("Please correct the highlighted fields", "error");
    return;
  }

  try {
    showSpinner();
    const result = await registerUser(
      values.name,
      values.email,
      values.password,
    );

    if (result) {
      sessionStorage.setItem(
        "notification",
        JSON.stringify({
          type: "success",
          message: "Registered successfully!",
        }),
      );
      window.location.href = "login.html";
    }
  } catch (error) {
    showNotification(error.message, "error");
  } finally {
    hideSpinner();
  }
}

export function initRegisterForm() {
  if (redirectIfLoggedIn()) return;
  const form = document.getElementById("register");
  if (!form) return;
  form.addEventListener("submit", onRegister);
}
