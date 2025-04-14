
import { Device, ConnectionType } from "@/data/mock-data";
import { toast } from "@/components/ui/use-toast";

// Simulate scanning for nearby devices
export const scanForDevices = (): Promise<Partial<Device>[]> => {
  return new Promise((resolve) => {
    console.log("Scanning for devices...");
    // Simulate a network scan delay
    setTimeout(() => {
      // Return found devices (in a real app, this would be actual discovered devices)
      resolve([
        {
          name: "New Smart Bulb",
          type: "light",
          connectionType: "wifi",
          ipAddress: "192.168.1.120",
        },
        {
          name: "Smart Lock",
          type: "lock",
          connectionType: "bluetooth",
          macAddress: "AA:BB:CC:DD:EE:FF",
        }
      ]);
    }, 2000);
  });
};

// Connect to a specific device
export const connectToDevice = (device: Partial<Device>): Promise<Device> => {
  return new Promise((resolve, reject) => {
    console.log(`Connecting to device: ${device.name}`);
    
    // Simulate connection delay
    setTimeout(() => {
      if (Math.random() > 0.2) { // 80% success rate for demo purposes
        // Generate a complete device object with the necessary fields
        const connectedDevice: Device = {
          id: `${device.type}-${Date.now()}`,
          name: device.name || "Unknown Device",
          type: device.type || "light",
          room: device.room || "Living Room", // Default room
          status: "online",
          isOn: false,
          connectionType: device.connectionType || "wifi",
          macAddress: device.macAddress,
          ipAddress: device.ipAddress,
          data: getDefaultDataForType(device.type),
        };
        
        toast({
          title: "Device Connected",
          description: `Successfully connected to ${device.name}`,
        });
        
        resolve(connectedDevice);
      } else {
        // Simulate connection failure
        toast({
          title: "Connection Failed",
          description: `Could not connect to ${device.name}`,
          variant: "destructive",
        });
        
        reject(new Error(`Failed to connect to ${device.name}`));
      }
    }, 1500);
  });
};

// Disconnect from a device
export const disconnectDevice = (deviceId: string): Promise<void> => {
  return new Promise((resolve) => {
    console.log(`Disconnecting from device: ${deviceId}`);
    
    // Simulate disconnection delay
    setTimeout(() => {
      toast({
        title: "Device Disconnected",
        description: "Device has been successfully disconnected",
      });
      
      resolve();
    }, 1000);
  });
};

// Helper to generate default data based on device type
const getDefaultDataForType = (type?: string) => {
  switch (type) {
    case "light":
      return { brightness: 100, color: "#f5e3cb" };
    case "thermostat":
      return { temperature: 72 };
    case "lock":
      return { locked: true };
    case "speaker":
      return { volume: 50 };
    case "vacuum":
      return { batteryLevel: 100 };
    default:
      return {};
  }
};

// Send a command to a device
export const sendDeviceCommand = async (
  deviceId: string, 
  command: string, 
  params: Record<string, any>
): Promise<boolean> => {
  console.log(`Sending command to device ${deviceId}: ${command}`, params);
  
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // 90% success rate for commands
      const success = Math.random() > 0.1;
      
      if (!success) {
        toast({
          title: "Command Failed",
          description: `Failed to send ${command} command to device`,
          variant: "destructive",
        });
      }
      
      resolve(success);
    }, 800);
  });
};
