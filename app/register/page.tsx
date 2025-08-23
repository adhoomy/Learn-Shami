'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-slate-900 dark:border-slate-100 mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (session) {
    return null; // Will redirect
  }

  const handleRegisterSuccess = () => {
    // This will be called if auto-sign-in fails
    // Redirect to login with manual sign-in message
    router.push('/login?message=Account created successfully! Please sign in with your credentials.');
  };

  const goToLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Join Learn Shami
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Create your account to start learning Palestinian Arabic
          </p>
        </div>

        <RegisterForm 
          onSuccess={handleRegisterSuccess}
          onSwitchToLogin={goToLogin}
        />
      </div>
    </div>
  );
}
