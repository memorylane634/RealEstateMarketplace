import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Property } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import VerificationStatus from "@/components/common/VerificationStatus";

interface DealsListProps {
  type: "all" | "my" | "saved" | "active" | "closed";
  userId?: number;
}

export default function DealsList({ type, userId }: DealsListProps) {
  // Fetch properties based on the type
  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: [type === "all" ? "/api/properties" : `/api/properties?userId=${userId}`],
  });

  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-4 flex flex-col md:flex-row">
                <div className="md:w-48 flex-shrink-0 mb-4 md:mb-0 md:mr-4">
                  <Skeleton className="w-full h-32 rounded-md" />
                </div>
                <div className="flex-1">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    {Array(4).fill(0).map((_, idx) => (
                      <div key={idx}>
                        <Skeleton className="h-3 w-3/4 mb-1" />
                        <Skeleton className="h-5 w-1/2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t flex justify-end space-x-2 p-4">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <p className="text-red-600">Error loading properties: {(error as Error).message}</p>
        </CardContent>
      </Card>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-medium mb-2">No Properties Found</h3>
          <p className="text-gray-500 mb-4">
            {type === "all" && "There are no properties available at the moment."}
            {type === "my" && "You haven't listed any properties yet."}
            {type === "saved" && "You haven't saved any properties yet."}
            {type === "active" && "You don't have any active deals at the moment."}
            {type === "closed" && "You don't have any closed deals yet."}
          </p>
          {type === "my" && (
            <Link href="/dashboard/post">
              <Button>Post Your First Deal</Button>
            </Link>
          )}
          {type === "all" && (
            <Link href="/deals">
              <Button>Browse All Deals</Button>
            </Link>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {properties.map((property) => (
        <Card key={property.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 flex flex-col md:flex-row">
              <div className="md:w-48 flex-shrink-0 mb-4 md:mb-0 md:mr-4">
                {/* Placeholder image if no images are available */}
                <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z" clipRule="evenodd" />
                    <path d="M4 12h12v3H4v-3z" />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{property.title}</h4>
                  <VerificationStatus status="verified" />
                </div>
                <p className="text-gray-500 text-sm mb-2">{property.address}, {property.city}, {property.state}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                  <div>
                    <p className="text-gray-500 text-xs">Contract</p>
                    <p className="font-semibold">{formatCurrency(property.contractPrice)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">ARV</p>
                    <p className="font-semibold">{formatCurrency(property.arv)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Repair Est.</p>
                    <p className="font-semibold">{formatCurrency(property.repairCost)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Assignment</p>
                    <p className="font-semibold">{formatCurrency(property.assignmentFee)}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Posted {formatDistanceToNow(new Date(property.createdAt), { addSuffix: true })}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t flex justify-end space-x-2 p-4">
            <Link href={`/deals/${property.id}`}>
              <Button variant="default" size="sm">View Details</Button>
            </Link>
            {type === "all" && (
              <Button variant="outline" size="sm">Save Deal</Button>
            )}
            {type === "saved" && (
              <Button variant="outline" size="sm">Remove</Button>
            )}
            {type === "my" && (
              <Button variant="outline" size="sm">Edit Listing</Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
