"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SubjectSelector from "@/components/SubjectSelector";

interface Profile {
  id: string;
  bio: string | null;
  qualifications: string | null;
  experience: number | null;
  fees: number | null;
  rating: number;
  ratingCount: number;
  photo: string | null;
  aadharDoc: string | null;
  degreeDoc: string | null;
  subjects: string | null;
  location: string;
  approved: boolean;
}

interface BookingData {
  id: string;
  date: string;
  time: string;
  subject: string | null;
  status: string;
  notes: string | null;
  parent: { name: string | null; email: string };
  payment: { status: string; amount: number } | null;
}

interface AvailSlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  maxBookings: number;
}

export default function TeacherDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<"profile" | "documents" | "availability" | "bookings">("profile");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Profile form
  const [bio, setBio] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [experience, setExperience] = useState("");
  const [fees, setFees] = useState("");
  const [location, setLocation] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // Availability
  const [slots, setSlots] = useState<AvailSlot[]>([]);
  const [newSlot, setNewSlot] = useState<AvailSlot>({ dayOfWeek: 1, startTime: "09:00", endTime: "10:00", maxBookings: 1 });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role !== "TEACHER") router.push("/");
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
      fetchBookings();
      fetchAvailability();
    }
  }, [status]);

  const fetchProfile = async () => {
    const res = await fetch("/api/teachers");
    const data = await res.json();
    const mine = data.find((t: any) => t.user.email === session?.user?.email);
    if (mine) {
      setProfile(mine);
      setBio(mine.bio || "");
      setQualifications(mine.qualifications || "");
      setExperience(mine.experience?.toString() || "");
      setFees(mine.fees?.toString() || "");
      setLocation(mine.location || "");
      setSelectedSubjects(mine.subjects ? mine.subjects.split(",").map((s: string) => s.trim()) : []);
    }
  };

  const fetchBookings = async () => {
    const res = await fetch("/api/bookings");
    const data = await res.json();
    setBookings(data);
  };

  const fetchAvailability = async () => {
    const res = await fetch("/api/availability");
    const data = await res.json();
    setSlots(data.map((a: any) => ({ 
      dayOfWeek: a.dayOfWeek, 
      startTime: a.startTime, 
      endTime: a.endTime,
      maxBookings: a.maxBookings || 1
    })));
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!bio || !qualifications || !experience || !fees || selectedSubjects.length === 0) {
      setError("Please fill all profile fields and select at least one subject.");
      return;
    }

    setSaving(true);
    setMessage("");

    await fetch("/api/teachers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bio,
        qualifications,
        experience,
        fees,
        location,
        subjects: selectedSubjects.join(","),
      }),
    });

    setMessage("Profile saved!");
    setSaving(false);
    fetchProfile();
  };

  const uploadDoc = async (file: File, docType: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("docType", docType);

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (res.ok) {
      setMessage(`${docType} uploaded successfully!`);
      fetchProfile();
    }
  };

  const saveAvailability = async () => {
    setSaving(true);
    await fetch("/api/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slots }),
    });
    setMessage("Availability saved!");
    setSaving(false);
  };

  const handleBookingAction = async (bookingId: string, action: string) => {
    await fetch("/api/bookings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, status: action }),
    });
    fetchBookings();
  };

  const addSlot = () => {
    setSlots([...slots, { ...newSlot }]);
  };

  const removeSlot = (index: number) => {
    setSlots(slots.filter((_, i) => i !== index));
  };

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  if (status === "loading" || !session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13A699]"></div>
      </div>
    );
  }

  const allDocsUploaded = !!(profile?.photo && profile?.aadharDoc && profile?.degreeDoc);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#13A699]">Teacher Dashboard</h1>
        <div className="flex gap-2">
          {!allDocsUploaded && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-600 uppercase">
              Documents Missing
            </span>
          )}
          {profile && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${profile.approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              {profile.approved ? "✓ Approved" : "⏳ Pending Approval"}
            </span>
          )}
        </div>
      </div>

      {message && (
        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg mb-4 text-sm font-bold border border-green-200">{message}</div>
      )}
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg mb-4 text-sm font-bold border border-red-200">{error}</div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(["profile", "documents", "availability", "bookings"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition ${
              tab === t ? "bg-[#13A699] text-white" : "bg-[#FFD708]/20 text-[#13A699] hover:bg-[#FFD708]/40"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {tab === "profile" && (
        <form onSubmit={saveProfile} className="bg-white rounded-2xl p-6 shadow-md border border-[#FFD708]/20">
          <h2 className="text-xl font-bold text-[#13A699] mb-4 uppercase">Profile Information (Mandatory)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-[#13A699] mb-1">Bio *</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699] resize-none"
                placeholder="Required: Tell parents about yourself..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#13A699] mb-1">Qualifications *</label>
              <input
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699]"
                placeholder="Required: e.g. B.Ed, M.Sc Mathematics"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#13A699] mb-1">Experience (years) *</label>
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#13A699] mb-1">Fees (₹/hr) *</label>
                <input
                  type="number"
                  value={fees}
                  onChange={(e) => setFees(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#13A699] mb-1">Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699]"
                placeholder="Optional: District or Area"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#13A699] mb-2">Subjects You Teach *</label>
              <SubjectSelector selectedSubjects={selectedSubjects} onChange={setSelectedSubjects} mode="multi" />
              {selectedSubjects.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedSubjects.map((s) => (
                    <span key={s} className="bg-[#13A699]/10 text-[#13A699] text-xs px-2 py-1 rounded-full font-bold">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#FFD708] text-[#13A699] font-black py-4 rounded-xl hover:bg-[#FFD708]/80 transition disabled:opacity-50 uppercase shadow-lg"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      )}

      {/* Documents Tab */}
      {tab === "documents" && (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#FFD708]/20">
          <h2 className="text-xl font-bold text-[#13A699] mb-4 uppercase">Verification Documents (Mandatory)</h2>
          <div className="space-y-8">
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-bold text-[#13A699] mb-2 uppercase">Profile Photo *</label>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-[#FFD708]/20 rounded-full flex items-center justify-center overflow-hidden border-2 border-[#FFD708]">
                  {profile?.photo ? (
                    <img src={profile.photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl text-[#13A699]">📷</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && uploadDoc(e.target.files[0], "photo")}
                  className="text-sm text-[#13A699]"
                />
              </div>
            </div>

            {/* Aadhar Upload */}
            <div>
              <label className="block text-sm font-bold text-[#13A699] mb-2 uppercase">Aadhar Card *</label>
              <div className="flex items-center gap-4 bg-[#FFF7ED] p-4 rounded-xl border border-[#FFD708]/20">
                {profile?.aadharDoc ? (
                  <span className="text-green-600 font-bold">✓ Uploaded</span>
                ) : (
                  <span className="text-red-600 font-bold">⚠️ Required</span>
                )}
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => e.target.files?.[0] && uploadDoc(e.target.files[0], "aadhar")}
                  className="text-sm text-[#13A699]"
                />
              </div>
            </div>

            {/* Degree Upload */}
            <div>
              <label className="block text-sm font-bold text-[#13A699] mb-2 uppercase">Degree Certificate *</label>
              <div className="flex items-center gap-4 bg-[#FFF7ED] p-4 rounded-xl border border-[#FFD708]/20">
                {profile?.degreeDoc ? (
                  <span className="text-green-600 font-bold">✓ Uploaded</span>
                ) : (
                  <span className="text-red-600 font-bold">⚠️ Required</span>
                )}
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => e.target.files?.[0] && uploadDoc(e.target.files[0], "degree")}
                  className="text-sm text-[#13A699]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Availability Tab */}
      {tab === "availability" && (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#FFD708]/20">
          <h2 className="text-xl font-bold text-[#13A699] mb-4 uppercase">Set Your Schedule</h2>

          {/* Add new slot */}
          <div className="flex flex-col gap-4 mb-8 p-6 bg-[#FFF7ED] rounded-2xl border border-[#FFD708]/30">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-bold text-[#13A699] mb-1 uppercase">Day</label>
                <select
                  value={newSlot.dayOfWeek}
                  onChange={(e) => setNewSlot({ ...newSlot, dayOfWeek: parseInt(e.target.value) })}
                  className="w-full px-3 py-3 rounded-lg border border-[#FFD708]/30 bg-white text-[#13A699] text-sm font-bold"
                >
                  {dayNames.map((d, i) => (
                    <option key={i} value={i}>{d}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-bold text-[#13A699] mb-1 uppercase">Start</label>
                <input
                  type="time"
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                  className="w-full px-3 py-3 rounded-lg border border-[#FFD708]/30 bg-white text-[#13A699] text-sm"
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-bold text-[#13A699] mb-1 uppercase">End</label>
                <input
                  type="time"
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                  className="w-full px-3 py-3 rounded-lg border border-[#FFD708]/30 bg-white text-[#13A699] text-sm"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-xs font-bold text-[#13A699] mb-1 uppercase">Max Bookings for this slot</label>
                <input
                  type="number"
                  min={1}
                  value={newSlot.maxBookings}
                  onChange={(e) => setNewSlot({ ...newSlot, maxBookings: parseInt(e.target.value) || 1 })}
                  className="w-full px-3 py-3 rounded-lg border border-[#FFD708]/30 bg-white text-[#13A699] text-sm font-bold"
                />
              </div>
              <button
                onClick={addSlot}
                className="mt-5 bg-[#13A699] text-white font-bold px-8 py-3 rounded-xl text-sm hover:bg-[#13A699]/80 transition shadow-md"
              >
                + Add to Schedule
              </button>
            </div>
          </div>

          {/* Current slots */}
          {slots.length === 0 ? (
            <p className="text-[#13A699]/50 text-sm italic mb-6">No schedule set yet. Parents cannot book you without availability.</p>
          ) : (
            <div className="space-y-3 mb-8">
              {slots.map((slot, i) => (
                <div key={i} className="flex items-center justify-between bg-[#FFF7ED] rounded-xl px-6 py-3 border border-[#FFD708]/20">
                  <span className="text-[#13A699] font-bold">
                    <strong className="uppercase">{dayNames[slot.dayOfWeek]}</strong>: {slot.startTime} - {slot.endTime} 
                    <span className="ml-4 bg-[#FFD708]/30 px-2 py-0.5 rounded text-xs">Limit: {slot.maxBookings}</span>
                  </span>
                  <button
                    onClick={() => removeSlot(i)}
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    Remove ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={saveAvailability}
            disabled={saving}
            className="w-full bg-[#13A699] text-white font-black py-4 rounded-xl hover:bg-[#13A699]/80 transition disabled:opacity-50 uppercase shadow-lg"
          >
            {saving ? "Updating..." : "Save Full Schedule"}
          </button>
        </div>
      )}

      {/* Bookings Tab */}
      {tab === "bookings" && (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#FFD708]/20">
          <h2 className="text-xl font-bold text-[#13A699] mb-4 uppercase">Booking Requests</h2>
          {bookings.length === 0 ? (
            <p className="text-[#13A699]/50 text-sm">No bookings yet.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b.id} className="border border-[#FFD708]/20 rounded-xl p-4 bg-[#FFF7ED]/20">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-black text-[#13A699] uppercase">{b.parent.name || b.parent.email}</p>
                      <p className="text-sm text-[#13A699]/60 font-bold">
                        {b.subject && <span className="uppercase">{b.subject} · </span>}
                        {b.date} at {b.time}
                      </p>
                      {b.notes && <p className="text-xs text-gray-400 mt-2 bg-white p-2 rounded-lg border border-[#FFD708]/10 italic">"{b.notes}"</p>}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                      b.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                      b.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                      b.status === "REJECTED" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  {b.status === "PENDING" && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleBookingAction(b.id, "CONFIRMED")}
                        className="bg-green-500 text-white px-6 py-2 rounded-xl text-xs font-black uppercase hover:bg-green-600 transition shadow-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleBookingAction(b.id, "REJECTED")}
                        className="bg-red-500 text-white px-6 py-2 rounded-xl text-xs font-black uppercase hover:bg-red-600 transition shadow-sm"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
