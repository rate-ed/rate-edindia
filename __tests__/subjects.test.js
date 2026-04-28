// Test the subjects module via API instead since Jest needs TS config
const BASE = "http://localhost:3000";

// We'll test subject hierarchy by checking teacher filtering works
describe("Subject Hierarchy Integration Tests", () => {
  test("Can filter teachers by Career Skills subject (Coding)", async () => {
    const res = await fetch(`${BASE}/api/teachers?subject=Coding`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBeGreaterThan(0);
    data.forEach(t => expect(t.subjects).toContain("Coding"));
  });

  test("Can filter teachers by Activities subject (Dance)", async () => {
    const res = await fetch(`${BASE}/api/teachers?subject=Dance`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBeGreaterThan(0);
    data.forEach(t => expect(t.subjects).toContain("Dance"));
  });

  test("Can filter by Development subject (Speech Therapy)", async () => {
    const res = await fetch(`${BASE}/api/teachers?subject=Speech Therapy`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBeGreaterThan(0);
    data.forEach(t => expect(t.subjects).toContain("Speech Therapy"));
  });

  test("Nonexistent subject returns empty", async () => {
    const res = await fetch(`${BASE}/api/teachers?subject=FakeSubject123`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBe(0);
  });

  test("Search query finds teachers across subjects", async () => {
    const res = await fetch(`${BASE}/api/teachers?q=Coding`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBeGreaterThan(0);
  });

  test("Location filter works for  areas", async () => {
    const res = await fetch(`${BASE}/api/teachers?location=Powai`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.length).toBeGreaterThan(0);
    data.forEach(t => expect(t.location).toContain("Powai"));
  });
});
