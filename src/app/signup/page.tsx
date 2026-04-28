"use client";
import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("PARENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const r = session.user.role;
      if (r === "TEACHER") router.replace("/dashboard/teacher");
      else if (r === "ADMIN") router.replace("/dashboard/admin");
      else router.replace("/dashboard/parent");
    }
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but login failed. Please try logging in.");
      } else {
        router.refresh();
      }
    } catch {
      setError("Something went wrong");
    }
    setLoading(false);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13A699]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-[#FFD708]/20">
        <h1 className="text-xl font-bold text-[#13A699] text-center mb-6">Create Account</h1>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#13A699] mb-1">I am a</label>
            <div className="flex gap-2">
              {[
                { val: "PARENT", label: "Parent" },
                { val: "TEACHER", label: "Teacher" },
              ].map(({ val, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setRole(val)}
                  className={`flex-1 py-2 rounded-lg font-medium transition text-sm ${
                    role === val
                      ? "bg-[#13A699] text-white"
                      : "bg-[#FFD708]/20 text-[#13A699] hover:bg-[#FFD708]/40"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#13A699] mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#13A699] mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#13A699] mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED]"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FFD708] text-[#13A699] font-bold py-3 rounded-xl hover:bg-[#FFD708]/80 transition disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-[#13A699]/60">
          Already have an account?{" "}
          <Link href="/login" className="text-[#13A699] font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
