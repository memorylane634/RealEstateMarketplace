import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Users, 
  FileCheck, 
  Home, 
  Check, 
  X, 
  FileText, 
  Eye, 
  Loader2,
  LogOut
} from "lucide-react";
import { useLocation } from "wouter";

// Define types for our API responses
type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  verificationStatus: string;
  isVerified: boolean;
  createdAt: string;
};

type VerificationDocument = {
  id: number;
  userId: number;
  documentType: string;
  filePath: string;
  status: string;
  uploadedAt: string;
};

type Property = {
  id: number;
  userId: number;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  status: string;
  contractPrice: number;
  arv: number;
  repairCost: number;
  assignmentFee: number;
  isApproved: boolean;
  createdAt: string;
};

export default function AdminDashboard() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Fetch all users
  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });
  
  // Fetch all verification documents
  const { data: documents, isLoading: documentsLoading } = useQuery<VerificationDocument[]>({
    queryKey: ["/api/admin/verification-documents"],
  });
  
  // Fetch all properties
  const { data: properties, isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ["/api/admin/deals"],
  });
  
  // Mutation to approve/reject user verification
  const updateUserVerificationMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: number, status: string }) => {
      if (status === "verified") {
        const res = await apiRequest("PATCH", `/api/admin/verify-buyer/${userId}`, { 
          verificationStatus: status 
        });
        return await res.json();
      } else {
        const res = await apiRequest("PATCH", `/api/admin/verify-seller/${userId}`, { 
          verificationStatus: status 
        });
        return await res.json();
      }
    },
    onSuccess: () => {
      toast({
        title: "User verification status updated",
      });
      // Refresh users
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update user",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Mutation to approve/reject verification document
  const updateDocumentStatusMutation = useMutation({
    mutationFn: async ({ documentId, status }: { documentId: number, status: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/verify-document/${documentId}`, { status });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Document status updated",
      });
      // Refresh documents
      queryClient.invalidateQueries({ queryKey: ["/api/admin/verification-documents"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update document",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Mutation to approve/reject property
  const updatePropertyStatusMutation = useMutation({
    mutationFn: async ({ propertyId, isApproved }: { propertyId: number, isApproved: boolean }) => {
      const res = await apiRequest("PATCH", `/api/admin/approve-property/${propertyId}`, { isApproved });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Property status updated",
      });
      // Refresh properties
      queryClient.invalidateQueries({ queryKey: ["/api/admin/deals"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update property",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Filter pending verification users, documents, and properties
  const pendingBuyers = users?.filter(u => u.userType === "cash_buyer" && u.verificationStatus === "pending") || [];
  const pendingSellers = users?.filter(u => u.userType === "wholesaler" && u.verificationStatus === "pending") || [];
  const pendingDocuments = documents?.filter(d => d.status === "pending") || [];
  const pendingProperties = properties?.filter(p => !p.isApproved) || [];
  
  // Handle admin logout
  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    toast({
      title: "Logged out",
      description: "You have been logged out of the admin dashboard",
    });
    setLocation("/admin/login");
  };
  
  // Function to open document in new tab
  const viewDocument = (type: string, filename: string) => {
    window.open(`/api/admin/proof/${type}/${filename}`, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-500">Manage users, properties, and verification requests</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          
          {/* Dashboard overview cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Pending Buyers</p>
                    <p className="text-2xl font-bold">
                      {usersLoading ? (
                        <Skeleton className="h-8 w-8" />
                      ) : (
                        pendingBuyers.length
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Pending Sellers</p>
                    <p className="text-2xl font-bold">
                      {usersLoading ? (
                        <Skeleton className="h-8 w-8" />
                      ) : (
                        pendingSellers.length
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <FileCheck className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Pending Documents</p>
                    <p className="text-2xl font-bold">
                      {documentsLoading ? (
                        <Skeleton className="h-8 w-8" />
                      ) : (
                        pendingDocuments.length
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Home className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Pending Deals</p>
                    <p className="text-2xl font-bold">
                      {propertiesLoading ? (
                        <Skeleton className="h-8 w-8" />
                      ) : (
                        pendingProperties.length
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content tabs */}
          <Tabs defaultValue="deals">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="deals">All Deals</TabsTrigger>
              <TabsTrigger value="buyers">Cash Buyers</TabsTrigger>
              <TabsTrigger value="sellers">Wholesalers</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            
            {/* Deals tab */}
            <TabsContent value="deals">
              <Card>
                <CardHeader>
                  <CardTitle>Property Listings</CardTitle>
                  <CardDescription>
                    Review and approve property listings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {propertiesLoading ? (
                    <div className="space-y-4">
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Skeleton className="h-10 w-10 rounded-md" />
                            <div>
                              <Skeleton className="h-4 w-40 mb-2" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Skeleton className="h-9 w-20" />
                            <Skeleton className="h-9 w-20" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : properties && properties.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No deals available</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Property</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {properties?.map((property) => (
                          <TableRow key={property.id}>
                            <TableCell className="font-medium">{property.title}</TableCell>
                            <TableCell>{property.address}, {property.city}, {property.state}</TableCell>
                            <TableCell>{property.propertyType.replace(/_/g, ' ')}</TableCell>
                            <TableCell>
                              ${property.contractPrice.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <Badge className={property.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                                {property.isApproved ? "Approved" : "Pending"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                {!property.isApproved && (
                                  <Button 
                                    size="sm" 
                                    onClick={() => updatePropertyStatusMutation.mutate({ 
                                      propertyId: property.id, 
                                      isApproved: true 
                                    })}
                                    disabled={updatePropertyStatusMutation.isPending}
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                )}
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setLocation(`/deals/${property.id}`)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Cash Buyers tab */}
            <TabsContent value="buyers">
              <Card>
                <CardHeader>
                  <CardTitle>Cash Buyer Verification</CardTitle>
                  <CardDescription>
                    Review and approve cash buyer verification requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="space-y-4">
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div>
                              <Skeleton className="h-4 w-40 mb-2" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Skeleton className="h-9 w-20" />
                            <Skeleton className="h-9 w-20" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : pendingBuyers.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No pending cash buyer verification requests</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Registration Date</TableHead>
                          <TableHead>Documents</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingBuyers.map((user) => {
                          const userDocs = documents?.filter(doc => doc.userId === user.id) || [];
                          const hasProofOfFunds = userDocs.some(doc => doc.documentType === "proof_of_funds");
                          const hasID = userDocs.some(doc => doc.documentType === "id");
                          
                          return (
                            <TableRow key={user.id}>
                              <TableCell>
                                {user.firstName} {user.lastName}
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <Badge variant={hasID ? "outline" : "destructive"} className="mr-1">
                                    ID: {hasID ? "Uploaded" : "Missing"}
                                  </Badge>
                                  <Badge variant={hasProofOfFunds ? "outline" : "destructive"}>
                                    Proof of Funds: {hasProofOfFunds ? "Uploaded" : "Missing"}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    onClick={() => updateUserVerificationMutation.mutate({ 
                                      userId: user.id, 
                                      status: "verified" 
                                    })}
                                    disabled={updateUserVerificationMutation.isPending || !hasID || !hasProofOfFunds}
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Verify
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-red-500 border-red-200 hover:bg-red-50"
                                    onClick={() => updateUserVerificationMutation.mutate({ 
                                      userId: user.id, 
                                      status: "rejected" 
                                    })}
                                    disabled={updateUserVerificationMutation.isPending}
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Wholesalers tab */}
            <TabsContent value="sellers">
              <Card>
                <CardHeader>
                  <CardTitle>Wholesaler Verification</CardTitle>
                  <CardDescription>
                    Review and approve wholesaler verification requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="space-y-4">
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div>
                              <Skeleton className="h-4 w-40 mb-2" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Skeleton className="h-9 w-20" />
                            <Skeleton className="h-9 w-20" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : pendingSellers.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No pending wholesaler verification requests</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Registration Date</TableHead>
                          <TableHead>Documents</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingSellers.map((user) => {
                          const userDocs = documents?.filter(doc => doc.userId === user.id) || [];
                          const hasContract = userDocs.some(doc => doc.documentType === "contract");
                          const hasID = userDocs.some(doc => doc.documentType === "id");
                          
                          return (
                            <TableRow key={user.id}>
                              <TableCell>
                                {user.firstName} {user.lastName}
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <Badge variant={hasID ? "outline" : "destructive"} className="mr-1">
                                    ID: {hasID ? "Uploaded" : "Missing"}
                                  </Badge>
                                  <Badge variant={hasContract ? "outline" : "destructive"}>
                                    Contract: {hasContract ? "Uploaded" : "Missing"}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button 
                                    size="sm" 
                                    onClick={() => updateUserVerificationMutation.mutate({ 
                                      userId: user.id, 
                                      status: "verified" 
                                    })}
                                    disabled={updateUserVerificationMutation.isPending || !hasID || !hasContract}
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Verify
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="text-red-500 border-red-200 hover:bg-red-50"
                                    onClick={() => updateUserVerificationMutation.mutate({ 
                                      userId: user.id, 
                                      status: "rejected" 
                                    })}
                                    disabled={updateUserVerificationMutation.isPending}
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Documents tab */}
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Document Verification</CardTitle>
                  <CardDescription>
                    Review uploaded verification documents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {documentsLoading ? (
                    <div className="space-y-4">
                      {Array(3).fill(0).map((_, i) => (
                        <div key={i} className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Skeleton className="h-10 w-10 rounded-md" />
                            <div>
                              <Skeleton className="h-4 w-40 mb-2" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Skeleton className="h-9 w-20" />
                            <Skeleton className="h-9 w-20" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : pendingDocuments.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No pending document verification requests</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User ID</TableHead>
                          <TableHead>Document Type</TableHead>
                          <TableHead>Uploaded</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingDocuments.map((doc) => (
                          <TableRow key={doc.id}>
                            <TableCell>{doc.userId}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                                <span className="capitalize">{doc.documentType.replace(/_/g, ' ')}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              {new Date(doc.uploadedAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                Pending
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => viewDocument(doc.documentType, doc.filePath.split('/').pop() || '')}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => updateDocumentStatusMutation.mutate({ 
                                    documentId: doc.id, 
                                    status: "verified" 
                                  })}
                                  disabled={updateDocumentStatusMutation.isPending}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  className="text-red-500 border-red-200 hover:bg-red-50"
                                  onClick={() => updateDocumentStatusMutation.mutate({ 
                                    documentId: doc.id, 
                                    status: "rejected" 
                                  })}
                                  disabled={updateDocumentStatusMutation.isPending}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}