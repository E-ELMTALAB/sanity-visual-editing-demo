import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetails from "./pages/CourseDetails";
import EnterpriseSales from "./pages/EnterpriseSales";
import Magazine from "./pages/Magazine";
import Support from "./pages/Support";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Auth from "./pages/Auth";
import LearningPath from "./pages/LearningPath";
import PathBuilder from "./pages/PathBuilder";
import StartPath from "./pages/StartPath";
import FreeConsultation from "./pages/FreeConsultation";
import NotFound from "./pages/NotFound";
import FloatingSupportWidget from "./components/FloatingSupportWidget";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course/:courseId" element={<CourseDetails />} />
          <Route path="/learning-path/:pathId" element={<LearningPath />} />
          <Route path="/start-path/:pathType" element={<StartPath />} />
          <Route path="/enterprise" element={<EnterpriseSales />} />
          <Route path="/magazine" element={<Magazine />} />
          <Route path="/support" element={<Support />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/path-builder" element={<PathBuilder />} />
          <Route path="/free-consultation" element={<FreeConsultation />} />
          <Route path="/legal/terms" element={<TermsOfService />} />
          <Route path="/legal/privacy" element={<PrivacyPolicy />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FloatingSupportWidget />
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
