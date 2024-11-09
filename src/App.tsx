import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import ChatBot from "./components/ChatBot";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import Assessment from "./pages/Assessment";
import { AuditFormProvider } from "./contexts/AuditFormContext";
import { AuditFormModal } from "./components/AuditFormModal";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <AuditFormProvider>
            <Navigation />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/services" element={<Services />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/assessment/*" element={<Assessment />} />
            </Routes>
            <ChatBot />
            <AuditFormModal />
            <Toaster />
            <Sonner />
          </AuditFormProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;