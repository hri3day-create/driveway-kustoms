import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Driveway Kustoms",
  description:
    "Premium doorstep detailing and automotive customization built around your vehicle.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "DK Orders",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/app-icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
