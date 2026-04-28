"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
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
}

function SearchContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const initialSubject = searchParams.get("subject");
  
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(initialSubject ? [initialSubject] : []);
  const resultsRef = useRef<HTMLDivElement>(null);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      // Fetch all active teachers
      const res = await fetch(`/api/teachers`);
      if (!res.ok) throw new Error("Search failed");
      const allTeachers = await res.json();

      let filtered = allTeachers;

      // 1. Filter by Name/Keyword
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        filtered = filtered.filter((t: Teacher) => 
          t.user.name?.toLowerCase().includes(q) ||
          t.bio?.toLowerCase().includes(q) ||
          t.subjects?.toLowerCase().includes(q)
        );
      }

      // 2. Filter by selected subjects (OR logic)
      if (selectedSubjects.length > 0) {
        filtered = filtered.filter((t: Teacher) => {
          if (!t.subjects) return false;
          const teacherSubjects = t.subjects.toLowerCase().split(',').map(s => s.trim());
          return selectedSubjects.some(s => 
            teacherSubjects.some(ts => ts.includes(s.toLowerCase()) || s.toLowerCase().includes(ts))
          );
        });
      }

      setTeachers(filtered);
    } catch (err) {
      console.error("Search Error:", err);
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
    // Smooth scroll when a filter is applied
    if (selectedSubjects.length > 0 && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 500);
    }
  }, [selectedSubjects, searchQuery]);

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
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-black text-[#13A699] uppercase tracking-tighter mb-4 leading-none">
          Find Your Expert
        </h1>
        <div className="w-24 h-2 bg-[#FFD708] mx-auto rounded-full mt-4 shadow-sm"></div>
      </div>

      <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-[#FFD708]/30 mb-16 overflow-hidden">
        <div className="flex flex-col md:flex-row gap-6 mb-16">
          <div className="flex-1 relative group">
            <input
              type="text"
              placeholder="Search by teacher name or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-[2rem] border-4 border-[#FFF7ED] focus:border-[#13A699] focus:outline-none bg-[#FFF7ED]/50 text-[#13A699] text-xl font-bold shadow-inner transition-all"
            />
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl opacity-30 group-focus-within:opacity-100 transition-opacity">🔍</span>
          </div>
          <button
            onClick={fetchTeachers}
            className="bg-[#13A699] text-white font-black px-12 py-5 rounded-[2rem] hover:bg-[#13A699]/90 transition shadow-xl text-xl uppercase tracking-widest active:scale-95"
          >
            Update Results
          </button>
        </div>

        <div className="pt-8 border-t-4 border-[#FFD708]/5">
           <div className="flex justify-between items-center mb-12">
             <h2 className="text-3xl md:text-4xl font-black text-[#13A699] uppercase tracking-tighter border-l-8 border-[#FFD708] pl-6">
                Subject List
             </h2>
             <p className="text-[#13A699] font-black text-sm bg-[#FFD708]/20 px-6 py-3 rounded-full border border-[#FFD708]/30 shadow-sm">
                Found {teachers.length} Expert Matches
             </p>
           </div>
          
           <SubjectSelector
              selectedSubjects={selectedSubjects}
              onChange={(s) => setSelectedSubjects(s)}
              mode="multi"
           />
        </div>
      </div>

      <div ref={resultsRef} className="scroll-mt-32">
        {loading ? (
          <div className="text-center py-24">
            <div className="animate-spin rounded-full h-20 w-20 border-t-8 border-b-8 border-[#13A699] mx-auto"></div>
            <p className="mt-8 text-[#13A699] font-black text-2xl uppercase tracking-widest animate-pulse">Scanning Marketplace...</p>
          </div>
        ) : teachers.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[4rem] border-4 border-dashed border-[#FFD708]/30 shadow-inner">
            <div className="text-6xl mb-6 opacity-30">🕵️</div>
            <p className="text-3xl font-black text-[#13A699]/40 uppercase tracking-tighter max-w-md mx-auto">
              No experts found for this selection yet.
            </p>
            <button 
              onClick={() => { setSelectedSubjects([]); setSearchQuery(""); }}
              className="mt-8 text-[#13A699] font-black uppercase tracking-widest underline decoration-[#FFD708] decoration-4 underline-offset-4"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {teachers.map((teacher) => (
              <Link href={`/book/${teacher.id}`} key={teacher.id} className="bg-white rounded-[3rem] p-10 shadow-2xl border-2 border-[#FFD708]/10 hover:border-[#13A699]/40 transition-all duration-500 group hover:-translate-y-3 flex flex-col no-underline relative overflow-hidden">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFD708]/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                
                <div className="flex items-center gap-8 mb-8 relative z-10">
                  <div className="w-24 h-24 bg-[#FFD708]/20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden border-4 border-[#FFD708]/30 group-hover:scale-110 transition-transform duration-500 shadow-md">
                    {teacher.photo ? (
                      <img src={teacher.photo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl text-[#13A699] font-black uppercase">
                        {teacher.user.name?.[0] || "T"}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-3xl text-black truncate uppercase tracking-tight mb-2 group-hover:text-[#13A699] transition-colors">{teacher.user.name || "Teacher"}</h3>
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-black text-[#FFD708]">{(teacher.rating || 0).toFixed(1)} ★</span>
                      <span className="text-xs text-gray-400 font-black ml-2 uppercase tracking-tighter">({teacher.ratingCount} reviews)</span>
                    </div>
                  </div>
                </div>

                {teacher.bio && (
                  <p className="text-gray-600 mb-8 line-clamp-4 text-xl leading-relaxed font-bold relative z-10 no-underline">{teacher.bio}</p>
                )}

                <div className="flex items-center justify-between mt-auto pt-8 border-t-4 border-[#FFD708]/5 relative z-10">
                  <div className="flex flex-col">
                    <span className="text-3xl font-black text-black">₹{teacher.fees || 500}</span>
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest mt-1">Per Hour</span>
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
    <Suspense fallback={<div className="text-center py-24 animate-pulse font-black text-4xl text-[#13A699] tracking-tighter uppercase">Initializing Marketplace...</div>}>
      <SearchContent />
    </Suspense>
  );
}
