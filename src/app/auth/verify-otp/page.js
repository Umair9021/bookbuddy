'use client'
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState('');
  const [email, setemail] = useState('');
  const [purpose, setPurpose] = useState('signup');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(()=>{
    const emailParams = searchParams.get('email');
    const purposeParams = searchParams.get('purpose');
    if(emailParams){
        setemail(emailParams);
    }
    if(purposeParams){
      setPurpose(purposeParams);
    }
  },[searchParams]);

  const verifyOtp = async () => {
    
    setMessage('Verifying...');
    const { error } = await supabase.auth.verifyOtp({
        email,
      token: otp,
      type: purpose,
    });

    if (purpose=='signup') {
      setMessage('Account verified! Redirecting to dashboard...');
      setTimeout(() => router.push('/dashboard'), 2000);
    } else {
        setMessage('Verified! Redirecting to Password update...')
      setTimeout(() => router.push('/auth/updatePassword'), 2000)
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">
          {purpose === 'signup'? 'Verify Your Account': 'Reset Password'}
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
            />
          </div>
          <button
            onClick={verifyOtp}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            Verify
          </button>
           
          {message && (
            <p className={`mt-2 text-sm ${message.includes('Error')? 'text-red-500': 'text-green-500'}`}>{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}