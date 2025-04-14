
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout";
import { DeviceProvider } from "./contexts/device-context";
import { StudyAssistantProvider } from "./contexts/study-assistant-context";

// Pages
import Dashboard from "./pages/Dashboard";
import Devices from "./pages/Devices";
import Assistant from "./pages/Assistant";
import Analytics from "./pages/Analytics";
import AddDevice from "./pages/AddDevice";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import StudyAssistant from "./pages/StudyAssistant";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DeviceProvider>
        <StudyAssistantProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/devices" element={<Devices />} />
                <Route path="/assistant" element={<Assistant />} />
                <Route path="/study-assistant" element={<StudyAssistant />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/add-device" element={<AddDevice />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </StudyAssistantProvider>
      </DeviceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
