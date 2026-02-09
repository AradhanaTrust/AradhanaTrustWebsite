import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Welcome from "@/components/Welcome";
import Objectives from "@/components/Objectives";
import Events from "@/components/Events";
import Donation from "@/components/Donation";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const dbImages = await prisma.galleryImage.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    select: { imageUrl: true },
  });

  const imageUrls = dbImages.map((img) => img.imageUrl);

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Welcome />
      <Objectives />
      <Donation />
      <Events />
      <Gallery dbImages={imageUrls} />
      <Footer />
    </main>
  );
}
