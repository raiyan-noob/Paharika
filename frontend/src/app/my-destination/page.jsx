"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/i18n/translations";
import { toast } from "react-toastify";
import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiEye,
  FiMapPin,
  FiClock,
  FiSearch,
  FiGrid,
  FiList,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiCheckCircle,
  FiFilter,
  FiCompass,
  FiArrowRight,
  FiImage,
} from "react-icons/fi";
import {
  GiMountainRoad,
  GiPalmTree,
  GiWaterSplash,
  GiIsland,
  GiForestCamp,
  GiCampfire,
} from "react-icons/gi";

// Initial realistic destinations for creator studio
const INITIAL_DESTINATIONS = [
  {
    id: "my-1",
    name: "Keokradong Summit & Cloud Camp",
    nameBn: "কেওক্রাডং চূড়া ও ক্লাউড ক্যাম্প",
    location: "Ruma, Bandarban",
    locationBn: "রুমা, বান্দরবান",
    price: 2200,
    duration: "3 Days, 2 Nights",
    durationBn: "৩ দিন, ২ রাত",
    category: "Hill District",
    categoryBn: "পাহাড়",
    status: "published",
    image:
      "https://cosmosgroup.sgp1.digitaloceanspaces.com/news/y8eC0WBzPEEVyKIGGjcM3zKIgirEYLTLvioF3GaP.jpeg",
    description:
      "Stand on the majestic peak of Keokradong above rolling cloud seas, experience ethnic Marma hospitality, and stargaze by the summit cottage.",
    views: 1420,
    rating: 4.9,
    dateAdded: "2026-10-24",
  },
  {
    id: "my-2",
    name: "Tanguar Haor Luxury Houseboat",
    nameBn: "টাঙ্গুয়ার হাওর লাক্সারি হাউসবোট",
    location: "Tahirpur, Sunamganj",
    locationBn: "তাহিরপুর, সুনামগঞ্জ",
    price: 3800,
    duration: "2 Days, 1 Night",
    durationBn: "২ দিন, ১ রাত",
    category: "Lake & Haor",
    categoryBn: "হাওর ও হ্রদ",
    status: "published",
    image:
      "https://bangladeshexplore.com/wp-content/uploads/2026/06/Sylhet-Jaflong.webp",
    description:
      "Float through the pristine waters of Tanguar Haor, watch flocking migratory birds, and enjoy fresh local fish delicacies on a traditional wooden boat.",
    views: 980,
    rating: 4.8,
    dateAdded: "2026-10-28",
  },
  {
    id: "my-3",
    name: "Nafakhum & Remakri Falls Trek",
    nameBn: "নাফাকুম ও রেমাক্রি জলপ্রপাত ট্র্যাকিং",
    location: "Thanchi, Bandarban",
    locationBn: "থানচি, বান্দরবান",
    price: 2800,
    duration: "4 Days, 3 Nights",
    durationBn: "৪ দিন, ৩ রাত",
    category: "Waterfall & Trail",
    categoryBn: "ঝর্ণা ও ট্রেইল",
    status: "published",
    image:
      "https://elements-resized.envatousercontent.com/elements-video-cover-images/5add86c6-3ddb-43ad-b709-1d4836db346b/video_preview/video_preview_0000.jpg?w=500&cf_fit=cover&q=85&format=auto&s=a14026110c6218594bda8c210e4bd192a4f751adced0265f4370161544d36c82",
    description:
      "Often referred to as the Niagara of Bengal. An adventurous boat transit on Sangu River followed by an unforgettable jungle trek.",
    views: 650,
    rating: 4.7,
    dateAdded: "2026-11-01",
  },
  {
    id: "my-4",
    name: "Sonadia Island Eco Mangrove Camp",
    nameBn: "সোনাদিয়া দ্বীপ ইকো ম্যানগ্রোভ ক্যাম্প",
    location: "Moheshkhali, Cox's Bazar",
    locationBn: "মহেশখালী, কক্সবাজার",
    price: 1900,
    duration: "2 Days, 1 Night",
    durationBn: "২ দিন, ১ রাত",
    category: "Island & Beach",
    categoryBn: "দ্বীপ ও সমুদ্র",
    status: "draft",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/d/db/Saint_Martins_Island_with_boats_in_foreground.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original",
    description:
      "Uninhabited serene sandy island with red crabs, mangrove channels, and pristine quiet seaside camping under the Milky Way.",
    views: 310,
    rating: 4.6,
    dateAdded: "2026-11-05",
  },
];

