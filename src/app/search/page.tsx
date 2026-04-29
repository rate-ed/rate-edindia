"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SubjectSelector from "@/components/SubjectSelector";

interface Teacher {
  id: string;
  bio: string | null;
  subjects: string | null;
  fees: number | null;
  rating: number;
  ratingCount: number;
  user: { name: string | null; email: string };
}

export default function SearchPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/teachers");
        const all = await res.json();
        
        if (selectedSubjects.length === 0) {
          setTeachers(all);
        } else {
          const filtered = all.filter((t: Teacher) => {
            if (!t.subjects) return false;
            const tSub = t.subjects.toLowerCase();
            return selectedSubjects.some(s => tSub.includes(s.toLowerCase().trim()));
          });
          setTeachers(filtered);
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
    
    // Auto-scroll when filter applied
    if (selectedSubjects.length > 0 && resultsRef.current) {
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 500);
    }
  }, [selectedSubjects]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-16">
        <h1 className="text-6xl font-black text-[#13A699] uppercase tracking-tighter mb-4">Find Your Expert</h1>
        <p className="text-[#FFD708] font-black uppercase tracking-widest text-lg bg-[#13A699] inline-block px-4 py-1 rounded">V1.0.6 RELOADED</p>
      </div>

      <div className="bg-white rounded-[4rem] p-12 shadow-2xl border-4 border-[#FFD708]/20 mb-20">
        <h2 className="text-4xl font-black text-[#13A699] uppercase mb-12 flex items-center gap-4">
          <span className="w-6 h-6 bg-[#FFD708] rounded-full"></span>
          Select Subjects:
        </h2>
        <SubjectSelector selectedSubjects={selectedSubjects} onChange={setSelectedSubjects} />
      </div>

      <div ref={resultsRef} className="scroll-mt-32">
        <div className="mb-12 flex justify-between items-center border-b-8 border-[#13A699]/10 pb-6">
           <h2 className="text-4xl font-black text-[#13A699] uppercase">Available Mentors</h2>
           <p className="text-[#13A699] font-black text-xl uppercase bg-[#FFD708] px-8 py-3 rounded-full">Found: {teachers.length}</p>
        </div>

        {loading ? (
          <div className="text-center py-24 animate-pulse">
            <div className="w-24 h-24 border-t-8 border-[#13A699] rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {teachers.map(t => (
              <Link href={`/book/${t.id}`} key={t.id} className="bg-white rounded-[3.5rem] p-10 shadow-2xl border-2 border-[#FFD708]/10 hover:scale-[1.03] transition-all flex flex-col no-underline group">
                <h3 className="font-black text-4xl text-black uppercase mb-2 leading-none group-hover:text-[#13A699]">{t.user.name || 'Expert'}</h3>
                <p className="text-sm font-black text-[#FFD708] uppercase tracking-[0.2em] mb-6">Certified Teacher</p>
                <p className="text-gray-500 text-xl font-bold line-clamp-3 mb-10">{t.bio || "No bio available."}</p>
                <div className="mt-auto pt-8 border-t-4 border-[#FFF7ED] flex justify-between items-center">
                   <span className="text-4xl font-black text-black">₹{t.fees || 500}</span>
                   <div className="bg-[#13A699] text-white font-black px-10 py-4 rounded-3xl uppercase text-lg shadow-xl">Book</div>
                </div>
              </Link>
            ))}
            {teachers.length === 0 && (
               <div className="col-span-full py-24 text-center bg-[#FFF7ED] rounded-[4rem] border-4 border-dashed border-[#FFD708]">
                  <p className="text-4xl font-black text-[#13A699]/20 uppercase">No teachers found in this selection.</p>
               </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
