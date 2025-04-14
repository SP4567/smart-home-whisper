import React, { createContext, useContext, useState } from "react";
import { findAvailableDevices } from "@/lib/device-discovery";

export interface Device {
  id: string;
  name: string;
  type: "light" | "thermostat" | "lock" | "camera" | "speaker";
  room: string;
  isOn: boolean;
  isConnected: boolean;
  data?: {
    brightness?: number;
    color?: string;
    temperature?: number;
    locked?: boolean;
    volume?: number;
  };
}

interface DeviceContextType {
  devices: Device[];
  isLoading: boolean;
  error: string | null;
  scanForDevices: () => Promise<void>;
  toggleDevice: (id: string) => void;
  updateDeviceData: (id: string, data: Partial<Device["data"]>) => void;
  connectToDevice: (id: string) => void;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider = ({ children }: { children: React.ReactNode }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Connect to a device
  const connectToDevice = (id: string) => {
    setDevices(prev => 
      prev.map(device => 
        device.id === id 
          ? { ...device, isConnected: true } 
          : device
      )
    );
  };
  
  // Toggle a device on/off
  const toggleDevice = (id: string) => {
    setDevices(prev => 
      prev.map(device => 
        device.id === id 
          ? { ...device, isOn: !device.isOn } 
          : device
      )
    );
  };
  
  // Update device data (e.g., brightness, temperature)
  const updateDeviceData = (id: string, data: Partial<Device["data"]>) => {
    setDevices(prev => 
      prev.map(device => 
        device.id === id 
          ? { 
              ...device, 
              data: { ...device.data, ...data } 
            } 
          : device
      )
    );
  };

  // Modified scanForDevices function to return void
  const scanForDevices = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const newDevices = await findAvailableDevices();
      setDevices(prev => {
        // Keep existing connected devices
        const existingDevices = prev.filter(d => d.isConnected);
        
        // Add newly found devices that aren't already connected
        const newDiscoveredDevices = newDevices.filter(
          newDev => !existingDevices.some(existing => existing.id === newDev.id)
        );
        
        return [...existingDevices, ...newDiscoveredDevices];
      });
    } catch (err) {
      setError('Failed to scan for devices');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DeviceContext.Provider
      value={{
        devices,
        isLoading,
        error,
        scanForDevices,
        toggleDevice,
        updateDeviceData,
        connectToDevice,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevices = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error("useDevices must be used within a DeviceProvider");
  }
  return context;
};
