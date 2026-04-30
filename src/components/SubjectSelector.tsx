"use client";
import { SUBJECT_HIERARCHY } from "@/lib/subjects";

interface SubjectSelectorProps {
  selectedSubjects: string[];
  onChange: (subjects: string[]) => void;
}

export default function SubjectSelector({ selectedSubjects, onChange }: SubjectSelectorProps) {
  return (
    <div className="space-y-12">
      {SUBJECT_HIERARCHY.map((cat) => (
        <div key={cat.name} className="border-b-4 border-[#FFD708]/10 pb-10 last:border-0">
          <h2 className="font-black text-[#13A699] text-3xl uppercase tracking-tighter mb-8 border-l-8 border-[#FFD708] pl-6">
            {cat.name}
          </h2>
          
          <div className="space-y-8">
            {cat.subcategories.map((sub) => (
              <div key={sub.name} className="ml-6">
                <h3 className="text-lg font-black text-gray-400 uppercase tracking-widest mb-4">
                  {sub.name}
                </h3>
                
                <div className="space-y-2">
                  {sub.items.map((item) => {
                    const isSelected = selectedSubjects.includes(item.name);
                    return (
                      <div
                        key={item.name}
                        onClick={() => {
                          if (isSelected) {
                            onChange(selectedSubjects.filter(s => s !== item.name));
                          } else {
                            onChange([...selectedSubjects, item.name]);
                          }
                        }}
                        className={`flex items-center justify-between w-full max-w-xl px-6 py-4 rounded-2xl cursor-pointer transition-all border-2 bg-white ${
                          isSelected ? 'border-[#13A699] shadow-md' : 'border-gray-100 hover:border-[#13A699]/30'
                        }`}
                      >
                        <span className="text-xl font-bold text-black uppercase tracking-tight">
                          {item.name}
                        </span>
                        
                        <div className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-[#13A699] border-[#13A699]' : 'border-[#FFD708]'
                        }`}>
                          {isSelected && (
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      </div>
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
