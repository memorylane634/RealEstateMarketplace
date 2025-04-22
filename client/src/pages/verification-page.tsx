import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { VerificationDocument } from "@shared/schema";
import FileUpload from "@/components/common/FileUpload";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { CheckCircle2, AlertTriangle, Loader2, FileText } from "lucide-react";

export default function VerificationPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<string>("");
  
  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      setLocation("/auth");
    }
  }, [user, setLocation]);
  
  // Fetch user's verification documents
  const { data: documents, isLoading } = useQuery<VerificationDocument[]>({
    queryKey: ["/api/verification-documents"],
    enabled: !!user,
  });
  
  // Upload document mutation
  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!selectedFile || !documentType) {
        throw new Error("Please select a file and document type");
      }
      
      const formData = new FormData();
      formData.append("document", selectedFile);
      formData.append("documentType", documentType);
      
      const response = await fetch('/api/upload-verification', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload document");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Document uploaded",
        description: "Your verification document has been submitted for review.",
      });
      setSelectedFile(null);
      setDocumentType("");
      // Refresh documents
      queryClient.invalidateQueries({ queryKey: ["/api/verification-documents"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle file selection
  const handleFileChange = (file: File) => {
    setSelectedFile(file);
  };
  
  // Handle document type selection
  const handleDocumentTypeChange = (type: string) => {
    setDocumentType(type);
  };
  
  // Handle upload button click
  const handleUpload = () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }
    
    if (!documentType) {
      toast({
        title: "No document type selected",
        description: "Please select a document type.",
        variant: "destructive",
      });
      return;
    }
    
    uploadMutation.mutate();
  };
  
  // Check if the user has uploaded each required document type
  const hasIdDocument = documents?.some(doc => doc.documentType === "id");
  const hasContractDocument = documents?.some(doc => doc.documentType === "contract");
  const hasProofOfFundsDocument = documents?.some(doc => doc.documentType === "proof_of_funds");
  
  // Check if user has completed all required verification documents
  const isCashBuyer = user?.userType === "cash_buyer";
  const isWholesaler = user?.userType === "wholesaler";
  const cashBuyerComplete = hasIdDocument && hasProofOfFundsDocument;
  const wholesalerComplete = hasIdDocument && hasContractDocument;
  const isVerificationComplete = isCashBuyer ? cashBuyerComplete : wholesalerComplete;
  
  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Account Verification</h1>
            <p className="text-gray-500">Complete your verification to unlock all features of QuickDeals</p>
          </div>
          
          {/* Verification status */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Verification Status</CardTitle>
                <Badge
                  className={`${
                    user.verificationStatus === "verified" 
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : user.verificationStatus === "rejected"
                      ? "bg-red-100 text-red-800 hover:bg-red-100"
                      : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                  }`}
                >
                  {user.verificationStatus === "verified" && "Verified"}
                  {user.verificationStatus === "pending" && "Pending"}
                  {user.verificationStatus === "rejected" && "Rejected"}
                </Badge>
              </div>
              <CardDescription>
                {user.verificationStatus === "verified"
                  ? "Your account has been verified. You have full access to the platform."
                  : user.verificationStatus === "rejected"
                  ? "Your verification was rejected. Please upload new documents."
                  : "Your verification is pending approval from our team."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user.verificationStatus === "verified" ? (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800">Verification Complete</AlertTitle>
                  <AlertDescription className="text-green-700">
                    Your account has been verified and you now have full access to all features of QuickDeals.
                  </AlertDescription>
                </Alert>
              ) : user.verificationStatus === "rejected" ? (
                <Alert className="bg-red-50 border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertTitle className="text-red-800">Verification Rejected</AlertTitle>
                  <AlertDescription className="text-red-700">
                    Your verification documents were rejected. Please upload new documents that clearly show the required information.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  {isVerificationComplete ? (
                    <Alert className="bg-blue-50 border-blue-200">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      <AlertTitle className="text-blue-800">Verification Submitted</AlertTitle>
                      <AlertDescription className="text-blue-700">
                        All required documents have been submitted and are pending review. This usually takes 24-48 hours.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="bg-yellow-50 border-yellow-200">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <AlertTitle className="text-yellow-800">Verification Incomplete</AlertTitle>
                      <AlertDescription className="text-yellow-700">
                        {isCashBuyer
                          ? "Please upload your ID and proof of funds to complete verification."
                          : "Please upload your ID and an assignable purchase contract to complete verification."}
                      </AlertDescription>
                    </Alert>
                  )}
                </>
              )}
            </CardContent>
          </Card>
          
          {/* Required documents */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Required Documents</CardTitle>
              <CardDescription>
                Upload the following documents to verify your identity and capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* ID Document */}
                <div className="flex items-start space-x-4">
                  <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ${
                    hasIdDocument ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                  }`}>
                    {hasIdDocument ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <span>1</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">Government-Issued ID</h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Upload a clear photo or scan of your driver's license, passport, or state ID
                    </p>
                    {documents?.find(doc => doc.documentType === "id") ? (
                      <div className="flex items-center bg-gray-50 p-2 rounded-md">
                        <FileText className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-sm text-gray-600">ID document uploaded</span>
                        <Badge className="ml-auto" variant="outline">
                          {documents.find(doc => doc.documentType === "id")?.status}
                        </Badge>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => handleDocumentTypeChange("id")}
                        className={documentType === "id" ? "ring-2 ring-primary" : ""}
                      >
                        Select ID Document
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Cash Buyer: Proof of Funds */}
                {isCashBuyer && (
                  <div className="flex items-start space-x-4">
                    <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ${
                      hasProofOfFundsDocument ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                    }`}>
                      {hasProofOfFundsDocument ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <span>2</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">Proof of Funds</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Upload a bank statement, line of credit, or other proof of funds document
                      </p>
                      {documents?.find(doc => doc.documentType === "proof_of_funds") ? (
                        <div className="flex items-center bg-gray-50 p-2 rounded-md">
                          <FileText className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-600">Proof of funds document uploaded</span>
                          <Badge className="ml-auto" variant="outline">
                            {documents.find(doc => doc.documentType === "proof_of_funds")?.status}
                          </Badge>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => handleDocumentTypeChange("proof_of_funds")}
                          className={documentType === "proof_of_funds" ? "ring-2 ring-primary" : ""}
                        >
                          Select Proof of Funds Document
                        </Button>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Wholesaler: Contract Document */}
                {isWholesaler && (
                  <div className="flex items-start space-x-4">
                    <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center ${
                      hasContractDocument ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                    }`}>
                      {hasContractDocument ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <span>2</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">Sample Assignable Contract</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Upload a sample purchase contract that shows you understand assignable contracts
                      </p>
                      {documents?.find(doc => doc.documentType === "contract") ? (
                        <div className="flex items-center bg-gray-50 p-2 rounded-md">
                          <FileText className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm text-gray-600">Contract document uploaded</span>
                          <Badge className="ml-auto" variant="outline">
                            {documents.find(doc => doc.documentType === "contract")?.status}
                          </Badge>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => handleDocumentTypeChange("contract")}
                          className={documentType === "contract" ? "ring-2 ring-primary" : ""}
                        >
                          Select Contract Document
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Document upload */}
          {documentType && !documents?.find(doc => doc.documentType === documentType) && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Document</CardTitle>
                <CardDescription>
                  Upload your {documentType === "id" ? "ID" : 
                              documentType === "proof_of_funds" ? "proof of funds" : 
                              "contract"} document
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  accept=".pdf,image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
                  }}
                  buttonText={`Select ${documentType === "id" ? "ID" : 
                                    documentType === "proof_of_funds" ? "Proof of Funds" : 
                                    "Contract"} File`}
                />
                
                {selectedFile && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md flex items-center">
                    <FileText className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-sm text-gray-700 flex-1">{selectedFile.name}</span>
                    <span className="text-xs text-gray-500">{Math.round(selectedFile.size / 1024)} KB</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => {
                    setSelectedFile(null);
                    setDocumentType("");
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpload}
                  disabled={!selectedFile || uploadMutation.isPending}
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload Document"
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
          
          {(user.verificationStatus === "verified" || isVerificationComplete) && (
            <div className="mt-8 text-center">
              <Button size="lg" onClick={() => setLocation("/dashboard")}>
                Go to Dashboard
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
