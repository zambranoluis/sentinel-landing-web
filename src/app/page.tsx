import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Footer } from "@/components/landing/Footer";
import { HowItWorks } from "@/components/landing/HowItWorks";

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
      </main>
      <Footer />
    </>
  );
}
