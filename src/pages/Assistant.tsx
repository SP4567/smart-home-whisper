
import { useState, useRef, useEffect } from "react";
import { useDevices } from "@/contexts/device-context";
import { chatHistory, ChatMessage } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Send, MicOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function Assistant() {
  const { devices, toggleDevice, updateDeviceData } = useDevices();
  const [messages, setMessages] = useState<ChatMessage[]>(chatHistory);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock function to process commands
  const processCommand = (text: string): string => {
    const lowerText = text.toLowerCase();
    
    // Light commands
    if (lowerText.includes("turn on") && lowerText.includes("light")) {
      const roomMatch = rooms.find(room => lowerText.toLowerCase().includes(room.toLowerCase()));
      
      if (roomMatch) {
        const roomLights = devices.filter(
          d => d.type === "light" && d.room.toLowerCase() === roomMatch.toLowerCase()
        );
        
        roomLights.forEach(light => {
          if (!light.isOn) toggleDevice(light.id);
        });
        
        return `I've turned on the lights in the ${roomMatch}.`;
      }
      return "I couldn't find the lights you specified.";
    }
    
    if (lowerText.includes("turn off") && lowerText.includes("light")) {
      const roomMatch = rooms.find(room => lowerText.toLowerCase().includes(room.toLowerCase()));
      
      if (roomMatch) {
        const roomLights = devices.filter(
          d => d.type === "light" && d.room.toLowerCase() === roomMatch.toLowerCase()
        );
        
        roomLights.forEach(light => {
          if (light.isOn) toggleDevice(light.id);
        });
        
        return `I've turned off the lights in the ${roomMatch}.`;
      }
      return "I couldn't find the lights you specified.";
    }
    
    // Thermostat commands
    if (lowerText.includes("temperature") || lowerText.includes("thermostat")) {
      if (lowerText.includes("set") || lowerText.includes("change")) {
        // Extract temperature value
        const matches = lowerText.match(/\d+/);
        if (matches && matches.length > 0) {
          const temp = parseInt(matches[0]);
          const thermostat = devices.find(d => d.type === "thermostat");
          
          if (thermostat) {
            updateDeviceData(thermostat.id, { temperature: temp });
            return `I've set the temperature to ${temp}°F.`;
          }
        }
        return "I couldn't understand the temperature setting.";
      } else {
        // Report current temperature
        const thermostat = devices.find(d => d.type === "thermostat");
        if (thermostat && thermostat.data?.temperature) {
          return `The current temperature is ${thermostat.data.temperature}°F.`;
        }
      }
    }
    
    // Lock commands
    if (lowerText.includes("lock") || lowerText.includes("door")) {
      const lock = devices.find(d => d.type === "lock");
      
      if (lock) {
        if (lowerText.includes("lock") && !lowerText.includes("unlock")) {
          updateDeviceData(lock.id, { locked: true });
          return "I've locked the door for you.";
        } else if (lowerText.includes("unlock")) {
          updateDeviceData(lock.id, { locked: false });
          return "I've unlocked the door for you.";
        } else {
          return `The door is currently ${lock.data?.locked ? "locked" : "unlocked"}.`;
        }
      }
    }
    
    // Status commands
    if (lowerText.includes("status") || lowerText.includes("what's on")) {
      const activeDevices = devices.filter(d => d.isOn);
      
      if (activeDevices.length === 0) {
        return "No devices are currently active.";
      }
      
      return `Currently active devices: ${activeDevices.map(d => d.name).join(", ")}.`;
    }
    
    return "I'm sorry, I don't understand that command. Try asking me to turn on/off lights, adjust the temperature, or check device status.";
  };

  // Handle message submission
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    
    // Process command and respond
    setTimeout(() => {
      const response = processCommand(input);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    }, 500);
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
        const mockCommand = "Turn on the living room lights";
        setInput(mockCommand);
        
        // Auto-send the command after populating the input
        setTimeout(() => {
          const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: "user",
            content: mockCommand,
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, userMessage]);
          setInput("");
          
          // Process command and respond
          setTimeout(() => {
            const response = processCommand(mockCommand);
            
            const assistantMessage: ChatMessage = {
              id: (Date.now() + 1).toString(),
              role: "assistant",
              content: response,
              timestamp: new Date()
            };
            
            setMessages(prev => [...prev, assistantMessage]);
          }, 500);
        }, 500);
      }, 2000);
    }
  };

  // Extract room names from devices for command processing
  const rooms = Array.from(new Set(devices.map(device => device.room)));

  return (
    <div className="container mx-auto flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Smart Assistant</h1>
        <p className="text-muted-foreground">Control your home with natural language commands.</p>
      </div>
      
      <Card className="flex h-[calc(100vh-220px)] flex-col">
        <CardHeader className="pb-3">
          <CardTitle>Home Assistant</CardTitle>
          <CardDescription>
            Ask me to control devices, check status, or help with automations.
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
                    <p>{message.content}</p>
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
              placeholder="Type a message..."
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
            <Button type="submit" size="icon" onClick={handleSendMessage}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
