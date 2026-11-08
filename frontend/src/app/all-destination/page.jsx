import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AllDestinationPage from "@/pages/all-destination/page";

export const metadata = {
  title: "All Destinations | Paharika - Bangladesh Travel Planner",
  description:
    "Explore all curated travel destinations across Bangladesh — hills, beaches, forests, lakes, and islands. Plan your perfect trip with Paharika.",
};

export default function AllDestinationRoute() {
  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <AllDestinationPage />
      </main>
      <Footer />
    </div>
  );
}
