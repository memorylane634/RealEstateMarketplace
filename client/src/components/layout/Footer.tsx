import { Link } from "wouter";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  MapPin, 
  Phone, 
  Mail 
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">QuickDeals</h3>
            <p className="text-gray-400 mb-4">The safest platform for real estate wholesaling. Connect with verified partners and close deals with confidence.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white">Home</Link>
              </li>
              <li>
                <Link href="/deals" className="text-gray-400 hover:text-white">Browse Deals</Link>
              </li>
              <li>
                <Link href="/auth?mode=register" className="text-gray-400 hover:text-white">Sign Up</Link>
              </li>
              <li>
                <Link href="/auth?mode=login" className="text-gray-400 hover:text-white">Login</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">Wholesaling Guide</Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">Legal Resources</Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">FAQ</Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">Support</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mt-1 mr-3 flex-shrink-0" />
                <span>123 Real Estate Way, Suite 100<br />Atlanta, GA 30328</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>(404) 555-1234</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 flex-shrink-0" />
                <span>support@quickdeals.io</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} QuickDeals. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-6">
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
            <Link href="/terms" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
