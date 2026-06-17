"use client";

import DashboardStats from "../../../components/dashboard/DashboardStats";
import OccupancyChart from "../../../components/dashboard/OccupancyChart";
import BookingChart from "../../../components/dashboard/BookingChart";
import RoomStatusChart from "../../../components/dashboard/RoomStatusChart";
import GuestNationalityChart from "../../../components/dashboard/GuestNationalitychart";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mt-5">Dashboard</h1>

        <p className="text-gray-500">Hotel Overview</p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OccupancyChart />
        <BookingChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RoomStatusChart />
        <GuestNationalityChart />
      </div>
    </div>
  );
}
