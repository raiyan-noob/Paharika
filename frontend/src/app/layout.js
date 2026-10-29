import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastContainer } from "react-toastify";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Paharika - Bangladesh Travel Destination Planner & Booking",
  description:
    "Explore Bangladesh's most breathtaking places — Cox's Bazar, Bandarban, Sajek Valley, Sundarbans, Sylhet, and more. Plan, customize, and book your dream adventure with Paharika.",
  keywords: [
    "Paharika",
    "Bangladesh travel",
    "Cox's Bazar",
    "Bandarban",
    "Sajek Valley",
    "Sundarbans",
    "tour planner",
    "booking",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-base-100 text-base-content antialiased transition-colors duration-300">
        <LanguageProvider>
          <ThemeProvider>
            {children}
            <ToastContainer
              position="bottom-right"
              autoClose={2500}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
