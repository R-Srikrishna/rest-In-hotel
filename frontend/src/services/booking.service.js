import api from "../lib/axios";

const BOOKING_URL = "/bookings";
const GUEST_BOOKINGS_URL = "/bookings/my-bookings";
const GUEST_BOOKING_CREATE_URL = "/bookings/my-booking";

export const fetchAdminBookings = async () => {
  try {
    const response = await api.get(BOOKING_URL);
    return response.data?.data?.bookings ?? response.data?.bookings ?? [];
  } catch (error) {
    console.error("Error fetching admin bookings:", error);
    throw error;
  }
};

export const fetchGuestBookings = async () => {
  try {
    const response = await api.get(GUEST_BOOKINGS_URL);
    return response.data?.data?.bookings ?? response.data?.bookings ?? [];
  } catch (error) {
    console.error("Error fetching guest bookings:", error);
    throw error;
  }
};

export const fetchBookingById = async (id) => {
  try {
    const response = await api.get(`${BOOKING_URL}/${id}`);
    return response.data?.data?.booking ?? response.data?.booking ?? null;
  } catch (error) {
    console.error("Error fetching booking:", error);
    throw error;
  }
};

export const createBooking = async (bookingData) => {
  try {
    const response = await api.post(GUEST_BOOKING_CREATE_URL, bookingData);
    return response.data?.data?.booking ?? response.data?.booking ?? null;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

export const updateBooking = async (id, bookingData) => {
  try {
    const response = await api.patch(`${BOOKING_URL}/${id}`, bookingData);
    return response.data?.data?.booking ?? response.data?.booking ?? null;
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};

export const deleteBooking = async (id) => {
  try {
    await api.delete(`${BOOKING_URL}/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};
