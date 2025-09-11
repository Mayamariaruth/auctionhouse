import { API_AUCTIONS_PROFILES } from "../constants.js";
import { apiFetch } from "../request.js";

// Update a user profile
export async function editProfile(name, profileData, token) {
  try {
    const data = await apiFetch(
      `${API_AUCTIONS_PROFILES}/${name}`,
      {
        method: "PUT",
        body: profileData,
        auth: true,
      },
      token
    );

    return data;
  } catch (error) {
    console.error(`Failed to update profile for ${name}:`, error);
    throw error;
  }
}
