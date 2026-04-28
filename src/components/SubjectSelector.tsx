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
    <div className="bg-white space-y-12">
      {SUBJECT_HIERARCHY.map((cat) => (
        <div key={cat.name} className="border-b-4 border-[#FFD708]/20 pb-12 last:border-b-0">
          <h2 className="font-black text-[#13A699] text-3xl md:text-4xl uppercase tracking-tighter mb-10 border-l-8 border-[#FFD708] pl-6">
            {cat.name}
          </h2>
          
          <div className="space-y-4">
            {cat.subcategories.map((sub) => (
              <div key={sub.name}>
                <h3 className="text-lg font-black text-[#13A699]/40 uppercase tracking-widest mb-6 ml-6">
                  {sub.name}
                </h3>
                
                <div className="ml-6 space-y-2">
                  {sub.items.map((item) => {
                    const isSelected = selectedSubjects.includes(item.name);
                    return (
                      <label
                        key={item.name}
                        className="flex items-center justify-between w-full max-w-2xl px-8 py-5 rounded-2xl cursor-pointer transition-all border-2 bg-white border-[#FFD708]/30 hover:border-[#13A699]/30"
                      >
                        <span className="text-xl md:text-2xl font-black text-[#13A699] uppercase tracking-tight">
                          {item.name}
                        </span>
                        
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            className="peer h-10 w-10 cursor-pointer appearance-none rounded-xl border-4 border-[#FFD708]/30 transition-all checked:bg-[#13A699] checked:border-[#13A699] focus:outline-none shadow-sm"
                            checked={isSelected}
                            onChange={() => toggle(item.name)}
                          />
                          <svg
                            className="absolute h-7 w-7 pointer-events-none hidden peer-checked:block text-white left-1.5"
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
