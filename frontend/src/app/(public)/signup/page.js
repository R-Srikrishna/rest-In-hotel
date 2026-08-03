import AuthForm from "@/components/auth/AuthForm";

export default function GuestSignupPage() {
  return <AuthForm mode="signup" userType="guest" showSlider />;
}
