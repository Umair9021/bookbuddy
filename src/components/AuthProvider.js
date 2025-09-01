
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      const currentUser = data?.user || null;

      if (currentUser) {
        // 🔍 Check MongoDB for suspension
        try {
          const res = await fetch(`/api/users/${currentUser.id}`);
          const dbUser = await res.json();

          // if (dbUser?.isSuspended) {
          //   // 🚫 If suspended → force signout
          //   await supabase.auth.signOut();
          //   setUser(null);
          //   router.replace("/auth/suspended"); // a dedicated page or popup
          //   return;
          // }
          if (res.ok) {
            const dbUser = await res.json();
            if (dbUser?.isSuspended) {
              await supabase.auth.signOut();
              setUser(null);
              router.replace("/auth/suspended");
              return;
            }
          }
        } catch (err) {
          console.error("Error checking suspension:", err);
        }
      }

      setUser(currentUser);
      setLoading(false);
    };

    checkUser();

    // 🔄 Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        const currentUser = session?.user || null;

        if (currentUser) {
          // Check MongoDB again
          try {
            const res = await fetch(`/api/users/${currentUser.id}`);
            const dbUser = await res.json();

            if (dbUser?.isSuspended) {
              await supabase.auth.signOut();
              setUser(null);
              router.replace("/auth/suspended");
              return;
            }
          } catch (err) {
            console.error("Error checking suspension:", err);
          }
        }

        setUser(currentUser);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe?.();
    };

  }, [supabase, router]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
