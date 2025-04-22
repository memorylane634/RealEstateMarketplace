import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, VerificationDocument, Property } from "@shared/schema";
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
  AlertCircle
} from "lucide-react";

type UserWithoutPassword = Omit<User, 'password'>;

export default function AdminPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Redirect if not admin
  useEffect(() => {
    if (user && user.userType !== "admin") {
      setLocation("/");
    } else if (!user) {
      setLocation("/auth");
    }
  }, [user, setLocation]);
  
  // Fetch all users
  const { data: users, isLoading: usersLoading } = useQuery<UserWithoutPassword[]>({
    queryKey: ["/api/admin/users"],
    enabled: !!user && user.userType === "admin",
  });
  
  // Fetch all verification documents
  const { data: documents, isLoading: documentsLoading } = useQuery<VerificationDocument[]>({
    queryKey: ["/api/admin/verification-documents"],
    enabled: !!user && user.userType === "admin",
  });
  
  // Fetch all properties
  const { data: properties, isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
    enabled: !!user && user.userType === "admin",
  });
  
  // Mutation to approve/reject user verification
  const updateUserVerificationMutation = useMutation({
    mutationFn: async ({ userId, status }: { userId: number, status: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/verify-user/${userId}`, { verificationStatus: status });
      return await res.json();
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
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
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
  const pendingUsers = users?.filter(u => u.verificationStatus === "pending") || [];
  const pendingDocuments = documents?.filter(d => d.status === "pending") || [];
  const pendingProperties = properties?.filter(p => !p.isApproved) || [];
  
  if (!user || user.userType !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500">Manage users, properties, and verification requests</p>
          </div>
          
          {/* Dashboard overview cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-500">Pending Verifications</p>
                    <p className="text-2xl font-bold">
                      {usersLoading ? (
                        <Skeleton className="h-8 w-8" />
                      ) : (
                        pendingUsers.length
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
                    <FileCheck className="h-6 w-6 text-green-600" />
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
                    <p className="text-sm text-gray-500">Pending Properties</p>
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
          <Tabs defaultValue="users">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="properties">Properties</TabsTrigger>
            </TabsList>
            
            {/* Users tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Verification Requests</CardTitle>
                  <CardDescription>
                    Review and approve new user verification requests
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
                  ) : pendingUsers.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No pending user verification requests</p>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>User Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pendingUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell>
                              {user.firstName} {user.lastName}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Badge className="capitalize">
                                {user.userType === "cash_buyer" ? "Cash Buyer" : user.userType}
                              </Badge>
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
                                  onClick={() => updateUserVerificationMutation.mutate({ 
                                    userId: user.id, 
                                    status: "verified" 
                                  })}
                                  disabled={updateUserVerificationMutation.isPending}
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
                        ))}
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
                                  onClick={() => window.open(`/uploads/${doc.filePath.split('/').pop()}`, '_blank')}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={() => updateDocumentStatusMutation.mutate({ 
                                    documentId: doc.id, 
                                    status: "approved" 
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
            
            {/* Properties tab */}
            <TabsContent value="properties">
              <Card>
                <CardHeader>
                  <CardTitle>Property Approval</CardTitle>
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
                            <Skeleton className="h-16 w-16 rounded-md" />
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
                  ) : pendingProperties.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No pending property approval requests</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingProperties.map((property) => (
                        <div
                          key={property.id}
                          className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col md:flex-row gap-4"
                        >
                          <div className="w-full md:w-32 h-24 bg-gray-200 rounded-md flex-shrink-0 flex items-center justify-center">
                            <Home className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{property.title}</h3>
                            <p className="text-sm text-gray-500">
                              {property.address}, {property.city}, {property.state}
                            </p>
                            <div className="flex gap-4 mt-2">
                              <div>
                                <p className="text-xs text-gray-500">Price</p>
                                <p className="font-medium">
                                  ${property.contractPrice.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Posted By</p>
                                <p className="font-medium">User #{property.userId}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Status</p>
                                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                  Pending
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2 justify-center">
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
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-500 border-red-200 hover:bg-red-50"
                              onClick={() => updatePropertyStatusMutation.mutate({ 
                                propertyId: property.id, 
                                isApproved: false 
                              })}
                              disabled={updatePropertyStatusMutation.isPending}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
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
