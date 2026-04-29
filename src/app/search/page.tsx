"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SUBJECT_HIERARCHY } from "@/lib/subjects";

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
    if (selectedSubjects.length > 0) {
       setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth' }), 400);
    }
  }, [selectedSubjects]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-[#13A699] uppercase tracking-tighter">Marketplace v2.0</h1>
        <p className="text-[#FFD708] font-bold uppercase tracking-widest mt-2">Find your skill mentor</p>
      </div>

      {/* FULL LIST DISPLAY - NO DROPDOWNS */}
      <div className="space-y-12 mb-20 bg-white p-10 rounded-[3rem] shadow-2xl border-4 border-[#FFD708]/10">
        {SUBJECT_HIERARCHY.map(cat => (
          <div key={cat.name} className="border-b-2 border-gray-100 pb-10 last:border-0">
            <h2 className="text-3xl font-black text-[#13A699] uppercase mb-8 border-l-8 border-[#FFD708] pl-4">{cat.name}</h2>
            {cat.subcategories.map(sub => (
              <div key={sub.name} className="ml-4 mb-6">
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">{sub.name}</h3>
                <div className="space-y-3">
                  {sub.items.map(item => (
                    <label key={item.name} className="flex items-center justify-between p-5 rounded-2xl border-2 border-gray-50 hover:bg-[#FFF7ED] cursor-pointer group">
                      <span className="text-xl font-bold text-[#13A699] uppercase">{item.name}</span>
                      <input 
                        type="checkbox" 
                        className="w-8 h-8 rounded-lg border-2 border-[#FFD708] text-[#13A699] focus:ring-0" 
                        checked={selectedSubjects.includes(item.name)}
                        onChange={() => {
                          if (selectedSubjects.includes(item.name)) {
                            setSelectedSubjects(selectedSubjects.filter(x => x !== item.name));
                          } else {
                            setSelectedSubjects([...selectedSubjects, item.name]);
                          }
                        }}
                      />
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div ref={resultsRef} className="scroll-mt-32">
        <h2 className="text-3xl font-black text-[#13A699] uppercase mb-10">Available Teachers ({teachers.length})</h2>
        <div className="grid grid-cols-1 gap-8">
          {teachers.map(t => (
            <Link href={`/book/${t.id}`} key={t.id} className="bg-white p-8 rounded-[2.5rem] shadow-xl border-2 border-[#FFD708]/10 no-underline flex items-center gap-8 hover:scale-[1.02] transition-all">
              <div className="w-24 h-24 bg-[#FFD708]/20 rounded-full flex items-center justify-center text-4xl">🧑‍🏫</div>
              <div>
                <h3 className="text-3xl font-black text-black uppercase">{t.user.name || "Expert"}</h3>
                <p className="text-[#13A699] font-bold text-lg">{t.bio}</p>
                <p className="text-[#FFD708] font-black mt-2 text-2xl">₹{t.fees || 500}/hr</p>
              </div>
            </Link>
          ))}
          {teachers.length === 0 && <p className="text-center py-20 text-2xl font-black text-gray-300 uppercase">No teachers found in this selection.</p>}
        </div>
      </div>
    </div>
  );
}
