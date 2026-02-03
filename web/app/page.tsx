import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Welcome from "@/components/Welcome";
import Objectives from "@/components/Objectives";
import Events from "@/components/Events";
import Donation from "@/components/Donation";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Welcome />
      <Objectives />
      <Donation />
      <Events />
      <Gallery />
      <Footer />
    </main>
  );
}
