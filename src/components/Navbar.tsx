"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="bg-[#FFF7ED] border-b-2 border-[#FFD708]/30 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 flex justify-start">
          {!session && (
            <Link href="/signup" className="bg-[#FFD708] text-[#13A699] font-black px-4 py-2 rounded-xl text-[10px] uppercase shadow-sm no-underline">
              Sign Up
            </Link>
          )}
        </div>
        <div className="flex-none flex flex-col items-center">
          <Link href="/" className="flex flex-col items-center no-underline">
            <img src="/logo.png" alt="Rate-ED" className="h-8 object-contain" />
            <span className="text-[#13A699] font-black text-[10px] uppercase tracking-widest mt-1">Home</span>
          </Link>
        </div>
        <div className="flex-1 flex justify-end">
          {session ? (
            <button onClick={() => signOut({ callbackUrl: "/" })} className="bg-[#13A699] text-white font-black px-4 py-2 rounded-xl text-[10px] uppercase no-underline">
              Exit
            </button>
          ) : (
            <Link href="/login" className="text-[#13A699] font-black text-[10px] uppercase no-underline hover:underline">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
