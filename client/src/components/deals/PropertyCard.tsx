import { Link } from "wouter";
import { Property } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import VerificationStatus from "@/components/common/VerificationStatus";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const {
    id,
    title,
    address,
    city,
    state,
    propertyType,
    contractPrice,
    arv,
    assignmentFee,
    createdAt,
  } = property;

  // Format the created date to "X days ago"
  const postedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
      <div className="relative">
        {/* Placeholder image if no images are available */}
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z" clipRule="evenodd" />
            <path d="M4 12h12v3H4v-3z" />
          </svg>
        </div>

        <div className="absolute bottom-0 left-0 bg-primary text-white px-3 py-1 text-sm font-medium">
          {propertyType}
        </div>
        
        <div className="absolute top-0 right-0 m-2">
          <VerificationStatus status="verified" />
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-gray-500 text-sm mb-3">{address}, {city}, {state}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-gray-500 text-xs">Contract Price</p>
            <p className="font-semibold">{formatCurrency(contractPrice)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">ARV</p>
            <p className="font-semibold">{formatCurrency(arv)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Assignment Fee</p>
            <p className="font-semibold">{formatCurrency(assignmentFee)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Posted</p>
            <p className="font-semibold">{postedDate}</p>
          </div>
        </div>
        
        <Link href={`/deals/${id}`}>
          <a className="block bg-primary text-white px-4 py-2 rounded text-center font-medium hover:bg-blue-700">
            View Deal
          </a>
        </Link>
      </div>
    </div>
  );
}
