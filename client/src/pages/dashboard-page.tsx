import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DealsList from "@/components/dashboard/DealsList";
import DealForm from "@/components/deals/DealForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Property, SavedDeal, ClosedDeal, ContactRequest } from "@shared/schema";

export default function DashboardPage() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Parse the active tab from the URL if available
  useEffect(() => {
    const path = location.split("/");
    if (path.length > 2) {
      setActiveTab(path[2]);
    } else {
      setActiveTab("overview");
    }
  }, [location]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      setLocation("/auth");
    } else if (!user.isVerified) {
      setLocation("/verification");
    }
  }, [user, setLocation]);

  // Fetch user's properties
  const { data: properties } = useQuery<Property[]>({
    queryKey: [`/api/properties?userId=${user?.id}`],
    enabled: !!user,
  });

  // Fetch user's saved deals
  const { data: savedDeals } = useQuery<SavedDeal[]>({
    queryKey: ["/api/saved-deals"],
    enabled: !!user,
  });

  // Fetch user's closed deals
  const { data: closedDeals } = useQuery<ClosedDeal[]>({
    queryKey: ["/api/closed-deals"],
    enabled: !!user,
  });

  // Fetch user's contact requests/messages
  const { data: contactRequests } = useQuery<ContactRequest[]>({
    queryKey: ["/api/contact-requests"],
    enabled: !!user,
  });

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (!user) return null;

  // Render dashboard overview
  const renderOverview = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-1">
              {user.userType === "wholesaler" ? "Your Listings" : "Saved Deals"}
            </p>
            <p className="text-2xl font-bold text-gray-800 mb-2">
              {user.userType === "wholesaler" ? properties?.length || 0 : savedDeals?.length || 0}
            </p>
            <p className="text-xs text-gray-500">
              {user.userType === "wholesaler" ? "Active property listings" : "Properties you've saved"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-1">Active Deals</p>
            <p className="text-2xl font-bold text-gray-800 mb-2">
              {properties?.filter(p => p.status === "under_contract")?.length || 0}
            </p>
            <p className="text-xs text-gray-500">Deals currently under contract</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-1">Closed Deals</p>
            <p className="text-2xl font-bold text-gray-800 mb-2">
              {closedDeals?.length || 0}
            </p>
            <p className="text-xs text-gray-500">Successfully closed transactions</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {contactRequests && contactRequests.length > 0 ? (
            <div className="space-y-3">
              {contactRequests.slice(0, 3).map((request) => (
                <div key={request.id} className="flex items-start p-3 bg-gray-50 rounded-md">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-lg mr-3">
                    {request.senderId === user.id ? "S" : "R"}
                  </div>
                  <div>
                    <p className="font-medium">
                      {request.senderId === user.id ? "You sent a message" : "You received a message"}
                    </p>
                    <p className="text-sm text-gray-500">{request.message.substring(0, 100)}...</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>
            {user.userType === "wholesaler" ? "Your Recent Listings" : "Recently Saved Deals"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DealsList 
            type={user.userType === "wholesaler" ? "my" : "saved"} 
            userId={user.id} 
          />
        </CardContent>
      </Card>
    </>
  );

  // Render appropriate content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "post":
        return <DealForm />;
      case "listings":
        return <DealsList type="my" userId={user.id} />;
      case "saved":
        return <DealsList type="saved" userId={user.id} />;
      case "active":
        return <DealsList type="active" userId={user.id} />;
      case "closed":
        return <DealsList type="closed" userId={user.id} />;
      default:
        return renderOverview();
    }
  };

  return (
    <DashboardLayout activeTab={activeTab}>
      {renderContent()}
    </DashboardLayout>
  );
}
