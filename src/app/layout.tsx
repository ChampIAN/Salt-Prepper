import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Salt & Prepper OS",
  description: "Tactical Simulation Protocol V4.2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className="min-h-screen selection:bg-accent/30 selection:text-accent-bright antialiased flex flex-col">
        {children}
      </body>
    </html>
  );
}
