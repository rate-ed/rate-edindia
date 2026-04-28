const BASE = "http://localhost:3000";

describe("Rate-ED API Tests", () => {
  test("GET /api/teachers returns approved teachers", async () => {
    const res = await fetch(`${BASE}/api/teachers`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(3); // 3 approved teachers
    for (const teacher of data) {
      expect(teacher.approved).toBe(true);
      expect(teacher.user).toBeDefined();
      expect(teacher.user.name).toBeDefined();
    }
  });

  test("GET /api/teachers?subject=Coding filters correctly", async () => {
    const res = await fetch(`${BASE}/api/teachers?subject=Coding`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBeGreaterThan(0);
    for (const teacher of data) {
      expect(teacher.subjects).toContain("Coding");
    }
  });

  test("GET /api/teachers?location=Bandra filters by location", async () => {
    const res = await fetch(`${BASE}/api/teachers?location=Bandra`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBeGreaterThan(0);
    for (const teacher of data) {
      expect(teacher.location).toContain("Bandra");
    }
  });

  test("POST /api/register creates a new user", async () => {
    const email = `test_${Date.now()}@test.com`;
    const res = await fetch(`${BASE}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password: "test123456",
        name: "Test User",
        role: "PARENT",
      }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.email).toBe(email);
    expect(data.role).toBe("PARENT");
  });

  test("POST /api/register rejects duplicate email", async () => {
    const res = await fetch(`${BASE}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@rate-ed.com",
        password: "test123",
        name: "Duplicate",
        role: "PARENT",
      }),
    });
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("already");
  });

  test("POST /api/register with TEACHER role creates profile", async () => {
    const email = `teacher_${Date.now()}@test.com`;
    const res = await fetch(`${BASE}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password: "test123456",
        name: "New Teacher",
        role: "TEACHER",
      }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.role).toBe("TEACHER");
  });

  test("GET /api/bookings without auth returns 401", async () => {
    const res = await fetch(`${BASE}/api/bookings`);
    expect(res.status).toBe(401);
  });

  test("PUT /api/teachers without auth returns 401", async () => {
    const res = await fetch(`${BASE}/api/teachers`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bio: "test" }),
    });
    expect(res.status).toBe(401);
  });

  test("GET /api/availability returns data", async () => {
    const teachers = await fetch(`${BASE}/api/teachers`).then((r) => r.json());
    const teacherId = teachers[0]?.id;
    if (teacherId) {
      const res = await fetch(`${BASE}/api/availability?teacherId=${teacherId}`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    }
  });
});
