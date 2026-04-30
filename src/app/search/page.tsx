"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SubjectSelector from "@/components/SubjectSelector";

export default function SearchPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const resultsRef = useRef(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/teachers");
        const all = await res.json();
        if (selectedSubjects.length === 0) {
          setTeachers(all);
        } else {
          setTeachers(all.filter(t => 
            selectedSubjects.some(s => t.subjects?.toLowerCase().includes(s.toLowerCase().trim()))
          ));
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    load();
  }, [selectedSubjects]);

  const handleScroll = () => {
     if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth' });
     }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-[#13A699] uppercase tracking-tighter">Marketplace v3.0</h1>
        <div className="w-20 h-2 bg-[#FFD708] mx-auto mt-4 rounded-full"></div>
      </div>

      <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl border-4 border-[#FFD708]/10 mb-16">
        <h2 className="text-3xl font-black text-[#13A699] uppercase mb-10 pl-2">Select Category</h2>
        <SubjectSelector 
           selectedSubjects={selectedSubjects} 
           onChange={(s) => { setSelectedSubjects(s); handleScroll(); }} 
        />
      </div>

      <div ref={resultsRef} className="scroll-mt-32">
        <div className="mb-10 border-b-4 border-gray-100 pb-4">
           <h2 className="text-3xl font-black text-[#13A699] uppercase">Teachers Found ({teachers.length})</h2>
        </div>

        {loading ? (
          <div className="text-center py-20 animate-pulse">
            <div className="w-16 h-16 border-t-8 border-[#13A699] rounded-full animate-spin mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {teachers.map(t => (
              <Link href={`/book/${t.id}`} key={t.id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-[#FFD708]/10 no-underline flex items-center gap-8 hover:border-[#13A699]/40 transition-all">
                <div className="w-24 h-24 bg-[#FFD708]/20 rounded-full flex items-center justify-center text-5xl shadow-inner">🧑‍🏫</div>
                <div>
                  <h3 className="text-3xl font-black text-black uppercase mb-1">{t.user.name || 'Expert'}</h3>
                  <p className="text-[#13A699] font-bold text-lg leading-relaxed">{t.bio || "Available for classes."}</p>
                  <p className="text-[#FFD708] font-black mt-3 text-2xl">₹{t.fees || 500}/hr</p>
                </div>
              </Link>
            ))}
            {teachers.length === 0 && <p className="text-center py-20 text-3xl font-black text-gray-300 uppercase italic">Nothing found yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
