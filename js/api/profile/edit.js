import { API_AUCTIONS_PROFILES } from "../constants.js";
import { apiFetch } from "../request.js";

// Update a user profile
export async function editProfile(username, profileData, token) {
  try {
    const data = await apiFetch(
      `${API_AUCTIONS_PROFILES}/${username}`,
      {
        method: "PUT",
        body: profileData,
      },
      token
    );

    return data;
  } catch (error) {
    console.error(`Failed to update profile for ${username}:`, error);
    throw error;
  }
}
