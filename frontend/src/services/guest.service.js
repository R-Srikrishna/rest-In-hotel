"use client";

import api from "../lib/axios";

const API_URL = "/guests/users";

// Get all guests
export const fetchGuests = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Guests Response-1:", response.data);

    return response.data.guests;
  } catch (error) {
    console.error("Error fetching guests:", error);
    throw error;
  }
};

// Get guest by ID
export const fetchGuestById = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Guest Response:", response.data);

    return response.data.guest;
  } catch (error) {
    console.error("Error fetching guest:", error);
    throw error;
  }
};

// Create guest
export const createGuest = async (guestData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.post(API_URL, guestData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.guests;
  } catch (error) {
    console.error("Error creating guest:", error);
    throw error;
  }
};

// Update guest
export const updateGuest = async (id, guestData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.patch(`${API_URL}/${id}`, guestData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Guest Response:", response.data);

    return response.data.guests;
  } catch (error) {
    console.error("Error updating guest:", error);
    throw error;
  }
};

// Delete guest
export const deleteGuest = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.guests;
  } catch (error) {
    console.error("Error deleting guest:", error);
    throw error;
  }
};
