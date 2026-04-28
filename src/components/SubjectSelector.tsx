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
    <div className="space-y-12 bg-white p-2">
      {SUBJECT_HIERARCHY.map((cat) => (
        <div key={cat.name} className="border-b-4 border-[#FFD708]/20 pb-12 last:border-b-0">
          <h2 className="font-black text-[#13A699] text-5xl uppercase tracking-tighter mb-8 leading-none">
            {cat.name}
          </h2>
          
          <div className="grid grid-cols-1 gap-10">
            {cat.subcategories.map((sub) => (
              <div key={sub.name} className="pl-4 border-l-4 border-[#FFD708]/30">
                <h3 className="text-3xl font-black text-[#13A699]/90 uppercase tracking-tight mb-6 flex items-center gap-3">
                  <span className="w-3 h-3 bg-[#FFD708] rounded-full"></span>
                  {sub.name} 
                  <span className="text-sm text-gray-400 font-bold ml-2">[{sub.minAge}+ Age]</span>
                </h3>
                
                <div className="flex flex-wrap gap-4 pl-6">
                  {sub.items.map((item) => {
                    const isSelected = selectedSubjects.includes(item.name);
                    return (
                      <label
                        key={item.name}
                        className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] cursor-pointer transition-all duration-200 border-2 ${
                          isSelected
                            ? "bg-[#13A699] text-white border-[#13A699] shadow-2xl scale-110 ring-4 ring-[#13A699]/10"
                            : "bg-[#FFF7ED]/50 text-[#13A699] border-[#FFD708]/40 hover:bg-[#FFD708]/20 hover:scale-105"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="w-6 h-6 rounded-lg border-[#FFD708] text-[#13A699] focus:ring-[#13A699] cursor-pointer"
                          checked={isSelected}
                          onChange={() => toggle(item.name)}
                        />
                        <span className="text-2xl font-black uppercase tracking-tight">
                          {item.name}
                        </span>
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
