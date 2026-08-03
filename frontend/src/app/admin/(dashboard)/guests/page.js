import GuestTable from "@/components/admin/GuestTabel";

export default function AdminGuestsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-white">Guests</h1>
        <p className="text-sm text-slate-400">View registered guests and their contact information.</p>
      </div>
      <GuestTable />
    </div>
  );
}
