import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "HealthForge | AI Health Tracking",
  description: "Personalized health tracking with AI-powered insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
