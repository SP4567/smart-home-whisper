
import { useDevices } from "@/contexts/device-context";
import { weeklyEnergyData } from "@/data/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function Analytics() {
  const { devices } = useDevices();
  
  // Calculate device type distribution
  const deviceTypes = devices.reduce(
    (acc, device) => {
      if (!acc[device.type]) {
        acc[device.type] = 0;
      }
      acc[device.type]++;
      return acc;
    },
    {} as Record<string, number>
  );
  
  const deviceTypeData = Object.keys(deviceTypes).map((type) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: deviceTypes[type],
  }));
  
  // Mock data for hourly usage
  const hourlyUsageData = [
    { time: "12 AM", usage: 1.2 },
    { time: "3 AM", usage: 0.9 },
    { time: "6 AM", usage: 1.5 },
    { time: "9 AM", usage: 2.3 },
    { time: "12 PM", usage: 3.1 },
    { time: "3 PM", usage: 2.7 },
    { time: "6 PM", usage: 3.5 },
    { time: "9 PM", usage: 2.8 },
    { time: "11 PM", usage: 1.9 },
  ];
  
  // Mock data for device usage
  const deviceUsageData = [
    { name: "Lights", hours: 8.5 },
    { name: "Thermostat", hours: 24 },
    { name: "TV", hours: 4.2 },
    { name: "Kitchen", hours: 2.1 },
    { name: "Speakers", hours: 3.7 },
  ];
  
  // Mock data for monthly consumption comparison
  const monthlyComparisonData = [
    { month: "Jan", thisYear: 320, lastYear: 340 },
    { month: "Feb", thisYear: 300, lastYear: 330 },
    { month: "Mar", thisYear: 310, lastYear: 350 },
    { month: "Apr", thisYear: 290, lastYear: 340 },
    { month: "May", thisYear: 280, lastYear: 320 },
    { month: "Jun", thisYear: 300, lastYear: 330 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Energy Analytics</h1>
        <p className="text-muted-foreground">Monitor and analyze your home's energy consumption.</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Today's Usage</CardTitle>
            <CardDescription>Total energy consumed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">14.7 kWh</div>
            <p className="text-xs text-muted-foreground">12% less than yesterday</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">This Month</CardTitle>
            <CardDescription>Monthly consumption</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">287 kWh</div>
            <p className="text-xs text-muted-foreground">8% less than last month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Estimated Cost</CardTitle>
            <CardDescription>Based on current usage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$42.15</div>
            <p className="text-xs text-muted-foreground">For this month so far</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="hourly">Hourly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
        
        <TabsContent value="daily">
          <Card>
            <CardHeader>
              <CardTitle>Daily Energy Consumption</CardTitle>
              <CardDescription>Energy usage for the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyEnergyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} kWh`, 'Energy Usage']} />
                    <Legend />
                    <Bar dataKey="usage" fill="hsl(var(--primary))" name="Energy Usage (kWh)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hourly">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Energy Consumption</CardTitle>
              <CardDescription>Energy usage throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyUsageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} kWh`, 'Energy Usage']} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="usage" 
                      stroke="hsl(var(--primary))" 
                      activeDot={{ r: 8 }}
                      name="Energy Usage (kWh)" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monthly">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Comparison</CardTitle>
              <CardDescription>This year vs. last year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} kWh`, 'Energy Usage']} />
                    <Legend />
                    <Bar dataKey="thisYear" fill="hsl(var(--primary))" name="This Year" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="lastYear" fill="#8884d8" name="Last Year" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Device Distribution</CardTitle>
            <CardDescription>Types of devices in your home</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {deviceTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} devices`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Device Usage Time</CardTitle>
            <CardDescription>Average daily usage hours by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={deviceUsageData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" />
                  <Tooltip formatter={(value) => [`${value} hours`, 'Usage Time']} />
                  <Legend />
                  <Bar dataKey="hours" fill="hsl(var(--primary))" name="Hours per Day" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
