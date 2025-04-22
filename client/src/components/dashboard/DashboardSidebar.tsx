import { Link, useLocation } from "wouter";
import { 
  Search, 
  Star, 
  Clipboard, 
  History, 
  Sliders, 
  UserCog, 
  FileText, 
  Plus, 
  List, 
  Home
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface DashboardSidebarProps {
  userType: string;
  activeTab?: string;
}

export default function DashboardSidebar({ userType, activeTab = "overview" }: DashboardSidebarProps) {
  const { user } = useAuth();
  const [location] = useLocation();

  const isCashBuyer = userType === "cash_buyer";
  const isWholesaler = userType === "wholesaler";

  const isActive = (tab: string) => {
    return activeTab === tab;
  };

  return (
    <div className="lg:w-64 flex-shrink-0">
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-semibold">
              {user?.firstName?.charAt(0) || ""}{user?.lastName?.charAt(0) || ""}
            </span>
          </div>
          <div className="ml-4">
            <p className="font-medium">{user?.firstName} {user?.lastName}</p>
            <div className="flex items-center">
              {user?.isVerified ? (
                <span className="px-2 py-1 text-xs rounded-full bg-green-500 text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {isCashBuyer ? "Verified Buyer" : "Verified Wholesaler"}
                </span>
              ) : (
                <span className="px-2 py-1 text-xs rounded-full bg-orange-500 text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Pending Verification
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-1">
        <Link href="/dashboard">
          <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            isActive("overview") 
              ? "bg-primary text-white" 
              : "text-gray-700 hover:bg-gray-50"
          }`}>
            <Home className="mr-3 h-5 w-5" />
            Dashboard Overview
          </a>
        </Link>

        {isCashBuyer && (
          <>
            <Link href="/deals">
              <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive("browse") 
                  ? "bg-primary text-white" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}>
                <Search className="mr-3 h-5 w-5" />
                Browse Deals
              </a>
            </Link>
            
            <Link href="/dashboard/saved">
              <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive("saved") 
                  ? "bg-primary text-white" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}>
                <Star className="mr-3 h-5 w-5" />
                Saved Deals
              </a>
            </Link>
            
            <Link href="/dashboard/active">
              <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive("active") 
                  ? "bg-primary text-white" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}>
                <Clipboard className="mr-3 h-5 w-5" />
                Active Deals
              </a>
            </Link>
            
            <Link href="/dashboard/closed">
              <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive("closed") 
                  ? "bg-primary text-white" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}>
                <History className="mr-3 h-5 w-5" />
                Closed Deals
              </a>
            </Link>
            
            <Link href="/dashboard/criteria">
              <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive("criteria") 
                  ? "bg-primary text-white" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}>
                <Sliders className="mr-3 h-5 w-5" />
                Buying Criteria
              </a>
            </Link>
          </>
        )}

        {isWholesaler && (
          <>
            <Link href="/dashboard/post">
              <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive("post") 
                  ? "bg-primary text-white" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}>
                <Plus className="mr-3 h-5 w-5" />
                Post a Deal
              </a>
            </Link>
            
            <Link href="/dashboard/listings">
              <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive("listings") 
                  ? "bg-primary text-white" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}>
                <List className="mr-3 h-5 w-5" />
                My Listings
              </a>
            </Link>
            
            <Link href="/dashboard/active">
              <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive("active") 
                  ? "bg-primary text-white" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}>
                <Clipboard className="mr-3 h-5 w-5" />
                Active Deals
              </a>
            </Link>
            
            <Link href="/dashboard/closed">
              <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive("closed") 
                  ? "bg-primary text-white" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}>
                <History className="mr-3 h-5 w-5" />
                Closed Deals
              </a>
            </Link>
          </>
        )}

        <Link href="/verification">
          <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            isActive("verification") 
              ? "bg-primary text-white" 
              : "text-gray-700 hover:bg-gray-50"
          }`}>
            <FileText className="mr-3 h-5 w-5" />
            Verification Status
          </a>
        </Link>
        
        <Link href="/dashboard/settings">
          <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
            isActive("settings") 
              ? "bg-primary text-white" 
              : "text-gray-700 hover:bg-gray-50"
          }`}>
            <UserCog className="mr-3 h-5 w-5" />
            Account Settings
          </a>
        </Link>
      </div>
    </div>
  );
}
