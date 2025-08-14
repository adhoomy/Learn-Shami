'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function SignInForm() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      alert("Sign in failed: " + result.error);
    }
  };

  if (status === "loading") {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {session.user.name}!</CardTitle>
          <CardDescription>You are signed in</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p><strong>Email:</strong> {session.user.email}</p>
            <p><strong>User ID:</strong> {session.user.id}</p>
            <p><strong>Role:</strong> <span className="capitalize">{session.user.role}</span></p>
          </div>
          
          <Button onClick={() => signOut()} variant="destructive">
            Sign Out
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Choose your sign-in method</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Credentials Form */}
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
            />
          </div>
          <Button type="submit" className="w-full">
            Sign In with Credentials
          </Button>
        </form>

        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p><strong>Demo Accounts:</strong></p>
          <p>Admin: admin@example.com / password</p>
          <p>Learner: learner@example.com / password</p>
        </div>
      </CardContent>
    </Card>
  );
}
