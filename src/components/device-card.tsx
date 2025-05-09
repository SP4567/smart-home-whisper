
import { 
  Lightbulb, 
  Thermometer, 
  Lock, 
  Camera, 
  Speaker, 
  Plug, 
  RotateCw, 
  Power, 
  Unlock,
  Wifi,
  Bluetooth
} from "lucide-react";
import { Device } from "@/types/device-types";
import { useDevices } from "@/contexts/device-context";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DeviceCardProps {
  device: Device;
  className?: string;
}

export function DeviceCard({ device, className }: DeviceCardProps) {
  const { toggleDevice, updateDeviceData, disconnectFromDevice } = useDevices();
  
  const getDeviceIcon = () => {
    switch (device.type) {
      case "light":
        return <Lightbulb className={cn("h-5 w-5", device.isOn ? "text-amber-400" : "text-muted-foreground")} />;
      case "thermostat":
        return <Thermometer className={cn("h-5 w-5", device.isOn ? "text-blue-400" : "text-muted-foreground")} />;
      case "lock":
        return device.data?.locked 
          ? <Lock className={cn("h-5 w-5", device.isOn ? "text-green-400" : "text-muted-foreground")} />
          : <Unlock className={cn("h-5 w-5", device.isOn ? "text-red-400" : "text-muted-foreground")} />;
      case "camera":
        return <Camera className={cn("h-5 w-5", device.isOn ? "text-primary" : "text-muted-foreground")} />;
      case "speaker":
        return <Speaker className={cn("h-5 w-5", device.isOn ? "text-primary" : "text-muted-foreground")} />;
      case "vacuum":
        return <RotateCw className={cn("h-5 w-5", device.isOn ? "text-primary" : "text-muted-foreground")} />;
      case "outlet":
        return <Plug className={cn("h-5 w-5", device.isOn ? "text-primary" : "text-muted-foreground")} />;
      default:
        return <Power className={cn("h-5 w-5", device.isOn ? "text-primary" : "text-muted-foreground")} />;
    }
  };

  const getConnectionIcon = () => {
    if (device.connectionType === "wifi") {
      return <Wifi className="h-4 w-4 text-blue-400" />;
    } else if (device.connectionType === "bluetooth") {
      return <Bluetooth className="h-4 w-4 text-indigo-400" />;
    }
    return null;
  };

  const getConnectionInfo = () => {
    if (device.connectionType === "wifi") {
      return device.ipAddress;
    } else if (device.connectionType === "bluetooth") {
      return device.macAddress;
    }
    return null;
  };

  const renderDeviceControls = () => {
    if (!device.isOn) return null;

    switch (device.type) {
      case "light":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Brightness</span>
              <Slider
                defaultValue={[device.data?.brightness || 50]} 
                max={100}
                step={1}
                className="flex-1" 
                onValueChange={(value) => updateDeviceData(device.id, { brightness: value[0] })} 
              />
              <span className="w-8 text-xs font-medium">{device.data?.brightness || 0}%</span>
            </div>
          </div>
        );
      case "thermostat":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => updateDeviceData(device.id, { temperature: (device.data?.temperature || 70) - 1 })}
              >
                <span className="text-lg">-</span>
              </Button>
              <span className="text-2xl font-semibold">{device.data?.temperature || 70}°F</span>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => updateDeviceData(device.id, { temperature: (device.data?.temperature || 70) + 1 })}
              >
                <span className="text-lg">+</span>
              </Button>
            </div>
          </div>
        );
      case "lock":
        return (
          <div className="mt-2 flex justify-center">
            <Button 
              variant={device.data?.locked ? "destructive" : "default"}
              onClick={() => updateDeviceData(device.id, { locked: !device.data?.locked })}
            >
              {device.data?.locked ? "Unlock" : "Lock"}
            </Button>
          </div>
        );
      case "speaker":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Volume</span>
              <Slider
                defaultValue={[device.data?.volume || 50]} 
                max={100}
                step={1}
                className="flex-1" 
                onValueChange={(value) => updateDeviceData(device.id, { volume: value[0] })} 
              />
              <span className="w-8 text-xs font-medium">{device.data?.volume || 0}%</span>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleDisconnect = async () => {
    await disconnectFromDevice(device.id);
  };

  return (
    <Card className={cn("device-card-gradient overflow-hidden", className)}>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getDeviceIcon()}
            <CardTitle className="text-base">{device.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {getConnectionIcon()}
            <span 
              className={cn(
                "inline-block h-2 w-2 rounded-full", 
                device.status === "online" ? "bg-green-500" : "bg-red-500"
              )} 
            />
          </div>
        </div>
        <CardDescription className="flex flex-col pt-1">
          <span>{device.room}</span>
          <span className="text-xs text-muted-foreground">{getConnectionInfo()}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        {renderDeviceControls()}
      </CardContent>
      <CardFooter className="p-4 pt-2 flex flex-col gap-2">
        <Button 
          variant={device.isOn ? "default" : "outline"} 
          className="w-full"
          onClick={() => toggleDevice(device.id)}
        >
          <Power className="mr-2 h-4 w-4" />
          {device.isOn ? "Turn Off" : "Turn On"}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          className="w-full text-xs"
          onClick={handleDisconnect}
        >
          Disconnect
        </Button>
      </CardFooter>
    </Card>
  );
}
