"use client";

import { Suspense } from "react";

import BookSwapInner from "@/components/BookSwapInner";

export default function BrowsePage() {
  return (
    <Suspense fallback={<div>Loading browse...</div>}>
      <BookSwapInner />
    </Suspense>
  );
}
