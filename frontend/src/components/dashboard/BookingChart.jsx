"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function BookingChart() {
  const data = [
    { day: "Mon", bookings: 4 },
    { day: "Tue", bookings: 6 },
    { day: "Wed", bookings: 5 },
    { day: "Thu", bookings: 8 },
    { day: "Fri", bookings: 10 },
    { day: "Sat", bookings: 15 },
    { day: "Sun", bookings: 12 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow h-96">
      <h2 className="font-bold mb-4">Booking Trend</h2>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="bookings" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
