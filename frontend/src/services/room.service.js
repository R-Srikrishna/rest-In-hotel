// services/room.service.js
import api from "../lib/axios";

const API_URL = "/rooms";

export const fetchRooms = async () => {
  try {
    // Hits router.get('/', roomsController.getAllRooms);
    const response = await api.get(API_URL);

    // Safely extract rooms array from typical Express envelope shapes
    return (
      response.data?.data?.rooms ??
      response.data?.rooms ??
      response.data?.data ??
      response.data ??
      []
    );
  } catch (err) {
    console.error("Fetch Rooms Error:", err);
    throw err;
  }
};

export const fetchAdminRooms = async () => {
  try {
    const response = await api.get(API_URL);
    return (
      response.data?.data?.rooms ??
      response.data?.rooms ??
      response.data?.data ??
      response.data ??
      []
    );
  } catch (err) {
    console.error("Fetch Admin Rooms Error:", err);
    throw err;
  }
};

export const fetchRoomById = async (id) => {
  try {
    const response = await api.get(`${API_URL}/${id}`);
    console.log("API RESPONSE:", response.data);

    return response.data?.data?.room ?? response.data?.room ?? response.data;
  } catch (err) {
    console.error("Fetch Room By ID Error:", err);
    throw err;
  }
};

export const createRoom = async (roomData) => {
  console.log("Sending room:", roomData);

  try {
    const response = await api.post(API_URL, roomData);
    return response.data?.data?.room ?? response.data?.room;
  } catch (err) {
    console.error("Status:", err.response?.status);
    console.error("Response:", err.response?.data);
    throw err;
  }
};

export const deleteRoom = async (id) => {
  try {
    console.log("Delete Room Response:", `${API_URL}/${id}`);
    await api.delete(`${API_URL}/${id}`);
    return true;
  } catch (err) {
    console.error("Delete Room Error:", err);
    throw err;
  }
};

export const updateRoom = async (id, roomData) => {
  try {
    const response = await api.patch(`${API_URL}/${id}`, roomData);
    return response.data?.data?.room ?? response.data?.room;
  } catch (err) {
    console.error("Update Room Error:", err);
    throw err;
  }
};

export const fetchRoomsByType = async (roomType) => {
  try {
    const response = await api.get(`${API_URL}/type/${roomType}`);
    return response.data?.data?.room ?? response.data?.room;
  } catch (err) {
    console.error("Fetch Rooms By Type Error:", err);
    throw err;
  }
};
