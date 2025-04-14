
import { createContext, useContext, useState, ReactNode } from "react";
import { Device, mockDevices } from "@/data/mock-data";
import { useToast } from "@/components/ui/use-toast";

interface DeviceContextType {
  devices: Device[];
  toggleDevice: (id: string) => void;
  updateDeviceData: (id: string, data: Partial<Device['data']>) => void;
  getDevicesByRoom: (room: string) => Device[];
  addDevice: (device: Omit<Device, 'id'>) => void;
  removeDevice: (id: string) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(mockDevices);
  const { toast } = useToast();

  const toggleDevice = (id: string) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === id ? { ...device, isOn: !device.isOn } : device
      )
    );
    
    const device = devices.find(d => d.id === id);
    if (device) {
      toast({
        title: `${device.name} is now ${device.isOn ? 'off' : 'on'}`,
        duration: 2000,
      });
    }
  };

  const updateDeviceData = (id: string, data: Partial<Device['data']>) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === id
          ? { ...device, data: { ...device.data, ...data } }
          : device
      )
    );
  };

  const getDevicesByRoom = (room: string) => {
    return devices.filter((device) => device.room === room);
  };

  const addDevice = (deviceData: Omit<Device, 'id'>) => {
    const newDevice: Device = {
      ...deviceData,
      id: `${deviceData.type}-${Date.now()}`,
    };
    
    setDevices((prevDevices) => [...prevDevices, newDevice]);
    
    toast({
      title: "Device added",
      description: `${deviceData.name} has been added to your devices.`,
    });
  };

  const removeDevice = (id: string) => {
    const deviceToRemove = devices.find(device => device.id === id);
    
    setDevices((prevDevices) => prevDevices.filter((device) => device.id !== id));
    
    if (deviceToRemove) {
      toast({
        title: "Device removed",
        description: `${deviceToRemove.name} has been removed.`,
      });
    }
  };

  return (
    <DeviceContext.Provider
      value={{
        devices,
        toggleDevice,
        updateDeviceData,
        getDevicesByRoom,
        addDevice,
        removeDevice,
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
