import AuthForm from "@/components/auth/AuthForm";

export default function GuestLoginPage({ searchParams }) {
  const isAdmin = searchParams?.role === "admin";

  return (
    <AuthForm
      mode="login"
      userType={isAdmin ? "admin" : "guest"}
      showSlider={!isAdmin}
    />
  );
}
