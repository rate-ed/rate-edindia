"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SUBJECT_HIERARCHY } from "@/lib/subjects";

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
    if (selectedSubjects.length === 1) params.set("subject", selectedSubjects[0]);

    try {
      const res = await fetch(`/api/teachers?${params}`);
      const data = await res.json();

      let filtered = data;
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

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

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
        <h1 className="text-6xl font-black text-[#13A699] uppercase tracking-tighter mb-4 leading-none">
          Find Your Expert
        </h1>
        <div className="w-24 h-2 bg-[#FFD708] mx-auto rounded-full mt-4"></div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-[#FFD708]/30 mb-16">
        
        {/* Search Input */}
        <div className="flex flex-col md:flex-row gap-6 mb-16">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 rounded-[2rem] border-4 border-[#FFF7ED] focus:border-[#13A699] focus:outline-none bg-[#FFF7ED]/50 text-[#13A699] text-xl font-bold shadow-inner"
            />
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl">🔍</span>
          </div>
          <button
            onClick={fetchTeachers}
            className="bg-[#13A699] text-white font-black px-12 py-5 rounded-[2rem] hover:bg-[#13A699]/80 transition shadow-xl text-xl uppercase tracking-widest"
          >
            Refine Search
          </button>
        </div>

        {/* SUBJECT LIST - DIRECTLY DISPLAYED, NO DROPDOWNS */}
        <div className="pt-8 border-t-4 border-[#FFD708]/5">
           <h2 className="text-4xl font-black text-[#13A699] uppercase tracking-tighter mb-12 border-l-8 border-[#FFD708] pl-6">
              Select Subjects:
           </h2>
          
           <div className="space-y-12">
            {SUBJECT_HIERARCHY.map((cat) => (
              <div key={cat.name} className="border-b-4 border-[#FFD708]/10 pb-12 last:border-b-0">
                <h3 className="font-black text-[#13A699] text-3xl md:text-4xl uppercase tracking-tighter mb-8 leading-none">
                  {cat.name}
                </h3>
                
                <div className="grid grid-cols-1 gap-10">
                  {cat.subcategories.map((sub) => (
                    <div key={sub.name} className="pl-4 border-l-4 border-[#FFD708]/30">
                      <h4 className="text-xl md:text-2xl font-black text-[#13A699]/60 uppercase tracking-widest mb-6">
                        {sub.name}
                      </h4>
                      
                      <div className="space-y-3">
                        {sub.items.map((item) => {
                          const isSelected = selectedSubjects.includes(item.name);
                          return (
                            <label
                              key={item.name}
                              className={`flex items-center justify-between w-full max-w-2xl px-8 py-5 rounded-2xl cursor-pointer transition-all border-2 ${
                                isSelected
                                  ? "bg-[#13A699] text-white border-[#13A699] shadow-xl scale-[1.01]"
                                  : "bg-white text-[#13A699] border-[#FFD708]/20 hover:border-[#13A699]/40 hover:bg-[#FFF7ED]"
                              }`}
                            >
                              <span className="text-2xl font-black uppercase tracking-tight">
                                {item.name}
                              </span>
                              
                              <div className="relative flex items-center">
                                <input
                                  type="checkbox"
                                  className="peer h-10 w-10 cursor-pointer appearance-none rounded-xl border-4 border-[#FFD708]/50 transition-all checked:bg-white checked:border-white focus:outline-none"
                                  checked={isSelected}
                                  onChange={() => toggleSubject(item.name)}
                                />
                                <svg
                                  className="absolute h-7 w-7 pointer-events-none hidden peer-checked:block text-[#13A699] left-1.5"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="6"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

           {selectedSubjects.length > 0 && (
              <div className="mt-12 p-8 bg-[#13A699] rounded-[2.5rem] shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-white text-xl font-black uppercase tracking-widest">Selected:</h3>
                  <button
                    onClick={() => setSelectedSubjects([])}
                    className="text-[#FFD708] text-sm font-black uppercase tracking-widest hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {selectedSubjects.map((s) => (
                    <span key={s} className="bg-white text-[#13A699] text-sm px-6 py-2 rounded-full flex items-center gap-3 font-black shadow-md uppercase">
                      {s}
                      <button onClick={() => setSelectedSubjects(selectedSubjects.filter((x) => x !== s))} className="hover:text-red-500 font-black text-xl">×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      <div ref={resultsRef} className="scroll-mt-32">
        {loading ? (
          <div className="text-center py-24">
            <div className="animate-spin rounded-full h-20 w-20 border-t-8 border-b-8 border-[#13A699] mx-auto"></div>
            <p className="mt-8 text-[#13A699] font-black text-2xl uppercase tracking-widest animate-pulse">Filtering Results...</p>
          </div>
        ) : teachers.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[4rem] border-4 border-dashed border-[#FFD708]/30 shadow-inner">
            <div className="text-6xl mb-6 opacity-30">🕵️</div>
            <p className="text-3xl font-black text-[#13A699]/40 uppercase tracking-tighter">
              No results found for this selection yet.
            </p>
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
                      <span className="text-lg font-black text-[#FFD708]">{(teacher.rating || 0).toFixed(1)} ★</span>
                      <span className="text-xs text-gray-400 font-black ml-2 uppercase tracking-tighter">({teacher.ratingCount} reviews)</span>
                    </div>
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
    <Suspense fallback={<div className="text-center py-24 animate-pulse font-black text-4xl text-[#13A699] tracking-tighter uppercase">Initializing Marketplace...</div>}>
      <SearchContent />
    </Suspense>
  );
}
