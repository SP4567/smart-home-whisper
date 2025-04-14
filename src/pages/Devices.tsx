
import { useDevices } from "@/contexts/device-context";
import { DeviceCard } from "@/components/device-card";
import { rooms } from "@/data/mock-data";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

export default function Devices() {
  const { devices } = useDevices();
  const navigate = useNavigate();
  const [roomFilter, setRoomFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  
  // Get unique device types
  const deviceTypes = Array.from(new Set(devices.map(device => device.type)));
  
  // Apply filters
  const filteredDevices = devices.filter(device => {
    const matchesRoom = roomFilter === "all" || device.room === roomFilter;
    const matchesType = typeFilter === "all" || device.type === typeFilter;
    return matchesRoom && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Devices</h1>
          <p className="text-muted-foreground">Manage all your connected devices.</p>
        </div>
        <Button className="mt-4 sm:mt-0" onClick={() => navigate("/add-device")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Device
        </Button>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
          <label htmlFor="room-filter" className="mb-2 block text-sm font-medium">
            Filter by Room
          </label>
          <Select value={roomFilter} onValueChange={setRoomFilter}>
            <SelectTrigger id="room-filter">
              <SelectValue placeholder="Select room" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rooms</SelectItem>
              {rooms.map(room => (
                <SelectItem key={room} value={room}>{room}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
          <label htmlFor="type-filter" className="mb-2 block text-sm font-medium">
            Filter by Type
          </label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger id="type-filter">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {deviceTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {filteredDevices.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredDevices.map(device => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      ) : (
        <div className="flex h-[300px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
          <h3 className="mb-2 text-xl font-semibold">No devices found</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            No devices match your current filters. Try adjusting your filters or add a new device.
          </p>
          <Button onClick={() => navigate("/add-device")}>
            <Plus className="mr-2 h-4 w-4" />
            Add Device
          </Button>
        </div>
      )}
    </div>
  );
}
