"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function SuspendedPage() {
  const router = useRouter();

  return (
    
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <CardTitle className="mt-4 text-xl font-semibold text-gray-900">
            Account Suspended
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-gray-600">
            Your account has been suspended by the administrator.  
            You will not be able to access the platform until it is reactivated.
          </p>
          <p className="text-sm text-gray-500">
            If you believe this is a mistake, please contact support.
          </p>

          <div className="space-y-2">
            <Button 
              onClick={() => router.replace("/auth/login")} 
              className="w-full"
            >
              Return to Login
            </Button>

            <Button
              as="a"
              onClick={() => router.replace("/auth/contacttoAdmin")} 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
