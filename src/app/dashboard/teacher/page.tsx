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
}

export default function TeacherDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<"profile" | "documents" | "availability" | "bookings">("profile");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Profile form
  const [bio, setBio] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [experience, setExperience] = useState("");
  const [fees, setFees] = useState("");
  const [location, setLocation] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  // Availability
  const [slots, setSlots] = useState<AvailSlot[]>([]);
  const [newSlot, setNewSlot] = useState<AvailSlot>({ dayOfWeek: 1, startTime: "09:00", endTime: "10:00" });

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
    setSlots(data.map((a: any) => ({ dayOfWeek: a.dayOfWeek, startTime: a.startTime, endTime: a.endTime })));
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#13A699]">Teacher Dashboard</h1>
        {profile && (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${profile.approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
            {profile.approved ? "✓ Approved" : "⏳ Pending Approval"}
          </span>
        )}
      </div>

      {message && (
        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg mb-4 text-sm">{message}</div>
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
          <h2 className="text-xl font-bold text-[#13A699] mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#13A699] mb-1">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699] resize-none"
                placeholder="Tell parents about yourself..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#13A699] mb-1">Qualifications</label>
              <input
                value={qualifications}
                onChange={(e) => setQualifications(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699]"
                placeholder="e.g. B.Ed, M.Sc Mathematics"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#13A699] mb-1">Experience (years)</label>
                <input
                  type="number"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#13A699] mb-1">Fees (₹/hr)</label>
                <input
                  type="number"
                  value={fees}
                  onChange={(e) => setFees(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#13A699] mb-1">Location</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699]"
                placeholder="Location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#13A699] mb-2">Subjects You Teach</label>
              <SubjectSelector selectedSubjects={selectedSubjects} onChange={setSelectedSubjects} mode="multi" />
              {selectedSubjects.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {selectedSubjects.map((s) => (
                    <span key={s} className="bg-[#13A699]/10 text-[#13A699] text-xs px-2 py-1 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Rating display */}
            {profile && (
              <div className="bg-[#FFF7ED] rounded-lg p-3">
                <span className="text-sm text-[#13A699] font-medium">Your Rating: </span>
                <span className="text-lg font-bold text-[#FFD708]">
                  {profile.rating > 0 ? `${profile.rating.toFixed(1)} ★` : "No ratings yet"}
                </span>
                {profile.ratingCount > 0 && (
                  <span className="text-xs text-gray-400 ml-1">({profile.ratingCount} reviews)</span>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-[#FFD708] text-[#13A699] font-bold py-3 rounded-xl hover:bg-[#FFD708]/80 transition disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      )}

      {/* Documents Tab */}
      {tab === "documents" && (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#FFD708]/20">
          <h2 className="text-xl font-bold text-[#13A699] mb-4">Documents</h2>
          <div className="space-y-6">
            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-[#13A699] mb-2">Profile Photo</label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-[#FFD708]/20 rounded-full flex items-center justify-center overflow-hidden">
                  {profile?.photo ? (
                    <img src={profile.photo} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl text-[#13A699]">📷</span>
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
              <label className="block text-sm font-medium text-[#13A699] mb-2">Aadhar Card</label>
              <div className="flex items-center gap-3">
                {profile?.aadharDoc ? (
                  <span className="text-green-600 text-sm">✓ Uploaded</span>
                ) : (
                  <span className="text-yellow-600 text-sm">⏳ Not uploaded</span>
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
              <label className="block text-sm font-medium text-[#13A699] mb-2">Degree Certificate</label>
              <div className="flex items-center gap-3">
                {profile?.degreeDoc ? (
                  <span className="text-green-600 text-sm">✓ Uploaded</span>
                ) : (
                  <span className="text-yellow-600 text-sm">⏳ Not uploaded</span>
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
          <h2 className="text-xl font-bold text-[#13A699] mb-4">Set Your Availability</h2>

          {/* Add new slot */}
          <div className="flex flex-wrap gap-3 mb-6 p-4 bg-[#FFF7ED] rounded-xl">
            <select
              value={newSlot.dayOfWeek}
              onChange={(e) => setNewSlot({ ...newSlot, dayOfWeek: parseInt(e.target.value) })}
              className="px-3 py-2 rounded-lg border border-[#FFD708]/30 bg-white text-[#13A699] text-sm"
            >
              {dayNames.map((d, i) => (
                <option key={i} value={i}>{d}</option>
              ))}
            </select>
            <input
              type="time"
              value={newSlot.startTime}
              onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
              className="px-3 py-2 rounded-lg border border-[#FFD708]/30 bg-white text-[#13A699] text-sm"
            />
            <span className="self-center text-[#13A699]">to</span>
            <input
              type="time"
              value={newSlot.endTime}
              onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
              className="px-3 py-2 rounded-lg border border-[#FFD708]/30 bg-white text-[#13A699] text-sm"
            />
            <button
              onClick={addSlot}
              className="bg-[#FFD708] text-[#13A699] font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#FFD708]/80 transition"
            >
              + Add Slot
            </button>
          </div>

          {/* Current slots */}
          {slots.length === 0 ? (
            <p className="text-[#13A699]/50 text-sm">No availability slots set yet.</p>
          ) : (
            <div className="space-y-2 mb-6">
              {slots.map((slot, i) => (
                <div key={i} className="flex items-center justify-between bg-[#FFF7ED] rounded-lg px-4 py-2">
                  <span className="text-sm text-[#13A699]">
                    <strong>{dayNames[slot.dayOfWeek]}</strong> {slot.startTime} - {slot.endTime}
                  </span>
                  <button
                    onClick={() => removeSlot(i)}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={saveAvailability}
            disabled={saving}
            className="w-full bg-[#FFD708] text-[#13A699] font-bold py-3 rounded-xl hover:bg-[#FFD708]/80 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Availability"}
          </button>
        </div>
      )}

      {/* Bookings Tab */}
      {tab === "bookings" && (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#FFD708]/20">
          <h2 className="text-xl font-bold text-[#13A699] mb-4">Manage Bookings</h2>
          {bookings.length === 0 ? (
            <p className="text-[#13A699]/50 text-sm">No bookings yet.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b.id} className="border border-[#FFD708]/20 rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-[#13A699]">{b.parent.name || b.parent.email}</p>
                      <p className="text-sm text-[#13A699]/60">
                        {b.subject && <span>{b.subject} · </span>}
                        {b.date} at {b.time}
                      </p>
                      {b.notes && <p className="text-xs text-gray-400 mt-1">{b.notes}</p>}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      b.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                      b.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                      b.status === "REJECTED" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    }`}>
                      {b.status}
                    </span>
                  </div>
                  {b.status === "PENDING" && (
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleBookingAction(b.id, "CONFIRMED")}
                        className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-600 transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleBookingAction(b.id, "REJECTED")}
                        className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-600 transition"
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
