"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SubjectSelector from "@/components/SubjectSelector";

interface PendingTeacher {
  id: string;
  bio: string | null;
  qualifications: string | null;
  subjects: string | null;
  location: string;
  approved: boolean;
  aadharDoc: string | null;
  degreeDoc: string | null;
  user: { name: string | null; email: string };
}

interface AdminBooking {
  id: string;
  date: string;
  time: string;
  subject: string | null;
  status: string;
  parent: { name: string | null; email: string };
  teacher: { user: { name: string | null; email: string } };
  payment: { id: string; status: string; amount: number; refundStatus: string | null } | null;
}

interface AdminPayment {
  id: string;
  amount: number;
  status: string;
  refundStatus: string | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  createdAt: string;
  user: { name: string | null; email: string };
  booking: { id: string; date: string; status: string };
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<"teachers" | "bookings" | "payments" | "add-teacher">("teachers");
  const [pendingTeachers, setPendingTeachers] = useState<PendingTeacher[]>([]);
  const [allTeachers, setAllTeachers] = useState<PendingTeacher[]>([]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Add teacher form
  const [newTeacher, setNewTeacher] = useState({
    name: "", email: "", password: "", bio: "", qualifications: "",
    experience: "", fees: "", subjects: "", location: "",
  });
  const [addTeacherSubjects, setAddTeacherSubjects] = useState<string[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated" && session?.user?.role !== "ADMIN") router.push("/");
  }, [status, session, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    const [pt, at, bk, pm] = await Promise.all([
      fetch("/api/admin?action=pending-teachers").then((r) => r.json()),
      fetch("/api/admin?action=all-teachers").then((r) => r.json()),
      fetch("/api/admin?action=all-bookings").then((r) => r.json()),
      fetch("/api/admin?action=all-payments").then((r) => r.json()),
    ]);
    setPendingTeachers(pt);
    setAllTeachers(at);
    setBookings(bk);
    setPayments(pm);
  };

  const approveTeacher = async (teacherId: string) => {
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "approve-teacher", teacherId }),
    });
    setMessage("Teacher approved!");
    fetchData();
  };

  const rejectTeacher = async (teacherId: string) => {
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reject-teacher", teacherId }),
    });
    setMessage("Teacher rejected.");
    fetchData();
  };

  const handleRefund = async (paymentId: string) => {
    if (!confirm("Are you sure you want to refund this payment?")) return;
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "refund", paymentId }),
    });
    setMessage("Payment refunded.");
    fetchData();
  };

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "add-teacher",
        ...newTeacher,
        subjects: addTeacherSubjects.join(","),
      }),
    });
    setMessage("Teacher added successfully!");
    setNewTeacher({ name: "", email: "", password: "", bio: "", qualifications: "", experience: "", fees: "", subjects: "", location: "" });
    setAddTeacherSubjects([]);
    setLoading(false);
    fetchData();
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#13A699]"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#13A699] mb-6">Admin Panel</h1>

      {message && (
        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg mb-4 text-sm">
          {message}
          <button onClick={() => setMessage("")} className="ml-4 text-green-500 hover:text-green-700">✕</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#FFD708]/20">
          <p className="text-xs text-[#13A699]/60">Pending Teachers</p>
          <p className="text-2xl font-bold text-[#FFD708]">{pendingTeachers.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#FFD708]/20">
          <p className="text-xs text-[#13A699]/60">Total Teachers</p>
          <p className="text-2xl font-bold text-[#13A699]">{allTeachers.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#FFD708]/20">
          <p className="text-xs text-[#13A699]/60">Total Bookings</p>
          <p className="text-2xl font-bold text-[#13A699]">{bookings.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-[#FFD708]/20">
          <p className="text-xs text-[#13A699]/60">Total Payments</p>
          <p className="text-2xl font-bold text-[#13A699]">{payments.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(["teachers", "bookings", "payments", "add-teacher"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition ${
              tab === t ? "bg-[#13A699] text-white" : "bg-[#FFD708]/20 text-[#13A699] hover:bg-[#FFD708]/40"
            }`}
          >
            {t === "add-teacher" ? "Add Teacher" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Teachers Tab */}
      {tab === "teachers" && (
        <div className="space-y-6">
          {pendingTeachers.length > 0 && (
            <div className="bg-white rounded-2xl p-6 shadow-md border border-[#FFD708]/20">
              <h2 className="text-xl font-bold text-[#FFD708] mb-4">⏳ Pending Approvals</h2>
              <div className="space-y-4">
                {pendingTeachers.map((t) => (
                  <div key={t.id} className="border border-[#FFD708]/30 rounded-xl p-4 bg-yellow-50/50">
                    <div className="flex items-start justify-between flex-wrap gap-2">
                      <div>
                        <p className="font-semibold text-[#13A699]">{t.user.name || t.user.email}</p>
                        <p className="text-sm text-[#13A699]/60">{t.user.email}</p>
                        {t.qualifications && <p className="text-xs text-gray-500 mt-1">Qualifications: {t.qualifications}</p>}
                        {t.subjects && <p className="text-xs text-gray-500">Subjects: {t.subjects}</p>}
                        <p className="text-xs text-gray-500">Location: {t.location}</p>
                        <div className="flex gap-2 mt-1">
                          {t.aadharDoc && <span className="text-xs text-green-600">✓ Aadhar</span>}
                          {t.degreeDoc && <span className="text-xs text-green-600">✓ Degree</span>}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveTeacher(t.id)}
                          className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-600 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectTeacher(t.id)}
                          className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-600 transition"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 shadow-md border border-[#FFD708]/20">
            <h2 className="text-xl font-bold text-[#13A699] mb-4">All Teachers</h2>
            {allTeachers.length === 0 ? (
              <p className="text-[#13A699]/50 text-sm">No teachers registered yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#FFD708]/20">
                      <th className="text-left py-2 text-[#13A699] font-medium">Name</th>
                      <th className="text-left py-2 text-[#13A699] font-medium">Email</th>
                      <th className="text-left py-2 text-[#13A699] font-medium">Subjects</th>
                      <th className="text-left py-2 text-[#13A699] font-medium">Status</th>
                      <th className="text-left py-2 text-[#13A699] font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTeachers.map((t) => (
                      <tr key={t.id} className="border-b border-[#FFD708]/10">
                        <td className="py-2 text-[#13A699]">{t.user.name || "-"}</td>
                        <td className="py-2 text-[#13A699]/70">{t.user.email}</td>
                        <td className="py-2 text-[#13A699]/70 max-w-[200px] truncate">{t.subjects || "-"}</td>
                        <td className="py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${t.approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {t.approved ? "Approved" : "Pending"}
                          </span>
                        </td>
                        <td className="py-2">
                          {!t.approved ? (
                            <button onClick={() => approveTeacher(t.id)} className="text-green-600 hover:underline text-xs">Approve</button>
                          ) : (
                            <button onClick={() => rejectTeacher(t.id)} className="text-red-400 hover:underline text-xs">Revoke</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {tab === "bookings" && (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#FFD708]/20">
          <h2 className="text-xl font-bold text-[#13A699] mb-4">All Bookings</h2>
          {bookings.length === 0 ? (
            <p className="text-[#13A699]/50 text-sm">No bookings yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#FFD708]/20">
                    <th className="text-left py-2 text-[#13A699] font-medium">Parent</th>
                    <th className="text-left py-2 text-[#13A699] font-medium">Teacher</th>
                    <th className="text-left py-2 text-[#13A699] font-medium">Subject</th>
                    <th className="text-left py-2 text-[#13A699] font-medium">Date</th>
                    <th className="text-left py-2 text-[#13A699] font-medium">Status</th>
                    <th className="text-left py-2 text-[#13A699] font-medium">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-[#FFD708]/10">
                      <td className="py-2 text-[#13A699]">{b.parent.name || b.parent.email}</td>
                      <td className="py-2 text-[#13A699]">{b.teacher.user.name || b.teacher.user.email}</td>
                      <td className="py-2 text-[#13A699]/70">{b.subject || "-"}</td>
                      <td className="py-2 text-[#13A699]/70">{b.date} {b.time}</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          b.status === "CONFIRMED" ? "bg-green-100 text-green-700" :
                          b.status === "PENDING" ? "bg-yellow-100 text-yellow-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-2">
                        {b.payment ? (
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            b.payment.status === "PAID" ? "bg-green-100 text-green-700" :
                            b.payment.status === "REFUNDED" ? "bg-purple-100 text-purple-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            ₹{b.payment.amount} - {b.payment.status}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">No payment</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Payments Tab */}
      {tab === "payments" && (
        <div className="bg-white rounded-2xl p-6 shadow-md border border-[#FFD708]/20">
          <h2 className="text-xl font-bold text-[#13A699] mb-4">Payment Management</h2>
          {payments.length === 0 ? (
            <p className="text-[#13A699]/50 text-sm">No payments yet.</p>
          ) : (
            <div className="space-y-4">
              {payments.map((p) => (
                <div key={p.id} className="border border-[#FFD708]/20 rounded-xl p-4">
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <p className="font-semibold text-[#13A699]">{p.user.name || p.user.email}</p>
                      <p className="text-sm text-[#13A699]/60">
                        Amount: ₹{p.amount} · Status: {p.status}
                        {p.refundStatus && ` · Refund: ${p.refundStatus}`}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Order: {p.razorpayOrderId} · Payment: {p.razorpayPaymentId || "N/A"}
                      </p>
                    </div>
                    {p.status === "PAID" && !p.refundStatus && (
                      <button
                        onClick={() => handleRefund(p.id)}
                        className="bg-purple-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-purple-600 transition"
                      >
                        Refund
                      </button>
                    )}
                    {p.refundStatus === "REFUNDED" && (
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                        Refunded
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add Teacher Tab */}
      {tab === "add-teacher" && (
        <form onSubmit={handleAddTeacher} className="bg-white rounded-2xl p-6 shadow-md border border-[#FFD708]/20">
          <h2 className="text-xl font-bold text-[#13A699] mb-4">Manual Teacher Entry</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#13A699] mb-1">Name</label>
                <input
                  value={newTeacher.name}
                  onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#13A699] mb-1">Email</label>
                <input
                  type="email"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699]"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#13A699] mb-1">Password</label>
              <input
                type="password"
                value={newTeacher.password}
                onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699]"
                placeholder="Default: teacher123"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#13A699] mb-1">Bio</label>
              <textarea
                value={newTeacher.bio}
                onChange={(e) => setNewTeacher({ ...newTeacher, bio: e.target.value })}
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699] resize-none"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#13A699] mb-1">Qualifications</label>
                <input
                  value={newTeacher.qualifications}
                  onChange={(e) => setNewTeacher({ ...newTeacher, qualifications: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#13A699] mb-1">Experience (yrs)</label>
                <input
                  type="number"
                  value={newTeacher.experience}
                  onChange={(e) => setNewTeacher({ ...newTeacher, experience: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#13A699] mb-1">Fees (₹/hr)</label>
                <input
                  type="number"
                  value={newTeacher.fees}
                  onChange={(e) => setNewTeacher({ ...newTeacher, fees: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#13A699] mb-1">Location</label>
              <input
                value={newTeacher.location}
                onChange={(e) => setNewTeacher({ ...newTeacher, location: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-[#FFD708]/30 focus:outline-none focus:border-[#13A699] bg-[#FFF7ED] text-[#13A699]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#13A699] mb-2">Subjects</label>
              <SubjectSelector
                selectedSubjects={addTeacherSubjects}
                onChange={setAddTeacherSubjects}
                mode="multi"
              />
              {addTeacherSubjects.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {addTeacherSubjects.map((s) => (
                    <span key={s} className="bg-[#13A699]/10 text-[#13A699] text-xs px-2 py-1 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FFD708] text-[#13A699] font-bold py-3 rounded-xl hover:bg-[#FFD708]/80 transition disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Teacher"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
