import { headers } from "../../config.js";

// Helper function for API calls
export async function apiFetch(url, options = {}, token) {
  const response = await fetch(url, {
    headers: headers(token),
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || "API request failed");
  }

  return data;
}
