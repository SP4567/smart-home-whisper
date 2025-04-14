
import React, { createContext, useState, useContext, useEffect } from 'react';
import { TimeTableEntry, StudyResource, studyResources, sampleTimetable, commonResponses } from '@/data/study-data';

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
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);

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
      return "Hello! I'm your Study Assistant. I can help you with study recommendations, create timetables, and answer questions about your studies. What would you like help with today?";
    }
    
    return "I'm here to help with your studies. You can ask me to generate a timetable, recommend study resources, provide study tips, or answer questions about your subjects.";
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
        markTimetableItemComplete
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
