"use client"

import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { Toaster } from "@/components/ui/sonner"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion";
import LenisScroller from "@/components/lenisScroller";

export default function RootLayout({ children }) {
   const pathname = usePathname()
  return (
    <html lang="en">
      <body>
        <AuthProvider>
           <LenisScroller />
          <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
