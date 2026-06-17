import Link from "next/link";
import GuestsPage from "./(dashboard)/guests/page";
import RoomsPage from "./(dashboard)/rooms/page";
import BookingsPage from "./(dashboard)/bookings/page";
import DashboardPage from "./(dashboard)/dashboard/page";

export default function Home() {
  return (
    <>
      <DashboardPage />
    </>
  );
}
