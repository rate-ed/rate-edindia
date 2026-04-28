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
  availability: Array<{ id: string; dayOfWeek: number; startTime: string; endTime: string; maxBookings: number }>;
}

interface BookingStatus {
  time: string;
  count: number;
}

export default function BookPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const teacherId = params.teacherId as string;

  const [teacher, setTeacher] = useState<TeacherData | null>(null);
  const [existingBookings, setExistingBookings] = useState<any[]>([]);
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
    // Fetch teacher data
    fetch(`/api/teachers`)
      .then((r) => r.json())
      .then((data: TeacherData[]) => {
        const t = data.find((t) => t.id === teacherId);
        if (t) setTeacher(t);
      });

    // Fetch confirmed bookings for this teacher to check availability
    fetch(`/api/bookings?teacherId=${teacherId}`)
      .then((r) => r.json())
      .then((data) => setExistingBookings(data));
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

  const getSlotStatus = (dayOfWeek: number, startTime: string, maxLimit: number) => {
    if (!date) return { full: false, count: 0 };
    
    // Check if the selected date matches the slot's day of week
    const selectedDate = new Date(date);
    if (selectedDate.getDay() !== dayOfWeek) return null;

    const count = existingBookings.filter(b => 
      b.date === date && 
      b.time === startTime && 
      (b.status === "CONFIRMED" || b.status === "PENDING")
    ).length;

    return { full: count >= maxLimit, count };
  };

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
            <p className="text-sm text-[#13A699]/60 font-bold uppercase tracking-widest">📍 {teacher.location || "Online"}</p>
          </div>
        </div>

        {/* Dynamic Schedule View */}
        <div className="bg-[#FFF7ED] rounded-2xl p-6 border border-[#FFD708]/30 mb-6">
          <h3 className="text-lg font-black text-[#13A699] mb-4 uppercase tracking-wide">Available Schedule</h3>
          
          <div className="mb-4">
            <label className="block text-[10px] font-black text-[#13A699]/60 uppercase mb-2">Step 1: Pick a Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => { setDate(e.target.value); setTime(""); }}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2 rounded-xl border-2 border-[#FFD708]/30 focus:border-[#13A699] focus:outline-none bg-white text-[#13A699] font-bold"
            />
          </div>

          {date && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
               <label className="block text-[10px] font-black text-[#13A699]/60 uppercase mb-2">Step 2: Choose an Open Slot</label>
               <div className="grid grid-cols-1 gap-3">
                  {teacher.availability.map((a, i) => {
                    const status = getSlotStatus(a.dayOfWeek, a.startTime, a.maxBookings);
                    if (!status) return null; // Slot doesn't match the selected day of week

                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={status.full}
                        onClick={() => setTime(a.startTime)}
                        className={`flex justify-between items-center px-5 py-3 rounded-xl border-2 transition-all ${
                          time === a.startTime 
                          ? "bg-[#13A699] text-white border-[#13A699] shadow-lg scale-[1.02]" 
                          : status.full 
                          ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed grayscale"
                          : "bg-white text-[#13A699] border-[#FFD708]/50 hover:border-[#13A699]"
                        }`}
                      >
                        <div className="flex flex-col items-start">
                          <span className="font-black text-sm uppercase">{a.startTime} - {a.endTime}</span>
                          {status.full ? (
                            <span className="text-[10px] font-black text-red-500 uppercase">FULLY BOOKED</span>
                          ) : (
                            <span className="text-[10px] font-black opacity-60 uppercase">{a.maxBookings - status.count} SLOTS LEFT</span>
                          )}
                        </div>
                        {status.full ? (
                           <span className="text-xl">🚫</span>
                        ) : time === a.startTime ? (
                           <span className="text-xl">✅</span>
                        ) : (
                           <span className="text-sm font-black text-[#FFD708]">PICK</span>
                        )}
                      </button>
                    );
                  })}
                  {teacher.availability.filter(a => new Date(date).getDay() === a.dayOfWeek).length === 0 && (
                    <p className="text-[#13A699]/60 text-xs italic font-bold text-center py-4 bg-white/50 rounded-xl">No slots listed for this day.</p>
                  )}
               </div>
            </div>
          )}
        </div>
      </div>

      {!booked ? (
        <form onSubmit={handleBook} className="bg-white rounded-3xl p-8 shadow-xl border border-[#FFD708]/20">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#13A699] mb-2 uppercase">Selected Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699] font-black"
                required
              >
                <option value="">Select a subject</option>
                {teacherSubjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <input type="hidden" value={date} required />
            <input type="hidden" value={time} required />

            <div>
              <label className="block text-sm font-bold text-[#13A699] mb-2 uppercase tracking-widest">Message for Teacher</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699] resize-none font-bold"
                placeholder="Questions or details..."
              />
            </div>
            
            <button
              type="submit"
              disabled={loading || !date || !time || !subject}
              className="w-full bg-[#FFD708] text-[#13A699] font-black py-5 rounded-2xl hover:bg-[#FFD708]/80 transition disabled:opacity-50 uppercase shadow-xl text-xl"
            >
              {!date ? "Select a Date First" : !time ? "Select a Time Slot" : loading ? "Booking..." : "Request Demo Class"}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-3xl p-10 shadow-2xl border border-[#FFD708]/20 text-center animate-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-200">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-[#13A699] mb-4 uppercase tracking-tight">Request Sent!</h2>
          <p className="text-[#13A699]/60 text-lg mb-8 font-bold">Your booking is pending teacher confirmation.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handlePayment}
              disabled={paying}
              className="bg-[#FFD708] text-[#13A699] font-black px-10 py-4 rounded-2xl hover:bg-[#FFD708]/80 transition shadow-lg uppercase"
            >
              {paying ? "Processing..." : `Pay ₹${teacher.fees || 500}`}
            </button>
            <button
              onClick={() => router.push("/dashboard/parent")}
              className="bg-[#13A699] text-white font-black px-10 py-4 rounded-2xl hover:bg-[#13A699]/80 transition shadow-lg uppercase"
            >
              Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
