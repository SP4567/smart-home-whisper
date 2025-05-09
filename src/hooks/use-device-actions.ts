import { useState } from "react";
import { Device } from "@/types/device-types";
import { findAvailableDevices } from "@/lib/device-discovery";

export function useDeviceActions() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState<Device[]>([]);
  
  // Connect to a device
  const connectToDevice = (id: string) => {
    setDevices(prev => 
      prev.map(device => 
        device.id === id 
          ? { ...device, isConnected: true, status: "online" } 
          : device
      )
    );
  };
  
  // Disconnect from a device
  const disconnectFromDevice = (id: string) => {
    setDevices(prev => 
      prev.map(device => 
        device.id === id 
          ? { ...device, isConnected: false, status: "offline" } 
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

  // Add a new device
  const addDevice = (device: Device) => {
    setDevices(prev => [...prev, device]);
  };

  // Scan for devices
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

  // Scan for new devices
  const scanForNewDevices = async (): Promise<void> => {
    setIsScanning(true);
    setScanResults([]);
    try {
      // Simulate finding new devices
      const results = await findAvailableDevices();
      
      // Filter out devices that are already in our list
      const newDevices = results.filter(
        result => !devices.some(device => device.id === result.id)
      );
      
      setScanResults(newDevices);
    } catch (err) {
      setError('Failed to scan for new devices');
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  // Connect to a new device from scan results
  const connectToNewDevice = async (deviceId: string): Promise<void> => {
    const deviceToConnect = scanResults.find(device => device.id === deviceId);
    if (!deviceToConnect) {
      setError('Device not found in scan results');
      return;
    }

    try {
      // In a real app, this would involve actual connection logic
      const connectedDevice = {
        ...deviceToConnect,
        isConnected: true,
        status: "online" as const
      };
      
      // Add the connected device to our devices list
      setDevices(prev => [...prev, connectedDevice]);
      
      // Remove the device from scan results
      setScanResults(prev => prev.filter(device => device.id !== deviceId));
    } catch (err) {
      setError('Failed to connect to device');
      console.error(err);
    }
  };

  return {
    devices,
    setDevices,
    isLoading,
    setIsLoading,
    error,
    setError,
    isScanning,
    scanResults,
    connectToDevice,
    disconnectFromDevice,
    toggleDevice,
    updateDeviceData,
    addDevice,
    scanForDevices,
    scanForNewDevices,
    connectToNewDevice
  };
}
