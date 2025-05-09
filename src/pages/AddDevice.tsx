import { useState } from "react";
import { useDevices } from "@/contexts/device-context";
import { useNavigate } from "react-router-dom";
import { rooms, DeviceType, ConnectionType } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Thermometer, Lock, Camera, Speaker, RotateCw, Plug, Wifi, Bluetooth } from "lucide-react";

export default function AddDevice() {
  const { addDevice } = useDevices();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [deviceType, setDeviceType] = useState<DeviceType>("light");
  const [room, setRoom] = useState(rooms[0]);
  const [connectionType, setConnectionType] = useState<ConnectionType>("wifi");
  const [ipAddress, setIpAddress] = useState("");
  const [macAddress, setMacAddress] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addDevice({
      id: `${deviceType}-${Date.now()}`,
      name,
      type: deviceType,
      room,
      status: "online",
      isOn: false,
      isConnected: true,
      connectionType,
      ...(connectionType === "wifi" && ipAddress ? { ipAddress } : {}),
      ...(connectionType === "bluetooth" && macAddress ? { macAddress } : {}),
      data: getDefaultDataForType(deviceType),
    });
    
    navigate("/devices");
  };
  
  const getDefaultDataForType = (type: DeviceType) => {
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
  
  const getDeviceTypeIcon = (type: DeviceType) => {
    switch (type) {
      case "light":
        return <Lightbulb className="h-5 w-5" />;
      case "thermostat":
        return <Thermometer className="h-5 w-5" />;
      case "lock":
        return <Lock className="h-5 w-5" />;
      case "camera":
        return <Camera className="h-5 w-5" />;
      case "speaker":
        return <Speaker className="h-5 w-5" />;
      case "vacuum":
        return <RotateCw className="h-5 w-5" />;
      case "outlet":
        return <Plug className="h-5 w-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Device</h1>
        <p className="text-muted-foreground">Connect a new smart device to your network.</p>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Device Information</CardTitle>
            <CardDescription>
              Enter the details of your new smart device.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Device Name</Label>
              <Input
                id="name"
                placeholder="e.g., Living Room Lamp"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Device Type</Label>
              <Select
                value={deviceType}
                onValueChange={(value) => setDeviceType(value as DeviceType)}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" />
                      <span>Light</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="thermostat">
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-4 w-4" />
                      <span>Thermostat</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="lock">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      <span>Smart Lock</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="camera">
                    <div className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      <span>Camera</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="speaker">
                    <div className="flex items-center gap-2">
                      <Speaker className="h-4 w-4" />
                      <span>Speaker</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="vacuum">
                    <div className="flex items-center gap-2">
                      <RotateCw className="h-4 w-4" />
                      <span>Vacuum</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="outlet">
                    <div className="flex items-center gap-2">
                      <Plug className="h-4 w-4" />
                      <span>Smart Outlet</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Select value={room} onValueChange={setRoom}>
                <SelectTrigger id="room">
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((roomName) => (
                    <SelectItem key={roomName} value={roomName}>
                      {roomName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="connectionType">Connection Type</Label>
              <Select 
                value={connectionType} 
                onValueChange={(value) => setConnectionType(value as ConnectionType)}
              >
                <SelectTrigger id="connectionType">
                  <SelectValue placeholder="Select connection type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wifi">
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4" />
                      <span>WiFi</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="bluetooth">
                    <div className="flex items-center gap-2">
                      <Bluetooth className="h-4 w-4" />
                      <span>Bluetooth</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {connectionType === "wifi" && (
              <div className="space-y-2">
                <Label htmlFor="ipAddress">IP Address</Label>
                <Input
                  id="ipAddress"
                  placeholder="e.g., 192.168.1.100"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                />
              </div>
            )}
            
            {connectionType === "bluetooth" && (
              <div className="space-y-2">
                <Label htmlFor="macAddress">MAC Address</Label>
                <Input
                  id="macAddress"
                  placeholder="e.g., 00:11:22:33:44:55"
                  value={macAddress}
                  onChange={(e) => setMacAddress(e.target.value)}
                />
              </div>
            )}
            
            <div className="rounded-lg border p-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  {getDeviceTypeIcon(deviceType)}
                </div>
                <div>
                  <h3 className="text-sm font-medium">
                    {deviceType.charAt(0).toUpperCase() + deviceType.slice(1)}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {getDeviceDescription(deviceType)}
                  </p>
                </div>
              </div>
              <p className="text-sm">
                You're adding a new {deviceType} called "{name || '[Name]'}" to your {room} via {connectionType}.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name}>
              Add Device
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

function getDeviceDescription(type: DeviceType): string {
  switch (type) {
    case "light":
      return "Smart light with brightness and color control";
    case "thermostat":
      return "Temperature control for your home";
    case "lock":
      return "Smart door lock with remote access";
    case "camera":
      return "Security camera with live video feed";
    case "speaker":
      return "Smart speaker with voice control";
    case "vacuum":
      return "Automated cleaning robot";
    case "outlet":
      return "Smart power outlet with energy monitoring";
    default:
      return "Smart device";
  }
}
