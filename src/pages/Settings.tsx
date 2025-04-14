
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  // Mock user settings
  const [userSettings, setUserSettings] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    notifications: true,
    location: "123 Main St, Anytown, USA",
    timezone: "America/New_York",
  });
  
  // Mock app settings
  const [appSettings, setAppSettings] = useState({
    darkMode: false,
    autoLock: true,
    autoShutOff: true,
    energySaving: true,
    voiceControl: true,
    sensitivity: 75,
    shareAnalytics: true,
  });
  
  // Mock voice settings
  const [voiceSettings, setVoiceSettings] = useState({
    enabled: true,
    wakeWord: "Hey Home",
    volume: 80,
    responseSpeed: 70,
    voiceType: "default",
  });
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      });
    }, 1000);
  };
  
  const handleSaveAppSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "App settings updated",
        description: "Your preference changes have been saved.",
      });
    }, 1000);
  };
  
  const handleSaveVoiceSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Voice settings updated",
        description: "Your voice control settings have been saved.",
      });
    }, 1000);
  };

  return (
    <div className="container space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences.</p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="app">App Settings</TabsTrigger>
          <TabsTrigger value="voice">Voice Control</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Manage your personal information and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={userSettings.name}
                    onChange={(e) => setUserSettings({ ...userSettings, name: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userSettings.email}
                    onChange={(e) => setUserSettings({ ...userSettings, email: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Home Location</Label>
                  <Input
                    id="location"
                    value={userSettings.location}
                    onChange={(e) => setUserSettings({ ...userSettings, location: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    className="w-full rounded-md border p-2"
                    value={userSettings.timezone}
                    onChange={(e) => setUserSettings({ ...userSettings, timezone: e.target.value })}
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  </select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="notifications"
                    checked={userSettings.notifications}
                    onCheckedChange={(checked) => setUserSettings({ ...userSettings, notifications: checked })}
                  />
                  <Label htmlFor="notifications">Enable notifications</Label>
                </div>
                
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="app">
          <Card>
            <CardHeader>
              <CardTitle>App Settings</CardTitle>
              <CardDescription>
                Customize how the Smart Home app works.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveAppSettings} className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable dark theme throughout the app
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={appSettings.darkMode}
                    onCheckedChange={(checked) => setAppSettings({ ...appSettings, darkMode: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-lock">Auto Lock</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically lock doors after 10 minutes
                    </p>
                  </div>
                  <Switch
                    id="auto-lock"
                    checked={appSettings.autoLock}
                    onCheckedChange={(checked) => setAppSettings({ ...appSettings, autoLock: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-shutoff">Auto Shut-off</Label>
                    <p className="text-sm text-muted-foreground">
                      Turn off lights when no motion is detected
                    </p>
                  </div>
                  <Switch
                    id="auto-shutoff"
                    checked={appSettings.autoShutOff}
                    onCheckedChange={(checked) => setAppSettings({ ...appSettings, autoShutOff: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="energy-saving">Energy Saving Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Optimize energy usage automatically
                    </p>
                  </div>
                  <Switch
                    id="energy-saving"
                    checked={appSettings.energySaving}
                    onCheckedChange={(checked) => setAppSettings({ ...appSettings, energySaving: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="share-analytics">Share Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Help improve the app by sharing usage data
                    </p>
                  </div>
                  <Switch
                    id="share-analytics"
                    checked={appSettings.shareAnalytics}
                    onCheckedChange={(checked) => setAppSettings({ ...appSettings, shareAnalytics: checked })}
                  />
                </div>
                
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="voice">
          <Card>
            <CardHeader>
              <CardTitle>Voice Control Settings</CardTitle>
              <CardDescription>
                Configure how you interact with your home using voice commands.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveVoiceSettings} className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="voice-enabled">Enable Voice Control</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow voice commands to control your home
                    </p>
                  </div>
                  <Switch
                    id="voice-enabled"
                    checked={voiceSettings.enabled}
                    onCheckedChange={(checked) => setVoiceSettings({ ...voiceSettings, enabled: checked })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="wake-word">Wake Word</Label>
                  <Input
                    id="wake-word"
                    value={voiceSettings.wakeWord}
                    onChange={(e) => setVoiceSettings({ ...voiceSettings, wakeWord: e.target.value })}
                    disabled={!voiceSettings.enabled}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="volume">Assistant Volume</Label>
                    <span className="text-sm">{voiceSettings.volume}%</span>
                  </div>
                  <Slider
                    id="volume"
                    defaultValue={[voiceSettings.volume]}
                    max={100}
                    step={1}
                    disabled={!voiceSettings.enabled}
                    onValueChange={(value) => setVoiceSettings({ ...voiceSettings, volume: value[0] })}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="response-speed">Response Speed</Label>
                    <span className="text-sm">
                      {voiceSettings.responseSpeed < 30
                        ? "Slow"
                        : voiceSettings.responseSpeed < 70
                        ? "Normal"
                        : "Fast"}
                    </span>
                  </div>
                  <Slider
                    id="response-speed"
                    defaultValue={[voiceSettings.responseSpeed]}
                    max={100}
                    step={1}
                    disabled={!voiceSettings.enabled}
                    onValueChange={(value) => setVoiceSettings({ ...voiceSettings, responseSpeed: value[0] })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="voice-type">Voice Type</Label>
                  <select
                    id="voice-type"
                    className="w-full rounded-md border p-2"
                    value={voiceSettings.voiceType}
                    onChange={(e) => setVoiceSettings({ ...voiceSettings, voiceType: e.target.value })}
                    disabled={!voiceSettings.enabled}
                  >
                    <option value="default">Default</option>
                    <option value="friendly">Friendly</option>
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                  </select>
                </div>
                
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="advanced">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Configure advanced options for your smart home. These settings are for experienced users.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-amber-50 p-4 text-amber-900 dark:bg-amber-950 dark:text-amber-200">
                <p className="font-medium">Advanced Settings are not available in demo mode</p>
                <p className="text-sm">
                  In a real implementation, this section would contain network settings, API configurations, backup options, and developer tools.
                </p>
              </div>
              
              <Button variant="outline" disabled>
                Reset All Devices
              </Button>
              <Button variant="outline" disabled>
                Export Configuration
              </Button>
              <Button variant="outline" className="w-full" disabled>
                System Diagnostics
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
