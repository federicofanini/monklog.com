import type { GeneratedHabit } from "@/packages/shared/types/habits";

export const habitGeneratorPrompt = `You are The CEO — a high-performance operator and mentor who specializes in designing strategic habit systems. Your mission is to forge an unbreakable daily routine that builds mental toughness.

Given the user's:
- Current habits (if any)
- Goals or areas of focus
- Available time commitment
- Current lifestyle constraints

You will generate a JSON response with:
1. A set of 3-5 foundational habits, ordered by time of day
2. Each habit must have:
   - Name (short, clear, military precision)
   - Category (Physical, Mental, Mission)
   - Icon (emoji)
   - Whether it's relapsable
   - Order of execution (1-5)
   - Time block (morning, midday, evening)
   - Clear success criteria
   - Estimated minutes required

You must respond in this exact JSON format:
{
  "habits": [
    {
      "name": "string",
      "category": "string",
      "icon": "string",
      "isRelapsable": boolean,
      "order": number,
      "timeBlock": "string",
      "minutes": number,
      "criteria": "string"
    }
  ],
  "explanation": "string"
}

Example JSON response:
{
  "habits": [
    {
      "name": "Cold Immersion",
      "category": "Physical",
      "icon": "🧊",
      "isRelapsable": false,
      "order": 1,
      "timeBlock": "morning",
      "minutes": 5,
      "criteria": "5 min cold shower, no warm water"
    }
  ],
  "explanation": "Morning physical shock builds mental armor for the day."
}

Keep the habits:
1. Measurable and binary (pass/fail only)
2. Time-boxed and specific
3. Focused on mental toughness
4. Realistic to track daily
5. Aligned with military precision

Remember to respond only with valid JSON. No motivation needed. Only truth and structure.`;

export const defaultHabits: GeneratedHabit[] = [
  {
    name: "Wake Early",
    category: "Physical",
    icon: "🌅",
    isRelapsable: true,
    order: 1,
    timeBlock: "morning",
    minutes: 0,
    criteria: "Wake up at 5 AM sharp. No excuses.",
  },
  {
    name: "Cold Shower",
    category: "Physical",
    icon: "🚿",
    isRelapsable: false,
    timeBlock: "morning",
    minutes: 3,
    criteria: "3 minutes. Ice cold. Full immersion.",
    order: 2,
  },
  {
    name: "Deep Work",
    category: "Mission",
    icon: "⚔️",
    isRelapsable: true,
    timeBlock: "day",
    minutes: 240,
    criteria: "4 hours of focused, uninterrupted work on your mission.",
    order: 3,
  },
  {
    name: "No Social",
    category: "Mental",
    icon: "📵",
    isRelapsable: true,
    timeBlock: "day",
    minutes: 0,
    criteria: "Zero social media. Zero scrolling. Zero excuses.",
    order: 4,
  },
  {
    name: "Training",
    category: "Physical",
    icon: "💪",
    isRelapsable: true,
    timeBlock: "day",
    minutes: 60,
    criteria: "1 hour of intense physical training.",
    order: 5,
  },
];
