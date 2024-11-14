"use client";

import localFont from "next/font/local";
import "./globals.css";
import Header from './components/Header';
import NavigationSidebar from "./components/Sidebar";
import ProtectedRoute from './components/ProtectedRoute'; 
import { AuthProvider } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  const router = useRouter();

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
            <ProtectedRoute >
              <div className="flex h-screen max-w-full overflow-x-hidden">
                <NavigationSidebar /> {/* Sidebar on the left */}
                <div className="flex flex-col w-full">
                  <Header /> {/* Sticky Header */}
                  <main className="flex-grow bg-white max-w-full overflow-x-hidden">
                    {children}
                  </main>
                </div>
              </div>
            </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}