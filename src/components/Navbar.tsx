"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-[#FFF7ED] border-b-2 border-[#FFD708]/30 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Section */}
        <div className="flex-1 flex justify-start">
          {!session && (
            <Link href="/signup" className="bg-[#FFD708] text-[#13A699] font-black px-6 py-2 rounded-2xl shadow-md uppercase text-sm no-underline hover:bg-[#FFD708]/80">
              Sign Up
            </Link>
          )}
        </div>

        {/* Center Section: Logo + Home */}
        <div className="flex-none flex flex-col items-center">
          <Link href="/" className="flex flex-col items-center no-underline">
            <img src="/logo.png" alt="Rate-ED" className="h-10 object-contain" />
            <span className="text-[#13A699] font-black text-xs uppercase tracking-tighter mt-1 hover:underline">Home Page</span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex-1 flex justify-end">
          {session ? (
            <button onClick={() => signOut({ callbackUrl: "/" })} className="bg-[#13A699] text-white font-black px-6 py-2 rounded-2xl shadow-md uppercase text-sm no-underline">
              Logout
            </button>
          ) : (
            <Link href="/login" className="text-[#13A699] font-black uppercase text-sm no-underline hover:underline">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
