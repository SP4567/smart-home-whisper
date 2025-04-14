
import { useDevices } from "@/contexts/device-context";
import { DeviceCard } from "@/components/device-card";
import { rooms, weeklyEnergyData } from "@/data/mock-data";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { devices } = useDevices();
  
  const onlineDevices = devices.filter(device => device.status === "online").length;
  const activeDevices = devices.filter(device => device.isOn).length;
  
  // Group devices by room
  const devicesByRoom = rooms.map(room => ({
    room,
    devices: devices.filter(device => device.room === room)
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Smart Home Dashboard</h1>
        <p className="text-muted-foreground">Monitor and control all your connected devices.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Total Devices</CardTitle>
            <CardDescription>All registered devices</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{devices.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Online Devices</CardTitle>
            <CardDescription>Currently connected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{onlineDevices}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Active Devices</CardTitle>
            <CardDescription>Currently powered on</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeDevices}</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Energy Consumption</CardTitle>
          <CardDescription>Daily energy usage over the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyEnergyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value} kWh`, 'Energy Usage']} />
                <Bar dataKey="usage" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="mb-4 text-2xl font-semibold tracking-tight">Quick Access</h2>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Devices</TabsTrigger>
            {rooms.map(room => (
              <TabsTrigger key={room} value={room}>{room}</TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {devices.slice(0, 8).map(device => (
                <DeviceCard key={device.id} device={device} />
              ))}
            </div>
          </TabsContent>
          
          {devicesByRoom.map(({ room, devices }) => (
            <TabsContent key={room} value={room} className="mt-4">
              {devices.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {devices.map(device => (
                    <DeviceCard key={device.id} device={device} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No devices in this room.</p>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
