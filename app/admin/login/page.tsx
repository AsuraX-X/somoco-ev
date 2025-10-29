"use client"

import { signIn } from "next-auth/react";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid username or password");
      } else {
        // Redirect to admin or callback URL
        const callbackUrl = searchParams.get("callbackUrl") || "/admin";
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error(err);

      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!username) {
      setError("Please enter your username first");
      return;
    }

    setResetLoading(true);
    setError("");
    setResetMessage(null);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to reset password");
      } else {
        setResetMessage(
          data.message || "Password reset requested. Check your email."
        );
        setError("");
      }
    } catch (err) {
      console.error(err);

      setError("An error occurred. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#252525] rounded-lg p-8 border border-[#333]">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Login</h1>
            <p className="text-gray-400 text-sm">
              Sign in to access the admin portal
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          {resetMessage && (
            <div className="mb-6 p-3 bg-green-500/10 border border-green-500/30 rounded text-green-400 text-sm">
              <p className="font-medium mb-1">Password reset</p>
              <p className="text-xs">{resetMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-primary border border-[#333] rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                placeholder="Enter your username"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-primary border border-[#333] rounded text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white py-3 rounded font-medium hover:bg-green-600 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetLoading || !username}
              className="w-full text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resetLoading ? "Sending reset email..." : "Forgot Password?"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#333]">
            <p className="text-center text-xs text-gray-500">
              Secured with NextAuth.js
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

const LoginPage = () => (
  <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
    <LoginPageContent />
  </Suspense>
);

export default LoginPage;
