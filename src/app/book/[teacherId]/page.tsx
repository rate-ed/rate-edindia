"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";

interface TeacherData {
  id: string;
  bio: string | null;
  qualifications: string | null;
  experience: number | null;
  fees: number | null;
  rating: number;
  subjects: string | null;
  location: string;
  photo: string | null;
  user: { name: string | null; email: string };
  availability: Array<{ dayOfWeek: number; startTime: string; endTime: string }>;
}

export default function BookPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const teacherId = params.teacherId as string;

  const [teacher, setTeacher] = useState<TeacherData | null>(null);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [subject, setSubject] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    // Explicitly fetch all teachers including availability
    fetch(`/api/teachers`)
      .then((r) => r.json())
      .then((data: TeacherData[]) => {
        const t = data.find((t) => t.id === teacherId);
        if (t) setTeacher(t);
      });
  }, [teacherId]);

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teacherId, date, time, subject, notes }),
    });

    const booking = await res.json();
    if (booking.id) {
      setBookingId(booking.id);
      setBooked(true);
    }
    setLoading(false);
  };

  const handlePayment = async () => {
    setPaying(true);
    const amount = teacher?.fees || 500;

    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, amount }),
    });

    const data = await res.json();

    const confirmed = window.confirm(
      `Razorpay Test Mode\n\nAmount: ₹${amount}\nOrder ID: ${data.orderId}\n\nClick OK to simulate successful payment.`
    );

    if (confirmed) {
      await fetch("/api/payments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: data.payment.id,
          razorpayPaymentId: "pay_test_" + Date.now(),
          status: "PAID",
        }),
      });
      alert("Payment successful! Your booking is confirmed.");
      router.push("/dashboard/parent");
    }
    setPaying(false);
  };

  if (!teacher) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13A699]"></div>
      </div>
    );
  }

  const teacherSubjects = teacher.subjects?.split(",").map((s) => s.trim()) || [];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-black text-[#13A699] mb-8 uppercase tracking-tight">Book Demo Class</h1>

      <div className="bg-white rounded-3xl p-8 shadow-xl border border-[#FFD708]/20 mb-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-[#FFD708]/20 rounded-full flex items-center justify-center overflow-hidden border-2 border-[#FFD708]">
            {teacher.photo ? (
               <img src={teacher.photo} alt="" className="w-full h-full object-cover" />
            ) : (
               <span className="text-3xl text-[#13A699] font-bold">{teacher.user.name?.[0] || "T"}</span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#13A699]">{teacher.user.name}</h2>
            {teacher.fees && <p className="text-xl font-black text-[#13A699]">₹{teacher.fees}/hr</p>}
            <p className="text-sm text-[#13A699]/60">📍 {teacher.location || "Location not set"}</p>
          </div>
        </div>

        {/* Schedule Section */}
        <div className="bg-[#FFF7ED] rounded-2xl p-6 border border-[#FFD708]/30 mb-6">
          <h3 className="text-lg font-bold text-[#13A699] mb-4 uppercase tracking-wide">Teacher's Schedule</h3>
          {teacher.availability && teacher.availability.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {teacher.availability.map((a, i) => (
                <div key={i} className="bg-white px-4 py-2 rounded-xl border border-[#FFD708]/50 flex justify-between items-center shadow-sm">
                  <span className="font-bold text-[#13A699] text-sm">{dayNames[a.dayOfWeek]}</span>
                  <span className="text-[#13A699]/70 text-xs font-medium">{a.startTime} - {a.endTime}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[#13A699]/50 text-sm italic">This teacher hasn't set their available slots yet.</p>
          )}
        </div>

        {teacher.bio && <p className="text-[#13A699]/70 leading-relaxed mb-4">{teacher.bio}</p>}
      </div>

      {!booked ? (
        <form onSubmit={handleBook} className="bg-white rounded-3xl p-8 shadow-xl border border-[#FFD708]/20">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#13A699] mb-2 uppercase">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699] font-medium"
                required
              >
                <option value="">Select a subject</option>
                {teacherSubjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#13A699] mb-2 uppercase">Preferred Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-3 rounded-xl border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#13A699] mb-2 uppercase">Preferred Time</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#13A699] mb-2 uppercase">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699] resize-none"
                placeholder="Message for the teacher..."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FFD708] text-[#13A699] font-black py-4 rounded-2xl hover:bg-[#FFD708]/80 transition disabled:opacity-50 uppercase shadow-lg text-lg"
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-3xl p-10 shadow-2xl border border-[#FFD708]/20 text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-200">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-[#13A699] mb-4 uppercase tracking-tight">Success!</h2>
          <p className="text-[#13A699]/60 text-lg mb-8">Your booking request has been sent.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handlePayment}
              disabled={paying}
              className="bg-[#FFD708] text-[#13A699] font-black px-10 py-4 rounded-2xl hover:bg-[#FFD708]/80 transition disabled:opacity-50 uppercase shadow-lg"
            >
              {paying ? "Processing..." : `Pay ₹${teacher.fees || 500}`}
            </button>
            <button
              onClick={() => router.push("/dashboard/parent")}
              className="bg-[#13A699] text-white font-black px-10 py-4 rounded-2xl hover:bg-[#13A699]/80 transition uppercase shadow-lg"
            >
              Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
