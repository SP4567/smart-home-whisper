export type DeviceType = 
  | "light" 
  | "thermostat" 
  | "lock" 
  | "camera" 
  | "speaker" 
  | "vacuum" 
  | "outlet";

export type DeviceStatus = "online" | "offline" | "error";
export type ConnectionType = "wifi" | "bluetooth";

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  room: string;
  status: DeviceStatus;
  isOn: boolean;
  connectionType: ConnectionType;
  macAddress?: string;
  ipAddress?: string;
  data?: {
    brightness?: number;
    color?: string;
    temperature?: number;
    locked?: boolean;
    volume?: number;
    batteryLevel?: number;
  };
}

export const rooms = [
  "Living Room",
  "Kitchen",
  "Master Bedroom",
  "Bathroom",
  "Office",
  "Hallway",
  "Guest Room"
];

export const mockDevices: Device[] = [
  {
    id: "light-1",
    name: "Ceiling Light",
    type: "light",
    room: "Living Room",
    status: "online",
    isOn: true,
    connectionType: "wifi",
    ipAddress: "192.168.1.101",
    data: {
      brightness: 80,
      color: "#f5e3cb" // warm white
    }
  },
  {
    id: "light-2",
    name: "Floor Lamp",
    type: "light",
    room: "Living Room",
    status: "online",
    isOn: false,
    connectionType: "wifi",
    ipAddress: "192.168.1.102",
    data: {
      brightness: 60,
      color: "#f5e3cb"
    }
  },
  {
    id: "thermostat-1",
    name: "Main Thermostat",
    type: "thermostat",
    room: "Living Room",
    status: "online",
    isOn: true,
    connectionType: "wifi",
    ipAddress: "192.168.1.103",
    data: {
      temperature: 72
    }
  },
  {
    id: "lock-1",
    name: "Front Door",
    type: "lock",
    room: "Hallway",
    status: "online",
    isOn: true,
    connectionType: "bluetooth",
    macAddress: "00:11:22:33:44:55",
    data: {
      locked: true
    }
  },
  {
    id: "camera-1",
    name: "Entryway Camera",
    type: "camera",
    room: "Hallway",
    status: "online",
    isOn: true,
    connectionType: "wifi",
    ipAddress: "192.168.1.104"
  },
  {
    id: "light-3",
    name: "Kitchen Lights",
    type: "light",
    room: "Kitchen",
    status: "online",
    isOn: true,
    connectionType: "wifi",
    ipAddress: "192.168.1.105",
    data: {
      brightness: 100,
      color: "#ffffff" // bright white
    }
  },
  {
    id: "light-4",
    name: "Bedroom Light",
    type: "light",
    room: "Master Bedroom",
    status: "online",
    isOn: false,
    connectionType: "wifi",
    ipAddress: "192.168.1.106",
    data: {
      brightness: 50,
      color: "#f5d6a8" // soft warm
    }
  },
  {
    id: "speaker-1",
    name: "Living Room Speaker",
    type: "speaker",
    room: "Living Room",
    status: "online",
    isOn: false,
    connectionType: "bluetooth",
    macAddress: "11:22:33:44:55:66",
    data: {
      volume: 65
    }
  },
  {
    id: "outlet-1",
    name: "Smart Outlet",
    type: "outlet",
    room: "Office",
    status: "online",
    isOn: true,
    connectionType: "wifi",
    ipAddress: "192.168.1.107"
  },
  {
    id: "vacuum-1",
    name: "Robot Vacuum",
    type: "vacuum",
    room: "Living Room",
    status: "offline",
    isOn: false,
    connectionType: "wifi",
    ipAddress: "192.168.1.108",
    data: {
      batteryLevel: 20
    }
  }
];

export interface EnergyData {
  day: string;
  usage: number;
}

export const weeklyEnergyData: EnergyData[] = [
  { day: "Mon", usage: 12.3 },
  { day: "Tue", usage: 14.8 },
  { day: "Wed", usage: 13.2 },
  { day: "Thu", usage: 15.7 },
  { day: "Fri", usage: 18.3 },
  { day: "Sat", usage: 16.2 },
  { day: "Sun", usage: 11.4 }
];

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export const chatHistory: ChatMessage[] = [
  {
    id: "1",
    role: "user",
    content: "Turn on the living room lights",
    timestamp: new Date('2023-04-14T09:15:00')
  },
  {
    id: "2",
    role: "assistant",
    content: "I've turned on the living room lights for you.",
    timestamp: new Date('2023-04-14T09:15:02')
  },
  {
    id: "3",
    role: "user",
    content: "What's the temperature in the house?",
    timestamp: new Date('2023-04-14T10:30:00')
  },
  {
    id: "4",
    role: "assistant",
    content: "The current temperature is 72°F according to your main thermostat.",
    timestamp: new Date('2023-04-14T10:30:03')
  }
];
