"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "react-toastify";
import {
  FiMapPin,
  FiCompass,
  FiClock,
  FiImage,
  FiFileText,
  FiStar,
  FiCheck,
  FiUpload,
  FiArrowRight,
  FiRefreshCw,
  FiEye,
  FiHeart,
  FiShare2,
  FiCalendar,
  FiCheckCircle,
  FiLayers,
} from "react-icons/fi";
import { GiMountainRoad, GiPalmTree, GiCampingTent, GiWaterfall } from "react-icons/gi";
import { HiSparkles } from "react-icons/hi2";

export default function AddDestination() {
  const { language } = useLanguage();
  const isBn = language === "bn";

  const fileInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    location: "Chittagong Hill Tracts",
    customLocation: "",
    price: "2500",
    duration: "3 Days, 2 Nights",
    category: "Hill District",
    season: "Winter (Nov - Feb)",
    image: "https://cosmosgroup.sgp1.digitaloceanspaces.com/news/y8eC0WBzPEEVyKIGGjcM3zKIgirEYLTLvioF3GaP.jpeg",
    description: "",
    highlights: ["Scenic Views", "Family Friendly"],
  });

  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("form"); // For mobile preview toggle

  // Divisions & Popular Regions of Bangladesh
  const regions = [
    { en: "Chittagong Hill Tracts", bn: "পার্বত্য চট্টগ্রাম" },
    { en: "Cox's Bazar & Coast", bn: "কক্সবাজার ও উপকূল" },
    { en: "Sylhet Division", bn: "সিলেট বিভাগ" },
    { en: "Khulna & Sundarbans", bn: "খুলনা ও সুন্দরবন" },
    { en: "Barisal & Coastal Islands", bn: "বরিশাল ও উপকূলীয় দ্বীপ" },
    { en: "Dhaka & Central", bn: "ঢাকা ও মধ্যাঞ্চল" },
    { en: "Rajshahi & North Bengal", bn: "রাজশাহী ও উত্তরাঞ্চল" },
    { en: "Rangpur Division", bn: "রংপুর বিভাগ" },
    { en: "Mymensingh & Garo Hills", bn: "ময়মনসিংহ ও গারো পাহাড়" },
    { en: "Other District", bn: "অন্যান্য জেলা" },
  ];

  // Category tags with theme badges
  const categories = [
    { en: "Hill District", bn: "পাহাড় ও উপত্যকা", color: "bg-emerald-600 text-white" },
    { en: "Sea Beach", bn: "সমুদ্র সৈকত", color: "bg-teal-600 text-white" },
    { en: "Mangrove & Wildlife", bn: "ম্যানগ্রোভ ও বন্যপ্রাণী", color: "bg-emerald-700 text-white" },
    { en: "Tea Garden", bn: "চা বাগান ও ঝর্ণা", color: "bg-green-600 text-white" },
    { en: "River & Haor", bn: "নদী ও হাওর", color: "bg-cyan-600 text-white" },
    { en: "Heritage Site", bn: "ঐতিহাসিক স্থান", color: "bg-amber-600 text-white" },
    { en: "Eco Resort", bn: "ইকো রিসোর্ট ও ক্যাম্পিং", color: "bg-lime-600 text-white" },
  ];

  // Preset Bangladesh Travel Photos for 1-click preview
  const presetImages = [
    {
      label: isBn ? "বান্দরবান" : "Bandarban",
      url: "https://cosmosgroup.sgp1.digitaloceanspaces.com/news/y8eC0WBzPEEVyKIGGjcM3zKIgirEYLTLvioF3GaP.jpeg",
    },
    {
      label: isBn ? "সাজেক ভ্যালি" : "Sajek Valley",
      url: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=800&q=80",
    },
    {
      label: isBn ? "কক্সবাজার" : "Cox's Bazar",
      url: "https://mybestfly.com/_next/image?url=https%3A%2F%2Fpub-5e439b5f38ca499ea1969bcc1d71b180.r2.dev%2Fmybestfly_assets%2Fassets%2Fblogs%2Fbest-places-to-visit-in-coxs-bazar%2Ffeatured-1783511674.webp&w=3840&q=75",
    },
    {
      label: isBn ? "শ্রীমঙ্গল চা বাগান" : "Sreemangal",
      url: "https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=800&q=80",
    },
    {
      label: isBn ? "সুন্দরবন" : "Sundarbans",
      url: "https://upload.wikimedia.org/wikipedia/commons/2/23/Sundarban_Tiger.jpg?utm_source=bn.wikipedia.org&utm_campaign=index&utm_content=original",
    },
  ];

  // Highlight options
  const availableHighlights = [
    { id: "Scenic Views", en: "Panoramic Scenic Views", bn: "মনোরম প্রাকৃতিক দৃশ্য" },
    { id: "Family Friendly", en: "Family & Kids Friendly", bn: "পারিবারিক ভ্রমণের উপযোগী" },
    { id: "Trekking", en: "Adventure & Trekking", bn: "রোমাঞ্চকর ট্রেকিং" },
    { id: "Camping Spot", en: "Night Camping Allowed", bn: "নাইট ক্যাম্পিং সুবিধা" },
    { id: "Local Food", en: "Indigenous / Local Cuisine", bn: "ঐতিহ্যবাহী পাহাড়ি ও স্থানীয় খাবার" },
    { id: "Budget Friendly", en: "Pocket Friendly Budget", bn: "সাধ্যের মধ্যে বাজেটবান্ধব" },
  ];

  // Handle Form Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Toggle Highlight feature
  const toggleHighlight = (id) => {
    setFormData((prev) => {
      const exists = prev.highlights.includes(id);
      return {
        ...prev,
        highlights: exists
          ? prev.highlights.filter((item) => item !== id)
          : [...prev.highlights, id],
      };
    });
  };

  // Device image selection handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.warn(isBn ? "অনুগ্রহ করে ৫ মেগাবাইটের কম সাইজের ছবি নির্বাচন করুন।" : "Please select an image smaller than 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
        toast.success(isBn ? "ডিভাইস থেকে ছবি আপলোড হয়েছে!" : "Photo loaded from your device!", {
          icon: "📷",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Quick Autofill Demo
  const autofillDemo = (presetKey = "sajek") => {
    if (presetKey === "sajek") {
      setFormData({
        name: isBn ? "সাজেক ভ্যালি — মেঘের রাজ্য" : "Sajek Valley — Kingdom of Clouds",
        location: "Chittagong Hill Tracts",
        customLocation: "Rangamati (Baghaichhari)",
        price: "3200",
        duration: "3 Days, 2 Nights",
        category: "Hill District",
        season: "Winter & Autumn (Oct - Mar)",
        image: "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=800&q=80",
        description: isBn
          ? "সাজেক ভ্যালিকে বলা হয় মেঘের রাজ্য। সকালের কুয়াশা ও মেঘের ওড়াউড়ি কংলাক পাহাড় থেকে উপভোগ করার মতো অভিজ্ঞতা আর কোথাও মেলে না। কটেজে বসে মেঘ ছোঁয়া যায়।"
          : "Perched 1,800 feet above sea level, Sajek Valley offers ethereal views of undulating emerald hills draped in blankets of morning mist and endless skies.",
        highlights: ["Scenic Views", "Family Friendly", "Camping Spot", "Local Food"],
      });
    } else {
      setFormData({
        name: isBn ? "নীলগিরি হিল রিসোর্ট" : "Nilgiri Hill Resort",
        location: "Chittagong Hill Tracts",
        customLocation: "Thanchi Road, Bandarban",
        price: "4500",
        duration: "2 Days, 1 Night",
        category: "Hill District",
        season: "Round the Year",
        image: "https://cosmosgroup.sgp1.digitaloceanspaces.com/news/y8eC0WBzPEEVyKIGGjcM3zKIgirEYLTLvioF3GaP.jpeg",
        description: isBn
          ? "বান্দরবানের নীলগিরি এক অপরূপ সৌন্দর্যমণ্ডিত স্থান। মেঘের বুক চিরে জেগে থাকা এই চূড়ায় দাঁড়ালে মনে হয় আকাশের কাছাকাছি পৌঁছে গেছেন।"
          : "Often called Darjeeling of Bangladesh, Nilgiri sits atop towering peaks with 360-degree views where cloud seas roll under golden sunsets.",
        highlights: ["Scenic Views", "Budget Friendly", "Family Friendly"],
      });
    }
    toast.info(isBn ? "নমুনা তথ্য পূরণ করা হয়েছে!" : "Autofilled sample destination data!", {
      autoClose: 1800,
    });
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error(isBn ? "অনুগ্রহ করে গন্তব্যের নাম লিখুন।" : "Please enter a destination name.");
      return;
    }

    if (!formData.description.trim()) {
      toast.error(isBn ? "অনুগ্রহ করে স্থানটির সংক্ষিপ্ত বিবরণ দিন।" : "Please provide a brief description.");
      return;
    }

    setSubmitting(true);

    try {
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        (process.env.BACKEND_URL ? process.env.BACKEND_URL.replace(/\/$/, "") : "http://localhost:5000");

      const res = await fetch(`${backendUrl}/add-destination`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && (data.insertedId || data.acknowledged || data.success)) {
        toast.success(
          isBn
            ? `🎉 অভিনন্দন! "${formData.name}" ডাটাবেজে সফলভাবে যুক্ত হয়েছে!`
            : `🎉 Success! "${formData.name}" has been saved to the Paharika database!`,
          { autoClose: 3000 }
        );
        handleReset();
      } else {
        toast.error(isBn ? "গন্তব্য যোগ করতে ব্যর্থ হয়েছে।" : "Failed to add destination.");
      }
    } catch (err) {
      console.error("Error adding destination:", err);
      toast.error(isBn ? "সার্ভারের সাথে সংযোগ করা যায়নি।" : "Could not connect to Paharika server.");
    } finally {
      setSubmitting(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setFormData({
      name: "",
      location: "Chittagong Hill Tracts",
      customLocation: "",
      price: "2000",
      duration: "2 Days, 1 Night",
      category: "Hill District",
      season: "Winter (Nov - Feb)",
      image: "https://cosmosgroup.sgp1.digitaloceanspaces.com/news/y8eC0WBzPEEVyKIGGjcM3zKIgirEYLTLvioF3GaP.jpeg",
      description: "",
      highlights: ["Scenic Views"],
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.info(isBn ? "ফর্ম রিসেট করা হয়েছে।" : "Form reset.");
  };

  const selectedCategoryBadge =
    categories.find((c) => c.en === formData.category) || categories[0];

  return (
    <div className="relative min-h-screen bg-base-100 text-base-content overflow-hidden pt-24 pb-20 sm:pt-28 sm:pb-24">
      {/* Decorative Background Lighting Gradients */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-base-content/60 mb-6">
          <Link href="/" className="hover:text-emerald-600 transition-colors">
            {isBn ? "হোম" : "Home"}
          </Link>
          <span>/</span>
          <Link href="/#featured" className="hover:text-emerald-600 transition-colors">
            {isBn ? "গন্তব্যসমূহ" : "Destinations"}
          </Link>
          <span>/</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
            {isBn ? "নতুন গন্তব্য যোগ" : "Add Destination"}
          </span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-base-200/80 pb-6 mb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <GiMountainRoad className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isBn ? "পাহাড়িকা ট্রাভেল কমিউনিটি" : "Paharika Explorer Community"}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight bg-gradient-to-r from-base-content via-base-content to-emerald-600 bg-clip-text">
              {isBn ? "নতুন গন্তব্য প্রকাশ করুন" : "Add a Travel Destination"}
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm text-base-content/70 leading-relaxed">
              {isBn
                ? "বাংলাদেশের অপরূপ পাহাড়, সমুদ্র, নদী ও বনের অনন্য স্থানগুলো যুক্ত করুন এবং দেশ-বিদেশের পর্যটকদের নতুন অভিযানের পথ দেখান।"
                : "Help fellow travelers discover the breathtaking hidden gems, tranquil hill tracts, and coastal retreats across Bangladesh."}
            </p>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-bold text-base-content/50 uppercase tracking-wider hidden sm:inline">
              {isBn ? "নমুনা পূরণ:" : "Quick Fill:"}
            </span>
            <button
              type="button"
              onClick={() => autofillDemo("sajek")}
              className="px-3 py-1.5 rounded-xl bg-base-200 hover:bg-emerald-500/10 hover:text-emerald-600 border border-base-300 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <HiSparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isBn ? "সাজেক" : "Sajek"}</span>
            </button>
            <button
              type="button"
              onClick={() => autofillDemo("nilgiri")}
              className="px-3 py-1.5 rounded-xl bg-base-200 hover:bg-emerald-500/10 hover:text-emerald-600 border border-base-300 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <HiSparkles className="w-3.5 h-3.5 text-teal-500" />
              <span>{isBn ? "নীলগিরি" : "Nilgiri"}</span>
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher: Form vs Live Preview */}
        <div className="lg:hidden flex items-center p-1 rounded-2xl bg-base-200 border border-base-300 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("form")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "form"
                ? "bg-base-100 text-emerald-600 shadow-sm"
                : "text-base-content/60"
            }`}
          >
            <FiLayers className="w-3.5 h-3.5" />
            <span>{isBn ? "ফর্ম পূরণ করুন" : "Destination Form"}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "preview"
                ? "bg-base-100 text-emerald-600 shadow-sm"
                : "text-base-content/60"
            }`}
          >
            <FiEye className="w-3.5 h-3.5" />
            <span>{isBn ? "লাইভ কার্ড প্রিভিউ" : "Live Card Preview"}</span>
          </button>
        </div>

        {/* Main 2-Column Split: Form (Left) & Live Preview (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: THE FORM (7 cols on Desktop) */}
          <div
            className={`lg:col-span-7 space-y-6 ${
              activeTab === "preview" ? "hidden lg:block" : "block"
            }`}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-base-100 rounded-3xl border border-base-300 p-6 sm:p-8 shadow-xl space-y-6"
            >
              {/* Form Title Banner */}
              <div className="flex items-center justify-between border-b border-base-200 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
                    <FiMapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-extrabold text-base sm:text-lg text-base-content">
                      {isBn ? "গন্তব্যের প্রাথমিক তথ্য" : "Destination Details"}
                    </h2>
                    <p className="text-[11px] text-base-content/60">
                      {isBn ? "সঠিক তথ্য দিয়ে ফর্মটি পূরণ করুন" : "Provide verified and authentic travel info"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-semibold text-base-content/50 hover:text-rose-500 transition-colors flex items-center gap-1"
                >
                  <FiRefreshCw className="w-3.5 h-3.5" />
                  <span>{isBn ? "রিসেট" : "Reset"}</span>
                </button>
              </div>

              {/* 1. Destination Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
                  <FiMapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isBn ? "গন্তব্যের নাম *" : "Destination Name *"}</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={isBn ? "যেমন: সাজেক ভ্যালি, রাঙ্গামাটি" : "e.g. Sajek Valley"}
                    className="w-full px-4 py-3 rounded-2xl bg-base-200/50 border border-base-300 focus:border-emerald-500 focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm font-medium transition-all"
                    required
                  />
                </div>
              </div>

              {/* 2. Location & Region */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
                    <FiCompass className="w-3.5 h-3.5 text-teal-600" />
                    <span>{isBn ? "বিভাগ / অঞ্চল *" : "Division / Region *"}</span>
                  </label>
                  <select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl bg-base-200/50 border border-base-300 focus:border-emerald-500 focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm font-medium transition-all"
                  >
                    {regions.map((reg, idx) => (
                      <option key={idx} value={reg.en}>
                        {isBn ? reg.bn : reg.en}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
                    <FiMapPin className="w-3.5 h-3.5 text-teal-600" />
                    <span>{isBn ? "নির্দিষ্ট উপজেলা / এলাকা" : "Specific District / Upazila"}</span>
                  </label>
                  <input
                    type="text"
                    name="customLocation"
                    value={formData.customLocation}
                    onChange={handleChange}
                    placeholder={isBn ? "যেমন: বাঘাইছড়ি, রাঙ্গামাটি" : "e.g. Thanchi, Bandarban"}
                    className="w-full px-4 py-3 rounded-2xl bg-base-200/50 border border-base-300 focus:border-emerald-500 focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm font-medium transition-all"
                  />
                </div>
              </div>

              {/* 3. Estimated Price & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
                    <span className="font-mono text-emerald-600 font-bold">৳</span>
                    <span>{isBn ? "আনুমানিক খরচ (জনপ্রতি ৳) *" : "Estimated Price (৳ / Person) *"}</span>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 font-bold text-base-content/60 text-sm">৳</span>
                    <input
                      type="number"
                      name="price"
                      min="0"
                      step="100"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="e.g. 2500"
                      className="w-full pl-9 pr-4 py-3 rounded-2xl bg-base-200/50 border border-base-300 focus:border-emerald-500 focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm font-bold font-mono transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
                    <FiClock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isBn ? "ভ্রমণের সময়কাল *" : "Ideal Duration *"}</span>
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder={isBn ? "যেমন: ৩ দিন, ২ রাত" : "e.g. 3 Days, 2 Nights"}
                    className="w-full px-4 py-3 rounded-2xl bg-base-200/50 border border-base-300 focus:border-emerald-500 focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm font-medium transition-all"
                    required
                  />
                </div>
              </div>

              {/* 4. Category Selector (Chips) */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
                  <FiLayers className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isBn ? "গন্তব্যের ধরন / ক্যাটাগরি" : "Destination Category"}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat, idx) => {
                    const isSelected = formData.category === cat.en;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, category: cat.en }))}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all transform active:scale-95 ${
                          isSelected
                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-transparent shadow-md shadow-emerald-600/20 scale-105"
                            : "bg-base-200/70 hover:bg-base-200 border-base-300 text-base-content/75"
                        }`}
                      >
                        {isBn ? cat.bn : cat.en}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Image URL & Device File Upload */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
                    <FiImage className="w-3.5 h-3.5 text-teal-600" />
                    <span>{isBn ? "গন্তব্যের ছবি *" : "Destination Cover Image *"}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-500 hover:underline flex items-center gap-1"
                  >
                    <FiUpload className="w-3 h-3" />
                    <span>{isBn ? "ডিভাইস থেকে ফাইল নির্বাচন" : "Choose from device"}</span>
                  </button>
                </div>

                <div className="relative flex items-center">
                  <FiImage className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/50 pointer-events-none" />
                  <input
                    type="text"
                    name="image"
                    value={
                      formData.image.startsWith("data:")
                        ? isBn
                          ? "ডিভাইস থেকে ছবি নির্বাচন করা হয়েছে (পরিবর্তন করতে ক্লিক করুন)"
                          : "Image loaded from device (Click to change)"
                        : formData.image
                    }
                    onChange={handleChange}
                    onClick={() => fileInputRef.current?.click()}
                    placeholder={
                      isBn
                        ? "ডিভাইস থেকে ছবি বেছে নিন অথবা ওয়েব ইমেজ ইউআরএল দিন"
                        : "Click here to choose photo from device or paste image URL"
                    }
                    className="w-full pl-10 pr-24 py-3 rounded-2xl bg-base-200/50 border border-base-300 focus:border-emerald-500 focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm font-medium transition-all cursor-pointer"
                    readOnly={formData.image.startsWith("data:")}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute right-2 px-3 py-1.5 rounded-xl bg-emerald-600/10 hover:bg-emerald-600 text-emerald-600 hover:text-white text-[11px] font-bold transition-all flex items-center gap-1"
                  >
                    <FiUpload className="w-3 h-3" />
                    <span>{isBn ? "ব্রাউজ" : "Browse"}</span>
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* Preset Photo Chips */}
                <div className="pt-1">
                  <span className="text-[11px] font-semibold text-base-content/60 block mb-1.5">
                    {isBn ? "অথবা নির্বাচিত ভ্রমণ ফটো থেকে বেছে নিন:" : "Or select a curated Bangladesh photo:"}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {presetImages.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, image: preset.url }));
                          toast.info(
                            isBn
                              ? `${preset.label} ছবি নির্বাচন করা হয়েছে!`
                              : `Selected ${preset.label} photo!`,
                            { autoClose: 900, hideProgressBar: true }
                          );
                        }}
                        className={`text-[11px] px-3 py-1 rounded-full border transition-all ${
                          formData.image === preset.url
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                            : "bg-base-200/80 hover:bg-base-300 border-base-300 text-base-content/80"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 6. Best Season */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
                  <FiCalendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{isBn ? "ভ্রমণের সেরা সময়" : "Best Season to Visit"}</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { en: "Winter (Nov - Feb)", bn: "শীতকাল (নভে - ফেব্রু)" },
                    { en: "Monsoon (Jun - Sep)", bn: "বর্ষাকাল (জুন - সেপ্টে)" },
                    { en: "Autumn (Oct - Nov)", bn: "শরৎ ও হেমন্ত" },
                    { en: "Round the Year", bn: "সারা বছর" },
                  ].map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, season: s.en }))}
                      className={`text-[11px] font-bold p-2.5 rounded-xl border text-center transition-all ${
                        formData.season === s.en
                          ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold"
                          : "bg-base-200/50 border-base-300 text-base-content/70 hover:bg-base-200"
                      }`}
                    >
                      {isBn ? s.bn : s.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* 7. Highlights & Key Perks */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
                  <FiCheckCircle className="w-3.5 h-3.5 text-teal-600" />
                  <span>{isBn ? "স্থানটির বিশেষ আকর্ষণ ও সুবিধাসমূহ" : "Key Highlights & Facilities"}</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {availableHighlights.map((hl) => {
                    const isChecked = formData.highlights.includes(hl.id);
                    return (
                      <label
                        key={hl.id}
                        onClick={() => toggleHighlight(hl.id)}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer text-xs transition-all ${
                          isChecked
                            ? "bg-emerald-500/10 border-emerald-500/60 text-emerald-700 dark:text-emerald-300 font-semibold"
                            : "bg-base-200/40 border-base-300/80 text-base-content/70 hover:bg-base-200"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                            isChecked
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-base-content/30"
                          }`}
                        >
                          {isChecked && <FiCheck className="w-3 h-3" />}
                        </div>
                        <span>{isBn ? hl.bn : hl.en}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 8. Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-base-content/80 flex items-center gap-1.5">
                    <FiFileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isBn ? "বিস্তারিত বিবরণ ও ভ্রমণ অভিজ্ঞতা *" : "Description & Travel Highlights *"}</span>
                  </label>
                  <span className="text-[10px] text-base-content/40 font-mono">
                    {formData.description.length} {isBn ? "অক্ষর" : "chars"}
                  </span>
                </div>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={
                    isBn
                      ? "স্থানটির বিশেষত্ব কী? কীভাবে যেতে হয়, কী দেখার আছে এবং ভ্রমণকারীদের জন্য প্রয়োজনীয় টিপস লিখুন..."
                      : "What makes this destination magical? Describe the landscape, local culture, travel tips, and best viewpoints..."
                  }
                  className="w-full px-4 py-3 rounded-2xl bg-base-200/50 border border-base-300 focus:border-emerald-500 focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs sm:text-sm font-medium transition-all resize-y"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-700 hover:to-teal-600 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      <span>{isBn ? "গন্তব্য প্রকাশ করা হচ্ছে..." : "Publishing Destination..."}</span>
                    </>
                  ) : (
                    <>
                      <GiMountainRoad className="w-5 h-5" />
                      <span>{isBn ? "গন্তব্য যুক্ত করুন" : "Publish Destination to Paharika"}</span>
                      <FiArrowRight className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: STICKY LIVE CARD PREVIEW (5 cols on Desktop) */}
          <div
            className={`lg:col-span-5 space-y-6 lg:sticky lg:top-28 ${
              activeTab === "form" ? "hidden lg:block" : "block"
            }`}
          >
            {/* Live Preview Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-base-content/80">
                  {isBn ? "লাইভ কার্ড প্রিভিউ" : "Live Card Preview"}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                {isBn ? "যেমন দেখাবে অ্যাপে" : "Actual Paharika Card"}
              </span>
            </div>

            {/* Destination Card Styled like FeaturedDestinations.jsx */}
            <div className="group relative rounded-3xl overflow-hidden bg-base-100 border border-base-300 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-emerald-500/50">
              {/* Card Thumbnail Image */}
              <div className="relative h-60 w-full overflow-hidden bg-base-300">
                <img
                  src={
                    formData.image ||
                    "https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={formData.name || "Destination Preview"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://cosmosgroup.sgp1.digitaloceanspaces.com/news/y8eC0WBzPEEVyKIGGjcM3zKIgirEYLTLvioF3GaP.jpeg";
                  }}
                />

                {/* Gradient Shadow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Category Badge (Top Left) */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
                  <span
                    className={`text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-md ${selectedCategoryBadge.color}`}
                  >
                    {isBn ? selectedCategoryBadge.bn : selectedCategoryBadge.en}
                  </span>
                </div>

                {/* Rating Badge (Top Right) */}
                <div className="absolute top-3.5 right-3.5">
                  <span className="inline-flex items-center gap-1 bg-black/60 backdrop-blur-md text-amber-300 px-2.5 py-1 rounded-full text-xs font-bold shadow-md border border-white/10">
                    <FiStar className="w-3.5 h-3.5 fill-amber-300" />
                    <span>4.9</span>
                    <span className="text-[10px] text-white/70">
                      ({isBn ? "নতুন" : "New"})
                    </span>
                  </span>
                </div>

                {/* Price Pill Floating at Bottom Right of Image */}
                <div className="absolute bottom-3.5 right-3.5 bg-black/75 backdrop-blur-md px-3 py-1 rounded-2xl border border-white/15 text-right shadow-md">
                  <span className="text-white text-base font-black font-mono">
                    ৳ {Number(formData.price || 0).toLocaleString()}
                  </span>
                  <span className="text-white/70 text-[10px] block -mt-0.5">
                    {isBn ? "/ জনপ্রতি" : "/ person"}
                  </span>
                </div>

                {/* Duration Floating at Bottom Left of Image */}
                <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 text-white/90 text-xs font-semibold bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-xl">
                  <FiClock className="w-3 h-3 text-emerald-300" />
                  <span>{formData.duration || "3 Days, 2 Nights"}</span>
                </div>
              </div>

              {/* Card Body Content */}
              <div className="p-5 sm:p-6 space-y-3.5">
                <div>
                  {/* Location Pin */}
                  <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-1">
                    <FiMapPin className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      {formData.customLocation
                        ? `${formData.customLocation}, ${formData.location}`
                        : formData.location}
                    </span>
                  </p>

                  {/* Destination Name */}
                  <h3 className="text-lg sm:text-xl font-black text-base-content tracking-tight line-clamp-1">
                    {formData.name || (isBn ? "গন্তব্যের নাম লিখুন" : "Destination Title")}
                  </h3>
                </div>

                {/* Description Snippet */}
                <p className="text-xs text-base-content/70 line-clamp-2 leading-relaxed">
                  {formData.description ||
                    (isBn
                      ? "আপনার গন্তব্যের চমৎকার বর্ণনা এখানে দৃশ্যমান হবে। প্রাকৃতিক সৌন্দর্য, পাহাড়, নদী এবং পর্যটকদের জন্য তথ্যপূর্ণ বিবরণ লিখুন..."
                      : "Detailed description of the destination will appear here. Highlight natural attractions, local culture, and scenic viewpoints...")}
                </p>

                {/* Highlights tags */}
                {formData.highlights && formData.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {formData.highlights.slice(0, 3).map((hl, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-base-200 text-base-content/75 border border-base-300"
                      >
                        ✓ {hl}
                      </span>
                    ))}
                    {formData.highlights.length > 3 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 text-emerald-600">
                        +{formData.highlights.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Card Action Buttons Preview */}
                <div className="pt-2 border-t border-base-200 flex items-center gap-2">
                  <button
                    type="button"
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold text-center shadow-md shadow-emerald-600/15"
                  >
                    {isBn ? "বিস্তারিত দেখুন" : "Explore Details"}
                  </button>
                  <button
                    type="button"
                    className="p-2.5 rounded-xl border border-base-300 hover:border-emerald-500 hover:text-emerald-600 text-base-content/70 transition-colors"
                  >
                    <FiHeart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Travel Submission Tips Card */}
            <div className="rounded-3xl border border-base-300 bg-base-200/50 p-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  💡
                </div>
                <h4 className="font-extrabold text-xs sm:text-sm text-base-content">
                  {isBn ? "উন্নত গন্তব্য তৈরির টিপস" : "Quality Listing Tips"}
                </h4>
              </div>
              <ul className="text-[11px] text-base-content/70 space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>
                  {isBn
                    ? "উচ্চ রেজোলিউশন ও প্রাকৃতিক ল্যান্ডস্কেপযুক্ত পরিষ্কার ছবি ব্যবহার করুন।"
                    : "Use crisp, high-resolution natural landscape photography."}
                </li>
                <li>
                  {isBn
                    ? "উপজেলা বা ইউনিয়নের সঠিক নাম দিন যাতে পর্যটকরা সহজে গুগল ম্যাপে খুঁজে পায়।"
                    : "Include accurate Upazila or District info for easy Google Maps navigation."}
                </li>
                <li>
                  {isBn
                    ? "জনপ্রতি বাস্তবসম্মত যাতায়াত ও থাকা-খাওয়ার আনুমানিক খরচ উল্লেখ করুন।"
                    : "Provide realistic per-person accommodation and transport estimates."}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
