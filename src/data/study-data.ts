
export interface StudyResource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'book' | 'exercise';
  url: string;
  subject: string;
  duration?: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
}

export interface TimeTableEntry {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  subject?: string;
  type: 'study' | 'break' | 'exercise' | 'meal' | 'other' | 'routine';
  description?: string;
  completed: boolean;
}

export interface StudySession {
  id: string;
  subject: string;
  duration: number; // in minutes
  date: Date;
  progress: number; // 0-100
  notes: string[];
}

// Mock study resources
export const studyResources: StudyResource[] = [
  {
    id: '1',
    title: 'Introduction to Calculus',
    description: 'Learn the fundamentals of calculus with this comprehensive video.',
    type: 'video',
    url: 'https://example.com/calculus-intro',
    subject: 'Mathematics',
    duration: 45,
    difficulty: 'beginner',
    tags: ['calculus', 'math', 'introduction']
  },
  {
    id: '2',
    title: 'Advanced Physics Concepts',
    description: 'Explore complex physics theories and applications.',
    type: 'video',
    url: 'https://example.com/advanced-physics',
    subject: 'Physics',
    duration: 60,
    difficulty: 'advanced',
    tags: ['physics', 'quantum', 'advanced']
  },
  {
    id: '3',
    title: 'Organic Chemistry Basics',
    description: 'A comprehensive guide to organic chemistry fundamentals.',
    type: 'article',
    url: 'https://example.com/organic-chemistry',
    subject: 'Chemistry',
    difficulty: 'intermediate',
    tags: ['chemistry', 'organic', 'molecules']
  },
  {
    id: '4',
    title: 'Programming with Python',
    description: 'Learn Python programming from scratch.',
    type: 'video',
    url: 'https://example.com/python-basics',
    subject: 'Computer Science',
    duration: 90,
    difficulty: 'beginner',
    tags: ['python', 'programming', 'coding']
  },
  {
    id: '5',
    title: 'World History: Ancient Civilizations',
    description: 'Explore the wonders of ancient civilizations around the world.',
    type: 'book',
    url: 'https://example.com/ancient-civilizations',
    subject: 'History',
    difficulty: 'intermediate',
    tags: ['history', 'ancient', 'civilizations']
  }
];

// Sample timetable entries
export const sampleTimetable: TimeTableEntry[] = [
  {
    id: '1',
    title: 'Morning Study: Mathematics',
    startTime: '08:00',
    endTime: '09:30',
    subject: 'Mathematics',
    type: 'study',
    description: 'Focus on calculus problems',
    completed: false
  },
  {
    id: '2',
    title: 'Break',
    startTime: '09:30',
    endTime: '10:00',
    type: 'break',
    completed: false
  },
  {
    id: '3',
    title: 'Physics Review',
    startTime: '10:00',
    endTime: '11:30',
    subject: 'Physics',
    type: 'study',
    description: 'Review chapter 5 and solve problems',
    completed: false
  },
  {
    id: '4',
    title: 'Lunch',
    startTime: '12:00',
    endTime: '13:00',
    type: 'meal',
    completed: false
  },
  {
    id: '5',
    title: 'Computer Science Practice',
    startTime: '13:30',
    endTime: '15:00',
    subject: 'Computer Science',
    type: 'study',
    description: 'Coding exercises and problem solving',
    completed: false
  }
];

// Sample routine activities
export const routineActivities = [
  { id: 'wake', title: 'Wake Up', duration: 15, importance: 'high', category: 'personal' },
  { id: 'breakfast', title: 'Breakfast', duration: 30, importance: 'high', category: 'meal' },
  { id: 'exercise', title: 'Exercise', duration: 45, importance: 'high', category: 'health' },
  { id: 'shower', title: 'Shower & Get Ready', duration: 30, importance: 'high', category: 'personal' },
  { id: 'study', title: 'Study Session', duration: 90, importance: 'high', category: 'academic' },
  { id: 'lunch', title: 'Lunch', duration: 45, importance: 'high', category: 'meal' },
  { id: 'break', title: 'Short Break', duration: 15, importance: 'medium', category: 'rest' },
  { id: 'hobby', title: 'Hobby Time', duration: 60, importance: 'medium', category: 'personal' },
  { id: 'dinner', title: 'Dinner', duration: 45, importance: 'high', category: 'meal' },
  { id: 'relaxation', title: 'Relaxation', duration: 60, importance: 'medium', category: 'rest' },
  { id: 'sleep', title: 'Sleep', duration: 480, importance: 'high', category: 'health' }
];

// Sample responses for common questions
export const commonResponses = {
  greeting: "Hello! I'm your Study Assistant. How can I help you today?",
  notUnderstood: "I'm sorry, I didn't understand that. Could you please rephrase your question?",
  subjectRecommendation: "Based on your schedule, I recommend focusing on {subject} today.",
  studyTips: [
    "Try the Pomodoro technique: 25 minutes of focused study followed by a 5-minute break.",
    "Review your notes within 24 hours of learning new material to improve retention.",
    "Teach concepts to someone else (or even an imaginary person) to solidify your understanding.",
    "Create mind maps to connect ideas and improve recall.",
    "Take short breaks every 45-60 minutes to maintain focus and energy.",
    "Stay hydrated and maintain a healthy diet to support brain function.",
    "Get adequate sleep to consolidate memory and improve learning.",
    "Try different study environments to find what works best for you."
  ],
  routineGeneration: "I've generated a personalized daily routine for you based on best practices for productivity and well-being.",
  routineTips: [
    "Consistency is key - try to follow a similar schedule each day.",
    "Block time for deep work when you're most productive.",
    "Include buffer time between activities to avoid feeling rushed.",
    "Make sure to include enough time for sleep and rest.",
    "Balance academic, social, and personal activities for better well-being."
  ]
};
