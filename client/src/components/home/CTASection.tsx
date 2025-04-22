import { Link } from "wouter";

export default function CTASection() {
  return (
    <div className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Ready to start wholesaling with confidence?</h2>
          <p className="text-gray-300 mb-8 text-lg">
            Join our community of verified real estate professionals and start closing deals safely.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth?mode=register&type=cash_buyer">
              <a className="bg-white text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
                Create Buyer Account
              </a>
            </Link>
            <Link href="/auth?mode=register&type=wholesaler">
              <a className="bg-secondary text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700">
                Create Wholesaler Account
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
