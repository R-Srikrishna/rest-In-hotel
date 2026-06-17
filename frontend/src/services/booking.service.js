import api from "../lib/axios";

const API_URL = "/bookings/rooms";

export const fetchBookings = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.bookings;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

export const fetchBookingById = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await api.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.booking;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await api.post(API_URL, bookingData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.booking;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const updateBooking = async (id, bookingData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await api.patch(`${API_URL}/${id}`, bookingData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.booking;
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};

export const deleteBooking = async (id) => {
  const token = localStorage.getItem("token");
  try {
    await api.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return true;
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};
