import { Link } from "wouter";

export default function Hero() {
  return (
    <div className="bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-white">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Connect with verified real estate wholesalers and cash buyers
            </h1>
            <p className="text-blue-100 text-lg mb-8">
              QuickDeals is the safest way to wholesale real estate. With our verification process and secure platform, you can assign contracts efficiently, safely, and legally.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth?mode=register&type=cash_buyer">
                <a className="bg-white text-primary px-6 py-3 rounded-lg text-center font-semibold shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary">
                  I'm a Cash Buyer
                </a>
              </Link>
              <Link href="/auth?mode=register&type=wholesaler">
                <a className="bg-secondary text-white px-6 py-3 rounded-lg text-center font-semibold shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-secondary">
                  I'm a Wholesaler
                </a>
              </Link>
            </div>
          </div>
          <div className="hidden md:block relative">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center mb-4">
                <span className="px-3 py-1 text-xs rounded-full bg-green-500 text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Verified Deal
                </span>
                <span className="ml-auto text-gray-500 text-sm">Posted 2 days ago</span>
              </div>
              <div className="w-full h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4V5h12v10z" clipRule="evenodd" />
                  <path d="M4 12h12v3H4v-3z" />
                </svg>
              </div>
              <h3 className="font-semibold text-xl mb-2">Single Family Home - Fixer Upper</h3>
              <p className="text-gray-500 mb-3">1234 Maple Street, Atlanta, GA</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-500 text-sm">Contract Price</p>
                  <p className="font-semibold text-lg">$155,000</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">ARV</p>
                  <p className="font-semibold text-lg">$245,000</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Repair Estimate</p>
                  <p className="font-semibold text-lg">$40,000</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Assignment Fee</p>
                  <p className="font-semibold text-lg">$8,500</p>
                </div>
              </div>
              <Link href="/deals">
                <a className="block bg-primary text-white px-4 py-2 rounded text-center font-medium hover:bg-blue-700">
                  View Deal Details
                </a>
              </Link>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-secondary text-white p-4 rounded-lg shadow-lg">
              <p className="font-bold text-xl">7%</p>
              <p className="text-sm">Platform Fee</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
