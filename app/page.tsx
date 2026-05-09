import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Features from "@/components/features";
import HowItWorks from "@/components/how-it-works";
import SavingsPreview from "@/components/savings-preview";
import CTA from "@/components/cta";
import Footer from "@/components/footer";
import SpendForm from "@/components/spend-form";

export default function Home() {
  return (
    <main className="bg-black text-white min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <SpendForm />
      <Features />
      <HowItWorks />
      <SavingsPreview />
      <CTA />
      <Footer />
  
    </main>
  );
}