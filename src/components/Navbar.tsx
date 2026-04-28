"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const dashboardLink = session?.user?.role === "TEACHER"
    ? "/dashboard/teacher"
    : session?.user?.role === "ADMIN"
    ? "/dashboard/admin"
    : "/dashboard/parent";

  return (
    <nav className="bg-[#FFF7ED] border-b border-[#FFD708]/30 px-6 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">
        {/* Left column: Sign Up */}
        <div className="flex justify-start">
          {!session && (
            <Link
              href="/signup"
              className="bg-[#FFD708] text-[#13A699] font-black px-4 py-2 rounded-xl hover:bg-[#FFD708]/80 transition text-xs whitespace-nowrap shadow-sm uppercase"
            >
              Sign Up
            </Link>
          )}
        </div>

        {/* Center column: Logo & Home */}
        <div className="flex flex-col items-center gap-1">
          <Link href="/" className="flex flex-col items-center">
            <img src="/logo.png" alt="Rate-ED" className="h-10 object-contain" />
            <span className="text-[#13A699] font-black text-[10px] uppercase tracking-widest mt-1 hover:underline">Home</span>
          </Link>
        </div>

        {/* Right column: Auth */}
        <div className="flex justify-end items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3">
              <Link
                href={dashboardLink}
                className="text-[#13A699] font-bold hover:underline text-xs whitespace-nowrap uppercase"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="bg-[#13A699] text-white px-3 py-1.5 rounded-lg text-xs hover:bg-[#13A699]/80 transition whitespace-nowrap uppercase font-bold"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-[#13A699] font-black hover:underline text-xs whitespace-nowrap uppercase"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
