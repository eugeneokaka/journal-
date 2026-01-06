"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const [loading, setLoading] = useState(true); // controls the spinner

  useEffect(() => {
    const syncUser = async () => {
      if (!isSignedIn || !user) return;

      try {
        const res = await fetch("/api/auth/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clerkId: user.id }),
        });

        const data = await res.json();

        if (data.success) {
          // stop spinner before redirect
          setLoading(false);

          // give a tiny delay so user sees spinner stop
          setTimeout(() => {
            router.replace("/"); // redirect to home
          }, 300);
        } else {
          console.error("Failed to sync user:", data.error);
          setLoading(false); // stop spinner even on error
        }
      } catch (error) {
        console.error("Error syncing user:", error);
        setLoading(false);
      }
    };

    syncUser();
  }, [user, isSignedIn, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        {loading ? (
          <>
            <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="mt-4 text-gray-700 font-medium">
              Setting up your account...
            </p>
          </>
        ) : (
          <p className="mt-4 text-gray-700 font-medium">
            Setup complete! Redirecting...
          </p>
        )}
      </div>
      <style jsx>{`
        .spinner-border {
          border-top-color: transparent;
        }
      `}</style>
    </div>
  );
}
