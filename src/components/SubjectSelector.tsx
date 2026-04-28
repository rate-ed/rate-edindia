"use client";
import { useState } from "react";
import { SUBJECT_HIERARCHY } from "@/lib/subjects";

interface SubjectSelectorProps {
  selectedSubjects: string[];
  onChange: (subjects: string[]) => void;
  mode?: "multi" | "single";
}

export default function SubjectSelector({ selectedSubjects, onChange, mode = "multi" }: SubjectSelectorProps) {
  const [expandedCat, setExpandedCat] = useState<string | null>(null);
  const [expandedSub, setExpandedSub] = useState<string | null>(null);

  const toggle = (subject: string) => {
    if (mode === "single") {
      onChange([subject]);
      return;
    }
    if (selectedSubjects.includes(subject)) {
      onChange(selectedSubjects.filter((s) => s !== subject));
    } else {
      onChange([...selectedSubjects, subject]);
    }
  };

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-[#FFD708]/30">
      {SUBJECT_HIERARCHY.map((cat) => (
        <div key={cat.name} className="border-b-4 border-[#FFD708]/10 last:border-b-0">
          <button
            type="button"
            onClick={() => setExpandedCat(expandedCat === cat.name ? null : cat.name)}
            className="w-full px-8 py-10 flex justify-between items-center hover:bg-[#FFF7ED] transition-all group"
          >
            <span className="font-black text-[#13A699] text-4xl md:text-5xl uppercase tracking-tighter text-left leading-none">
              {cat.name}
            </span>
            <svg
              className={`w-2 h-2 text-[#13A699]/40 transition-transform duration-300 ${expandedCat === cat.name ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={6} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {expandedCat === cat.name && (
            <div className="px-6 pb-8 animate-in slide-in-from-top-2 duration-300">
              {cat.subcategories.map((sub) => (
                <div key={sub.name} className="mt-4 border-2 border-[#FFD708]/20 rounded-[2rem] overflow-hidden bg-[#FFF7ED]/20">
                  <button
                    type="button"
                    onClick={() => setExpandedSub(expandedSub === `${cat.name}-${sub.name}` ? null : `${cat.name}-${sub.name}`)}
                    className="w-full px-6 py-6 flex justify-between items-center hover:bg-[#FFD708]/10 transition-all"
                  >
                    <span className="text-2xl md:text-3xl font-black text-[#13A699]/90 uppercase tracking-tight text-left">
                      {sub.name} <span className="text-xs text-gray-400 font-bold ml-2">[{sub.minAge}+]</span>
                    </span>
                    <svg
                      className={`w-1.5 h-1.5 text-[#13A699]/30 transition-transform duration-300 ${expandedSub === `${cat.name}-${sub.name}` ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={6} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {expandedSub === `${cat.name}-${sub.name}` && (
                    <div className="px-8 py-8 flex flex-wrap gap-4 bg-white border-t-2 border-[#FFD708]/10">
                      {sub.items.map((item) => {
                        const isSelected = selectedSubjects.includes(item.name);
                        return (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => toggle(item.name)}
                            className={`px-8 py-4 rounded-[1.5rem] text-xl font-black transition-all duration-200 shadow-sm ${
                              isSelected
                                ? "bg-[#13A699] text-white shadow-xl scale-110 ring-4 ring-[#13A699]/20"
                                : "bg-[#FFD708]/10 text-[#13A699] border-2 border-[#FFD708]/30 hover:bg-[#FFD708]/30 hover:scale-105"
                            }`}
                          >
                            {item.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
