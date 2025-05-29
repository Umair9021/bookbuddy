
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
              We've sent a confirmation link to your email. Please check your inbox to verify your account.
            </CardDescription>
          </CardHeader>
       </Card>
  );
}
