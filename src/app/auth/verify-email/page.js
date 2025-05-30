import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VerifyEmailPage() {
  return (
    <Card className="w-[500px] m-auto shadow-lg mt-70">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Verify Your Email
        </CardTitle>
        <CardDescription className="text-gray-500">
  We've sent a 6-digit OTP code to your email.{" "}
  <Link href="/auth/verify-otp" className="text-indigo-600 hover:underline">
    Click here to enter it.
  </Link>
</CardDescription>
      </CardHeader>
    </Card>
  );
}
