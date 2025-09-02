"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyOtpPageInner() {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [purpose, setPurpose] = useState("signup");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParams = searchParams.get("email");
    const purposeParams = searchParams.get("purpose");
    if (emailParams) setEmail(emailParams);
    if (purposeParams) setPurpose(purposeParams);
  }, [searchParams]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setMessage("Please enter a valid 6-digit code");
      return;
    }
    if (!email) {
      setMessage("Email is missing. Please go back and try again.");
      return;
    }

    setIsLoading(true);
    setMessage("Verifying...");

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: purpose === "signup" ? "signup" : "recovery",
      });

      if (error) {
        if (error.message.includes("expired")) {
          setMessage("Code has expired. Please request a new one.");
        } else if (error.message.includes("invalid")) {
          setMessage("Invalid code. Please check and try again.");
        } else if (error.message.includes("too many")) {
          setMessage("Too many attempts. Please wait before trying again.");
        } else {
          setMessage(`Error: ${error.message}`);
        }
        setIsLoading(false);
        return;
      }

      if (purpose === "signup") {
        setMessage("Account verified! Redirecting to dashboard...");
        setTimeout(() => router.push("/"), 2000);
      } else {
        setMessage("Verified! Redirecting to password update...");
        setTimeout(() => router.push("/auth/updatePassword"), 2000);
      }
    } catch (err) {
      setMessage(`Unexpected error: ${err.message}`);
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    if (resendCooldown > 0) return;

    setMessage("Resending code...");
    setIsLoading(true);

    try {
      if (purpose === "signup") {
        const { error } = await supabase.auth.resend({
          type: "signup",
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          setMessage(`Error resending code: ${error.message}`);
        } else {
          setMessage("New verification code sent!");
          setResendCooldown(60);
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/verify-otp?email=${encodeURIComponent(
            email
          )}&purpose=recovery`,
        });

        if (error) {
          setMessage(`Error resending code: ${error.message}`);
        } else {
          setMessage("New verification code sent!");
          setResendCooldown(60);
        }
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 6) setOtp(value);
  };

  return (
   <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
  <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-md">
    <h1 className="text-2xl font-bold mb-4 text-center">
      {purpose === "signup" ? "Verify Your Account" : "Reset Password"}
    </h1>
    <p className="text-sm text-gray-600 mb-6 text-center">
      Code sent to: <span className="font-medium">{email}</span>
    </p>

    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Enter 6-digit verification code
        </label>
        <input
          type="text"
          value={otp}
          onChange={handleOtpChange}
          className="w-full p-3 border border-gray-300 rounded-md text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="000000"
          maxLength={6}
          disabled={isLoading}
          autoComplete="one-time-code"
        />
      </div>

      <button
        onClick={verifyOtp}
        disabled={isLoading || otp.length !== 6}
        className="w-full bg-indigo-600 text-white py-3 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed font-medium"
      >
        {isLoading ? "Verifying..." : "Verify Code"}
      </button>

      <button
        type="button"
        onClick={resendCode}
        disabled={isLoading || resendCooldown > 0}
        className="w-full text-indigo-600 py-2 rounded-md hover:text-indigo-700 text-sm disabled:text-indigo-300 disabled:cursor-not-allowed"
      >
        {resendCooldown > 0
          ? `Resend Code (${resendCooldown}s)`
          : isLoading
          ? "Sending..."
          : "Resend Code"}
      </button>

      {message && (
        <div
          className={`mt-4 p-3 rounded-md text-sm text-center ${
            message.includes("Error") ||
            message.includes("expired") ||
            message.includes("invalid")
              ? "bg-red-50 text-red-600 border border-red-200"
              : "bg-green-50 text-green-600 border border-green-200"
          }`}
        >
          {message}
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={() => router.push("/auth/login")}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          ← Back to Login
        </button>
      </div>
    </div>
  </div>
</div>

  );
}
