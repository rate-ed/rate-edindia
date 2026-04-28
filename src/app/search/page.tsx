"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import SubjectSelector from "@/components/SubjectSelector";

interface Teacher {
  id: string;
  bio: string | null;
  qualifications: string | null;
  experience: number | null;
  fees: number | null;
  rating: number;
  ratingCount: number;
  subjects: string | null;
  location: string;
  photo: string | null;
  user: { name: string | null; email: string; image: string | null };
  availability: Array<{ dayOfWeek: number; startTime: string; endTime: string }>;
}

export default function SearchPage() {
  const { data: session } = useSession();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);

  const fetchTeachers = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedSubjects.length === 1) params.set("subject", selectedSubjects[0]);
    if (locationFilter) params.set("location", locationFilter);

    const res = await fetch(`/api/teachers?${params}`);
    const data = await res.json();

    let filtered = data;
    if (selectedSubjects.length > 1) {
      filtered = data.filter((t: Teacher) =>
        selectedSubjects.some((s) => t.subjects?.includes(s))
      );
    }

    setTeachers(filtered);
    setLoading(false);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-4 h-4 ${i < Math.round(rating) ? "text-[#FFD708]" : "text-gray-200"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#13A699] mb-6">Find a Teacher</h1>

      <div className="bg-white rounded-2xl p-6 shadow-md border border-[#FFD708]/20 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <input
            type="text"
            placeholder="Search by name, skill, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699]"
          />
          <input
            type="text"
            placeholder="Location"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="md:w-64 px-4 py-3 rounded-xl border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699]"
          />
          <button
            onClick={fetchTeachers}
            className="bg-[#FFD708] text-[#13A699] font-bold px-6 py-3 rounded-xl hover:bg-[#FFD708]/80 transition"
          >
            Search
          </button>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowSubjectPicker(!showSubjectPicker)}
            className="text-[#13A699] text-sm font-medium hover:underline flex items-center gap-1"
          >
            {showSubjectPicker ? "▲ Hide" : "▼ Filter by"} Subject Category
            {selectedSubjects.length > 0 && (
              <span className="bg-[#13A699] text-white text-xs px-2 py-0.5 rounded-full ml-2">
                {selectedSubjects.length}
              </span>
            )}
          </button>
          {showSubjectPicker && (
            <div className="mt-3">
              <SubjectSelector
                selectedSubjects={selectedSubjects}
                onChange={(s) => setSelectedSubjects(s)}
                mode="multi"
              />
              {selectedSubjects.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedSubjects.map((s) => (
                    <span key={s} className="bg-[#13A699]/10 text-[#13A699] text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                      {s}
                      <button onClick={() => setSelectedSubjects(selectedSubjects.filter((x) => x !== s))} className="hover:text-red-500">×</button>
                    </span>
                  ))}
                  <button
                    onClick={() => { setSelectedSubjects([]); fetchTeachers(); }}
                    className="text-xs text-red-400 hover:text-red-600 ml-2"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13A699] mx-auto"></div>
        </div>
      ) : teachers.length === 0 ? (
        <div className="text-center py-12 text-[#13A699]/50">
          <p className="text-lg">No teachers found. Try different search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="bg-white rounded-2xl p-6 shadow-md border border-[#FFD708]/20 hover:shadow-lg transition">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-[#FFD708]/20 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {teacher.photo ? (
                    <img src={teacher.photo} alt="" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-2xl text-[#13A699] font-bold">
                      {teacher.user.name?.[0] || "T"}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-[#13A699] truncate">{teacher.user.name || "Teacher"}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(teacher.rating)}
                    <span className="text-xs text-gray-400 ml-1">({teacher.ratingCount})</span>
                  </div>
                  <p className="text-xs text-[#13A699]/60 mt-1">📍 {teacher.location}</p>
                </div>
              </div>

              {teacher.bio && (
                <p className="text-sm text-[#13A699]/70 mb-3 line-clamp-2">{teacher.bio}</p>
              )}

              {teacher.subjects && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {teacher.subjects.split(",").slice(0, 4).map((s) => (
                    <span key={s} className="bg-[#FFD708]/20 text-[#13A699] text-xs px-2 py-0.5 rounded-full">
                      {s.trim()}
                    </span>
                  ))}
                  {teacher.subjects.split(",").length > 4 && (
                    <span className="text-xs text-gray-400">+{teacher.subjects.split(",").length - 4} more</span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#FFD708]/20">
                <div>
                  {teacher.experience && (
                    <span className="text-xs text-[#13A699]/60">{teacher.experience} yrs exp</span>
                  )}
                  {teacher.fees && (
                    <span className="text-sm font-bold text-[#13A699] ml-3">₹{teacher.fees}/hr</span>
                  )}
                </div>
                {session ? (
                  <Link
                    href={`/book/${teacher.id}`}
                    className="bg-[#FFD708] text-[#13A699] font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#FFD708]/80 transition"
                  >
                    Book Demo
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="bg-[#13A699] text-white font-medium px-4 py-2 rounded-lg text-sm hover:bg-[#13A699]/80 transition"
                  >
                    Login to Book
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
