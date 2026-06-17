"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function OccupancyChart() {
  const data = [
    { day: "Mon", occupancy: 65 },
    { day: "Tue", occupancy: 72 },
    { day: "Wed", occupancy: 68 },
    { day: "Thu", occupancy: 81 },
    { day: "Fri", occupancy: 90 },
    { day: "Sat", occupancy: 95 },
    { day: "Sun", occupancy: 88 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow h-96">
      <h2 className="font-bold mb-4">Occupancy Trend</h2>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="occupancy" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
