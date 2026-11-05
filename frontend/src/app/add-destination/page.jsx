import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddDestination from "@/pages/add-destination/page";

export const metadata = {
  title: "Add Destination | Paharika - Bangladesh Travel Planner",
  description:
    "Share and add breathtaking travel destinations in Bangladesh to the Paharika community explorer platform.",
};

export default function AddDestinationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content selection:bg-emerald-500 selection:text-white">
      <Navbar />
      <main className="flex-1">
        <AddDestination />
      </main>
      <Footer />
    </div>
  );
}
