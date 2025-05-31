'use client'
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('signup');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParams = searchParams.get('email');
    const purposeParams = searchParams.get('purpose');
    if (emailParams) {
      setEmail(emailParams);
    }
    if (purposeParams) {
      setPurpose(purposeParams);
    }
  }, [searchParams]);

  const verifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setMessage('Please enter a valid 6-digit code');
      return;
    }

    setIsLoading(true);
    setMessage('Verifying...');

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: purpose,
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
      setIsLoading(false);
      return;
    }

    // Only show success and redirect after successful verification
    if (purpose === 'signup') {
      setMessage('Account verified! Redirecting to dashboard...');
      setTimeout(() => router.push('/dashboard'), 2000);
    } else {
      setMessage('Verified! Redirecting to password update...');
      setTimeout(() => router.push('/auth/updatePassword'), 2000);
    }
  };

  const resendCode = async () => {
    setMessage('Resending code...');
    setIsLoading(true);

    try {
      if (purpose === 'signup') {
        await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
      } else {
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/verify-otp?email=${email}&purpose=recovery`,
        });
      }
      setMessage('New verification code sent!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">
          {purpose === 'signup' ? 'Verify Your Account' : 'Reset Password'}
        </h1>
        <p className="text-sm text-gray-600 mb-4">
          Code sent to: <span className="font-medium">{email}</span>
        </p>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">OTP Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="6-digit code"
              maxLength={6}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={verifyOtp}
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:bg-indigo-400"
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
          <button
            type="button"
            onClick={resendCode}
            disabled={isLoading}
            className="w-full text-indigo-600 py-2 rounded hover:text-indigo-700 text-sm disabled:text-indigo-300"
          >
            Resend Code
          </button>
          {message && (
            <p className={`mt-2 text-sm ${
              message.includes('Error') ? 'text-red-500' : 'text-green-500'
            }`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}