
import { useState, useRef, useEffect } from "react";
import { useStudyAssistant, RoutinePreferences } from "@/contexts/study-assistant-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Mic, 
  Send, 
  MicOff, 
  Book, 
  Calendar, 
  Video, 
  Clock, 
  Check, 
  GraduationCap,
  AlarmClock,
  Coffee,
  Utensils,
  Dumbbell,
  Moon,
  ListTodo
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function StudyAssistant() {
  const { 
    messages, 
    sendMessage, 
    isGeneratingResponse,
    timetable,
    generateTimetable,
    recommendResources,
    markTimetableItemComplete,
    dailyRoutine,
    generateDailyRoutine,
    personalizeDailyRoutine,
    routinePreferences
  } = useStudyAssistant();
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [routinePrefs, setRoutinePrefs] = useState<RoutinePreferences>(routinePreferences);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle message submission
  const handleSendMessage = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  // Handle routine preferences update
  const handleUpdateRoutinePreferences = () => {
    personalizeDailyRoutine(routinePrefs);
    toast({
      title: "Routine updated",
      description: "Your daily routine has been personalized based on your preferences."
    });
  };

  // Mock speech recognition
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      toast({
        title: "Voice recognition stopped",
      });
    } else {
      setIsListening(true);
      toast({
        title: "Listening...",
        description: "Voice recognition is not implemented in this demo.",
      });
      
      // Mock speech recognition after 2 seconds
      setTimeout(() => {
        setIsListening(false);
        const mockCommand = "Can you recommend some math videos?";
        setInput(mockCommand);
        
        // Auto-send the command after populating the input
        setTimeout(() => {
          sendMessage(mockCommand);
          setInput("");
        }, 500);
      }, 2000);
    }
  };

  // Get recommended videos for the sidebar
  const recommendedVideos = recommendResources(undefined, 3).filter(r => r.type === 'video');

  return (
    <div className="container mx-auto flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Study Assistant</h1>
        <p className="text-muted-foreground">Your AI companion for effective learning and daily planning.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Chat Area - Takes up 3 columns on large screens */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="chat">
                <GraduationCap className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="timetable">
                <Calendar className="h-4 w-4 mr-2" />
                Timetable
              </TabsTrigger>
              <TabsTrigger value="routine">
                <ListTodo className="h-4 w-4 mr-2" />
                Daily Routine
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat">
              <Card className="flex h-[calc(100vh-220px)] flex-col">
                <CardHeader className="pb-3">
                  <CardTitle>Study AI Assistant</CardTitle>
                  <CardDescription>
                    Ask about study resources, get recommendations, or generate a daily routine or timetable.
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`flex max-w-[80%] items-start gap-3 rounded-lg px-4 py-2 ${
                            message.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          {message.role === "assistant" && (
                            <Avatar className="mt-0.5 h-8 w-8">
                              <AvatarImage src="/placeholder.svg" alt="Assistant" />
                              <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                          )}
                          <div>
                            <p className="whitespace-pre-line">{message.content}</p>
                            <p className="mt-1 text-xs opacity-70">
                              {new Date(message.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>
                
                <CardFooter className="p-4">
                  <div className="flex w-full items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={toggleListening}
                      className={`${isListening ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300" : ""}`}
                    >
                      {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>
                    <Textarea
                      placeholder="Ask about study materials, schedules, routines, or topics..."
                      className="min-h-10 flex-1 resize-none"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      type="submit" 
                      size="icon" 
                      onClick={handleSendMessage}
                      disabled={isGeneratingResponse || !input.trim()}
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="timetable">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Study Timetable</CardTitle>
                    <Button variant="outline" onClick={generateTimetable}>
                      <Calendar className="mr-2 h-4 w-4" />
                      Generate New
                    </Button>
                  </div>
                  <CardDescription>
                    Your personalized study schedule for today
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {timetable.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className={`p-2 rounded-full ${getTimeTableItemColor(item.type)}`}>
                          {getTimeTableItemIcon(item.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {item.title}
                              </h4>
                              {item.description && (
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                              )}
                            </div>
                            <span className="text-sm font-medium">
                              {item.startTime} - {item.endTime}
                            </span>
                          </div>
                        </div>
                        
                        <Button 
                          variant={item.completed ? "default" : "outline"} 
                          size="sm"
                          onClick={() => markTimetableItemComplete(item.id, !item.completed)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          {item.completed ? "Done" : "Mark Done"}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="routine">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Daily Routine</CardTitle>
                        <Button variant="outline" onClick={() => generateDailyRoutine()}>
                          <ListTodo className="mr-2 h-4 w-4" />
                          Generate New
                        </Button>
                      </div>
                      <CardDescription>
                        Your AI-generated daily routine optimized for productivity and well-being
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        {dailyRoutine.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className={`p-2 rounded-full ${getTimeTableItemColor(item.type)}`}>
                              {getRoutineItemIcon(item.type, item.title)}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                                    {item.title}
                                  </h4>
                                  {item.description && (
                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                  )}
                                </div>
                                <span className="text-sm font-medium">
                                  {item.startTime} - {item.endTime}
                                </span>
                              </div>
                            </div>
                            
                            <Button 
                              variant={item.completed ? "default" : "outline"} 
                              size="sm"
                              onClick={() => markTimetableItemComplete(item.id, !item.completed)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              {item.completed ? "Done" : "Mark Done"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Routine Preferences</CardTitle>
                      <CardDescription>
                        Customize your daily routine
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="wakeup">Wake Up Time</Label>
                          <Input 
                            id="wakeup" 
                            type="time" 
                            value={routinePrefs.wakeUpTime}
                            onChange={(e) => setRoutinePrefs({...routinePrefs, wakeUpTime: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="sleep">Sleep Time</Label>
                          <Input 
                            id="sleep" 
                            type="time" 
                            value={routinePrefs.sleepTime}
                            onChange={(e) => setRoutinePrefs({...routinePrefs, sleepTime: e.target.value})}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="exercise">Exercise Duration (minutes)</Label>
                          <Select
                            value={routinePrefs.exerciseDuration.toString()}
                            onValueChange={(value) => setRoutinePrefs({...routinePrefs, exerciseDuration: parseInt(value)})}
                          >
                            <SelectTrigger id="exercise">
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="45">45 minutes</SelectItem>
                              <SelectItem value="60">60 minutes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="studyHours">Study Hours Per Day</Label>
                          <Select
                            value={routinePrefs.studyHoursPerDay.toString()}
                            onValueChange={(value) => setRoutinePrefs({...routinePrefs, studyHoursPerDay: parseInt(value)})}
                          >
                            <SelectTrigger id="studyHours">
                              <SelectValue placeholder="Select hours" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2">2 hours</SelectItem>
                              <SelectItem value="3">3 hours</SelectItem>
                              <SelectItem value="4">4 hours</SelectItem>
                              <SelectItem value="5">5 hours</SelectItem>
                              <SelectItem value="6">6 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="hobbies" 
                            checked={routinePrefs.includeHobbies}
                            onCheckedChange={(checked) => setRoutinePrefs({...routinePrefs, includeHobbies: checked})}
                          />
                          <Label htmlFor="hobbies">Include Hobby Time</Label>
                        </div>
                        
                        <Button 
                          className="w-full" 
                          onClick={handleUpdateRoutinePreferences}
                        >
                          Update Routine
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Sidebar - Takes up 1 column on large screens */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recommended Videos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendedVideos.map((video) => (
                  <div key={video.id} className="group cursor-pointer">
                    <div className="relative aspect-video mb-2 overflow-hidden rounded-lg bg-muted">
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                        <Video className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <h4 className="font-medium group-hover:text-primary transition-colors">{video.title}</h4>
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{video.duration} mins</span>
                      <span className="mx-1">•</span>
                      <span>{video.subject}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper functions for timetable styling
function getTimeTableItemColor(type: string): string {
  switch (type) {
    case 'study':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
    case 'break':
      return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
    case 'meal':
      return 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300';
    case 'exercise':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
    case 'routine':
      return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300';
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
  }
}

function getTimeTableItemIcon(type: string): JSX.Element {
  switch (type) {
    case 'study':
      return <Book className="h-4 w-4" />;
    case 'break':
      return <Clock className="h-4 w-4" />;
    case 'meal':
      return <Utensils className="h-4 w-4" />;
    case 'exercise':
      return <Dumbbell className="h-4 w-4" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
}

function getRoutineItemIcon(type: string, title: string): JSX.Element {
  if (title.toLowerCase().includes('wake')) return <AlarmClock className="h-4 w-4" />;
  if (title.toLowerCase().includes('sleep')) return <Moon className="h-4 w-4" />;
  
  switch (type) {
    case 'study':
      return <Book className="h-4 w-4" />;
    case 'break':
      return <Coffee className="h-4 w-4" />;
    case 'meal':
      return <Utensils className="h-4 w-4" />;
    case 'exercise':
      return <Dumbbell className="h-4 w-4" />;
    case 'routine':
      return <ListTodo className="h-4 w-4" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
}
