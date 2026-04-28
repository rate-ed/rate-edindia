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
    <div className="border border-[#FFD708]/50 rounded-2xl bg-white overflow-hidden shadow-sm">
      {SUBJECT_HIERARCHY.map((cat) => (
        <div key={cat.name} className="border-b border-[#FFD708]/20 last:border-b-0">
          <button
            type="button"
            onClick={() => setExpandedCat(expandedCat === cat.name ? null : cat.name)}
            className="w-full px-6 py-6 flex justify-between items-center hover:bg-[#FFF7ED] transition"
          >
            <span className="font-black text-[#13A699] text-3xl uppercase tracking-tighter">{cat.name}</span>
            <svg
              className={`w-3 h-3 text-[#13A699] transition-transform ${expandedCat === cat.name ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedCat === cat.name && (
            <div className="pl-4 pb-4">
              {cat.subcategories.map((sub) => (
                <div key={sub.name} className="mt-2 border border-[#FFD708]/10 rounded-xl overflow-hidden mb-2 mr-4">
                  <button
                    type="button"
                    onClick={() => setExpandedSub(expandedSub === `${cat.name}-${sub.name}` ? null : `${cat.name}-${sub.name}`)}
                    className="w-full px-5 py-4 flex justify-between items-center hover:bg-[#FFF7ED]/50 transition bg-[#FFF7ED]/30"
                  >
                    <span className="text-2xl font-extrabold text-[#13A699]/90 uppercase tracking-tight">
                      {sub.name} <span className="text-xs text-gray-400 font-normal">[{sub.minAge}+]</span>
                    </span>
                    <svg
                      className={`w-2 h-2 text-[#13A699]/60 transition-transform ${expandedSub === `${cat.name}-${sub.name}` ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSub === `${cat.name}-${sub.name}` && (
                    <div className="pl-6 pr-4 py-6 flex flex-wrap gap-4 bg-white">
                      {sub.items.map((item) => {
                        const isSelected = selectedSubjects.includes(item.name);
                        return (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => toggle(item.name)}
                            className={`px-6 py-3 rounded-2xl text-lg font-black transition ${
                              isSelected
                                ? "bg-[#13A699] text-white shadow-xl scale-110"
                                : "bg-[#FFD708]/20 text-[#13A699] border border-[#FFD708]/30 hover:bg-[#FFD708]/40"
                            }`}
                          >
                            {item.name}
                            <span className="text-xs ml-2 opacity-70 font-normal">{item.minAge}+</span>
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
