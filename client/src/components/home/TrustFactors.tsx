import { Shield, FileText, DollarSign, Gauge } from "lucide-react";

export default function TrustFactors() {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose QuickDeals?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our marketplace is built on trust, verification, and efficiency.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 text-primary rounded-full flex items-center justify-center mb-4">
              <Shield className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Verified Users</h3>
            <p className="text-gray-600">
              All buyers and sellers are ID-verified to prevent fraud and ensure legitimate transactions.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 text-primary rounded-full flex items-center justify-center mb-4">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Legitimate Contracts</h3>
            <p className="text-gray-600">
              Every deal is backed by verified assignable contracts that are reviewed by our team.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 text-primary rounded-full flex items-center justify-center mb-4">
              <DollarSign className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Transparent Fees</h3>
            <p className="text-gray-600">
              Simple 7% commission on successful assignments. No hidden costs or surprises.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-blue-100 text-primary rounded-full flex items-center justify-center mb-4">
              <Gauge className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Faster Closings</h3>
            <p className="text-gray-600">
              Connect with serious, verified buyers ready to close quickly on legitimate deals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
