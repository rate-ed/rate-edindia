"use client";
import { SUBJECT_HIERARCHY } from "@/lib/subjects";

interface SubjectSelectorProps {
  selectedSubjects: string[];
  onChange: (subjects: string[]) => void;
  mode?: "multi" | "single";
}

export default function SubjectSelector({ selectedSubjects, onChange, mode = "multi" }: SubjectSelectorProps) {
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
    <div className="bg-[#FFF7ED]/30 rounded-3xl p-6 md:p-10 border-2 border-[#FFD708]/20">
      <div className="space-y-12">
        {SUBJECT_HIERARCHY.map((cat) => (
          <div key={cat.name} className="border-b-2 border-[#FFD708]/10 pb-10 last:border-b-0 last:pb-0">
            {/* Category Heading - Bold & Large */}
            <h2 className="font-black text-[#13A699] text-3xl md:text-4xl uppercase tracking-tighter mb-8 flex items-center gap-4">
              <span className="w-1.5 h-8 bg-[#FFD708] rounded-full"></span>
              {cat.name}
            </h2>
            
            <div className="grid grid-cols-1 gap-8">
              {cat.subcategories.map((sub) => (
                <div key={sub.name} className="pl-4">
                  {/* Subcategory Heading - Bold */}
                  <h3 className="text-xl md:text-2xl font-black text-[#13A699]/80 uppercase tracking-tight mb-6">
                    {sub.name}
                  </h3>
                  
                  {/* Subject List - One per line, checkbox on right */}
                  <div className="max-w-xl space-y-3">
                    {sub.items.map((item) => {
                      const isSelected = selectedSubjects.includes(item.name);
                      return (
                        <label
                          key={item.name}
                          className={`flex items-center justify-between gap-6 px-6 py-4 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${
                            isSelected
                              ? "bg-[#13A699] text-white border-[#13A699] shadow-xl scale-[1.02]"
                              : "bg-white text-[#13A699] border-[#FFD708]/20 hover:border-[#13A699]/40 hover:bg-[#FFF7ED]/50"
                          }`}
                        >
                          <span className="text-lg md:text-xl font-bold uppercase tracking-tight">
                            {item.name}
                            <span className="text-[10px] ml-2 opacity-50 font-black">[{item.minAge}+]</span>
                          </span>
                          
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              className="peer h-8 w-8 cursor-pointer appearance-none rounded-lg border-2 border-[#FFD708] transition-all checked:bg-white checked:border-white focus:outline-none"
                              checked={isSelected}
                              onChange={() => toggle(item.name)}
                            />
                            <svg
                              className="absolute h-5 w-5 pointer-events-none hidden peer-checked:block text-[#13A699] left-1.5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="4"
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
    </div>
  );
}
