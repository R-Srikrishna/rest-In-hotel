import AuthForm from "@/components/auth/AuthForm";

export default function GuestLoginPage() {
  return <AuthForm mode="login" userType="guest" showSlider />;
}
