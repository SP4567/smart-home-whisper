
import React, { createContext, useState, useContext, useEffect } from 'react';
import { TimeTableEntry, StudyResource, studyResources, sampleTimetable, commonResponses, routineActivities } from '@/data/study-data';

interface StudyAssistantContextType {
  messages: ChatMessage[];
  addMessage: (message: string, role: 'user' | 'assistant') => void;
  sendMessage: (message: string) => void;
  timetable: TimeTableEntry[];
  generateTimetable: () => void;
  recommendResources: (subject?: string, count?: number) => StudyResource[];
  isGeneratingResponse: boolean;
  clearMessages: () => void;
  markTimetableItemComplete: (id: string, completed: boolean) => void;
  dailyRoutine: TimeTableEntry[];
  generateDailyRoutine: (wakeUpTime?: string, sleepTime?: string) => void;
  personalizeDailyRoutine: (preferences: RoutinePreferences) => void;
  routinePreferences: RoutinePreferences;
}

export interface RoutinePreferences {
  wakeUpTime: string;
  sleepTime: string;
  exerciseDuration: number;
  studyHoursPerDay: number;
  includeHobbies: boolean;
  mealTimes: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const StudyAssistantContext = createContext<StudyAssistantContextType | undefined>(undefined);

export const StudyAssistantProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: commonResponses.greeting,
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [timetable, setTimetable] = useState<TimeTableEntry[]>(sampleTimetable);
  const [dailyRoutine, setDailyRoutine] = useState<TimeTableEntry[]>([]);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);
  const [routinePreferences, setRoutinePreferences] = useState<RoutinePreferences>({
    wakeUpTime: '07:00',
    sleepTime: '23:00',
    exerciseDuration: 45,
    studyHoursPerDay: 4,
    includeHobbies: true,
    mealTimes: {
      breakfast: '08:00',
      lunch: '13:00',
      dinner: '19:00'
    }
  });

  const addMessage = (content: string, role: 'user' | 'assistant') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const processCommand = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    // Daily routine generation request
    if (lowerText.includes("routine") || lowerText.includes("daily schedule")) {
      generateDailyRoutine();
      return commonResponses.routineGeneration + " You can check it out in the routine tab.";
    }
    
    // Timetable generation request
    if (lowerText.includes("timetable") || lowerText.includes("schedule")) {
      generateTimetable();
      return "I've generated a new study timetable for today. You can view it in the timetable section.";
    }
    
    // Video recommendations
    if (lowerText.includes("video") || lowerText.includes("watch")) {
      const subject = extractSubject(lowerText);
      const videos = recommendResources(subject, 3).filter(r => r.type === 'video');
      
      if (videos.length === 0) {
        return `I couldn't find any videos on ${subject || 'that topic'}. Would you like recommendations on a different subject?`;
      }
      
      let response = `Here are some ${subject ? subject + ' ' : ''}video recommendations:\n\n`;
      videos.forEach(video => {
        response += `- ${video.title}: ${video.description} (${video.duration} mins)\n`;
      });
      
      return response;
    }
    
    // Study tips
    if (lowerText.includes("tip") || lowerText.includes("advice") || lowerText.includes("help")) {
      const randomTip = commonResponses.studyTips[Math.floor(Math.random() * commonResponses.studyTips.length)];
      return `Study Tip: ${randomTip}`;
    }
    
    // General subject question
    if (lowerText.includes("recommend") || lowerText.includes("suggestion")) {
      const subject = extractSubject(lowerText);
      const resources = recommendResources(subject, 2);
      
      if (resources.length === 0) {
        return `I couldn't find any resources on ${subject || 'that topic'}. Would you like recommendations on a different subject?`;
      }
      
      let response = `Here are some recommended resources on ${subject || 'various topics'}:\n\n`;
      resources.forEach(resource => {
        response += `- ${resource.title} (${resource.type}): ${resource.description}\n`;
      });
      
      return response;
    }
    
    // Fallback response
    if (lowerText.includes("hello") || lowerText.includes("hi")) {
      return "Hello! I'm your Study Assistant. I can help you with study recommendations, create timetables, generate daily routines, and answer questions about your studies. What would you like help with today?";
    }
    
    return "I'm here to help with your studies. You can ask me to generate a timetable, daily routine, recommend study resources, provide study tips, or answer questions about your subjects.";
  };

  const sendMessage = (message: string) => {
    addMessage(message, 'user');
    setIsGeneratingResponse(true);
    
    // Simulate AI processing delay
    setTimeout(() => {
      const response = processCommand(message);
      addMessage(response, 'assistant');
      setIsGeneratingResponse(false);
    }, 1000);
  };

  const extractSubject = (text: string): string | undefined => {
    const subjects = ['math', 'mathematics', 'calculus', 'physics', 'chemistry', 'biology', 
                     'history', 'literature', 'english', 'computer science', 'programming'];
    
    for (const subject of subjects) {
      if (text.toLowerCase().includes(subject)) {
        return subject.charAt(0).toUpperCase() + subject.slice(1);
      }
    }
    return undefined;
  };

  const recommendResources = (subject?: string, count: number = 3): StudyResource[] => {
    let filteredResources = [...studyResources];
    
    if (subject) {
      filteredResources = filteredResources.filter(
        r => r.subject.toLowerCase().includes(subject.toLowerCase()) || 
             r.tags.some(tag => tag.toLowerCase().includes(subject.toLowerCase()))
      );
    }
    
    // Shuffle array for randomness
    filteredResources.sort(() => Math.random() - 0.5);
    
    return filteredResources.slice(0, count);
  };

  const generateTimetable = () => {
    // This is a simplified timetable generator
    // In a real application, you would want to consider 
    // user preferences, study habits, subjects, etc.
    
    const newTimetable: TimeTableEntry[] = [];
    const startHour = 8; // 8 AM
    const endHour = 20; // 8 PM
    const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Literature', 'History'];
    
    let currentHour = startHour;
    let entryId = 1;
    
    while (currentHour < endHour) {
      // Add a study session (1.5 hours)
      if (currentHour !== 12) { // Skip noon for lunch
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const duration = Math.random() > 0.3 ? 1.5 : 1; // Most sessions are 1.5 hours, some are 1 hour
        
        newTimetable.push({
          id: entryId.toString(),
          title: `Study: ${subject}`,
          startTime: `${currentHour.toString().padStart(2, '0')}:00`,
          endTime: `${(currentHour + duration).toString().padStart(2, '0')}:${duration === 1.5 ? '30' : '00'}`,
          subject: subject,
          type: 'study',
          description: `Focus on ${subject} concepts and practice problems`,
          completed: false
        });
        
        entryId++;
        currentHour += duration;
      }
      
      // Add a break or meal
      if (currentHour === 12) {
        // Lunch break
        newTimetable.push({
          id: entryId.toString(),
          title: 'Lunch Break',
          startTime: '12:00',
          endTime: '13:00',
          type: 'meal',
          completed: false
        });
        entryId++;
        currentHour += 1;
      } else {
        // Regular break
        const breakDuration = 0.5; // 30 minutes
        
        newTimetable.push({
          id: entryId.toString(),
          title: 'Break',
          startTime: `${currentHour.toString().padStart(2, '0')}:${currentHour % 1 === 0.5 ? '30' : '00'}`,
          endTime: `${(currentHour + breakDuration).toString().padStart(2, '0')}:${(currentHour + breakDuration) % 1 === 0.5 ? '30' : '00'}`,
          type: 'break',
          description: 'Rest, hydrate, and refresh your mind',
          completed: false
        });
        
        entryId++;
        currentHour += breakDuration;
      }
    }
    
    setTimetable(newTimetable);
  };

  // Generate a daily routine based on preferences
  const generateDailyRoutine = (wakeUpTime = routinePreferences.wakeUpTime, sleepTime = routinePreferences.sleepTime) => {
    const newRoutine: TimeTableEntry[] = [];
    let entryId = 1;
    
    // Parse wake up and sleep times
    const wakeHour = parseInt(wakeUpTime.split(':')[0]);
    const wakeMinute = parseInt(wakeUpTime.split(':')[1]);
    const sleepHour = parseInt(sleepTime.split(':')[0]);
    const sleepMinute = parseInt(sleepTime.split(':')[1]);
    
    // Calculate available hours
    let currentHour = wakeHour;
    let currentMinute = wakeMinute;
    
    // Morning routine
    newRoutine.push({
      id: entryId.toString(),
      title: 'Wake Up & Morning Routine',
      startTime: formatTime(currentHour, currentMinute),
      endTime: formatTime(currentHour, currentMinute + 30),
      type: 'routine',
      description: 'Brush teeth, wash face, get ready for the day',
      completed: false
    });
    
    // Advance time by 30 minutes
    currentMinute += 30;
    if (currentMinute >= 60) {
      currentHour += 1;
      currentMinute -= 60;
    }
    entryId++;
    
    // Breakfast
    newRoutine.push({
      id: entryId.toString(),
      title: 'Breakfast',
      startTime: formatTime(currentHour, currentMinute),
      endTime: formatTime(currentHour, currentMinute + 30),
      type: 'meal',
      description: 'Eat a nutritious breakfast',
      completed: false
    });
    
    // Advance time by 30 minutes
    currentMinute += 30;
    if (currentMinute >= 60) {
      currentHour += 1;
      currentMinute -= 60;
    }
    entryId++;
    
    // Morning study session
    newRoutine.push({
      id: entryId.toString(),
      title: 'Morning Study Session',
      startTime: formatTime(currentHour, currentMinute),
      endTime: formatTime(currentHour + 2, currentMinute),
      subject: 'Priority Subject',
      type: 'study',
      description: 'Focus on your most challenging subject when your mind is fresh',
      completed: false
    });
    
    // Advance time by 2 hours
    currentHour += 2;
    entryId++;
    
    // Short break
    newRoutine.push({
      id: entryId.toString(),
      title: 'Short Break',
      startTime: formatTime(currentHour, currentMinute),
      endTime: formatTime(currentHour, currentMinute + 15),
      type: 'break',
      description: 'Take a short break to refresh',
      completed: false
    });
    
    // Advance time by 15 minutes
    currentMinute += 15;
    if (currentMinute >= 60) {
      currentHour += 1;
      currentMinute -= 60;
    }
    entryId++;
    
    // Calculate lunch time (around 1pm if possible)
    let lunchHour = 13;
    let lunchMinute = 0;
    
    // If we're already past 1pm, set lunch to current time
    if (currentHour > lunchHour || (currentHour === lunchHour && currentMinute > 0)) {
      lunchHour = currentHour;
      lunchMinute = currentMinute;
    }
    
    // If we're before 1pm, add another study session
    if (currentHour < lunchHour || (currentHour === lunchHour && currentMinute === 0)) {
      // Mid-morning study session
      newRoutine.push({
        id: entryId.toString(),
        title: 'Mid-morning Study Session',
        startTime: formatTime(currentHour, currentMinute),
        endTime: formatTime(lunchHour, 0),
        subject: 'Secondary Subject',
        type: 'study',
        description: 'Work on your second priority subject',
        completed: false
      });
      entryId++;
    }
    
    // Lunch
    newRoutine.push({
      id: entryId.toString(),
      title: 'Lunch Break',
      startTime: formatTime(lunchHour, lunchMinute),
      endTime: formatTime(lunchHour, lunchMinute + 45),
      type: 'meal',
      description: 'Take time to eat a balanced lunch and rest',
      completed: false
    });
    
    // Update current time to after lunch
    currentHour = lunchHour;
    currentMinute = lunchMinute + 45;
    if (currentMinute >= 60) {
      currentHour += 1;
      currentMinute -= 60;
    }
    entryId++;
    
    // Afternoon exercise
    newRoutine.push({
      id: entryId.toString(),
      title: 'Exercise',
      startTime: formatTime(currentHour, currentMinute),
      endTime: formatTime(currentHour, currentMinute + routinePreferences.exerciseDuration),
      type: 'exercise',
      description: 'Physical activity to boost energy and focus',
      completed: false
    });
    
    // Advance time
    currentMinute += routinePreferences.exerciseDuration;
    while (currentMinute >= 60) {
      currentHour += 1;
      currentMinute -= 60;
    }
    entryId++;
    
    // Afternoon study session
    newRoutine.push({
      id: entryId.toString(),
      title: 'Afternoon Study Session',
      startTime: formatTime(currentHour, currentMinute),
      endTime: formatTime(currentHour + 1, currentMinute + 30),
      subject: 'Review Subject',
      type: 'study',
      description: 'Review material from previous sessions',
      completed: false
    });
    
    // Advance time by 1.5 hours
    currentHour += 1;
    currentMinute += 30;
    while (currentMinute >= 60) {
      currentHour += 1;
      currentMinute -= 60;
    }
    entryId++;
    
    // Break time
    newRoutine.push({
      id: entryId.toString(),
      title: 'Afternoon Break',
      startTime: formatTime(currentHour, currentMinute),
      endTime: formatTime(currentHour, currentMinute + 30),
      type: 'break',
      description: 'Take a refreshing break, maybe have a snack',
      completed: false
    });
    
    // Advance time by 30 minutes
    currentMinute += 30;
    if (currentMinute >= 60) {
      currentHour += 1;
      currentMinute -= 60;
    }
    entryId++;
    
    // Optional hobby time if enabled
    if (routinePreferences.includeHobbies) {
      newRoutine.push({
        id: entryId.toString(),
        title: 'Hobby/Free Time',
        startTime: formatTime(currentHour, currentMinute),
        endTime: formatTime(currentHour + 1, currentMinute),
        type: 'other',
        description: 'Engage in a hobby or activity you enjoy',
        completed: false
      });
      
      // Advance time by 1 hour
      currentHour += 1;
      entryId++;
    }
    
    // Calculate dinner time (around 7pm)
    const dinnerHour = parseInt(routinePreferences.mealTimes.dinner.split(':')[0]);
    const dinnerMinute = parseInt(routinePreferences.mealTimes.dinner.split(':')[1]);
    
    // If we're already past dinner time, set dinner to current time
    let actualDinnerHour = dinnerHour;
    let actualDinnerMinute = dinnerMinute;
    
    if (currentHour > dinnerHour || (currentHour === dinnerHour && currentMinute > dinnerMinute)) {
      actualDinnerHour = currentHour;
      actualDinnerMinute = currentMinute;
    }
    
    // If we're before dinner time, add another study session
    if (currentHour < dinnerHour || (currentHour === dinnerHour && currentMinute < dinnerMinute)) {
      // Evening study session
      newRoutine.push({
        id: entryId.toString(),
        title: 'Evening Study Session',
        startTime: formatTime(currentHour, currentMinute),
        endTime: formatTime(dinnerHour, dinnerMinute),
        subject: 'Light Review',
        type: 'study',
        description: 'Light review or easier subject',
        completed: false
      });
      entryId++;
    }
    
    // Dinner
    newRoutine.push({
      id: entryId.toString(),
      title: 'Dinner',
      startTime: formatTime(actualDinnerHour, actualDinnerMinute),
      endTime: formatTime(actualDinnerHour, actualDinnerMinute + 45),
      type: 'meal',
      description: 'Enjoy a balanced dinner',
      completed: false
    });
    
    // Update current time
    currentHour = actualDinnerHour;
    currentMinute = actualDinnerMinute + 45;
    if (currentMinute >= 60) {
      currentHour += 1;
      currentMinute -= 60;
    }
    entryId++;
    
    // Evening relaxation
    newRoutine.push({
      id: entryId.toString(),
      title: 'Evening Relaxation',
      startTime: formatTime(currentHour, currentMinute),
      endTime: formatTime(currentHour + 1, currentMinute),
      type: 'other',
      description: 'Relax and wind down for the day',
      completed: false
    });
    
    // Advance time by 1 hour
    currentHour += 1;
    entryId++;
    
    // Pre-sleep routine
    newRoutine.push({
      id: entryId.toString(),
      title: 'Pre-Sleep Routine',
      startTime: formatTime(sleepHour - 1, sleepMinute),
      endTime: formatTime(sleepHour, sleepMinute),
      type: 'routine',
      description: 'Prepare for bed, brush teeth, read a book',
      completed: false
    });
    entryId++;
    
    // Sleep time
    newRoutine.push({
      id: entryId.toString(),
      title: 'Sleep',
      startTime: formatTime(sleepHour, sleepMinute),
      endTime: formatTime(wakeHour, wakeMinute, true),
      type: 'other',
      description: 'Get restful sleep',
      completed: false
    });
    
    setDailyRoutine(newRoutine);
  };
  
  // Format time helper
  const formatTime = (hour: number, minute: number, nextDay = false): string => {
    const adjustedHour = hour >= 24 ? hour - 24 : hour;
    return `${adjustedHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}${nextDay ? ' (next day)' : ''}`;
  };

  // Update routine preferences
  const personalizeDailyRoutine = (preferences: RoutinePreferences) => {
    setRoutinePreferences(preferences);
    generateDailyRoutine(preferences.wakeUpTime, preferences.sleepTime);
  };

  const clearMessages = () => {
    setMessages([{
      id: '1',
      content: commonResponses.greeting,
      role: 'assistant',
      timestamp: new Date()
    }]);
  };

  const markTimetableItemComplete = (id: string, completed: boolean) => {
    setTimetable(prev => 
      prev.map(item => 
        item.id === id ? { ...item, completed } : item
      )
    );
  };

  // Generate an initial daily routine when first loaded
  useEffect(() => {
    generateDailyRoutine();
  }, []);

  return (
    <StudyAssistantContext.Provider
      value={{
        messages,
        addMessage,
        sendMessage,
        timetable,
        generateTimetable,
        recommendResources,
        isGeneratingResponse,
        clearMessages,
        markTimetableItemComplete,
        dailyRoutine,
        generateDailyRoutine,
        personalizeDailyRoutine,
        routinePreferences
      }}
    >
      {children}
    </StudyAssistantContext.Provider>
  );
};

export const useStudyAssistant = () => {
  const context = useContext(StudyAssistantContext);
  if (context === undefined) {
    throw new Error('useStudyAssistant must be used within a StudyAssistantProvider');
  }
  return context;
};
