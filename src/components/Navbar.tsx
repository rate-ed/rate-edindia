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
    <nav className="bg-[#FFF7ED] border-b border-[#FFD708]/30 px-2 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Side: Sign Up (Extreme Left) */}
        <div className="flex-1 flex justify-start">
          {!session && (
            <Link
              href="/signup"
              className="bg-[#FFD708] text-[#13A699] font-black px-4 py-1.5 rounded-lg hover:bg-[#FFD708]/80 transition text-xs whitespace-nowrap shadow-sm uppercase"
            >
              Sign Up
            </Link>
          )}
        </div>

        {/* Center: Logo and Home below it */}
        <div className="flex-none flex flex-col items-center">
          <Link href="/">
            <img src="/logo.png" alt="Rate-ED" className="h-8 object-contain mb-1" />
          </Link>
          <Link 
            href="/" 
            className="text-[#13A699] font-black hover:underline text-[10px] uppercase tracking-widest"
          >
            Home
          </Link>
        </div>

        {/* Right Side: Dashboard/Login (Extreme Right) */}
        <div className="flex-1 flex justify-end">
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
                Exit
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-[#13A699] font-black hover:underline text-xs whitespace-nowrap uppercase tracking-tighter"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