export default function MyDestinationPage() {
  const { language } = useLanguage();
  const t = translations[language].myDestinations;
  const isBn = language === "bn";

  // State
  const [destinations, setDestinations] = useState(INITIAL_DESTINATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'published' | 'draft'
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'

  // Modals state
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    location: "",
    price: "",
    duration: "",
    category: "Hill District",
    image: "",
    description: "",
    status: "published",
  });

  const [deletingItem, setDeletingItem] = useState(null);

  // Filtered destinations
  const filteredList = useMemo(() => {
    return destinations.filter((dest) => {
      // Tab filter
      if (activeTab === "published" && dest.status !== "published") return false;
      if (activeTab === "draft" && dest.status !== "draft") return false;

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const title = (dest.name + " " + (dest.nameBn || "")).toLowerCase();
        const loc = (dest.location + " " + (dest.locationBn || "")).toLowerCase();
        const desc = (dest.description || "").toLowerCase();
        return title.includes(query) || loc.includes(query) || desc.includes(query);
      }
      return true;
    });
  }, [destinations, activeTab, searchQuery]);

  // Statistics
  const totalCount = destinations.length;
  const publishedCount = destinations.filter((d) => d.status === "published").length;
  const draftCount = destinations.filter((d) => d.status === "draft").length;
  const totalViews = destinations.reduce((sum, d) => sum + (d.views || 0), 0);

  // Edit actions
  const openEditModal = (item) => {
    setEditingItem(item);
    setEditFormData({
      name: isBn && item.nameBn ? item.nameBn : item.name,
      location: isBn && item.locationBn ? item.locationBn : item.location,
      price: item.price,
      duration: isBn && item.durationBn ? item.durationBn : item.duration,
      category: item.category,
      image: item.image,
      description: item.description,
      status: item.status,
    });
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingItem) return;

    setDestinations((prev) =>
      prev.map((d) =>
        d.id === editingItem.id
          ? {
              ...d,
              name: editFormData.name,
              nameBn: editFormData.name,
              location: editFormData.location,
              locationBn: editFormData.location,
              price: Number(editFormData.price) || d.price,
              duration: editFormData.duration,
              category: editFormData.category,
              image: editFormData.image || d.image,
              description: editFormData.description,
              status: editFormData.status,
            }
          : d
      )
    );

    toast.success(t.updateSuccess || "Destination updated successfully!");
    setEditingItem(null);
  };

  // Delete actions
  const confirmDelete = () => {
    if (!deletingItem) return;

    const itemName = isBn && deletingItem.nameBn ? deletingItem.nameBn : deletingItem.name;
    setDestinations((prev) => prev.filter((d) => d.id !== deletingItem.id));
    toast.info(`${t.deleteSuccess || "Destination deleted."} (${itemName})`);
    setDeletingItem(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content selection:bg-emerald-500 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        {/* ──── Creator Studio Hero Banner ──── */}
        <section className="relative pt-12 pb-14 sm:pt-16 sm:pb-16 overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 text-white">
          {/* Ambient Glows */}
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-[110px] pointer-events-none"></div>
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.35) 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          ></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                {/* Pill Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                  <GiMountainRoad className="w-3.5 h-3.5" />
                  <span>{t.tag}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                  {t.pageTitle}
                </h1>
                <p className="text-sm sm:text-base text-emerald-100/75 leading-relaxed font-normal">
                  {t.pageSubtitle}
                </p>
              </div>

              {/* Add Destination Button */}
              <div className="flex items-center gap-3 self-start md:self-end">
                <Link
                  href="/add-destination"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>{t.addNewBtn}</span>
                </Link>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-8 pt-6 border-t border-white/10">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-[11px] font-semibold text-emerald-200/60 uppercase block">
                  {t.totalAdded}
                </span>
                <span className="text-2xl font-black text-white mt-0.5 block">{totalCount}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-[11px] font-semibold text-emerald-200/60 uppercase block">
                  {t.activePublished}
                </span>
                <span className="text-2xl font-black text-emerald-300 mt-0.5 block">
                  {publishedCount}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-[11px] font-semibold text-emerald-200/60 uppercase block">
                  {t.underReview}
                </span>
                <span className="text-2xl font-black text-amber-300 mt-0.5 block">{draftCount}</span>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="text-[11px] font-semibold text-emerald-200/60 uppercase block">
                  {t.totalViews}
                </span>
                <span className="text-2xl font-black text-cyan-300 mt-0.5 block">
                  {totalViews.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ──── Filter & Search Toolbar ──── */}
        <section className="sticky top-16 z-30 bg-base-100/95 dark:bg-base-100/95 backdrop-blur-md border-b border-base-300/70 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-base-200/70 rounded-xl border border-base-300">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "all"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-base-content/70 hover:text-emerald-600"
                  }`}
                >
                  {t.allTab} ({totalCount})
                </button>
                <button
                  onClick={() => setActiveTab("published")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "published"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-base-content/70 hover:text-emerald-600"
                  }`}
                >
                  {t.publishedTab} ({publishedCount})
                </button>
                <button
                  onClick={() => setActiveTab("draft")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === "draft"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-base-content/70 hover:text-emerald-600"
                  }`}
                >
                  {t.draftTab} ({draftCount})
                </button>
              </div>

              {/* Search + View Toggle */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 sm:w-72">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 w-3.5 h-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full pl-9 pr-8 py-2 rounded-xl text-xs bg-base-200/50 border border-base-300 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center border border-base-300 rounded-xl overflow-hidden bg-base-100">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-colors ${
                      viewMode === "grid"
                        ? "bg-emerald-600 text-white"
                        : "text-base-content/60 hover:bg-base-200"
                    }`}
                    title="Grid View"
                  >
                    <FiGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-colors ${
                      viewMode === "list"
                        ? "bg-emerald-600 text-white"
                        : "text-base-content/60 hover:bg-base-200"
                    }`}
                    title="List View"
                  >
                    <FiList className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ──── Destination Cards Container ──── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {filteredList.length === 0 ? (
            /* Empty State */
            <div className="p-12 text-center rounded-3xl border border-dashed border-base-300 max-w-lg mx-auto space-y-4 my-8">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto">
                <FiCompass className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-lg text-base-content">{t.emptyTitle}</h3>
                <p className="text-xs text-base-content/60 leading-relaxed">{t.emptySubtitle}</p>
              </div>
              <Link
                href="/add-destination"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md"
              >
                <FiPlus className="w-4 h-4" />
                <span>{t.addFirstBtn}</span>
              </Link>
            </div>
          ) : viewMode === "grid" ? (
            /* ── GRID VIEW ── */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredList.map((item) => {
                const displayName = isBn && item.nameBn ? item.nameBn : item.name;
                const displayLocation =
                  isBn && item.locationBn ? item.locationBn : item.location;
                const isPublished = item.status === "published";

                return (
                  <div
                    key={item.id}
                    className="group rounded-3xl bg-base-100 dark:bg-base-200/40 border border-base-300/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Image & Badges */}
                    <div className="relative h-48 overflow-hidden bg-base-300">
                      <img
                        src={item.image}
                        alt={displayName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://cosmosgroup.sgp1.digitaloceanspaces.com/news/y8eC0WBzPEEVyKIGGjcM3zKIgirEYLTLvioF3GaP.jpeg";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent"></div>

                      {/* Status Badge */}
                      <span
                        className={`absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm flex items-center gap-1 ${
                          isPublished
                            ? "bg-emerald-600/90 backdrop-blur-md border border-emerald-400/30"
                            : "bg-amber-600/90 backdrop-blur-md border border-amber-400/30"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isPublished ? "bg-emerald-300 animate-ping" : "bg-amber-200"
                          }`}
                        ></span>
                        {isPublished ? t.statusPublished : t.statusDraft}
                      </span>

                      {/* Price Tag */}
                      <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-emerald-300 text-xs font-black border border-white/10">
                        ৳{item.price.toLocaleString()}
                        <span className="text-[10px] text-white/60 font-normal ml-0.5">/ person</span>
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-extrabold text-base text-base-content group-hover:text-emerald-600 transition-colors line-clamp-1">
                            {displayName}
                          </h3>
                        </div>

                        <div className="flex items-center gap-1 text-xs text-base-content/60 font-medium mb-2">
                          <FiMapPin className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span>{displayLocation}</span>
                          <span className="mx-1 opacity-30">•</span>
                          <FiClock className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                          <span>{isBn && item.durationBn ? item.durationBn : item.duration}</span>
                        </div>

                        <p className="text-xs text-base-content/65 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Action Bar */}
                      <div className="pt-3 border-t border-base-300/60 flex items-center justify-between gap-2">
                        <Link
                          href={`/all-destination/${item.id}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 group/link"
                        >
                          <FiEye className="w-3.5 h-3.5" />
                          <span>{t.viewBtn}</span>
                        </Link>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openEditModal(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-base-300 bg-base-100 hover:border-emerald-500 hover:text-emerald-600 text-xs font-bold text-base-content transition-colors shadow-sm"
                            title={t.editBtn}
                          >
                            <FiEdit3 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{t.editBtn}</span>
                          </button>

                          <button
                            onClick={() => setDeletingItem(item)}
                            className="p-1.5 rounded-lg border border-base-300 bg-base-100 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500 transition-colors shadow-sm"
                            title={t.deleteBtn}
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Dashed "+ Add Another Destination" Card */}
              <Link
                href="/add-destination"
                className="group rounded-3xl border-2 border-dashed border-base-300 hover:border-emerald-500 bg-base-200/20 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 p-8 flex flex-col items-center justify-center text-center space-y-3 transition-all duration-300 min-h-[340px]"
              >
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <FiPlus className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-base text-base-content group-hover:text-emerald-600 transition-colors">
                    {t.cardAddPrompt}
                  </h4>
                  <p className="text-xs text-base-content/60 max-w-xs">{t.cardAddPromptSub}</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{t.addNewBtn}</span>
                  <FiArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          ) : (
            /* ── LIST / TABLE VIEW ── */
            <div className="space-y-3">
              {filteredList.map((item) => {
                const displayName = isBn && item.nameBn ? item.nameBn : item.name;
                const displayLocation =
                  isBn && item.locationBn ? item.locationBn : item.location;
                const isPublished = item.status === "published";

                return (
                  <div
                    key={item.id}
                    className="group flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-base-100 dark:bg-base-200/40 border border-base-300/80 hover:border-emerald-500/40 shadow-sm transition-all gap-4"
                  >
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <img
                        src={item.image}
                        alt={displayName}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-base-300 flex-shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-base-content group-hover:text-emerald-600 transition-colors">
                            {displayName}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              isPublished
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                            }`}
                          >
                            {isPublished ? t.statusPublished : t.statusDraft}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-base-content/60">
                          <span className="flex items-center gap-1">
                            <FiMapPin className="w-3 h-3 text-emerald-500" />
                            {displayLocation}
                          </span>
                          <span>•</span>
                          <span className="text-emerald-600 font-bold">
                            ৳{item.price.toLocaleString()}
                          </span>
                          <span>•</span>
                          <span>{isBn && item.durationBn ? item.durationBn : item.duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center w-full sm:w-auto justify-end">
                      <Link
                        href={`/all-destination/${item.id}`}
                        className="px-3 py-1.5 rounded-lg border border-base-300 text-xs font-bold hover:border-emerald-500 text-emerald-600 transition-colors"
                      >
                        {t.viewBtn}
                      </Link>
                      <button
                        onClick={() => openEditModal(item)}
                        className="px-3 py-1.5 rounded-lg border border-base-300 text-xs font-bold hover:border-emerald-500 hover:text-emerald-600 transition-colors flex items-center gap-1"
                      >
                        <FiEdit3 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{t.editBtn}</span>
                      </button>
                      <button
                        onClick={() => setDeletingItem(item)}
                        className="p-2 rounded-lg border border-base-300 text-red-500 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ──── EDIT MODAL ──── */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-base-100 rounded-3xl border border-base-300 shadow-2xl max-w-xl w-full p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between border-b border-base-300 pb-3">
                <div className="space-y-0.5">
                  <h3 className="text-lg font-black text-base-content">{t.editModalTitle}</h3>
                  <p className="text-xs text-base-content/60">{t.editModalSubtitle}</p>
                </div>
                <button
                  onClick={() => setEditingItem(null)}
                  className="p-1.5 rounded-xl hover:bg-base-200 text-base-content/60"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-base-content">{t.fieldTitle}</label>
                  <input
                    type="text"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-base-300 bg-base-200/40 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Location & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-base-content">{t.fieldLocation}</label>
                    <input
                      type="text"
                      value={editFormData.location}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, location: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-base-300 bg-base-200/40 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-base-content">{t.fieldPrice}</label>
                    <input
                      type="number"
                      value={editFormData.price}
                      onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-base-300 bg-base-200/40 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Duration & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-base-content">{t.fieldDuration}</label>
                    <input
                      type="text"
                      value={editFormData.duration}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, duration: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-base-300 bg-base-200/40 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-base-content">{t.fieldCategory}</label>
                    <select
                      value={editFormData.category}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, category: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-base-300 bg-base-200/40 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                    >
                      <option value="Hill District">Hill District</option>
                      <option value="Sea Beach">Sea Beach</option>
                      <option value="Forest & Mangrove">Forest & Mangrove</option>
                      <option value="Lake & Haor">Lake & Haor</option>
                      <option value="Island">Island</option>
                    </select>
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-base-content">{t.fieldStatus}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setEditFormData({ ...editFormData, status: "published" })}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                        editFormData.status === "published"
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600"
                          : "border-base-300 text-base-content/60"
                      }`}
                    >
                      ✓ {t.statusPublished}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditFormData({ ...editFormData, status: "draft" })}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                        editFormData.status === "draft"
                          ? "border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-600"
                          : "border-base-300 text-base-content/60"
                      }`}
                    >
                      ⏳ {t.statusDraft}
                    </button>
                  </div>
                </div>

                {/* Image URL & Preview */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-base-content">{t.fieldImage}</label>
                  <input
                    type="url"
                    value={editFormData.image}
                    onChange={(e) => setEditFormData({ ...editFormData, image: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-base-300 bg-base-200/40 text-xs font-semibold focus:border-emerald-500 focus:outline-none"
                    placeholder="https://..."
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-base-content">{t.fieldDescription}</label>
                  <textarea
                    rows={3}
                    value={editFormData.description}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, description: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-base-300 bg-base-200/40 text-xs font-medium focus:border-emerald-500 focus:outline-none"
                  ></textarea>
                </div>

                {/* Modal Buttons */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-base-300">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2.5 rounded-xl border border-base-300 text-xs font-bold hover:bg-base-200 transition-colors"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md transition-all"
                  >
                    {t.saveChanges}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ──── DELETE CONFIRMATION MODAL ──── */}
        {deletingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-base-100 rounded-3xl border border-base-300 shadow-2xl max-w-md w-full p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto">
                <FiTrash2 className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-base-content">{t.deleteModalTitle}</h3>
                <p className="text-xs text-base-content/70 leading-relaxed max-w-sm mx-auto">
                  {t.deleteConfirmText}
                </p>
                <div className="p-3 mt-2 rounded-xl bg-base-200 font-bold text-xs text-base-content">
                  "{isBn && deletingItem.nameBn ? deletingItem.nameBn : deletingItem.name}"
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingItem(null)}
                  className="py-2.5 rounded-xl border border-base-300 text-xs font-bold hover:bg-base-200 transition-colors"
                >
                  {t.keepDestination}
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  {t.confirmDelete}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

