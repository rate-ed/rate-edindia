"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import SubjectSelector from "@/components/SubjectSelector";

interface Teacher {
  id: string;
  bio: string | null;
  qualifications: string | null;
  experience: number | null;
  fees: number | null;
  rating: number;
  ratingCount: number;
  subjects: string | null;
  location: string;
  photo: string | null;
  user: { name: string | null; email: string; image: string | null };
  availability: Array<{ dayOfWeek: number; startTime: string; endTime: string }>;
}

function SearchContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialSubject = searchParams.get("subject");
  
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(initialSubject ? [initialSubject] : []);
  const resultsRef = useRef<HTMLDivElement>(null);

  const fetchTeachers = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    
    // If we have only 1 subject, it acts as a "Landing Page" mode
    if (selectedSubjects.length === 1) params.set("subject", selectedSubjects[0]);

    try {
      const res = await fetch(`/api/teachers?${params}`);
      const data = await res.json();

      let filtered = data;
      // Multi-select filtering
      if (selectedSubjects.length > 1) {
        filtered = data.filter((t: Teacher) =>
          selectedSubjects.some((s) => t.subjects?.toLowerCase().includes(s.toLowerCase()))
        );
      }

      setTeachers(filtered);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTeachers();
    if (selectedSubjects.length > 0 && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [selectedSubjects]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.round(rating) ? "text-[#FFD708]" : "text-gray-200"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Title Section */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-black text-[#13A699] uppercase tracking-tighter mb-4 leading-none">
          {selectedSubjects.length === 1 ? `Experts in ${selectedSubjects[0]}` : "Find Your Mentor"}
        </h1>
        <div className="w-24 h-2 bg-[#FFD708] mx-auto rounded-full mt-4"></div>
      </div>

      {/* Global List Section - Everything Visible at Once */}
      <div className="mb-20">
        <h2 className="text-2xl font-black text-[#13A699] uppercase mb-8 flex items-center gap-4">
          <span className="w-4 h-4 bg-[#FFD708] rotate-45"></span>
          Select Subjects to View Teachers:
        </h2>
        <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-[#FFD708]/30">
          <SubjectSelector
            selectedSubjects={selectedSubjects}
            onChange={(s) => setSelectedSubjects(s)}
            mode="multi"
          />
          
          {selectedSubjects.length > 0 && (
            <div className="mt-12 pt-10 border-t-4 border-[#FFD708]/10">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-[#13A699] uppercase tracking-wider">Current Selection:</h3>
                <button
                  onClick={() => setSelectedSubjects([])}
                  className="text-sm font-black text-red-500 hover:text-red-700 uppercase tracking-widest underline"
                >
                  Clear all filters
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {selectedSubjects.map((s) => (
                  <span key={s} className="bg-[#13A699] text-white text-base px-6 py-2 rounded-full flex items-center gap-3 font-black shadow-md uppercase">
                    {s}
                    <button onClick={() => setSelectedSubjects(selectedSubjects.filter((x) => x !== s))} className="hover:text-red-300 font-black text-xl">×</button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Header with Name Search */}
      <div ref={resultsRef} className="scroll-mt-32 mb-12">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between bg-[#13A699] p-8 rounded-[2.5rem] shadow-xl">
           <div className="flex-1 w-full relative">
              <input
                type="text"
                placeholder="Search by teacher name or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-2xl border-none focus:ring-4 focus:ring-[#FFD708]/50 bg-white text-[#13A699] text-xl font-bold placeholder:text-[#13A699]/30"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-[#13A699]/30">🔍</span>
           </div>
           <button
            onClick={fetchTeachers}
            className="w-full md:w-auto bg-[#FFD708] text-[#13A699] font-black px-12 py-4 rounded-2xl hover:scale-105 transition-all shadow-lg text-xl uppercase tracking-wider"
          >
            Refine Search
          </button>
        </div>
      </div>

      {/* Results Grid */}
      <div>
        {loading ? (
          <div className="text-center py-24">
            <div className="animate-spin rounded-full h-20 w-20 border-t-8 border-b-8 border-[#13A699] mx-auto"></div>
            <p className="mt-8 text-[#13A699] font-black text-2xl uppercase tracking-widest animate-pulse">Filtering Experts...</p>
          </div>
        ) : teachers.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[4rem] border-4 border-dashed border-[#FFD708]/30 shadow-inner">
            <div className="text-6xl mb-6 opacity-30">🕵️</div>
            <p className="text-3xl font-black text-[#13A699]/40 uppercase tracking-tighter">
              No teachers found for {selectedSubjects.length > 0 ? "this selection" : "these filters"} yet.
            </p>
            <p className="text-sm text-[#13A699]/30 mt-4 uppercase font-bold tracking-widest">Try selecting more subjects or clearing your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {teachers.map((teacher) => (
              <Link href={`/book/${teacher.id}`} key={teacher.id} className="bg-white rounded-[3rem] p-10 shadow-2xl border-2 border-[#FFD708]/10 hover:border-[#13A699]/40 transition-all duration-500 group hover:-translate-y-3 flex flex-col">
                <div className="flex items-center gap-8 mb-8">
                  <div className="w-24 h-24 bg-[#FFD708]/20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden border-4 border-[#FFD708]/30 group-hover:scale-110 transition-transform duration-500">
                    {teacher.photo ? (
                      <img src={teacher.photo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl text-[#13A699] font-black uppercase">
                        {teacher.user.name?.[0] || "T"}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-3xl text-[#13A699] truncate uppercase tracking-tight mb-2 group-hover:text-[#13A699] transition-colors">{teacher.user.name || "Teacher"}</h3>
                    <div className="flex items-center gap-1">
                      {renderStars(teacher.rating)}
                      <span className="text-xs text-gray-400 font-black ml-2 uppercase tracking-tighter">({teacher.ratingCount} reviews)</span>
                    </div>
                    <p className="text-sm font-black text-[#13A699]/50 mt-2 uppercase tracking-widest italic">📍 {teacher.location || "On-Call"}</p>
                  </div>
                </div>

                {teacher.bio && (
                  <p className="text-[#13A699]/70 mb-8 line-clamp-4 text-xl leading-relaxed font-bold">{teacher.bio}</p>
                )}

                <div className="flex items-center justify-between mt-auto pt-8 border-t-4 border-[#FFD708]/5">
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-[#13A699]">₹{teacher.fees || 500}</span>
                    <span className="text-xs font-black text-[#13A699]/40 uppercase tracking-widest mt-1">Per Hour</span>
                  </div>
                  <div className="bg-[#FFD708] text-[#13A699] font-black px-8 py-4 rounded-3xl text-lg group-hover:bg-[#FFD708]/80 transition-all shadow-xl uppercase transform group-hover:scale-105">
                    Book Demo
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-24 animate-pulse font-black text-4xl text-[#13A699] tracking-tighter">INITIALIZING MARKETPLACE...</div>}>
      <SearchContent />
    </Suspense>
  );
}
