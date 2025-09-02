"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import OAuthButton from "@/components/OAuthButton";

export default function LoginPage() {
  const [errorMessage, setErrorMessage] = useState("");
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        setErrorMessage("Password is wrong. Please try again.");
      } else if (error.message.includes("User not found")) {
        setErrorMessage("Email not registered. Please sign up first.");
      } else {
        setErrorMessage(error.message);
      }
    } else {
      router.push("/");
    }
  }

  async function handlePasswordReset(e) {
    e.preventDefault();
    setErrorMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: `${window.location.origin}/auth/verify-otp`,
    });

    if (error) {
      setResetMessage(`Error: ${error.message}`);
    } else {
      setResetMessage("Verification code sent! Check your email.");
      router.push(`/auth/verify-otp?email=${encodeURIComponent(resetEmail)}&purpose=recovery`);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="mt-6 text-center text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome back
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md rounded-xl sm:rounded-xl">
        <div className="bg-white py-6 sm:py-8 px-3 sm:px-10 shadow sm:rounded-xl">
          {!showReset ? (
            <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                    placeholder="youemail@example.com"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {errorMessage && (
                <p className="text-red-600 text-sm mt-2">{errorMessage}</p>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm text-right">
                  <button
                    onClick={() => setShowReset(!showReset)}
                    type="button"
                    className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot your password?
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex cursor-pointer justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign in
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordReset} className="mt-6 space-y-4">
              <label
                htmlFor="reset-email"
                className="block text-sm font-medium text-gray-700"
              >
                Enter your email to reset password
              </label>
              <input
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                placeholder="youremail@example.com"
              />
              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 text-sm sm:text-base font-medium"
              >
                Send reset link
              </button>
              {resetMessage && (
                <p
                  className={`mt-2 text-sm ${resetMessage.includes("Error")
                      ? "text-green-500"
                      : "text-red-500"
                    }`}
                >
                  {resetMessage}
                </p>
              )}
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3">
              <OAuthButton />
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-indigo-600 cursor-pointer hover:text-indigo-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>

  );
}
