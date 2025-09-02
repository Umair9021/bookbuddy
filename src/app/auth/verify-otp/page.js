


"use client";

import VerifyOtpPageInner from "@/components/VerifyOtpPageInner";
import { Suspense } from "react";


export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpPageInner />
    </Suspense>
  );
}
