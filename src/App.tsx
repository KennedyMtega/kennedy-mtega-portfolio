
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
          <Route path="/dashboard" element={<DashboardLayout><DashboardHome /></DashboardLayout>} />
          <Route path="/dashboard/projects" element={<DashboardLayout><DashboardProjects /></DashboardLayout>} />
          <Route path="/dashboard/blog" element={<DashboardLayout><DashboardHome /></DashboardLayout>} />
          <Route path="/dashboard/messages" element={<DashboardLayout><DashboardHome /></DashboardLayout>} />
          <Route path="/dashboard/analytics" element={<DashboardLayout><DashboardHome /></DashboardLayout>} />
          <Route path="/dashboard/donations" element={<DashboardLayout><DashboardHome /></DashboardLayout>} />
          <Route path="/dashboard/settings" element={<DashboardLayout><DashboardHome /></DashboardLayout>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
