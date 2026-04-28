"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13A699]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative text-center mb-16 py-12">
        <div className="absolute top-0 -left-10 w-40 h-40 bg-[#FFD708]/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 -right-10 w-60 h-60 bg-[#13A699]/5 rounded-full blur-3xl -z-10"></div>
        
        <h1 className="text-4xl md:text-6xl font-black text-[#13A699] mb-6 leading-tight">
          Make Your Child <br/> 
          <span className="relative inline-block">
            Skill Independent
            <div className="absolute -bottom-2 left-0 w-full h-2 bg-[#FFD708] rounded-full"></div>
          </span>
        </h1>
        <p className="text-[#13A699]/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium">
          A premium marketplace for specialized coaching in Career Skills, 
          Sports, Wellness, and Hobbies.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <Link
            href="/signup"
            className="bg-[#13A699] text-white font-bold px-12 py-4 rounded-2xl text-xl hover:shadow-[0_10px_20px_-5px_rgba(19,166,153,0.4)] transition-all transform hover:-translate-y-1"
          >
            Get Started
          </Link>
          <Link
            href="/search"
            className="bg-[#FFD708] text-[#13A699] font-bold px-12 py-4 rounded-2xl text-xl hover:shadow-[0_10px_20px_-5px_rgba(255,215,8,0.4)] transition-all transform hover:-translate-y-1"
          >
            Explore Skills
          </Link>
        </div>
      </div>

      {/* Graphical Step Section - Tiny Icons and Large Words */}
      <div className="mb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              title: "Discover",
              link: "/search",
              desc: "Browse through 50+ specialized categories from Digital Tech to Archery.",
              icon: (
                <svg className="w-4 h-4 text-[#13A699]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )
            },
            {
              title: "Connect",
              link: "/signup",
              desc: "View verified profiles, certificates, and check real-time availability slots.",
              icon: (
                <svg className="w-4 h-4 text-[#13A699]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              )
            },
            {
              title: "Grow",
              link: "/search",
              desc: "Book a demo session and start the journey toward specialized mastery.",
              icon: (
                <svg className="w-4 h-4 text-[#13A699]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              )
            }
          ].map((item, i) => (
            <Link key={i} href={item.link} className="text-center group block p-6 rounded-3xl hover:bg-[#FFD708]/10 transition-colors border border-transparent hover:border-[#FFD708]/30">
              <div className="w-8 h-8 bg-[#FFD708] rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-[#13A699] font-black text-4xl mb-4 tracking-tight uppercase">{item.title}</h3>
              <p className="text-[#13A699]/60 text-lg leading-relaxed max-w-xs mx-auto font-medium">
                {item.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* Teacher CTA Section */}
      <div className="relative bg-[#13A699] rounded-[3rem] p-12 text-center shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10"></div>
        <h2 className="text-4xl font-black text-white mb-6 uppercase">Are you a Teacher?</h2>
        <p className="text-white/80 text-xl mb-6 max-w-xl mx-auto font-medium">
          Showcase your skills to parents and grow your teaching career with us.
        </p>
      </div>
    </div>
  );
}
