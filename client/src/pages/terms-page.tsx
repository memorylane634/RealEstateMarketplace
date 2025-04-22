import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
            <p className="text-gray-500 mt-2">
              Please read these terms carefully before using QuickDeals
            </p>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-center text-primary">
                QuickDeals Commission Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-100 text-center mb-6">
                <h2 className="text-xl font-bold text-blue-800 mb-2">7% Commission Fee</h2>
                <p className="text-blue-700">
                  A 7% commission is payable by the wholesaler on all successful assignment deals
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold">Assignment Commission</h3>
                    <p className="text-gray-600">
                      Any contract assigned or closed through QuickDeals is subject to a 7% commission 
                      payable by the wholesaler.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold">Reporting Requirements</h3>
                    <p className="text-gray-600">
                      Users must report successful closings via our Deal Closed Form and submit valid 
                      proof (HUD-1 or closing statement).
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold">Payment Process</h3>
                    <p className="text-gray-600">
                      Upon successful closing, an invoice will be generated for 7% of the assignment fee. 
                      Payment can be made via Stripe or PayPal.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold">Non-Compliance</h3>
                    <p className="text-gray-600">
                      Failure to report and pay commission will result in account suspension or legal action.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-4">
                By accessing or using the QuickDeals platform, you agree to be bound by these Terms of 
                Service and all applicable laws and regulations. If you do not agree with any of these 
                terms, you are prohibited from using or accessing this site.
              </p>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-bold mb-4">2. User Verification</h2>
              <p className="text-gray-700 mb-4">
                All users must complete the verification process to access the full functionality of 
                the platform. This includes providing government-issued ID and additional documents 
                depending on user type:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>
                  <span className="font-medium">Wholesalers:</span> Must provide government-issued ID 
                  and a sample assignable purchase contract.
                </li>
                <li>
                  <span className="font-medium">Cash Buyers:</span> Must provide government-issued ID 
                  and proof of funds.
                </li>
              </ul>
              <p className="text-gray-700 mb-4">
                All documents will be reviewed by our team for verification. Falsifying documents or 
                information will result in immediate account termination.
              </p>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-bold mb-4">3. Commission and Payment</h2>
              <p className="text-gray-700 mb-4">
                Wholesalers agree to pay a 7% commission on all assignment fees for deals facilitated 
                through the QuickDeals platform. This commission is due upon successful closing of the 
                transaction. Wholesalers must report all successful closings through the Deal Closed Form 
                and provide appropriate documentation.
              </p>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-bold mb-4">4. Property Listings</h2>
              <p className="text-gray-700 mb-4">
                All property listings must be legitimate opportunities with accurate information. 
                Wholesalers must have valid, assignable contracts for all properties listed. QuickDeals 
                reserves the right to remove any listing that appears fraudulent or does not meet our 
                standards.
              </p>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-bold mb-4">5. User Conduct</h2>
              <p className="text-gray-700 mb-4">
                Users agree not to engage in any activity that could harm the QuickDeals platform or other 
                users. This includes but is not limited to: attempting to circumvent the platform to avoid 
                commissions, harassment of other users, posting false information, or any illegal activities.
              </p>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-bold mb-4">6. Privacy and Data</h2>
              <p className="text-gray-700 mb-4">
                QuickDeals takes user privacy seriously. We collect and process personal information as 
                needed to provide our services. By using our platform, you consent to our data practices 
                as outlined in our Privacy Policy.
              </p>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-bold mb-4">7. Termination</h2>
              <p className="text-gray-700 mb-4">
                QuickDeals reserves the right to terminate or suspend accounts at our discretion, 
                particularly for violations of these terms. Upon termination, users will lose access 
                to our services and may still be liable for any outstanding payments.
              </p>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-bold mb-4">8. Disclaimer</h2>
              <p className="text-gray-700 mb-4">
                QuickDeals is a platform connecting wholesalers and buyers. We do not guarantee the 
                success of any transaction or the accuracy of information provided by users. All users 
                are encouraged to perform their own due diligence before entering into any real estate 
                transaction.
              </p>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-bold mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 mb-4">
                QuickDeals shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use of or inability to use the service.
              </p>
              
              <Separator className="my-6" />
              
              <h2 className="text-xl font-bold mb-4">10. Changes to Terms</h2>
              <p className="text-gray-700 mb-4">
                QuickDeals reserves the right to modify these terms at any time. We will provide notice 
                of significant changes. Your continued use of the platform after such modifications 
                constitutes your acceptance of the updated terms.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg mt-8 text-center">
                <p className="font-medium text-gray-700">
                  Last updated: {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
