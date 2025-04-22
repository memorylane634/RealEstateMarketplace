import { Link } from "wouter";
import { UserCheck, Handshake, FileText } from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">How QuickDeals Works</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Our platform connects verified wholesalers with verified cash buyers, creating a secure marketplace for real estate contract assignments.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Complete Verification</h3>
          <p className="text-gray-600">
            Both buyers and sellers must verify their identities and capabilities before accessing deals.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Handshake className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Connect Safely</h3>
          <p className="text-gray-600">
            Browse verified deals or post your properties with confidence in our secure environment.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-semibold mb-3">Close Deals</h3>
          <p className="text-gray-600">
            Assign contracts efficiently and legally with our streamlined process and documentation.
          </p>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Link href="/terms">
          <a className="bg-primary text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            Learn More About Our Process
          </a>
        </Link>
      </div>
    </div>
  );
}
