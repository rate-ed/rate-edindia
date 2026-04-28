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
          {/* Category Heading - Bold & Large */}
          <h2 className="font-black text-[#13A699] text-4xl uppercase tracking-tighter mb-10 border-l-8 border-[#FFD708] pl-6">
            {cat.name}
          </h2>
          
          <div className="space-y-4">
            {cat.subcategories.map((sub) => (
              <div key={sub.name}>
                {/* Subcategory - Smaller Bold Heading */}
                <h3 className="text-xl font-black text-[#13A699]/60 uppercase tracking-widest mb-6 ml-6">
                  {sub.name}
                </h3>
                
                <div className="ml-6 space-y-2">
                  {sub.items.map((item) => {
                    const isSelected = selectedSubjects.includes(item.name);
                    return (
                      <label
                        key={item.name}
                        className={`flex items-center justify-between w-full max-w-2xl px-8 py-5 rounded-2xl cursor-pointer transition-all border-2 ${
                          isSelected
                            ? "bg-[#13A699] text-white border-[#13A699] shadow-xl scale-[1.01]"
                            : "bg-white text-[#13A699] border-[#FFD708]/20 hover:border-[#13A699]/40 hover:bg-[#FFF7ED]"
                        }`}
                      >
                        <span className="text-2xl font-black uppercase tracking-tight">
                          {item.name}
                        </span>
                        
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            className="peer h-10 w-10 cursor-pointer appearance-none rounded-xl border-4 border-[#FFD708]/50 transition-all checked:bg-white checked:border-white focus:outline-none shadow-sm"
                            checked={isSelected}
                            onChange={() => toggle(item.name)}
                          />
                          <svg
                            className="absolute h-7 w-7 pointer-events-none hidden peer-checked:block text-[#13A699] left-1.5"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="5"
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
