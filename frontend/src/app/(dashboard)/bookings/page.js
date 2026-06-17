"use client";

import { useState, useEffect } from "react";
import BookingTable from "../../../components/booking/BookingTable";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("")
      .then((res) => res.json())
      .then((data) => {
        setBookings(data.bookings || []);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="p-8">
      <BookingTable bookings={bookings} />{" "}
    </div>
  );
}
