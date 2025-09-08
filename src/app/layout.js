"use client";

import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/sonner"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion";
import LenisScroller from "@/components/lenisScroller";
import ChatBoard from "@/components/ChatBoard";
import { ChatProvider } from '@/contexts/ChatContext';

export default function RootLayout({ children }) {
  const pathname = usePathname()
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ChatProvider> {/* Wrap everything with ChatProvider */}
            <LenisScroller />
            <AnimatePresence mode="wait">
              {children}
            </AnimatePresence>
            <ChatBoard /> {/* Only one instance of ChatBoard */}
            <Toaster />
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}