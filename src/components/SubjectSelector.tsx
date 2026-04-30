"use client";
import { SUBJECT_HIERARCHY } from "@/lib/subjects";

export default function SubjectSelector({ selectedSubjects, onChange }: { selectedSubjects: string[], onChange: (s: string[]) => void }) {
  const toggle = (name: string) => {
    if (selectedSubjects.includes(name)) {
      onChange(selectedSubjects.filter(s => s !== name));
    } else {
      onChange([...selectedSubjects, name]);
    }
  };

  return (
    <div className="space-y-12">
      {SUBJECT_HIERARCHY.map(cat => (
        <div key={cat.name} className="border-b-4 border-gray-50 pb-10">
          <h2 className="text-3xl font-black text-[#13A699] uppercase mb-8 border-l-8 border-[#FFD708] pl-4">{cat.name}</h2>
          {cat.subcategories.map(sub => (
            <div key={sub.name} className="ml-4 mb-8">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">{sub.name}</h3>
              <div className="space-y-2">
                {sub.items.map(item => {
                  const isChecked = selectedSubjects.includes(item.name);
                  return (
                    <div key={item.name} onClick={() => toggle(item.name)} className="flex items-center justify-between p-5 rounded-2xl border-2 border-gray-100 bg-white cursor-pointer hover:border-[#13A699]/30">
                      <span className="text-xl font-bold text-black uppercase">{item.name}</span>
                      <div className={`w-10 h-10 rounded-xl border-4 flex items-center justify-center transition-colors ${isChecked ? 'bg-[#13A699] border-[#13A699]' : 'border-[#FFD708]/30'}`}>
                        {isChecked && <span className="text-white text-xl font-black">✓</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
