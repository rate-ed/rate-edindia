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
    <div className="bg-white space-y-16">
      {SUBJECT_HIERARCHY.map((cat) => (
        <div key={cat.name} className="border-b-8 border-[#FFD708]/10 pb-16 last:border-b-0">
          {/* Main Category - Massive & Bold */}
          <h2 className="font-black text-[#13A699] text-5xl uppercase tracking-tighter mb-12 border-l-[12px] border-[#FFD708] pl-8 leading-none">
            {cat.name}
          </h2>
          
          <div className="space-y-12">
            {cat.subcategories.map((sub) => (
              <div key={sub.name} className="ml-8">
                {/* Subcategory - Bold Header */}
                <h3 className="text-2xl font-black text-[#13A699]/60 uppercase tracking-widest mb-8">
                  {sub.name}
                </h3>
                
                {/* Subject List - One Per Line, Checkbox on Right */}
                <div className="space-y-4 max-w-2xl">
                  {sub.items.map((item) => {
                    const isSelected = selectedSubjects.includes(item.name);
                    return (
                      <label
                        key={item.name}
                        className={`flex items-center justify-between w-full px-8 py-6 rounded-3xl cursor-pointer transition-all border-[3px] ${
                          isSelected
                            ? "bg-white text-[#13A699] border-[#13A699] shadow-2xl"
                            : "bg-[#FFF7ED]/30 text-[#13A699] border-[#FFD708]/20 hover:border-[#13A699]/40 hover:bg-white"
                        }`}
                      >
                        <span className="text-3xl font-black uppercase tracking-tight leading-none">
                          {item.name}
                        </span>
                        
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            className="peer h-12 w-12 cursor-pointer appearance-none rounded-2xl border-4 border-[#FFD708] transition-all checked:bg-[#13A699] checked:border-[#13A699] focus:outline-none"
                            checked={isSelected}
                            onChange={() => toggle(item.name)}
                          />
                          <svg
                            className="absolute h-8 w-8 pointer-events-none hidden peer-checked:block text-white left-2 top-2"
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
  );
}
