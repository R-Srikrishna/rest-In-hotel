import RoomManagementTable from "@/components/admin/RoomManagementTable";

export default function AdminRoomsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-white">Rooms</h1>
        <p className="text-sm text-slate-400">Create, edit, and remove room listings.</p>
      </div>
      <RoomManagementTable />
    </div>
  );
}
