
import { DeviceType, ConnectionType, DeviceStatus } from "@/data/mock-data";

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  room: string;
  isOn: boolean;
  isConnected: boolean;
  status: DeviceStatus | "error";
  connectionType: ConnectionType; // Required field
  ipAddress?: string;
  macAddress?: string;
  data?: {
    brightness?: number;
    color?: string;
    temperature?: number;
    locked?: boolean;
    volume?: number;
    batteryLevel?: number;
  };
}

export interface DeviceContextType {
  devices: Device[];
  isLoading: boolean;
  error: string | null;
  scanForDevices: () => Promise<void>;
  toggleDevice: (id: string) => void;
  updateDeviceData: (id: string, data: Partial<Device["data"]>) => void;
  connectToDevice: (id: string) => void;
  disconnectFromDevice: (id: string) => void;
  addDevice: (device: Device) => void;
  scanForNewDevices: () => Promise<void>;
  connectToNewDevice: (deviceId: string) => Promise<void>;
  isScanning: boolean;
  scanResults: Device[];
}
