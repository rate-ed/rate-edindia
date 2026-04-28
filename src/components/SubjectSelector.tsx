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
    <div className="border border-[#FFD708]/50 rounded-xl bg-white overflow-hidden">
      {SUBJECT_HIERARCHY.map((cat) => (
        <div key={cat.name} className="border-b border-[#FFD708]/20 last:border-b-0">
          <button
            type="button"
            onClick={() => setExpandedCat(expandedCat === cat.name ? null : cat.name)}
            className="w-full px-4 py-4 flex justify-between items-center hover:bg-[#FFF7ED] transition"
          >
            <span className="font-black text-[#13A699] text-xl uppercase tracking-tight">{cat.name}</span>
            <svg
              className={`w-3 h-3 text-[#13A699] transition-transform ${expandedCat === cat.name ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedCat === cat.name && (
            <div className="pl-2">
              {cat.subcategories.map((sub) => (
                <div key={sub.name} className="border-t border-[#FFD708]/10">
                  <button
                    type="button"
                    onClick={() => setExpandedSub(expandedSub === `${cat.name}-${sub.name}` ? null : `${cat.name}-${sub.name}`)}
                    className="w-full px-4 py-3 flex justify-between items-center hover:bg-[#FFF7ED]/50 transition"
                  >
                    <span className="text-lg font-bold text-[#13A699]/80 uppercase">
                      {sub.name} <span className="text-xs text-gray-400 font-normal">[{sub.minAge}+]</span>
                    </span>
                    <svg
                      className={`w-2 h-2 text-[#13A699]/60 transition-transform ${expandedSub === `${cat.name}-${sub.name}` ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSub === `${cat.name}-${sub.name}` && (
                    <div className="pl-6 pb-4 flex flex-wrap gap-3">
                      {sub.items.map((item) => {
                        const isSelected = selectedSubjects.includes(item.name);
                        return (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => toggle(item.name)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition ${
                              isSelected
                                ? "bg-[#13A699] text-white shadow-md scale-105"
                                : "bg-[#FFD708]/20 text-[#13A699] hover:bg-[#FFD708]/40"
                            }`}
                          >
                            {item.name}
                            <span className="text-[10px] ml-1 opacity-70 font-normal">{item.minAge}+</span>
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
