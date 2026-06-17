"use client";

import { ResponsiveContainer, PieChart, Pie, Tooltip } from "recharts";

export default function GuestNationalityChart() {
  const data = [
    { name: "India", value: 45 },
    { name: "USA", value: 15 },
    { name: "UK", value: 10 },
    { name: "UAE", value: 20 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow h-96">
      <h2 className="font-bold mb-4">Guest Nationality</h2>

      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={120} />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
