export const API_KEY = "a2ecfe33-c14f-4497-91a7-09961eaf95f6";

// Reusable headers
export const headers = (token) => ({
  "Content-Type": "application/json",
  "X-Noroff-API-Key": API_KEY,
  ...(token && { Authorization: `Bearer ${token}` }),
});
