
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import ExpensesSection from "@/components/sections/ExpensesSection";
import PendingCustomersSection from "@/components/sections/PendingCustomersSection";
import CompletedCustomersSection from "@/components/sections/CompletedCustomersSection";
import EmployeesSection from "@/components/sections/EmployeesSection";
import CoveragesSection from "@/components/sections/CoveragesSection";
import AccountsSection from "@/components/sections/AccountsSection";
import MonthlyYearlyClosingSection from "@/components/sections/MonthlyYearlyClosingSection";
import CapitalOverYearSection from "@/components/sections/CapitalOverYearSection";
import Dashboard from "@/components/Dashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />}>
              <Route index element={<Dashboard />} />
              <Route path="expenses" element={<ExpensesSection />} />
              <Route path="pending-customers" element={<PendingCustomersSection />} />
              <Route path="completed-customers" element={<CompletedCustomersSection />} />
              <Route path="employees" element={<EmployeesSection />} />
              <Route path="coverages" element={<CoveragesSection />} />
              <Route path="accounts" element={<AccountsSection />} />
              <Route path="closing" element={<MonthlyYearlyClosingSection />} />
              <Route path="capital" element={<CapitalOverYearSection />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
