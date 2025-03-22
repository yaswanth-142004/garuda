import React, { useState } from "react";
import { cn } from "../lib/utils"; // Assuming you have a utility class function
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import useAuthStore from "../store/AuthStore.js";

function ForgotPassword({ className, ...props }) {
  const { forgotPassword, loading, error } = useAuthStore();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await forgotPassword(email);
      setMessage(response || "Password reset email sent successfully!");
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div
      className={cn("flex flex-col items-center justify-center min-h-screen px-4", className)}
      {...props}
    >
      <form
        onSubmit={handleForgotPassword}
        className="flex flex-col gap-6 w-full max-w-sm p-6 rounded shadow-md"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email, and we’ll send you a password reset link.
          </p>
        </div>
        <div className="grid gap-6">
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending..." : "Send Password Reset Email"}
          </Button>
        </div>
        <div className="text-center text-sm">
          Remember your password?{" "}
          <a href="/login" className="underline underline-offset-4">
            Log in
          </a>
        </div>
      </form>
    </div>
  );
}

export default ForgotPassword;
