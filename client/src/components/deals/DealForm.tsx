import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FileUpload from "@/components/common/FileUpload";

// Create a schema for property submission
const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  zipCode: z.string().min(5, { message: "Zip code is required" }),
  propertyType: z.string().min(1, { message: "Property type is required" }),
  contractPrice: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Contract price must be a positive number",
  }),
  arv: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "ARV must be a positive number",
  }),
  repairCost: z.string().refine(val => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Repair cost must be a non-negative number",
  }),
  assignmentFee: z.string().refine(val => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Assignment fee must be a positive number",
  }),
  notes: z.string().optional(),
  commissionAgreement: z.boolean().refine(val => val === true, {
    message: "You must agree to the 7% commission",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function DealForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [images, setImages] = useState<File[]>([]);
  const [contractDocument, setContractDocument] = useState<File | null>(null);

  // Initialize the form
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      propertyType: "",
      contractPrice: "",
      arv: "",
      repairCost: "",
      assignmentFee: "",
      notes: "",
      commissionAgreement: false,
    },
  });

  // Handle property submission
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();
      
      // Append form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'commissionAgreement') {
          formData.append(key, value.toString());
        }
      });
      
      // Append images
      images.forEach(image => {
        formData.append("images", image);
      });
      
      // Append contract document
      if (contractDocument) {
        formData.append("contractDocument", contractDocument);
      }
      
      const response = await fetch('/api/properties', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit property");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Property submitted successfully",
        description: "Your property has been submitted for review.",
      });
      
      // Reset the form
      form.reset();
      setImages([]);
      setContractDocument(null);
      
      // Invalidate the properties query to refresh the list
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit property",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: FormData) => {
    if (!contractDocument) {
      toast({
        title: "Missing document",
        description: "Please upload the assignable purchase contract",
        variant: "destructive",
      });
      return;
    }
    
    mutation.mutate(data);
  };

  // Handle contract document upload
  const handleContractUpload = (file: File) => {
    setContractDocument(file);
  };

  // Handle property images upload
  const handleImagesUpload = (files: FileList) => {
    const newImages = Array.from(files);
    setImages(prev => [...prev, ...newImages]);
  };

  // Remove an image from the list
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  if (!user || user.userType !== "wholesaler") {
    return (
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
        <p className="text-yellow-800">Only verified wholesalers can post deals.</p>
      </div>
    );
  }

  if (!user.isVerified) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
        <p className="text-yellow-800">Your account must be verified before you can post deals. Please complete the verification process.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold mb-6">Post a New Deal</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deal Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 3BR Ranch Style Fixer Upper" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="single_family">Single Family</SelectItem>
                      <SelectItem value="multi_family">Multi-Family</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Property Address</FormLabel>
                <FormControl>
                  <Input placeholder="Street address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. GA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip Code</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="contractPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contract Price ($)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="arv"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>After Repair Value - ARV ($)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="repairCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Repair Cost ($)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="assignmentFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignment Fee ($)</FormLabel>
                  <FormControl>
                    <Input type="number" min="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Provide additional details about the property, deal terms, etc." 
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Property Photos</h3>
              <FileUpload 
                accept="image/*" 
                multiple 
                onChange={(e) => {
                  if (e.target.files) handleImagesUpload(e.target.files);
                }}
              />
              
              {images.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="w-24 h-24 border rounded-md flex items-center justify-center bg-gray-50">
                        <p className="text-xs text-gray-500 text-center p-1">{image.name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Assignable Purchase Contract (Required)</h3>
              <FileUpload 
                accept=".pdf,image/*" 
                onChange={(e) => {
                  if (e.target.files?.[0]) handleContractUpload(e.target.files[0]);
                }}
              />
              
              {contractDocument && (
                <div className="mt-2">
                  <div className="p-2 border rounded-md bg-gray-50 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-gray-600">{contractDocument.name}</span>
                    <button
                      type="button"
                      onClick={() => setContractDocument(null)}
                      className="ml-auto text-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="commissionAgreement"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 mt-1"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I agree to pay a 7% commission to QuickDeals on the assignment fee upon successful closing of this deal.
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? "Submitting..." : "Submit Deal"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
