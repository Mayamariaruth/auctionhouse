import { headers } from "../../config.js";

// Helper function for API calls
export async function apiFetch(
  url,
  { method = "GET", body, auth = false } = {}
) {
  const token = auth ? localStorage.getItem("accessToken") : null;

  const options = {
    method,
    headers: headers(token),
    body: body ? JSON.stringify(body) : undefined,
  };

  const response = await fetch(url, options);

  // Only parse JSON if there is content
  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.warn("Response not valid JSON:", text);
    }
  }

  if (!response.ok) {
    throw new Error(data?.errors?.[0]?.message || "API request failed");
  }

  return data?.data ?? null;
}
