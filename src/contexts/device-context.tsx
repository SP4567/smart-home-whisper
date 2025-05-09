
import React, { createContext, useContext } from "react";
import { Device, DeviceContextType } from "@/types/device-types";
import { useDeviceActions } from "@/hooks/use-device-actions";

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    devices,
    isLoading,
    error,
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
  } = useDeviceActions();

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
        disconnectFromDevice,
        addDevice,
        scanForNewDevices,
        connectToNewDevice,
        isScanning,
        scanResults
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

export type { Device };
