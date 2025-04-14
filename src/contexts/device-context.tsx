
import { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Device, mockDevices } from "@/data/mock-data";
import { useToast } from "@/components/ui/use-toast";
import { 
  scanForDevices, 
  connectToDevice, 
  disconnectDevice,
  sendDeviceCommand 
} from "@/utils/device-connection";

interface DeviceContextType {
  devices: Device[];
  isScanning: boolean;
  scanResults: Partial<Device>[];
  toggleDevice: (id: string) => void;
  updateDeviceData: (id: string, data: Partial<Device['data']>) => void;
  getDevicesByRoom: (room: string) => Device[];
  addDevice: (device: Omit<Device, 'id'>) => void;
  removeDevice: (id: string) => void;
  scanForNewDevices: () => Promise<void>;
  connectToNewDevice: (device: Partial<Device>) => Promise<void>;
  disconnectFromDevice: (id: string) => Promise<void>;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<Partial<Device>[]>([]);
  const { toast } = useToast();

  // Scan for new devices
  const scanForNewDevices = useCallback(async () => {
    setIsScanning(true);
    try {
      const results = await scanForDevices();
      setScanResults(results);
      return results;
    } catch (error) {
      console.error("Error scanning for devices:", error);
      toast({
        title: "Scan Failed",
        description: "Failed to scan for devices. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  }, [toast]);

  // Connect to a new device
  const connectToNewDevice = useCallback(async (device: Partial<Device>) => {
    try {
      const connectedDevice = await connectToDevice(device);
      setDevices(prev => [...prev, connectedDevice]);
      
      // Clear this device from scan results
      setScanResults(prev => 
        prev.filter(d => 
          (d.ipAddress && d.ipAddress !== device.ipAddress) || 
          (d.macAddress && d.macAddress !== device.macAddress)
        )
      );
    } catch (error) {
      console.error("Error connecting to device:", error);
    }
  }, []);

  // Disconnect from a device
  const disconnectFromDevice = useCallback(async (id: string) => {
    try {
      await disconnectDevice(id);
      removeDevice(id);
    } catch (error) {
      console.error("Error disconnecting from device:", error);
      toast({
        title: "Disconnect Failed",
        description: "Failed to disconnect from device. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const toggleDevice = useCallback(async (id: string) => {
    const device = devices.find(d => d.id === id);
    if (!device) return;
    
    try {
      const command = device.isOn ? "turnOff" : "turnOn";
      const success = await sendDeviceCommand(id, command, {});
      
      if (success) {
        setDevices((prevDevices) =>
          prevDevices.map((device) =>
            device.id === id ? { ...device, isOn: !device.isOn } : device
          )
        );
        
        toast({
          title: `${device.name} is now ${device.isOn ? 'off' : 'on'}`,
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error toggling device:", error);
    }
  }, [devices, toast]);

  const updateDeviceData = useCallback(async (id: string, data: Partial<Device['data']>) => {
    const device = devices.find(d => d.id === id);
    if (!device) return;
    
    try {
      const success = await sendDeviceCommand(id, "updateData", data);
      
      if (success) {
        setDevices((prevDevices) =>
          prevDevices.map((device) =>
            device.id === id
              ? { ...device, data: { ...device.data, ...data } }
              : device
          )
        );
      }
    } catch (error) {
      console.error("Error updating device data:", error);
    }
  }, [devices]);

  const getDevicesByRoom = useCallback((room: string) => {
    return devices.filter((device) => device.room === room);
  }, [devices]);

  const addDevice = useCallback((deviceData: Omit<Device, 'id'>) => {
    const newDevice: Device = {
      ...deviceData,
      id: `${deviceData.type}-${Date.now()}`,
    };
    
    setDevices((prevDevices) => [...prevDevices, newDevice]);
    
    toast({
      title: "Device added",
      description: `${deviceData.name} has been added to your devices.`,
    });
  }, [toast]);

  const removeDevice = useCallback((id: string) => {
    const deviceToRemove = devices.find(device => device.id === id);
    
    setDevices((prevDevices) => prevDevices.filter((device) => device.id !== id));
    
    if (deviceToRemove) {
      toast({
        title: "Device removed",
        description: `${deviceToRemove.name} has been removed.`,
      });
    }
  }, [devices, toast]);

  return (
    <DeviceContext.Provider
      value={{
        devices,
        isScanning,
        scanResults,
        toggleDevice,
        updateDeviceData,
        getDevicesByRoom,
        addDevice,
        removeDevice,
        scanForNewDevices,
        connectToNewDevice,
        disconnectFromDevice,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
}

export const useDevices = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error("useDevices must be used within a DeviceProvider");
  }
  return context;
};
