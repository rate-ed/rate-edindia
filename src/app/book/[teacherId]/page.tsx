"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { SUBJECT_HIERARCHY } from "@/lib/subjects";

interface TeacherData {
  id: string;
  bio: string | null;
  qualifications: string | null;
  experience: number | null;
  fees: number | null;
  rating: number;
  subjects: string | null;
  location: string;
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
    fetch(`/api/teachers?all=1`)
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
    setBookingId(booking.id);
    setBooked(true);
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

    // Simulate Razorpay test mode payment
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
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-[#13A699] mb-6">Book a Demo Class</h1>

      <div className="bg-white rounded-2xl p-6 shadow-md border border-[#FFD708]/20 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-[#FFD708]/20 rounded-full flex items-center justify-center">
            <span className="text-2xl text-[#13A699] font-bold">{teacher.user.name?.[0] || "T"}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#13A699]">{teacher.user.name}</h2>
            <p className="text-sm text-[#13A699]/60">📍 {teacher.location}</p>
            {teacher.fees && <p className="text-sm font-semibold text-[#13A699]">₹{teacher.fees}/hr</p>}
          </div>
        </div>

        {teacher.bio && <p className="text-sm text-[#13A699]/70 mb-3">{teacher.bio}</p>}
        {teacher.qualifications && (
          <p className="text-sm text-[#13A699]/60 mb-2">
            <strong>Qualifications:</strong> {teacher.qualifications}
          </p>
        )}

        {teacher.availability.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-bold text-[#13A699] mb-2">Available Slots:</h3>
            <div className="flex flex-wrap gap-2">
              {teacher.availability.map((a, i) => (
                <span key={i} className="bg-[#FFD708]/20 text-[#13A699] text-xs px-3 py-1 rounded-full">
                  {dayNames[a.dayOfWeek]} {a.startTime}-{a.endTime}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {!booked ? (
        <form onSubmit={handleBook} className="bg-white rounded-2xl p-6 shadow-md border border-[#FFD708]/20">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#13A699] mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699]"
                required
              >
                <option value="">Select a subject</option>
                {teacherSubjects.length > 0 ? (
                  teacherSubjects.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))
                ) : (
                  SUBJECT_HIERARCHY.map((cat) =>
                    cat.subcategories.map((sub) =>
                      sub.items.map((item) => (
                        <option key={`${cat.name}-${item.name}`} value={item.name}>
                          {cat.name} → {sub.name} → {item.name}
                        </option>
                      ))
                    )
                  )
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#13A699] mb-1">Preferred Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#13A699] mb-1">Preferred Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#13A699] mb-1">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699] resize-none"
                placeholder="Any special requirements or questions..."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FFD708] text-[#13A699] font-bold py-3 rounded-xl hover:bg-[#FFD708]/80 transition disabled:opacity-50"
            >
              {loading ? "Booking..." : "Book Demo Class"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#FFD708]/20 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#13A699] mb-2">Booking Submitted!</h2>
          <p className="text-[#13A699]/60 mb-6">Your demo class request has been sent to the teacher.</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handlePayment}
              disabled={paying}
              className="bg-[#FFD708] text-[#13A699] font-bold px-6 py-3 rounded-xl hover:bg-[#FFD708]/80 transition disabled:opacity-50"
            >
              {paying ? "Processing..." : `Pay ₹${teacher.fees || 500}`}
            </button>
            <button
              onClick={() => router.push("/dashboard/parent")}
              className="bg-[#13A699] text-white font-medium px-6 py-3 rounded-xl hover:bg-[#13A699]/80 transition"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
