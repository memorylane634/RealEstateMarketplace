import { ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/hooks/use-auth";

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab?: string;
}

export default function DashboardLayout({ 
  children, 
  activeTab = "overview" 
}: DashboardLayoutProps) {
  const { user } = useAuth();
  
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Please log in to access your dashboard</h2>
        </div>
      </div>
    );
  }

  const dashboardTitle = user.userType === "wholesaler" 
    ? "Wholesaler Dashboard" 
    : user.userType === "cash_buyer" 
      ? "Cash Buyer Dashboard" 
      : "Dashboard";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{dashboardTitle}</h1>
            <p className="text-gray-500">Manage your real estate deals and account</p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-6">
            <DashboardSidebar userType={user.userType} activeTab={activeTab} />
            
            <main className="flex-1">
              {children}
            </main>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
