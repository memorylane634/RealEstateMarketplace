import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/deals/PropertyCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@shared/schema";
import { Search, Filter, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

export default function DealsPage() {
  const { user } = useAuth();
  const [propertyType, setPropertyType] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  
  // Fetch all properties
  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });
  
  // Filter properties based on user selections
  const filteredProperties = properties?.filter(property => {
    // Filter by property type if selected
    if (propertyType && property.propertyType !== propertyType) {
      return false;
    }
    
    // Filter by location (city or state) if entered
    if (location && 
        !property.city.toLowerCase().includes(location.toLowerCase()) && 
        !property.state.toLowerCase().includes(location.toLowerCase())) {
      return false;
    }
    
    // Filter by price range
    if (property.contractPrice < priceRange[0] || property.contractPrice > priceRange[1]) {
      return false;
    }
    
    return true;
  });
  
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Browse Real Estate Deals</h1>
              <p className="text-gray-500">Find and connect with verified wholesaling opportunities</p>
            </div>
            
            {!user?.isVerified && (
              <Card className="bg-yellow-50 border-yellow-200 mt-4 md:mt-0">
                <CardContent className="p-4">
                  <p className="text-yellow-800 text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Verification required to contact sellers
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm text-gray-500 mb-1">Search Location</label>
                <div className="relative">
                  <Input 
                    placeholder="City or State" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm text-gray-500 mb-1">Property Type</label>
                <Select 
                  value={propertyType} 
                  onValueChange={(value) => setPropertyType(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Type</SelectItem>
                    <SelectItem value="single_family">Single Family</SelectItem>
                    <SelectItem value="multi_family">Multi-Family</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <label className="block text-sm text-gray-500 mb-1">
                  Price Range: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                </label>
                <Slider
                  min={0}
                  max={1000000}
                  step={10000}
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  className="mt-2"
                />
              </div>
              
              <div className="self-end">
                <Button className="w-full md:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
          
          {/* Property listings */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                  <Skeleton className="w-full h-48" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Skeleton className="h-3 w-3/4 mb-1" />
                        <Skeleton className="h-5 w-1/2" />
                      </div>
                      <div>
                        <Skeleton className="h-3 w-3/4 mb-1" />
                        <Skeleton className="h-5 w-1/2" />
                      </div>
                      <div>
                        <Skeleton className="h-3 w-3/4 mb-1" />
                        <Skeleton className="h-5 w-1/2" />
                      </div>
                      <div>
                        <Skeleton className="h-3 w-3/4 mb-1" />
                        <Skeleton className="h-5 w-1/2" />
                      </div>
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded-md">
              <p className="text-red-600">Error loading properties: {(error as Error).message}</p>
            </div>
          ) : filteredProperties && filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                We couldn't find any properties matching your search criteria. Try adjusting your filters or check back later.
              </p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
