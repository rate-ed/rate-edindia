"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isHomePage = pathname === "/";

  return (
    <nav className="bg-[#FFF7ED] border-b border-[#FFD708]/30 px-4 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Back or Sign Up */}
        <div className="flex-1 flex justify-start gap-4">
          {!isHomePage && (
            <button 
              onClick={() => router.back()}
              className="text-[#13A699] font-black uppercase text-xs hover:underline flex items-center gap-1"
            >
              ← Back
            </button>
          )}
          {!session && (
            <Link href="/signup" className="bg-[#FFD708] text-[#13A699] font-black px-4 py-2 rounded-xl text-xs uppercase no-underline shadow-sm">
              Sign Up
            </Link>
          )}
        </div>

        {/* Center: Logo + Home */}
        <div className="flex-none flex flex-col items-center">
          <Link href="/" className="flex flex-col items-center no-underline">
            <img src="/logo.png" alt="Rate-ED" className="h-8 object-contain" />
            <span className="text-[#13A699] font-black text-[10px] uppercase tracking-widest mt-1 hover:underline">Home</span>
          </Link>
        </div>

        {/* Right: Auth */}
        <div className="flex-1 flex justify-end">
          {session ? (
            <button onClick={() => signOut({ callbackUrl: "/" })} className="bg-[#13A699] text-white font-black px-4 py-2 rounded-xl text-xs uppercase shadow-sm">
              Exit
            </button>
          ) : (
            <Link href="/login" className="text-[#13A699] font-black uppercase text-xs no-underline hover:underline">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
