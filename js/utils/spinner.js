// Display spinner
export function showSpinner(spinnerId = "spinner") {
  const spinner = document.getElementById(spinnerId);
  if (!spinner) return;
  spinner.classList.remove("d-none");
}

// Hide spinner
export function hideSpinner(spinnerId = "spinner") {
  const spinner = document.getElementById(spinnerId);
  if (!spinner) return;
  spinner.classList.add("d-none");
}

// Display modal spinner
export function showModalSpinner(modalId = "modal-spinner") {
  const spinner = document.getElementById(modalId);
  if (spinner) spinner.classList.remove("d-none");
}

// Hide modal spinner
export function hideModalSpinner(modalId = "modal-spinner") {
  const spinner = document.getElementById(modalId);
  if (spinner) spinner.classList.add("d-none");
}
