
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Add new pages for navigation links
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";

// Import Dashboard pages
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardProjects from "./pages/dashboard/Projects";
import DashboardBlog from "./pages/dashboard/Blog";
import DashboardMessages from "./pages/dashboard/Messages";
import DashboardAnalytics from "./pages/dashboard/Analytics";
import DashboardDonations from "./pages/dashboard/Donations";
import DashboardSettings from "./pages/dashboard/Settings";
import DashboardLayout from "./components/dashboard/DashboardLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/projects" element={<DashboardProjects />} />
          <Route path="/dashboard/blog" element={<DashboardBlog />} />
          <Route path="/dashboard/messages" element={<DashboardMessages />} />
          <Route path="/dashboard/analytics" element={<DashboardAnalytics />} />
          <Route path="/dashboard/donations" element={<DashboardDonations />} />
          <Route path="/dashboard/settings" element={<DashboardSettings />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
