
import { useState } from "react";
import { useDevices } from "@/contexts/device-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Bluetooth, Loader2 } from "lucide-react";
import { ConnectionType } from "@/data/mock-data";

export function DeviceScanner() {
  const { 
    scanForNewDevices, 
    connectToNewDevice, 
    isScanning, 
    scanResults 
  } = useDevices();

  const [connecting, setConnecting] = useState<Record<string, boolean>>({});

  const handleScan = async () => {
    await scanForNewDevices();
  };

  const handleConnect = async (deviceId: string, index: number) => {
    const deviceKey = `${index}`;
    setConnecting(prev => ({ ...prev, [deviceKey]: true }));
    
    try {
      await connectToNewDevice(deviceId);
    } finally {
      setConnecting(prev => ({ ...prev, [deviceKey]: false }));
    }
  };

  const getConnectionIcon = (type?: ConnectionType) => {
    switch (type) {
      case "wifi":
        return <Wifi className="h-4 w-4" />;
      case "bluetooth":
        return <Bluetooth className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Device Scanner</CardTitle>
        <CardDescription>
          Scan for and connect to new WiFi or Bluetooth devices
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button 
            onClick={handleScan} 
            disabled={isScanning} 
            className="w-full"
          >
            {isScanning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>Scan for Devices</>
            )}
          </Button>

          {scanResults.length > 0 && (
            <div className="mt-4 space-y-2">
              <h3 className="font-medium">Available Devices</h3>
              <div className="rounded-md border">
                {scanResults.map((device, index) => (
                  <div 
                    key={`${device.id || index}`}
                    className="flex items-center justify-between border-b p-3 last:border-0"
                  >
                    <div className="flex items-center space-x-3">
                      {getConnectionIcon(device.connectionType)}
                      <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {device.connectionType === "wifi" 
                            ? `IP: ${device.ipAddress}` 
                            : `MAC: ${device.macAddress}`}
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handleConnect(device.id, index)}
                      disabled={connecting[`${index}`]}
                    >
                      {connecting[`${index}`] ? (
                        <>
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          Connecting
                        </>
                      ) : (
                        <>Connect</>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {scanResults.length === 0 && !isScanning && (
            <div className="flex h-[100px] flex-col items-center justify-center rounded-md border border-dashed p-4 text-center">
              <p className="text-sm text-muted-foreground">
                No devices found. Click "Scan for Devices" to begin.
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-xs text-muted-foreground">
        <div>WiFi and Bluetooth devices supported</div>
      </CardFooter>
    </Card>
  );
}
