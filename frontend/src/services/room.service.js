// services/room.service.js
import api from "../lib/axios";

const API_URL = "/rooms";

export const fetchRooms = async () => {
  try {
    const response = await api.get("/rooms");

    // console.log("FULL RESPONSE:", response);
    // console.log("RESPONSE DATA:", response.data);

    return response.data.rooms;
  } catch (err) {
    console.error("Fetch Rooms Error:", err);
    throw err;
  }
};

export const fetchRoomById = async (id) => {
  try {
    const response = await api.get(`${API_URL}/${id}`);

    console.log("API RESPONSE:", response.data);

    return response.data.room;
  } catch (err) {
    console.error("Fetch Room By ID Error:", err);
    throw err;
  }
};

export const createRoom = async (roomData) => {
  try {
    const response = await api.post(API_URL, roomData);
    return response.data.rooms;
  } catch (err) {
    console.error("Create Room DB Write Error:", err);
    throw err;
  }
};

export const deleteRoom = async (id) => {
  try {
    console.log("Delete Room Response:", `${API_URL}/${id}`);
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data.rooms;
  } catch (err) {
    console.error("Delete Room Error:", err);
    throw err;
  }
};

export const updateRoom = async (id, roomData) => {
  try {
    const response = await api.patch(`${API_URL}/${id}`, roomData);
    return response.data.rooms;
  } catch (err) {
    console.error("Update Room Error:", err);
    throw err;
  }
};

export const fetchRoomsByType = async (roomType) => {
  try {
    const response = await api.get(`${API_URL}/type/${roomType}`);
    return response.data.rooms;
  } catch (err) {
    console.error("Fetch Rooms By Type Error:", err);
    throw err;
  }
};
