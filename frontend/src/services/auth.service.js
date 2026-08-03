import api from "../lib/axios";

const GUEST_API_URL = "/guests";
const ADMIN_API_URL = "/admin";

export const signupGuest = async (guestData) => {
  try {
    const response = await api.post(`${GUEST_API_URL}/signup`, guestData);
    return response.data;
  } catch (error) {
    console.error("Guest signup error:", error);
    throw error;
  }
};

export const loginGuest = async (credentials) => {
  try {
    const response = await api.post(`${GUEST_API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Guest login error:", error);
    throw error;
  }
};

export const fetchGuestProfile = async () => {
  try {
    const response = await api.get(`${GUEST_API_URL}/me`);
    return response.data;
  } catch (error) {
    console.error("Fetch guest profile error:", error);
    throw error;
  }
};

export const loginAdmin = async (credentials) => {
  try {
    const response = await api.post(`${ADMIN_API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    console.error("Admin login error:", error);
    throw error;
  }
};
