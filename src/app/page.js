import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content selection:bg-emerald-500 selection:text-white">
      {/* 1. Header Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        <Home />
      </main>

      {/* 8. Modern Footer */}
      <Footer />
    </div>
  );
}
