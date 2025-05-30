'use client'
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [donemessage, setdoneMessage] = useState('');
  const [email, setemail] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(()=>{
    const emailParams = searchParams.get('email');
    if(emailParams){
        setemail(emailParams);
    }
  })

  const verifyOtp = async () => {
    const { error } = await supabase.auth.verifyOtp({
        email,
      token: otp,
      type: 'signup',
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
        setdoneMessage('Account created successfully! Redirecting...')
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Verify OTP</h1>
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
            />
          </div>
          <button
            onClick={verifyOtp}
            className="w-full bg-indigo-600 text-white py-2 rounded"
          >
            Verify
          </button>
          {message && <p className="text-red-500 mt-2">{message}</p>}
          {donemessage && <p className="text-blue-500 mt-2">{donemessage}</p>}
        </div>
      </div>
    </div>
  );
}