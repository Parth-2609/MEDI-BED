import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "@next/font/google";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "MediBed - Hospital Appointment Booking",
  description: "Book doctor appointments securely with OTP login and SMS confirmations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
<body className="min-h-full flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 antialiased"><head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
        {children}
      </body>
    </html>
  );
}
