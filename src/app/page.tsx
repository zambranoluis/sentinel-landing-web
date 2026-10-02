import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Footer } from "@/components/landing/Footer";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Capabilities } from "@/components/landing/Capabilities";
import { ProductDemo } from "@/components/landing/ProductDemo";
import { Deployment } from "@/components/landing/Deployment";
import { Benefits } from "@/components/landing/Benefits";
import { Plans } from "@/components/landing/Plans";
import { Faq } from "@/components/landing/Faq";
import { FinalCta } from "@/components/landing/FinalCta";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content" tabIndex={0}>
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <HowItWorks />
        <Capabilities />
        <ProductDemo />
        <Deployment />
        <Benefits />
        <Plans />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
