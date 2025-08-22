'use client';

import { signIn, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import RegisterForm from "@/components/auth/register-form";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

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

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setMessage("Sign in failed: " + result.error);
    } else {
      setMessage("Signing in...");
    }
    setIsLoading(false);
  };

  const handleRegisterSuccess = () => {
    // This will be called if auto-sign-in fails
    setIsRegistering(false);
    setMessage("Account created! Please sign in with your credentials.");
  };

  const switchToRegister = () => setIsRegistering(true);
  const switchToLogin = () => setIsRegistering(false);



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {isRegistering ? 'Join Learn Shami' : 'Welcome Back'}
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {isRegistering ? 'Create your account to start learning' : 'Sign in to access your lessons'}
          </p>
        </div>

        {isRegistering ? (
          <RegisterForm 
            onSuccess={handleRegisterSuccess}
            onSwitchToLogin={switchToLogin}
          />
        ) : (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-slate-100">
                Sign In
              </CardTitle>
              <CardDescription>
                Use your email and password to sign in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleCredentialsSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              {message && (
                <div className={`p-3 rounded-md text-sm ${
                  message.includes("failed") 
                    ? "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400" 
                    : "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                }`}>
                  {message}
                </div>
              )}

              <div className="text-center">
                <Button 
                  variant="link" 
                  onClick={switchToRegister}
                  className="text-slate-600 dark:text-slate-400"
                >
                  Don't have an account? Sign up
                </Button>
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 text-center space-y-1 border-t pt-4">
                <p><strong>Demo Accounts:</strong></p>
                <p>Admin: admin@example.com / password</p>
                <p>Learner: learner@example.com / password</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
