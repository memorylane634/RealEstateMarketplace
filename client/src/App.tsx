import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import DealsPage from "@/pages/deals-page";
import DealDetailPage from "@/pages/deal-detail-page";
import AdminPage from "@/pages/admin-page";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminLoginPage from "@/pages/admin-login-page";
import VerificationPage from "@/pages/verification-page";
import TermsPage from "@/pages/terms-page";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute, VerifiedRoute, AdminRoute } from "@/lib/protected-route";
import { AdminProtectedRoute } from "@/lib/admin-protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage}/>
      <Route path="/auth" component={AuthPage}/>
      <Route path="/terms" component={TermsPage}/>
      <ProtectedRoute path="/verification" component={VerificationPage}/>
      <ProtectedRoute path="/dashboard" component={DashboardPage}/>
      <Route path="/deals" component={DealsPage}/>
      <Route path="/deals/:id" component={DealDetailPage}/>
      <AdminRoute path="/admin" component={AdminPage}/>
      
      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLoginPage}/>
      <AdminProtectedRoute path="/admin" component={AdminDashboard}/>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
