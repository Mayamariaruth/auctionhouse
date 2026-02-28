import { headers } from "../../config.js";

// Helper function for API calls
export async function apiFetch(
  url,
  { method = "GET", body, auth = false } = {},
) {
  const token = auth ? localStorage.getItem("accessToken") : null;

  const options = {
    method,
    headers: headers(token),
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetch(url, options);

    let data = null;
    const text = await response.text();

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        console.warn("Response not valid JSON:", text);
      }
    }

    if (!response.ok) {
      const message =
        data?.errors?.[0]?.message ||
        `Request failed with status ${response.status}`;

      const error = new Error(message);
      error.status = response.status;
      error.type = "api";
      throw error;
    }

    return data?.data ?? null;
  } catch (err) {
    if (err instanceof TypeError) {
      const networkError = new Error(
        "Network error. Please check your internet connection.",
      );
      networkError.type = "network";
      throw networkError;
    }

    throw err;
  }
}
