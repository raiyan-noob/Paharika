"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/i18n/translations";
import { toast } from "react-toastify";
import {
  FiMapPin,
  FiStar,
  FiClock,
  FiBookmark,
  FiShare2,
  FiArrowLeft,
  FiCheck,
  FiShield,
  FiPhoneCall,
  FiCalendar,
  FiUsers,
  FiCompass,
  FiSun,
  FiInfo,
  FiArrowRight,
  FiAward,
  FiHeart,
  FiCheckCircle,
} from "react-icons/fi";
import {
  GiMountainRoad,
  GiPalmTree,
  GiCampfire,
  GiBackpack,
  GiCompass,
  GiPathDistance,
} from "react-icons/gi";

export default function DestinationDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const { language } = useLanguage();
  const t = translations[language].destinationDetails;
  const tAll = translations[language].allDestinations;

  const [destination, setDestination] = useState(null);
  const [relatedDestinations, setRelatedDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeImage, setActiveImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  // Booking calculator state
  const [travelDate, setTravelDate] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [selectedTier, setSelectedTier] = useState("standard");
  const [includeGuide, setIncludeGuide] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  // Helper to extract string from string or bilingual object
  const getText = (field) => {
    if (!field) return "";
    if (typeof field === "object") return field[language] || field.en || field.bn || "";
    return field;
  };

  useEffect(() => {
    if (!id) return;

    const fetchDestinationData = async () => {
      try {
        setIsLoading(true);
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL ||
          (process.env.BACKEND_URL ? process.env.BACKEND_URL.replace(/\/$/, "") : "http://localhost:5000");

        // 1. Fetch current destination
        let currentItem = null;
        try {
          const res = await fetch(`${backendUrl}/all-destination/${id}`);
          if (res.ok) {
            currentItem = await res.json();
          }
        } catch {
          // If specific ID fetch failed, will fallback to list
        }

        // 2. Fetch all destinations for fallback and related list
        const listRes = await fetch(`${backendUrl}/all-destination`);
        if (listRes.ok) {
          const list = await listRes.json();
          const allItems = Array.isArray(list) ? list : [];

          // If single item wasn't resolved by direct route, find from array
          if (!currentItem) {
            currentItem = allItems.find(
              (item) => item._id === id || String(item.id) === String(id)
            );
          }

          // Filter out current item for related section
          const related = allItems
            .filter((item) => (item._id || item.id) !== id && (item._id || item.id) !== currentItem?._id)
            .slice(0, 3);
          setRelatedDestinations(related);
        }

        setDestination(currentItem);
      } catch (err) {
        console.error("Error fetching destination details:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDestinationData();
  }, [id]);

  // Gallery images (main image + themed aesthetic viewpoints)
  const galleryImages = destination
    ? [
        destination.image,
        destination.fallbackImage || "https://cosmosgroup.sgp1.digitaloceanspaces.com/news/y8eC0WBzPEEVyKIGGjcM3zKIgirEYLTLvioF3GaP.jpeg",
        "https://upload.wikimedia.org/wikipedia/commons/d/db/Saint_Martins_Island_with_boats_in_foreground.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original",
        "https://huntingworldbeauty.com/wp-content/uploads/2024/11/kua-1024x576.jpeg.webp",
      ].filter(Boolean)
    : [];

  // Price Calculation
  const basePrice = destination?.price ? parseInt(destination.price, 10) : 2200;
  const tierCost = selectedTier === "premium" ? 1500 : selectedTier === "adventure" ? 800 : 0;
  const guideFee = includeGuide ? 500 : 0;
  const totalPrice = (basePrice + tierCost) * guestCount + guideFee;

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard?.writeText(window.location.href);
      toast.success(t.shareToast, { autoClose: 2000 });
    }
  };

  const handleTogglePlan = () => {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    const placeName = getText(destination?.name) || (language === "en" ? "Destination" : "গন্তব্য");
    if (nextSaved) {
      toast.success(
        language === "en"
          ? `Added ${placeName} to My Plan!`
          : `${placeName} ভ্রমণ তালিকায় যোগ হয়েছে!`,
        { autoClose: 2000 }
      );
    } else {
      toast.info(
        language === "en"
          ? `Removed ${placeName} from My Plan`
          : `${placeName} প্ল্যান থেকে সরানো হয়েছে`,
        { autoClose: 1800 }
      );
    }
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      toast.success(t.bookingSuccess, { autoClose: 3500 });
    }, 700);
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse">
            <div className="h-6 bg-base-300 rounded w-48 mb-6"></div>
            <div className="h-[420px] bg-base-300 rounded-3xl mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-4">
                <div className="h-10 bg-base-300 rounded-xl w-3/4"></div>
                <div className="h-4 bg-base-300 rounded w-1/2"></div>
                <div className="h-32 bg-base-300 rounded-2xl"></div>
              </div>
              <div className="lg:col-span-4 h-96 bg-base-300 rounded-3xl"></div>
            </div>
          </div>
        ) : !destination ? (
          /* Not Found State */
          <div className="max-w-3xl mx-auto px-4 py-24 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
              <FiCompass className="w-10 h-10" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black mb-3">{t.notFoundTitle}</h2>
            <p className="text-base-content/60 text-sm mb-8 leading-relaxed">
              {t.notFoundSubtitle}
            </p>
            <Link
              href="/all-destination"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition-all hover:scale-[1.02]"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span>{t.backBtn}</span>
            </Link>
          </div>
        ) : (
          /* Loaded Destination View */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* ──── Breadcrumbs & Action Bar ──── */}
            <div className="flex flex-wrap items-center justify-between gap-3 py-4 mb-4 border-b border-base-300/60">
              <div className="flex items-center gap-2 text-xs font-semibold text-base-content/60">
                <Link
                  href="/all-destination"
                  className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
                >
                  <FiArrowLeft className="w-3.5 h-3.5" />
                  <span>{t.backToList}</span>
                </Link>
                <span className="opacity-40">/</span>
                <span>{t.breadcrumbDest}</span>
                <span className="opacity-40">/</span>
                <span className="text-base-content font-bold truncate max-w-[200px]">
                  {getText(destination.name)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-base-300 bg-base-100 hover:border-emerald-500 hover:text-emerald-600 text-xs font-semibold transition-colors shadow-sm"
                  title={t.share}
                >
                  <FiShare2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="hidden sm:inline">{t.share}</span>
                </button>
                <button
                  onClick={handleTogglePlan}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    isSaved
                      ? "bg-emerald-500 text-white shadow-emerald-500/20"
                      : "border border-base-300 bg-base-100 hover:border-emerald-500 hover:text-emerald-600 text-base-content"
                  }`}
                >
                  <FiBookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                  <span>{isSaved ? t.inPlan : t.addToPlan}</span>
                </button>
              </div>
            </div>

            {/* ──── Panoramic Hero Gallery Showcase ──── */}
            <section className="relative rounded-3xl overflow-hidden shadow-xl border border-base-300/70 mb-8 bg-slate-950">
              <div className="relative h-[340px] sm:h-[420px] lg:h-[480px] w-full overflow-hidden">
                <img
                  src={galleryImages[activeImage] || destination.image}
                  alt={getText(destination.name)}
                  className="w-full h-full object-cover transition-all duration-700 transform hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = destination.fallbackImage || "/images/coxs-bazar.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20"></div>

                {/* Top Badges */}
                <div className="absolute top-5 left-5 right-5 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 rounded-full text-xs font-black tracking-wide text-white bg-emerald-600 shadow-md">
                      {getText(destination.tag) || destination.category || "Featured Spot"}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white bg-black/50 backdrop-blur-md border border-white/20">
                      <FiAward className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t.verified}</span>
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-amber-400 font-black text-xs border border-white/15">
                    <FiStar className="w-3.5 h-3.5 fill-current" />
                    <span>{destination.rating || "4.8"}</span>
                    <span className="text-white/70 font-normal text-[11px] ml-0.5">
                      ({destination.reviews || 890} {t.reviews})
                    </span>
                  </div>
                </div>

                {/* Bottom Overlay Title & Stats */}
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2 pointer-events-none">
                  <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-300 bg-emerald-950/60 backdrop-blur-md px-3 py-1 rounded-lg border border-emerald-500/30">
                    <FiMapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{getText(destination.location)}</span>
                  </div>

                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight drop-shadow-md">
                    {getText(destination.name)}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs sm:text-sm text-white/80">
                    {destination.duration && (
                      <span className="inline-flex items-center gap-1.5 backdrop-blur-md bg-white/10 px-3 py-1 rounded-lg border border-white/15">
                        <FiClock className="w-3.5 h-3.5 text-teal-300" />
                        <span>{getText(destination.duration)}</span>
                      </span>
                    )}
                    {destination.season && (
                      <span className="inline-flex items-center gap-1.5 backdrop-blur-md bg-white/10 px-3 py-1 rounded-lg border border-white/15">
                        <FiSun className="w-3.5 h-3.5 text-amber-300" />
                        <span>{destination.season}</span>
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 backdrop-blur-md bg-emerald-500/20 px-3 py-1 rounded-lg border border-emerald-400/30 font-bold text-emerald-200">
                      <span>৳{basePrice.toLocaleString()} {t.perPerson}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Gallery Thumbnails Strip */}
              {galleryImages.length > 1 && (
                <div className="p-3 bg-base-100/90 dark:bg-slate-900/90 border-t border-base-300/60 backdrop-blur-md flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all duration-200 ${
                        activeImage === idx
                          ? "border-emerald-500 scale-105 shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400/40"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="Angle preview" className="w-full h-full object-cover" />
                    </button>
                  ))}
                  <div className="ml-auto pr-3 hidden sm:flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    <GiCompass className="w-4 h-4" />
                    <span>{galleryImages.length} High-Res Angles</span>
                  </div>
                </div>
              )}
            </section>

            {/* ──── Two Column Content & Booking Grid ──── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* ──── Left Column: Tabs, Content, Itinerary (8 cols) ──── */}
              <div className="lg:col-span-8 space-y-6">
                {/* Modern Pill Navigation Tabs */}
                <div className="flex items-center gap-2 p-1.5 bg-base-200/70 border border-base-300 rounded-2xl overflow-x-auto no-scrollbar">
                  {[
                    { id: "overview", label: t.overviewTab, icon: FiInfo },
                    { id: "highlights", label: t.highlightsTab, icon: FiAward },
                    { id: "itinerary", label: t.itineraryTab, icon: GiPathDistance },
                    { id: "tips", label: t.tipsTab, icon: FiShield },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                          isActive
                            ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20 scale-[1.02]"
                            : "text-base-content/70 hover:bg-base-100 hover:text-emerald-600"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* TAB 1: OVERVIEW */}
                {activeTab === "overview" && (
                  <div className="space-y-6 animate-fade-in">
                    {/* Story / Description */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-base-100 dark:bg-base-200/40 border border-base-300/70 shadow-sm space-y-4">
                      <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-xs uppercase tracking-wider">
                        <GiMountainRoad className="w-4 h-4" />
                        <span>{language === "en" ? "About This Destination" : "এই গন্তব্য সম্পর্কে"}</span>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-base-content">
                        {getText(destination.name)} — {getText(destination.location)}
                      </h2>
                      <p className="text-sm sm:text-base leading-relaxed text-base-content/80 font-normal">
                        {getText(destination.description)}
                      </p>
                    </div>

                    {/* Quick Specs 4-Card Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                      <div className="p-4 rounded-2xl border border-base-300/70 bg-base-100 dark:bg-base-200/40 space-y-1">
                        <span className="text-[11px] font-semibold text-base-content/50 uppercase">{t.season}</span>
                        <p className="font-extrabold text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
                          {destination.season || (language === "en" ? "Round the Year" : "সারা বছর")}
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl border border-base-300/70 bg-base-100 dark:bg-base-200/40 space-y-1">
                        <span className="text-[11px] font-semibold text-base-content/50 uppercase">{t.duration}</span>
                        <p className="font-extrabold text-xs sm:text-sm text-teal-600 dark:text-teal-400">
                          {getText(destination.duration) || "3 Days, 2 Nights"}
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl border border-base-300/70 bg-base-100 dark:bg-base-200/40 space-y-1">
                        <span className="text-[11px] font-semibold text-base-content/50 uppercase">{t.category}</span>
                        <p className="font-extrabold text-xs sm:text-sm text-cyan-600 dark:text-cyan-400">
                          {destination.category || "Scenic Nature"}
                        </p>
                      </div>
                      <div className="p-4 rounded-2xl border border-base-300/70 bg-base-100 dark:bg-base-200/40 space-y-1">
                        <span className="text-[11px] font-semibold text-base-content/50 uppercase">{t.ratingScore}</span>
                        <p className="font-extrabold text-xs sm:text-sm text-amber-500 flex items-center gap-1">
                          <FiStar className="w-3.5 h-3.5 fill-current" />
                          <span>{destination.rating || "4.8"} / 5.0</span>
                        </p>
                      </div>
                    </div>

                    {/* What's Included */}
                    <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-transparent border border-emerald-500/20 space-y-4">
                      <h3 className="font-bold text-base text-base-content flex items-center gap-2">
                        <FiCheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>{t.whatsIncluded}</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {t.includedItems.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-base-content/80">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <FiCheck className="w-3 h-3 font-bold" />
                            </span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: HIGHLIGHTS & ACTIVITIES */}
                {activeTab === "highlights" && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="p-6 sm:p-7 rounded-3xl bg-base-100 dark:bg-base-200/40 border border-base-300/70 shadow-sm space-y-4">
                      <h3 className="text-lg font-black text-base-content">
                        {language === "en" ? "Top Experiences & Signature Highlights" : "শীর্ষ অভিজ্ঞতা ও মূল আকর্ষণ"}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(destination.highlights || [
                          "Scenic Panorama & Cloud Seas",
                          "Sunrise & Sunset Observation Points",
                          "Authentic Indigenous Culture & Cuisine",
                          "Safe Forest & Hill Trekking Trails",
                        ]).map((highlight, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl border border-base-300/80 bg-base-200/40 flex items-start gap-3 hover:border-emerald-500/40 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <GiCampfire className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="font-bold text-xs sm:text-sm text-base-content">{highlight}</h4>
                              <p className="text-[11px] text-base-content/60 mt-0.5">
                                {language === "en"
                                  ? "Vetted and guided by local community hosts for an unforgettable safe experience."
                                  : "স্থানীয় কমিউনিটি গাইডের তত্ত্বাবধানে নিরাপদ ও স্মৃতিময় ভ্রমণের অভিজ্ঞতা।"}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* What to Bring Checklist */}
                    <div className="p-6 rounded-3xl border border-base-300/70 bg-base-100 dark:bg-base-200/40 space-y-3">
                      <div className="flex items-center gap-2 font-bold text-sm text-base-content">
                        <GiBackpack className="w-4 h-4 text-emerald-600" />
                        <span>{language === "en" ? "Essential Packing Checklist" : "ভ্রমণে সাথে নেওয়ার প্রয়োজনীয় তালিকা"}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {[
                          language === "en" ? "Original NID / Passport" : "জাতীয় পরিচয়পত্র / পাসপোর্ট",
                          language === "en" ? "Trekking / Non-slip shoes" : "গ্রিপযুক্ত জুতো",
                          language === "en" ? "Power bank & Torch" : "পাওয়ার ব্যাংক ও টর্চ",
                          language === "en" ? "Cash (Limited ATMs)" : "নগদ টাকা (সীমিত এটিএম)",
                          language === "en" ? "Light jacket / Raincoat" : "হালকা জ্যাকেট / রেইনকোট",
                          language === "en" ? "Personal Medications" : "ব্যক্তিগত জরুরি ওষুধ",
                        ].map((item, i) => (
                          <span
                            key={i}
                            className="px-3 py-1.5 rounded-xl bg-base-200/80 text-xs font-semibold text-base-content/80 border border-base-300/60"
                          >
                            ✓ {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: ITINERARY */}
                {activeTab === "itinerary" && (
                  <div className="p-6 sm:p-7 rounded-3xl bg-base-100 dark:bg-base-200/40 border border-base-300/70 shadow-sm space-y-6 animate-fade-in">
                    <div className="space-y-1">
                      <h3 className="text-lg font-black text-base-content">
                        {language === "en" ? "Suggested 3-Day Adventure Itinerary" : "প্রস্তাবিত ৩ দিনের ভ্রমণ পরিকল্পনা"}
                      </h3>
                      <p className="text-xs text-base-content/60">
                        {language === "en"
                          ? "Customizable based on your arrival timing, weather, and physical comfort."
                          : "আবহাওয়া এবং আপনার সুবিধার ওপর নির্ভর করে এই পরিকল্পনা কাস্টমাইজ করা যাবে।"}
                      </p>
                    </div>

                    <div className="relative border-l-2 border-emerald-500/30 ml-3.5 space-y-8 py-2">
                      {[
                        {
                          day: language === "en" ? "Day 01" : "১ম দিন",
                          title: language === "en" ? "Arrival, Check-in & Golden Sunset" : "গন্তব্যে পৌঁছানো, চেক-ইন ও সূর্যাস্ত দর্শন",
                          desc:
                            language === "en"
                              ? "Arrive at destination hub. Board local Chander Gari/boat to the eco-resort. Rest and enjoy panoramic evening sunset with fresh local tea."
                              : "গন্তব্যে আগমন ও রিসোর্টে চেক-ইন। সন্ধ্যার চা পর্বের সাথে রক্তিম সূর্যাস্ত উপভোগ ও স্থানীয় ব্রিফিং।",
                        },
                        {
                          day: language === "en" ? "Day 02" : "২য় দিন",
                          title: language === "en" ? "Guided Exploration, Hidden Trails & Campfire" : "স্থানীয় দর্শনীয় স্থান পরিদর্শন ও ক্যাম্পফায়ার",
                          desc:
                            language === "en"
                              ? "Early morning sunrise above clouds/waves. Guided trek into scenic waterfalls, cultural villages, and savor authentic indigenous lunch followed by an evening BBQ."
                              : "ভোরে অপরূপ সূর্যোদয় দর্শন। পাহাড়ি ঝর্ণা ও গ্রাম ঘুরে স্থানীয় ঐতিহ্যবাহী দুপুরের খাবার ও রাতে বারবিকিউ আড্ডা।",
                        },
                        {
                          day: language === "en" ? "Day 03" : "৩য় দিন",
                          title: language === "en" ? "Morning Photography, Souvenirs & Farewell" : "স্মৃতি সংগ্রহ, কেনাকাটা ও বিদায়",
                          desc:
                            language === "en"
                              ? "Catch final morning views, visit local handicraft cottage market for memorable souvenirs, and prepare for safe return transit."
                              : "ভোরের মনোরম দৃশ্য ক্যামেরাবন্দি করা, স্মৃতিচিহ্ন কেনাকাটা এবং মিষ্টি স্মৃতি নিয়ে ঢাকার উদ্দেশ্যে ফিরতি যাত্রা।",
                        },
                      ].map((step, idx) => (
                        <div key={idx} className="relative pl-6">
                          <span className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md">
                            {idx + 1}
                          </span>
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                              {step.day}
                            </span>
                            <h4 className="font-bold text-sm sm:text-base text-base-content">{step.title}</h4>
                            <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: TIPS & ESSENTIALS */}
                {activeTab === "tips" && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="p-6 sm:p-7 rounded-3xl bg-base-100 dark:bg-base-200/40 border border-base-300/70 shadow-sm space-y-5">
                      <h3 className="text-lg font-black text-base-content flex items-center gap-2">
                        <FiShield className="w-5 h-5 text-emerald-600" />
                        <span>{t.tipsTab}</span>
                      </h3>

                      <div className="space-y-4 text-xs sm:text-sm text-base-content/80">
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                          <h4 className="font-bold text-emerald-700 dark:text-emerald-300">
                            🌿 {language === "en" ? "Eco-Tourism & Cultural Respect" : "পরিবেশ ও স্থানীয় সংস্কৃতির প্রতি সম্মান"}
                          </h4>
                          <p className="text-xs leading-relaxed">
                            {language === "en"
                              ? "Do not discard plastics or bottles along the trails. Always ask before photographing indigenous community members or sacred temples."
                              : "পাহাড় বা সৈকতে প্লাস্টিক ফেলবেন না। স্থানীয় উপজাতীয় বাসিন্দা ও ধর্মীয় স্থানের ছবি তোলার আগে অনুমতি নিন।"}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                          <h4 className="font-bold text-amber-700 dark:text-amber-300">
                            ⚠️ {language === "en" ? "Hill Road & Weather Precaution" : "পাহাড়ি পথ ও আবহাওয়ার সতর্কতা"}
                          </h4>
                          <p className="text-xs leading-relaxed">
                            {language === "en"
                              ? "During monsoon, hill roads can be slippery. Stick to registered 4x4 Chander Gari drivers and avoid nighttime unguided trekking."
                              : "বর্ষাকালে পাহাড়ি পথ পিচ্ছিল হতে পারে। সর্বদা অভিজ্ঞ চালক ও নিবন্ধিত গাইডের পরামর্শ মেনে চলুন।"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ──── Right Column: Sticky Booking Concierge Card (4 cols) ──── */}
              <div className="lg:col-span-4 sticky top-24">
                <div className="p-6 rounded-3xl bg-base-100 dark:bg-base-200/60 border border-base-300/80 shadow-xl space-y-5">
                  {/* Price Header */}
                  <div className="flex items-end justify-between border-b border-base-300/60 pb-4">
                    <div>
                      <span className="text-[11px] font-semibold text-base-content/50 uppercase tracking-wider block">
                        {language === "en" ? "Starting From" : "শুরু মাত্র"}
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                          ৳{basePrice.toLocaleString()}
                        </span>
                        <span className="text-xs font-medium text-base-content/60">{t.perPerson}</span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      15% Seasonal Deal
                    </span>
                  </div>

                  {/* Booking Form Controls */}
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    {/* Date Picker */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-base-content flex items-center gap-1.5">
                        <FiCalendar className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{t.selectDate}</span>
                      </label>
                      <input
                        type="date"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-base-300 bg-base-200/40 text-xs font-semibold focus:border-emerald-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    {/* Guest Counter */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-base-content flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <FiUsers className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{t.travelers}</span>
                        </span>
                        <span className="text-emerald-600 font-extrabold text-xs">
                          {guestCount} {t.guestLabel}
                        </span>
                      </label>
                      <div className="flex items-center justify-between p-2 rounded-xl border border-base-300 bg-base-200/40">
                        <button
                          type="button"
                          onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                          className="w-8 h-8 rounded-lg bg-base-100 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-base-content font-bold flex items-center justify-center border border-base-300 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-xs font-black">
                          {guestCount} {t.guestLabel}
                        </span>
                        <button
                          type="button"
                          onClick={() => setGuestCount(Math.min(12, guestCount + 1))}
                          className="w-8 h-8 rounded-lg bg-base-100 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-base-content font-bold flex items-center justify-center border border-base-300 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Tier Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-base-content block">{t.packageType}</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "standard", label: t.standard, extra: "+৳0" },
                          { id: "premium", label: t.premium, extra: "+৳1.5K" },
                          { id: "adventure", label: t.adventure, extra: "+৳800" },
                        ].map((tier) => (
                          <button
                            key={tier.id}
                            type="button"
                            onClick={() => setSelectedTier(tier.id)}
                            className={`p-2 rounded-xl text-center border text-[11px] font-bold transition-all ${
                              selectedTier === tier.id
                                ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 shadow-sm"
                                : "border-base-300 bg-base-200/40 text-base-content/70 hover:border-emerald-300"
                            }`}
                          >
                            <span className="block truncate">{tier.label.split(" ")[0]}</span>
                            <span className="text-[10px] opacity-60 font-normal">{tier.extra}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Add-on Guide Checkbox */}
                    <label className="flex items-center gap-2 p-2.5 rounded-xl border border-base-300 bg-base-200/30 cursor-pointer text-xs font-medium">
                      <input
                        type="checkbox"
                        checked={includeGuide}
                        onChange={(e) => setIncludeGuide(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                      <span className="flex-1">
                        {language === "en" ? "Add Ethnic Community Guide" : "স্থানীয় অভিজ্ঞ গাইড যুক্ত করুন"} (+৳500)
                      </span>
                    </label>

                    {/* Total Price Box */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-transparent border border-emerald-500/20 flex items-center justify-between">
                      <span className="text-xs font-bold text-base-content/70">{t.totalPrice}:</span>
                      <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                        ৳{totalPrice.toLocaleString()}
                      </span>
                    </div>

                    {/* Submit CTA */}
                    <button
                      type="submit"
                      disabled={isBooking}
                      className="w-full py-3.5 rounded-xl font-black text-sm text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 shadow-lg shadow-emerald-600/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                    >
                      <span>{isBooking ? (language === "en" ? "Processing..." : "অপেক্ষা করুন...") : t.bookTrip}</span>
                      <FiArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  {/* Trust Micro-Perks */}
                  <div className="space-y-2 pt-2 border-t border-base-300/60 text-[11px] text-base-content/60">
                    <div className="flex items-center gap-2">
                      <FiShield className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                      <span>{t.freeCancel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiPhoneCall className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                      <span>{t.support247}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiAward className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
                      <span>{t.instantConfirm}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ──── Related Destinations Carousel / Showcase ──── */}
            {relatedDestinations.length > 0 && (
              <section className="mt-16 pt-10 border-t border-base-300/60">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 block">
                      {language === "en" ? "Curated Suggestions" : "আপনার পছন্দের জন্য"}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-base-content">
                      {t.relatedTitle}
                    </h3>
                  </div>
                  <Link
                    href="/all-destination"
                    className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    <span>{tAll.filterAll}</span>
                    <FiArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedDestinations.map((rel) => {
                    const relId = rel._id || rel.id;
                    const relName = getText(rel.name);
                    const relLocation = getText(rel.location);
                    return (
                      <Link
                        key={relId}
                        href={`/all-destination/${relId}`}
                        className="group bg-base-100 dark:bg-base-200/40 rounded-2xl border border-base-300/70 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                      >
                        <div className="relative h-44 overflow-hidden bg-base-300">
                          <img
                            src={rel.image}
                            alt={relName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = rel.fallbackImage || "/images/coxs-bazar.jpg";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                          <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-bold text-white bg-emerald-600 shadow">
                            {getText(rel.tag) || rel.category || "Top Spot"}
                          </span>
                        </div>
                        <div className="p-4 space-y-2">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="font-bold text-base text-base-content group-hover:text-emerald-600 transition-colors">
                              {relName}
                            </h4>
                            <div className="flex items-center gap-0.5 text-xs text-amber-500 font-bold">
                              <FiStar className="w-3 h-3 fill-current" />
                              <span>{rel.rating || "4.8"}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-base-content/60">
                            <FiMapPin className="w-3 h-3 text-emerald-500" />
                            <span>{relLocation}</span>
                          </div>
                          <div className="pt-2 border-t border-base-300/60 flex items-center justify-between text-xs">
                            <span className="text-emerald-600 font-bold">
                              ৳{(rel.price || 2000).toLocaleString()} {t.perPerson}
                            </span>
                            <span className="font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                              {tAll.viewDetails} →
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
