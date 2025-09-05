import { headers } from "../../config.js";

// Helper function for API calls
export async function apiFetch(
  url,
  { method = "GET", body, auth = false } = {}
) {
  // Get token from localStorage if auth is true
  const token = auth ? localStorage.getItem("accessToken") : null;

  const options = {
    method,
    headers: headers(token),
    body: body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || "API request failed");
  }

  return data.data;
}
