import BookingTable from "@/components/admin/BookingTable";

export default function AdminBookingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-white">Bookings</h1>
        <p className="text-sm text-slate-400">Manage guest reservations and booking status.</p>
      </div>
      <BookingTable />
    </div>
  );
}
