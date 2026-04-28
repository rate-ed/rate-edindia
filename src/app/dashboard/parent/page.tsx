"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface BookingData {
  id: string;
  date: string;
  time: string;
  subject: string | null;
  status: string;
  notes: string | null;
  teacher: {
    id: string;
    fees: number | null;
    user: { name: string | null; email: string };
  };
  payment: { id: string; status: string; amount: number } | null;
}

export default function ParentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role !== "PARENT") {
      if (session?.user?.role === "TEACHER") router.push("/dashboard/teacher");
      if (session?.user?.role === "ADMIN") router.push("/dashboard/admin");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchBookings();
    }
  }, [status]);

  const fetchBookings = async () => {
    const res = await fetch("/api/bookings");
    const data = await res.json();
    setBookings(data);
    setLoading(false);
  };

  const handlePayment = async (booking: BookingData) => {
    const amount = booking.teacher.fees || 500;

    const res = await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId: booking.id, amount }),
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
      fetchBookings();
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13A699]"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-[#13A699]">Parent Dashboard</h1>
        <Link
          href="/search"
          className="bg-[#FFD708] text-[#13A699] font-bold px-6 py-2 rounded-xl hover:bg-[#FFD708]/80 transition"
        >
          Find a Teacher
        </Link>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-md border border-[#FFD708]/20">
        <h2 className="text-xl font-bold text-[#13A699] mb-4">Your Bookings</h2>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#13A699]/50 text-lg mb-4">No bookings yet</p>
            <Link
              href="/search"
              className="bg-[#FFD708] text-[#13A699] font-bold px-6 py-3 rounded-xl hover:bg-[#FFD708]/80 transition inline-block"
            >
              Browse Teachers
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b.id} className="border border-[#FFD708]/20 rounded-xl p-4">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-semibold text-[#13A699]">
                      {b.teacher.user.name || b.teacher.user.email}
                    </p>
                    <p className="text-sm text-[#13A699]/60">
                      {b.subject && <span>{b.subject} · </span>}
                      {b.date} at {b.time}
                    </p>
                    {b.notes && <p className="text-xs text-gray-400 mt-1">{b.notes}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      b.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                      b.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                      b.status === "REJECTED" ? "bg-red-100 text-red-700" :
                      b.status === "CANCELLED" ? "bg-gray-100 text-gray-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {b.status}
                    </span>
                    {b.payment && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        b.payment.status === "PAID" ? "bg-green-100 text-green-700" :
                        b.payment.status === "REFUNDED" ? "bg-purple-100 text-purple-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        ₹{b.payment.amount} - {b.payment.status}
                      </span>
                    )}
                  </div>
                </div>
                {!b.payment && b.status !== "REJECTED" && b.status !== "CANCELLED" && (
                  <button
                    onClick={() => handlePayment(b)}
                    className="mt-3 bg-[#FFD708] text-[#13A699] font-bold px-4 py-2 rounded-lg text-sm hover:bg-[#FFD708]/80 transition"
                  >
                    Pay ₹{b.teacher.fees || 500}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
