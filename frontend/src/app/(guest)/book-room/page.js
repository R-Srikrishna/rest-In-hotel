import BookingForm from "@/components/guest/BookingForm";

export default function GuestBookRoomPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold text-white">Book a room</h1>
        <p className="text-sm text-slate-400">Create a reservation for your stay.</p>
      </div>
      <BookingForm />
    </div>
  );
}
