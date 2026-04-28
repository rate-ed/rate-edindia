"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("If an account exists for ${email}, a password reset link has been sent.");
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#FFD708]/20 text-center">
        <h1 className="text-xl font-bold text-[#13A699] mb-4 uppercase">Reset Password</h1>
        
        {message ? (
          <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg mb-6 text-sm">{message}</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-[#13A699]/60 mb-4">Enter your email address and we'll send you a link to reset your password.</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED]"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#FFD708] text-[#13A699] font-bold py-3 rounded-xl hover:bg-[#FFD708]/80 transition uppercase"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <p className="mt-6 text-sm text-[#13A699]/60">
          Remember your password?{" "}
          <Link href="/login" className="text-[#13A699] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
