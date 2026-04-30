"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import SubjectSelector from "@/components/SubjectSelector";

interface Teacher {
  id: string;
  bio: string | null;
  subjects: string | null;
  fees: number | null;
  user: { name: string | null; email: string };
}

function SearchContent() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/teachers");
        const all = await res.json();
        
        if (selectedSubjects.length === 0) {
          setTeachers(all);
        } else {
          const filtered = all.filter((t: any) => {
            if (!t.subjects) return false;
            const tSub = t.subjects.toLowerCase();
            return selectedSubjects.some(s => tSub.includes(s.toLowerCase().trim()));
          });
          setTeachers(filtered);
        }
      } catch (e) {
        console.error(e);
        setTeachers([]);
      }
      setLoading(false);
    }
    load();
  }, [selectedSubjects]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-[#13A699] uppercase tracking-tighter mb-4">Experts</h1>
        <p className="text-[#FFD708] font-black uppercase text-sm bg-[#13A699] px-3 py-1 inline-block rounded">Live 24/7</p>
      </div>

      <div className="bg-white rounded-[3rem] p-8 shadow-xl border-4 border-[#FFD708]/10 mb-16">
        <h2 className="text-3xl font-black text-[#13A699] uppercase mb-10 pl-2">Subject List</h2>
        <SubjectSelector selectedSubjects={selectedSubjects} onChange={setSelectedSubjects} />
        {selectedSubjects.length > 0 && (
          <button onClick={() => setSelectedSubjects([])} className="mt-8 text-red-500 font-bold uppercase text-xs underline">Clear All</button>
        )}
      </div>

      <div className="mb-8 flex justify-between items-center border-b-4 border-gray-50 pb-4">
        <h2 className="text-2xl font-black text-[#13A699] uppercase">Results ({teachers.length})</h2>
      </div>

      {loading ? (
        <div className="text-center py-20 animate-pulse">
           <div className="w-16 h-16 border-t-4 border-[#13A699] rounded-full animate-spin mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {teachers.map(t => (
            <Link href={`/book/${t.id}`} key={t.id} className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 no-underline flex items-center gap-6 hover:border-[#13A699]/40">
              <div className="w-16 h-16 bg-[#FFD708]/20 rounded-full flex items-center justify-center text-3xl">🧑‍🏫</div>
              <div className="flex-1">
                <h3 className="font-black text-xl text-black uppercase leading-tight">{t.user.name || 'Mentor'}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mt-1">{t.bio}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-[#13A699]">₹{t.fees || 500}</p>
                <p className="text-[10px] font-black text-[#FFD708] uppercase">per hr</p>
              </div>
            </Link>
          ))}
          {teachers.length === 0 && <p className="text-center py-20 font-black text-gray-300">NO TEACHERS FOUND.</p>}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchContent />
    </Suspense>
  );
}
