export interface SubjectItem {
  name: string;
  minAge: number;
}

export interface SubCategory {
  name: string;
  minAge: number;
  items: SubjectItem[];
}

export interface Category {
  name: string;
  subcategories: SubCategory[];
}

export const SUBJECT_HIERARCHY: Category[] = [
  {
    name: "Career Skills (Digital & Tech)",
    subcategories: [
      {
        name: "Skill Examples",
        minAge: 9,
        items: [
          { name: "Coding", minAge: 9 },
          { name: "Robotics", minAge: 9 },
          { name: "Lego Robotics", minAge: 9 },
          { name: "Electronics", minAge: 9 },
          { name: "3D printing", minAge: 9 },
          { name: "App Dev", minAge: 9 },
          { name: "Web Dev", minAge: 9 },
          { name: "AI Tools", minAge: 9 },
          { name: "Data Analytics", minAge: 9 },
          { name: "Cybersecurity", minAge: 9 },
        ],
      }
    ],
  },
  {
    name: "Career Skills (Creative & Media)",
    subcategories: [
      {
        name: "Skill Examples",
        minAge: 12,
        items: [
          { name: "Graphic Design", minAge: 12 },
          { name: "UI/UX", minAge: 12 },
          { name: "Video Editing", minAge: 12 },
          { name: "Photography", minAge: 12 },
          { name: "Animation", minAge: 12 },
          { name: "Podcasting", minAge: 12 },
        ],
      }
    ],
  },
  {
    name: "Career Skills (Business & Entrepreneurship)",
    subcategories: [
      {
        name: "Skill Examples",
        minAge: 13,
        items: [
          { name: "Freelancing", minAge: 13 },
          { name: "Startup Basics", minAge: 13 },
          { name: "E-commerce", minAge: 13 },
          { name: "Digital Marketing", minAge: 13 },
        ],
      }
    ],
  },
  {
    name: "Career Skills (Skilled Trades & Services)",
    subcategories: [
      {
        name: "Skill Examples",
        minAge: 10,
        items: [
          { name: "Baking", minAge: 10 },
          { name: "Makeup", minAge: 10 },
          { name: "Fashion Design", minAge: 10 },
          { name: "Interior Basics", minAge: 10 },
          { name: "Event Planning", minAge: 10 },
        ],
      }
    ],
  },
  {
    name: "Career Skills (Finance & Career Readiness)",
    subcategories: [
      {
        name: "Skill Examples",
        minAge: 15,
        items: [
          { name: "Personal Finance", minAge: 15 },
          { name: "Stock Basics", minAge: 15 },
          { name: "Resume", minAge: 15 },
          { name: "Interview Skills", minAge: 15 },
        ],
      }
    ],
  },
  {
    name: "Activities (Communication & Personality)",
    subcategories: [
      {
        name: "Skill Examples",
        minAge: 6,
        items: [
          { name: "Public Speaking", minAge: 6 },
          { name: "Debate", minAge: 6 },
          { name: "Storytelling", minAge: 6 },
          { name: "Leadership", minAge: 6 },
        ],
      }
    ],
  },
  {
    name: "Activities (Performing Arts)",
    subcategories: [
      {
        name: "Skill Examples",
        minAge: 5,
        items: [
          { name: "Dance", minAge: 5 },
          { name: "Singing", minAge: 5 },
          { name: "Acting", minAge: 5 },
          { name: "Instruments", minAge: 5 },
        ],
      }
    ],
  },
  {
    name: "Activities (Creative Arts)",
    subcategories: [
      {
        name: "Skill Examples",
        minAge: 5,
        items: [
          { name: "Drawing", minAge: 5 },
          { name: "Painting", minAge: 5 },
          { name: "Digital Art", minAge: 5 },
          { name: "DIY Crafts", minAge: 5 },
        ],
      }
    ],
  },
  {
    name: "Activities (Cognitive & Enrichment)",
    subcategories: [
      {
        name: "Skill Examples",
        minAge: 6,
        items: [
          { name: "Chess", minAge: 6 },
          { name: "Abacus", minAge: 6 },
          { name: "Memory Training", minAge: 6 },
          { name: "Writing", minAge: 6 },
        ],
      }
    ],
  },
  {
    name: "Activities (Life Skills)",
    subcategories: [
      {
        name: "Skill Examples",
        minAge: 8,
        items: [
          { name: "Time Management", minAge: 8 },
          { name: "Emotional Intelligence", minAge: 8 },
          { name: "Etiquette", minAge: 8 },
        ],
      }
    ],
  },
  {
    name: "Sports (Team Sports)",
    subcategories: [
      {
        name: "Skill Examples",
        minAge: 6,
        items: [
          { name: "Football", minAge: 6 },
          { name: "Cricket", minAge: 6 },
          { name: "Basketball", minAge: 6 },
          { name: "Volleyball", minAge: 6 },
        ],
      }
    ],
  },
  {
    name: "Sports (Individual Sports)",
    subcategories: [
      {
        name: "Skill Examples",
        minAge: 6,
        items: [
          { name: "Tennis", minAge: 6 },
          { name: "Badminton", minAge: 6 },
          { name: "Swimming", minAge: 6 },
          { name: "Athletics", minAge: 6 },
        ],
      }
    ],
  },
  {
    name: "Sports (Fitness & Discipline)",
    subcategories: [
      {
        name: "Skill Examples",
        minAge: 8,
        items: [
          { name: "Martial Arts", minAge: 8 },
          { name: "Yoga", minAge: 8 },
          { name: "Gym Training", minAge: 8 },
        ],
      }
    ],
  },
  {
    name: "Sports (Niche Sports)",
    subcategories: [
      {
        name: "Skill Examples",
        minAge: 10,
        items: [
          { name: "Golf", minAge: 10 },
          { name: "Squash", minAge: 10 },
          { name: "Archery", minAge: 10 },
          { name: "Shooting", minAge: 10 },
        ],
      }
    ],
  },
  {
    name: "Development & Wellness (Child Development)",
    subcategories: [
      {
        name: "Skill Examples",
        minAge: 3,
        items: [
          { name: "Speech Therapy", minAge: 3 },
          { name: "Occupational Therapy", minAge: 3 },
          { name: "Special Education", minAge: 3 },
        ],
      }
    ],
  },
  {
    name: "Development & Wellness (Mental Wellness)",
    subcategories: [
      {
        name: "Skill Examples",
        minAge: 12,
        items: [
          { name: "Counseling", minAge: 12 },
          { name: "Stress Management", minAge: 12 },
          { name: "Anxiety", minAge: 12 },
          { name: "Support", minAge: 12 },
        ],
      }
    ],
  },
  {
    name: "Development & Wellness (Special Needs Support)",
    subcategories: [
      {
        name: "Skill Examples",
        minAge: 3,
        items: [
          { name: "Autism Support", minAge: 3 },
          { name: "Learning Disabilities", minAge: 3 },
        ],
      }
    ],
  },
  {
    name: "Hobbies (Hobby Skills)",
    subcategories: [
      {
        name: "Skill Examples",
        minAge: 5,
        items: [
          { name: "Gardening", minAge: 5 },
          { name: "DIY Crafts", minAge: 5 },
          { name: "Casual Photography", minAge: 5 },
        ],
      }
    ],
  },
  {
    name: "Hobbies (Lifestyle Skills)",
    subcategories: [
      {
        name: "Skill Examples",
        minAge: 8,
        items: [
          { name: "Cooking", minAge: 8 },
          { name: "Baking", minAge: 8 },
          { name: "Home Organization", minAge: 8 },
        ],
      }
    ],
  },
  {
    name: "Hobbies (Exploration)",
    subcategories: [
      {
        name: "Skill Examples",
        minAge: 8,
        items: [
          { name: "Language Learning", minAge: 8 },
          { name: "Travel Skills", minAge: 8 },
        ],
      }
    ],
  },
  {
    name: "Academics",
    subcategories: [
      {
        name: "General Academics",
        minAge: 3,
        items: [
          { name: "all subjects", minAge: 3 },
          { name: "languages", minAge: 3 },
          { name: "hindi", minAge: 3 },
          { name: "marathi", minAge: 3 },
          { name: "english", minAge: 3 },
          { name: "math", minAge: 3 },
          { name: "science", minAge: 3 },
        ],
      },
    ],
  },
];

export function getAllSubjects(): string[] {
  const subjects: string[] = [];
  for (const cat of SUBJECT_HIERARCHY) {
    for (const sub of cat.subcategories) {
      for (const item of sub.items) {
        if (!subjects.includes(item.name)) {
          subjects.push(item.name);
        }
      }
    }
  }
  return subjects;
}

export function flattenForSearch(): Array<{
  category: string;
  subcategory: string;
  subject: string;
  minAge: number;
}> {
  const result: Array<{
    category: string;
    subcategory: string;
    subject: string;
    minAge: number;
  }> = [];
  for (const cat of SUBJECT_HIERARCHY) {
    for (const sub of cat.subcategories) {
      for (const item of sub.items) {
        result.push({
          category: cat.name,
          subcategory: sub.name,
          subject: item.name,
          minAge: item.minAge,
        });
      }
    }
  }
  return result;
}
