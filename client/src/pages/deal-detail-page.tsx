import { useEffect, useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Property, ContactRequest } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import VerificationStatus from "@/components/common/VerificationStatus";
import { 
  ArrowLeft, 
  Heart, 
  Share, 
  Check, 
  MapPin, 
  Home, 
  DollarSign, 
  Hammer, 
  Briefcase,
  Calendar, 
  MessageSquare, 
  FileText,
  Loader2,
  AlertCircle
} from "lucide-react";

export default function DealDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [contactMessage, setContactMessage] = useState("");
  
  // Fetch property details
  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: [`/api/properties/${id}`],
  });
  
  // Format currency values
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Handle saving a deal
  const saveDealMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/saved-deals", { propertyId: parseInt(id) });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Deal saved",
        description: "This property has been added to your saved deals.",
      });
      // Refresh saved deals
      queryClient.invalidateQueries({ queryKey: ["/api/saved-deals"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error saving deal",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle contact seller
  const contactSellerMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/contact-requests", {
        propertyId: parseInt(id),
        message: contactMessage,
      });
      return await res.json() as ContactRequest;
    },
    onSuccess: () => {
      toast({
        title: "Message sent",
        description: "Your message has been sent to the wholesaler.",
      });
      setContactMessage("");
      // Refresh contact requests
      queryClient.invalidateQueries({ queryKey: ["/api/contact-requests"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle contact submission
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message to send to the seller.",
        variant: "destructive",
      });
      return;
    }
    contactSellerMutation.mutate();
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-5 w-96" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="w-full h-64 rounded-lg mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {Array(4).fill(0).map((_, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                      <Skeleton className="h-4 w-3/4 mb-1" />
                      <Skeleton className="h-6 w-1/2" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-48 w-full rounded-lg" />
              </div>
              <div>
                <Skeleton className="w-full h-64 rounded-lg mb-4" />
                <Skeleton className="w-full h-48 rounded-lg" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-md mx-auto">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h1>
              <p className="text-gray-500 mb-6">
                {error ? (error as Error).message : "The property you're looking for doesn't exist or has been removed."}
              </p>
              <Button onClick={() => setLocation("/deals")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Deals
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => setLocation("/deals")}
              className="mr-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Deals
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
              <p className="text-gray-500 flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {property.address}, {property.city}, {property.state} {property.zipCode}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Property Image */}
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z" clipRule="evenodd" />
                  <path d="M4 12h12v3H4v-3z" />
                </svg>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <VerificationStatus status="verified" size="md" />
                  <span className="ml-4 text-gray-500 text-sm">
                    Posted {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => saveDealMutation.mutate()} disabled={!user?.isVerified || saveDealMutation.isPending}>
                    {saveDealMutation.isPending ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Heart className="h-4 w-4 mr-2" />
                    )}
                    Save
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
              
              {/* Property details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center text-gray-500 mb-1">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span className="text-xs">Contract Price</span>
                  </div>
                  <p className="font-semibold text-lg">{formatCurrency(property.contractPrice)}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Home className="h-4 w-4 mr-1" />
                    <span className="text-xs">ARV</span>
                  </div>
                  <p className="font-semibold text-lg">{formatCurrency(property.arv)}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Hammer className="h-4 w-4 mr-1" />
                    <span className="text-xs">Repair Estimate</span>
                  </div>
                  <p className="font-semibold text-lg">{formatCurrency(property.repairCost)}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span className="text-xs">Assignment Fee</span>
                  </div>
                  <p className="font-semibold text-lg">{formatCurrency(property.assignmentFee)}</p>
                </div>
              </div>
              
              {/* Deal information tabs */}
              <Tabs defaultValue="details">
                <TabsList className="w-full">
                  <TabsTrigger value="details" className="flex-1">Property Details</TabsTrigger>
                  <TabsTrigger value="numbers" className="flex-1">Deal Numbers</TabsTrigger>
                  <TabsTrigger value="docs" className="flex-1">Documents</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="bg-white p-6 rounded-lg shadow-sm mt-2">
                  <h3 className="text-lg font-medium mb-4">Property Information</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-gray-500 text-sm">Property Type</p>
                      <p className="font-medium">
                        {property.propertyType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Status</p>
                      <p className="font-medium capitalize">{property.status}</p>
                    </div>
                  </div>
                  
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-gray-700 mb-4">{property.notes || "No additional description provided."}</p>
                </TabsContent>
                
                <TabsContent value="numbers" className="bg-white p-6 rounded-lg shadow-sm mt-2">
                  <h3 className="text-lg font-medium mb-4">Deal Analysis</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Contract Price:</span>
                      <span className="font-medium">{formatCurrency(property.contractPrice)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">After Repair Value (ARV):</span>
                      <span className="font-medium">{formatCurrency(property.arv)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Estimated Repair Costs:</span>
                      <span className="font-medium">{formatCurrency(property.repairCost)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Assignment Fee:</span>
                      <span className="font-medium">{formatCurrency(property.assignmentFee)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Total Investment (Contract + Repairs):</span>
                      <span className="font-medium">{formatCurrency(property.contractPrice + property.repairCost)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Potential Profit (ARV - Total Investment):</span>
                      <span className="font-medium">{formatCurrency(property.arv - (property.contractPrice + property.repairCost))}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">ROI:</span>
                      <span className="font-medium">
                        {((property.arv - (property.contractPrice + property.repairCost)) / (property.contractPrice + property.repairCost) * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h4 className="font-medium flex items-center mb-2">
                      <Check className="h-4 w-4 text-blue-500 mr-2" />
                      QuickDeals Verification
                    </h4>
                    <p className="text-sm text-gray-600">
                      Our team has verified the contract, property details, and numbers on this deal.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="docs" className="bg-white p-6 rounded-lg shadow-sm mt-2">
                  <h3 className="text-lg font-medium mb-4">Available Documents</h3>
                  
                  {!user?.isVerified ? (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-4">
                      <p className="text-yellow-800 flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        You must be a verified user to view documents
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-gray-50 rounded-md">
                        <FileText className="h-5 w-5 text-gray-500 mr-3" />
                        <div className="flex-1">
                          <p className="font-medium">Assignable Purchase Contract</p>
                          <p className="text-sm text-gray-500">Uploaded by wholesaler</p>
                        </div>
                        <Button size="sm" variant="outline" className="ml-2">View</Button>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar */}
            <div>
              {/* Contact seller */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Contact Wholesaler
                  </CardTitle>
                  <CardDescription>
                    Send a message to the property wholesaler
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!user ? (
                    <div className="text-center py-4">
                      <p className="text-gray-500 mb-4">You must be logged in to contact the wholesaler</p>
                      <Button onClick={() => setLocation("/auth")}>Login or Register</Button>
                    </div>
                  ) : !user.isVerified ? (
                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                      <p className="text-yellow-800 text-sm flex items-center">
                        <AlertCircle className="h-5 w-5 mr-2" />
                        You must be a verified user to contact wholesalers
                      </p>
                      <Button 
                        variant="link" 
                        className="px-0 text-yellow-800" 
                        onClick={() => setLocation("/verification")}
                      >
                        Complete verification
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit}>
                      <Textarea
                        placeholder="Enter your message to the wholesaler..."
                        className="mb-4"
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        rows={5}
                      />
                      <Button 
                        type="submit" 
                        className="w-full"
                        disabled={contactSellerMutation.isPending}
                      >
                        {contactSellerMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send Message"
                        )}
                      </Button>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Only verified users can contact wholesalers
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>
              
              {/* Deal timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Deal Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                          <Check className="h-4 w-4" />
                        </div>
                        <div className="h-full w-0.5 bg-gray-200 mt-1"></div>
                      </div>
                      <div>
                        <p className="font-medium">Deal Listed</p>
                        <p className="text-sm text-gray-500">
                          {new Date(property.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Property listed by wholesaler
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center">
                          <Check className="h-4 w-4" />
                        </div>
                        <div className="h-full w-0.5 bg-gray-200 mt-1"></div>
                      </div>
                      <div>
                        <p className="font-medium">Deal Verified</p>
                        <p className="text-sm text-gray-500">
                          {new Date(property.updatedAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Contract and property details verified by QuickDeals
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center">
                          3
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-500">Under Contract</p>
                        <p className="text-sm text-gray-400">Pending</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Waiting for buyer to secure the contract
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
