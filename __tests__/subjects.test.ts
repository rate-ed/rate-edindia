import { SUBJECT_HIERARCHY, getAllSubjects, flattenForSearch } from "../src/lib/subjects";

describe("Subject Hierarchy Tests", () => {
  test("has 5 top-level categories", () => {
    expect(SUBJECT_HIERARCHY.length).toBe(5);
    const names = SUBJECT_HIERARCHY.map((c) => c.name);
    expect(names).toContain("Career Skills");
    expect(names).toContain("Activities");
    expect(names).toContain("Sports");
    expect(names).toContain("Development & Wellness");
    expect(names).toContain("Hobbies");
  });

  test("Career Skills has correct subcategories", () => {
    const career = SUBJECT_HIERARCHY.find((c) => c.name === "Career Skills")!;
    expect(career.subcategories.length).toBe(5);
    const subNames = career.subcategories.map((s) => s.name);
    expect(subNames).toContain("Digital & Tech");
    expect(subNames).toContain("Creative & Media");
    expect(subNames).toContain("Business & Entrepreneurship");
    expect(subNames).toContain("Skilled Trades & Services");
    expect(subNames).toContain("Finance & Career Readiness");
  });

  test("Digital & Tech has correct items and age", () => {
    const career = SUBJECT_HIERARCHY.find((c) => c.name === "Career Skills")!;
    const digitalTech = career.subcategories.find((s) => s.name === "Digital & Tech")!;
    expect(digitalTech.minAge).toBe(9);
    expect(digitalTech.items.length).toBe(6);
    const itemNames = digitalTech.items.map((i) => i.name);
    expect(itemNames).toContain("Coding");
    expect(itemNames).toContain("App Dev");
    expect(itemNames).toContain("Web Dev");
    expect(itemNames).toContain("AI Tools");
    expect(itemNames).toContain("Data Analytics");
    expect(itemNames).toContain("Cybersecurity");
  });

  test("Activities Performing Arts has correct items", () => {
    const activities = SUBJECT_HIERARCHY.find((c) => c.name === "Activities")!;
    const performing = activities.subcategories.find((s) => s.name === "Performing Arts")!;
    expect(performing.minAge).toBe(5);
    const items = performing.items.map((i) => i.name);
    expect(items).toContain("Dance");
    expect(items).toContain("Singing");
    expect(items).toContain("Acting");
    expect(items).toContain("Instruments");
  });

  test("Sports has all subcategories", () => {
    const sports = SUBJECT_HIERARCHY.find((c) => c.name === "Sports")!;
    expect(sports.subcategories.length).toBe(4);
    const subNames = sports.subcategories.map((s) => s.name);
    expect(subNames).toContain("Team Sports");
    expect(subNames).toContain("Individual Sports");
    expect(subNames).toContain("Fitness & Discipline");
    expect(subNames).toContain("Niche Sports");
  });

  test("getAllSubjects returns unique subjects", () => {
    const subjects = getAllSubjects();
    expect(subjects.length).toBeGreaterThan(50);
    const uniqueCheck = new Set(subjects);
    expect(uniqueCheck.size).toBe(subjects.length);
  });

  test("flattenForSearch includes category path", () => {
    const flat = flattenForSearch();
    expect(flat.length).toBeGreaterThan(50);
    const codingEntry = flat.find((f) => f.subject === "Coding");
    expect(codingEntry).toBeDefined();
    expect(codingEntry!.category).toBe("Career Skills");
    expect(codingEntry!.subcategory).toBe("Digital & Tech");
    expect(codingEntry!.minAge).toBe(9);
  });

  test("Development & Wellness has correct structure", () => {
    const dev = SUBJECT_HIERARCHY.find((c) => c.name === "Development & Wellness")!;
    expect(dev.subcategories.length).toBe(3);
    const childDev = dev.subcategories.find((s) => s.name === "Child Development")!;
    expect(childDev.minAge).toBe(3);
    expect(childDev.items.map((i) => i.name)).toContain("Speech Therapy");
  });

  test("Hobbies has correct structure", () => {
    const hobbies = SUBJECT_HIERARCHY.find((c) => c.name === "Hobbies")!;
    expect(hobbies.subcategories.length).toBe(3);
    const exploration = hobbies.subcategories.find((s) => s.name === "Exploration")!;
    expect(exploration.minAge).toBe(8);
    expect(exploration.items.map((i) => i.name)).toContain("Language Learning");
  });
});
