// Validate image URL
export function isValidImageUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

// Set error message and highlight form field
export function setError(form, fieldId, message) {
  const field = form.querySelector(
    `#${form.id.includes("edit") ? "edit-" : "listing-"}${fieldId}`
  );
  const errorEl = form.querySelector(
    `#${form.id.includes("edit") ? "edit-" : ""}${fieldId}-error`
  );

  if (field) field.classList.add("input-error");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add("active");
  }
}

// Clear all errors from the form fields
export function clearErrors(form) {
  const errorEls = form.querySelectorAll(".error-message");
  errorEls.forEach((el) => {
    el.textContent = "";
    el.classList.remove("active");
  });

  const fields = form.querySelectorAll(".form-control");
  fields.forEach((el) => el.classList.remove("input-error"));
}
