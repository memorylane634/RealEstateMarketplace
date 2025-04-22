import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Property } from "@shared/schema";
import PropertyCard from "@/components/deals/PropertyCard";
import { Skeleton } from "@/components/ui/skeleton";

export default function FeaturedDeals() {
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  // Show only the first 3 properties
  const featuredProperties = properties?.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Featured Deals</h2>
        <Link href="/deals" className="text-primary font-medium hover:underline">
          View All Deals
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeletons
          Array(3).fill(0).map((_, index) => (
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
          ))
        ) : featuredProperties && featuredProperties.length > 0 ? (
          featuredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))
        ) : (
          <div className="col-span-3 text-center py-10">
            <p className="text-gray-500">No properties available at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
