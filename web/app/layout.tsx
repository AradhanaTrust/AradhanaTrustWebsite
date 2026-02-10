import type { Metadata } from "next";
import { Cinzel, Poppins, Cinzel_Decorative } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "700", "900"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600"],
});

const cinzelDecorative = Cinzel_Decorative({
  subsets: ["latin"],
  variable: "--font-cinzel-decorative",
  weight: ["400", "700", "900"],
});

export const metadata: Metadata = {
  title: "Aradhana Dharmika Trust",
  description: "Serving Dharma · Spreading Devotion · Supporting Humanity",
  icons: {
    icon: "/assets/Logo_Round.png",
  },
};

import { LanguageProvider } from "@/context/LanguageContext";
import AuthProvider from "@/components/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${cinzel.variable} ${poppins.variable} ${cinzelDecorative.variable} antialiased texture-parchment`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
