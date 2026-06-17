"use client";

import { ResponsiveContainer, PieChart, Pie, Tooltip } from "recharts";

export default function RoomStatusChart() {
  const data = [
    { name: "Occupied", value: 80 },
    { name: "Available", value: 30 },
    { name: "Maintenance", value: 10 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow h-96">
      <h2 className="font-bold mb-4">Room Status</h2>

      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={120} />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
