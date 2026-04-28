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
  const [locationFilter, setLocationFilter] = useState("");
  const [showSubjectPicker, setShowSubjectPicker] = useState(!!initialSubject);
  const resultsRef = useRef<HTMLDivElement>(null);

  const fetchTeachers = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    
    // If we have only 1 subject, it acts as a "Landing Page" mode
    if (selectedSubjects.length === 1) params.set("subject", selectedSubjects[0]);
    if (locationFilter) params.set("location", locationFilter);

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
      }, 500);
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
      {/* Dynamic Landing Page Heading */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-[#13A699] uppercase tracking-tighter mb-4">
          {selectedSubjects.length === 1 ? `Experts in ${selectedSubjects[0]}` : "Discover Teachers"}
        </h1>
        {selectedSubjects.length === 1 && (
          <p className="text-[#13A699]/60 text-lg font-bold uppercase tracking-widest">
            Specialized Coaching Marketplace
          </p>
        )}
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#FFD708]/30 mb-12">
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <input
            type="text"
            placeholder="Search by name, skill, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-6 py-4 rounded-2xl border-2 border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699] text-lg font-medium"
          />
          <button
            onClick={fetchTeachers}
            className="bg-[#FFD708] text-[#13A699] font-black px-10 py-4 rounded-2xl hover:bg-[#FFD708]/80 transition shadow-lg text-lg uppercase tracking-wider"
          >
            Search
          </button>
        </div>

        <div className="pt-4 border-t-2 border-[#FFD708]/10">
          <button
            type="button"
            onClick={() => setShowSubjectPicker(!showSubjectPicker)}
            className="text-[#13A699] text-3xl font-black uppercase tracking-tighter hover:underline flex items-center gap-3 transition-all"
          >
            <span className="bg-[#FFD708] text-white w-10 h-10 rounded-full flex items-center justify-center text-xl">
              {showSubjectPicker ? "↑" : "↓"}
            </span>
            Explore Subject Categories
          </button>
          
          {showSubjectPicker && (
            <div className="mt-10">
              <SubjectSelector
                selectedSubjects={selectedSubjects}
                onChange={(s) => setSelectedSubjects(s)}
                mode="multi"
              />
              {selectedSubjects.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2 p-6 bg-[#FFF7ED]/30 rounded-2xl border border-[#FFD708]/20">
                  {selectedSubjects.map((s) => (
                    <span key={s} className="bg-[#13A699] text-white text-sm px-4 py-2 rounded-full flex items-center gap-2 font-bold shadow-sm">
                      {s}
                      <button onClick={() => setSelectedSubjects(selectedSubjects.filter((x) => x !== s))} className="hover:text-red-300 font-black text-lg">×</button>
                    </span>
                  ))}
                  <button
                    onClick={() => { setSelectedSubjects([]); fetchTeachers(); }}
                    className="text-sm font-black text-red-500 hover:text-red-700 ml-4 uppercase tracking-widest underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div ref={resultsRef} className="scroll-mt-32">
        {loading ? (
          <div className="text-center py-24">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#13A699] mx-auto"></div>
            <p className="mt-6 text-[#13A699] font-black uppercase tracking-widest animate-pulse">Filtering Results...</p>
          </div>
        ) : teachers.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-[#FFD708]/40 shadow-sm">
            <p className="text-2xl font-black text-[#13A699]/40 uppercase tracking-tighter">
              No teachers found for {selectedSubjects.length > 0 ? selectedSubjects.join(", ") : "this category"} yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {teachers.map((teacher) => (
              <Link href={`/book/${teacher.id}`} key={teacher.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-[#FFD708]/20 hover:border-[#13A699]/40 transition-all duration-300 group hover:-translate-y-2 flex flex-col">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 bg-[#FFD708]/20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-[#FFD708]/50 group-hover:scale-110 transition-transform">
                    {teacher.photo ? (
                      <img src={teacher.photo} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl text-[#13A699] font-black uppercase">
                        {teacher.user.name?.[0] || "T"}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-black text-2xl text-[#13A699] truncate uppercase tracking-tight">{teacher.user.name || "Teacher"}</h3>
                    <div className="flex items-center gap-1 mt-1">
                      {renderStars(teacher.rating)}
                      <span className="text-xs text-gray-400 font-bold ml-1 uppercase">({teacher.ratingCount} reviews)</span>
                    </div>
                    <p className="text-sm font-bold text-[#13A699]/60 mt-1 uppercase tracking-wider italic">📍 {teacher.location || "Online"}</p>
                  </div>
                </div>

                {teacher.bio && (
                  <p className="text-[#13A699]/70 mb-6 line-clamp-3 text-lg leading-relaxed font-medium">{teacher.bio}</p>
                )}

                <div className="flex items-center justify-between mt-auto pt-6 border-t-2 border-[#FFD708]/10">
                  <div>
                    <span className="text-2xl font-black text-[#13A699]">₹{teacher.fees || 500}</span>
                    <span className="text-xs font-bold text-[#13A699]/50 uppercase ml-1">/hr</span>
                  </div>
                  <div className="bg-[#FFD708] text-[#13A699] font-black px-6 py-3 rounded-2xl text-base group-hover:bg-[#FFD708]/80 transition shadow-md uppercase">
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
    <Suspense fallback={<div className="text-center py-20 animate-pulse font-black text-[#13A699]">LOADING MARKETPLACE...</div>}>
      <SearchContent />
    </Suspense>
  );
}
