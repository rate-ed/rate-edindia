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
  const resultsRef = useRef<HTMLDivElement>(null);
  
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/teachers`);
      const allTeachers = await res.json();
      
      if (selectedSubjects.length === 0) {
        setTeachers(allTeachers);
      } else {
        // Multi-subject OR filter
        const filtered = allTeachers.filter((t: Teacher) => {
          if (!t.subjects) return false;
          const tSubLower = t.subjects.toLowerCase();
          return selectedSubjects.some(s => tSubLower.includes(s.toLowerCase().trim()));
        });
        setTeachers(filtered);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTeachers();
    if (selectedSubjects.length > 0 && resultsRef.current) {
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
    }
  }, [selectedSubjects]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-black text-[#13A699] uppercase tracking-tighter mb-4 leading-none">
          Marketplace
        </h1>
        <p className="text-[#FFD708] font-bold uppercase tracking-widest text-sm">Version 1.0.5 Live</p>
      </div>

      <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-[#FFD708]/30 mb-16">
        <h2 className="text-4xl font-black text-[#13A699] uppercase tracking-tighter mb-10 border-l-8 border-[#FFD708] pl-6">
          Subject Categories
        </h2>
        <SubjectSelector selectedSubjects={selectedSubjects} onChange={setSelectedSubjects} />
      </div>

      <div ref={resultsRef} className="scroll-mt-32">
        <div className="flex justify-between items-center mb-10">
           <h2 className="text-3xl font-black text-[#13A699] uppercase tracking-tight">Available Teachers</h2>
           <p className="bg-[#13A699] text-white px-6 py-2 rounded-full font-black text-sm uppercase">
             Matches: {teachers.length}
           </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
             <div className="animate-spin rounded-full h-16 w-16 border-t-8 border-b-8 border-[#13A699] mx-auto"></div>
          </div>
        ) : teachers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-[#FFD708]/30">
            <p className="text-2xl font-black text-[#13A699]/30 uppercase">No teachers found for this selection yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teachers.map((t) => (
              <Link href={`/book/${t.id}`} key={t.id} className="bg-white rounded-[3rem] p-8 shadow-xl border border-[#FFD708]/10 hover:border-[#13A699]/40 transition-all flex flex-col no-underline group">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 bg-[#FFD708]/20 rounded-full flex items-center justify-center overflow-hidden border-4 border-[#FFD708]/30">
                    {t.photo ? <img src={t.photo} className="w-full h-full object-cover" /> : <span className="text-3xl font-black text-[#13A699]">{t.user.name?.[0] || 'T'}</span>}
                  </div>
                  <div>
                    <h3 className="font-black text-2xl text-black uppercase">{t.user.name || 'Teacher'}</h3>
                    <p className="text-sm font-bold text-[#FFD708]">Expert Mentor</p>
                  </div>
                </div>
                <p className="text-gray-600 font-medium mb-8 line-clamp-3 no-underline">{t.bio}</p>
                <div className="mt-auto pt-6 border-t-2 border-[#FFD708]/5 flex justify-between items-center">
                  <span className="text-2xl font-black text-black">₹{t.fees || 500}</span>
                  <div className="bg-[#FFD708] text-[#13A699] font-black px-6 py-2 rounded-2xl uppercase text-sm shadow-md">Book Demo</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      
      <div className="text-center mt-20 text-[10px] text-gray-300 font-bold uppercase tracking-widest">
        Permanent Global Deployment Active
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 font-black text-[#13A699]">CONNECTING...</div>}>
      <SearchContent />
    </Suspense>
  );
}
