
// Root component of the application, handles routing and layout
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Add new pages for navigation links
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contact from "./pages/Contact";
import Services from "./pages/Services";
import Auth from "./pages/Auth";
import ProjectDetail from "./pages/ProjectDetail";

// Import Dashboard pages
import DashboardHome from "./pages/dashboard/DashboardHome";
import DashboardProjects from "./pages/dashboard/Projects";
import ProjectEdit from "./pages/dashboard/ProjectEdit";
import DashboardBlog from "./pages/dashboard/Blog";
import DashboardBlogEdit from "./pages/dashboard/BlogEdit";
import DashboardMessages from "./pages/dashboard/Messages";
import DashboardAnalytics from "./pages/dashboard/Analytics";
import DashboardDonations from "./pages/dashboard/Donations";
import DashboardSettings from "./pages/dashboard/Settings";
import DashboardServices from "./pages/dashboard/Services";
import ServiceEdit from "./pages/dashboard/ServiceEdit";
import ServicePurchases from "./pages/dashboard/ServicePurchases";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/dashboard/projects" element={<DashboardProjects />} />
            <Route path="/dashboard/projects/new" element={<ProjectEdit />} />
            <Route path="/dashboard/projects/edit/:id" element={<ProjectEdit />} />
            <Route path="/dashboard/blog" element={<DashboardBlog />} />
            <Route path="/dashboard/blog/new" element={<DashboardBlogEdit />} />
            <Route path="/dashboard/blog/edit/:id" element={<DashboardBlogEdit />} />
            <Route path="/dashboard/messages" element={<DashboardMessages />} />
            <Route path="/dashboard/analytics" element={<DashboardAnalytics />} />
            <Route path="/dashboard/donations" element={<DashboardDonations />} />
            <Route path="/dashboard/settings" element={<DashboardSettings />} />
            <Route path="/dashboard/services" element={<DashboardServices />} />
            <Route path="/dashboard/services/new" element={<ServiceEdit />} />
            <Route path="/dashboard/services/edit/:id" element={<ServiceEdit />} />
            <Route path="/dashboard/service-purchases" element={<ServicePurchases />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
