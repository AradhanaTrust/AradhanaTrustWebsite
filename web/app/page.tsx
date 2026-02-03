import Header from "@/components/Header";
import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />

      {/* Placeholder for Next Sections */}
      <div className="h-screen bg-white/5 flex items-center justify-center">
        <p className="text-gray-400">Welcome Section Coming Soon...</p>
      </div>
    </main>
  );
}
