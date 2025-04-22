import { useEffect } from "react";
import { useLocation } from "wouter";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import TrustFactors from "@/components/home/TrustFactors";
import FeaturedDeals from "@/components/home/FeaturedDeals";
import CTASection from "@/components/home/CTASection";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // If user is logged in, redirect to dashboard
  useEffect(() => {
    if (user && !user.isVerified) {
      setLocation('/verification');
    }
  }, [user, setLocation]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <TrustFactors />
        <FeaturedDeals />
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
}
