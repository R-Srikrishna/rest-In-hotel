"use client";

export default function DashboardStats() {
  const stats = [
    {
      title: "Total Rooms",
      value: 120,
    },
    {
      title: "Bookings",
      value: 45,
    },
    {
      title: "Guests",
      value: 87,
    },
    {
      title: "Revenue",
      value: "₹85,000",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {stats.map((item) => (
        <div key={item.title} className="bg-white rounded-xl shadow p-6">
          <h3 className="text-sm text-gray-500">{item.title}</h3>

          <p className="text-3xl font-bold mt-3">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
