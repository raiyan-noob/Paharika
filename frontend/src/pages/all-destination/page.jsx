"use client";
import { useState, useEffect, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/i18n/translations";
import { toast } from "react-toastify";
import Link from "next/link";
import {
  FiSearch,
  FiMapPin,
  FiStar,
  FiArrowRight,
  FiBookmark,
  FiGrid,
  FiList,
  FiFilter,
  FiX,
  FiClock,
  FiCompass,
  FiChevronDown,
  FiTrendingUp,
} from "react-icons/fi";
import {
  GiMountainRoad,
  GiPalmTree,
  GiForestCamp,
  GiIsland,
  GiWaveSurfer,
  GiCastle,
} from "react-icons/gi";

// Category filter config
const CATEGORIES = [
  { key: "all", icon: FiCompass },
  { key: "beach", icon: GiWaveSurfer, keywords: ["beach", "sea", "coast", "bazar", "kuakata", "martin", "সৈকত", "সমুদ্র"] },
  { key: "hill", icon: GiMountainRoad, keywords: ["hill", "mountain", "peak", "valley", "sajek", "bandarban", "rangamati", "keokradong", "পাহাড়", "চূড়া", "ভ্যালি"] },
  { key: "forest", icon: GiForestCamp, keywords: ["forest", "mangrove", "sundarban", "rainforest", "lawachara", "বন", "ম্যানগ্রোভ"] },
  { key: "lake", icon: GiWaveSurfer, keywords: ["lake", "kaptai", "boga", "হ্রদ"] },
  { key: "island", icon: GiIsland, keywords: ["island", "coral", "দ্বীপ", "প্রবাল"] },
  { key: "cultural", icon: GiCastle, keywords: ["cultural", "heritage", "temple", "mosque", "ঐতিহ্য", "মন্দির", "মসজিদ"] },
];

export default function AllDestinationPage() {
  const { language } = useLanguage();
  const t = translations[language].allDestinations;

  // State
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid");
  const [savedPlans, setSavedPlans] = useState([]);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Fetch destinations from backend
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const backendUrl =
          process.env.NEXT_PUBLIC_BACKEND_URL ||
          (process.env.BACKEND_URL ? process.env.BACKEND_URL.replace(/\/$/, "") : "http://localhost:5000");
        const res = await fetch(`${backendUrl}/all-destination`);
        if (res.ok) {
          const data = await res.json();
          setDestinations(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error("Failed to fetch destinations from server:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  // Helper: get displayable text from bilingual or plain fields
  const getText = (field) => {
    if (!field) return "";
    if (typeof field === "object") return field[language] || field.en || field.bn || "";
    return field;
  };

  // Filter + Search + Sort
  const filteredDestinations = useMemo(() => {
    let results = [...destinations];

    // Category filter
    if (activeCategory !== "all") {
      const cat = CATEGORIES.find((c) => c.key === activeCategory);
      if (cat?.keywords) {
        results = results.filter((dest) => {
          const haystack = [
            getText(dest.name),
            getText(dest.location),
            getText(dest.description),
            getText(dest.tag),
            dest.category || "",
          ]
            .join(" ")
            .toLowerCase();
          return cat.keywords.some((kw) => haystack.includes(kw.toLowerCase()));
        });
      }
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter((dest) => {
        const haystack = [
          getText(dest.name),
          getText(dest.location),
          getText(dest.description),
          getText(dest.tag),
          dest.category || "",
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
    }

    // Sort
    switch (sortBy) {
      case "rating":
        results.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "price":
        results.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "name":
        results.sort((a, b) => getText(a.name).localeCompare(getText(b.name)));
        break;
      default:
        break;
    }

    return results;
  }, [destinations, activeCategory, searchQuery, sortBy, language]);

  // Bookmark toggle
  const toggleSavePlan = (dest) => {
    const destId = dest._id || dest.id;
    const isSaved = savedPlans.includes(destId);
    const destName = getText(dest.name);
    if (isSaved) {
      setSavedPlans(savedPlans.filter((id) => id !== destId));
      toast.info(
        language === "en"
          ? `Removed ${destName} from My Plan`
          : `${destName} প্ল্যান থেকে সরানো হয়েছে`,
        { autoClose: 1800 }
      );
    } else {
      setSavedPlans([...savedPlans, destId]);
      toast.success(
        language === "en"
          ? `Added ${destName} to My Plan!`
          : `${destName} ভ্রমণ তালিকায় যোগ হয়েছে!`,
        { autoClose: 1800 }
      );
    }
  };

  // Sort options
  const sortOptions = [
    { value: "default", label: t.sortDefault },
    { value: "rating", label: t.sortRating },
    { value: "price", label: t.sortPrice },
    { value: "name", label: t.sortName },
  ];

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* ──── Hero Banner ──── */}
      <section className="relative pt-24 pb-16 sm:pt-28 sm:pb-20 overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 text-white">
        {/* Ambient glows */}
        <div className="absolute top-10 left-1/4 w-72 h-72 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-[110px] pointer-events-none"></div>
        {/* Grid dots */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.35) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        ></div>
        {/* Watermarks */}
        <GiMountainRoad className="absolute top-16 right-12 w-36 h-36 text-white/[0.03] hidden lg:block pointer-events-none" />
        <GiPalmTree className="absolute bottom-12 left-10 w-28 h-28 text-white/[0.03] hidden lg:block pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Tag pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 backdrop-blur-md mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-emerald-200 uppercase">
              {t.heroTag}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {t.heroTitle.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
              {t.heroTitle.split(" ").slice(-1)}
            </span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-emerald-100/70 max-w-2xl mx-auto leading-relaxed">
            {t.heroSubtitle}
          </p>

          {/* Search bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl px-4 py-3 gap-3 focus-within:border-emerald-400/60 transition-colors">
              <FiSearch className="w-5 h-5 text-emerald-300 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="flex-1 bg-transparent outline-none text-white placeholder-emerald-200/50 text-sm font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
                >
                  <FiX className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ──── Toolbar: Filters / Sort / View Toggle ──── */}
      <section className="sticky top-16 z-30 bg-base-100/95 dark:bg-base-100/95 backdrop-blur-md border-b border-base-300/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-3">
            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const label = t[`filter${cat.key.charAt(0).toUpperCase() + cat.key.slice(1)}`];
                const isActive = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-500/20"
                        : "bg-base-200/70 text-base-content/70 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-600"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              {/* Result count */}
              <span className="text-[11px] font-semibold text-base-content/50 hidden sm:inline-block mr-1">
                {filteredDestinations.length} {t.totalResults}
              </span>

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-base-300 bg-base-100 hover:border-emerald-500 text-xs font-semibold text-base-content/80 transition-colors"
                >
                  <FiTrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{t.sortLabel}</span>
                  <FiChevronDown
                    className={`w-3 h-3 transition-transform ${showSortDropdown ? "rotate-180" : ""}`}
                  />
                </button>
                {showSortDropdown && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowSortDropdown(false)}></div>
                    <div className="absolute right-0 mt-1 w-36 bg-base-100 border border-base-300 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                      {sortOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSortBy(opt.value);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-medium transition-colors ${
                            sortBy === opt.value
                              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 font-bold"
                              : "text-base-content/70 hover:bg-base-200"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* View toggle */}
              <div className="flex items-center border border-base-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 transition-colors ${
                    viewMode === "grid"
                      ? "bg-emerald-600 text-white"
                      : "bg-base-100 text-base-content/60 hover:bg-base-200"
                  }`}
                  title={t.gridView}
                >
                  <FiGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 transition-colors ${
                    viewMode === "list"
                      ? "bg-emerald-600 text-white"
                      : "bg-base-100 text-base-content/60 hover:bg-base-200"
                  }`}
                  title={t.listView}
                >
                  <FiList className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──── Destination Cards ──── */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Mobile result count */}
          <div className="sm:hidden mb-4 text-xs font-semibold text-base-content/50">
            {filteredDestinations.length} {t.totalResults}
          </div>

          {/* Loading skeleton */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-base-100 dark:bg-base-200/40 rounded-2xl border border-base-300/70 overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-base-300"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-base-300 rounded w-2/3"></div>
                    <div className="h-3 bg-base-300 rounded w-1/2"></div>
                    <div className="h-3 bg-base-300 rounded w-full"></div>
                    <div className="h-3 bg-base-300 rounded w-4/5"></div>
                    <div className="flex justify-between pt-3 border-t border-base-300/50">
                      <div className="h-4 bg-base-300 rounded w-1/4"></div>
                      <div className="h-4 bg-base-300 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredDestinations.length === 0 ? (
            /* Empty state */
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center">
                <FiCompass className="w-9 h-9 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-base-content/80 mb-1">{t.noResults}</h3>
              <p className="text-sm text-base-content/50 mb-5">{t.noResultsSub}</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                  setSortBy("default");
                }}
                className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs rounded-xl shadow hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <FiX className="w-4 h-4" />
                {t.clearFilters}
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* ── Grid View ── */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((dest) => {
                const destId = dest._id || dest.id;
                const isSaved = savedPlans.includes(destId);
                const displayName = getText(dest.name);
                const displayLocation = getText(dest.location);
                const displayDesc = getText(dest.description);
                const displayTag = getText(dest.tag) || dest.category || (language === "en" ? "Popular" : "জনপ্রিয়");
                const displayDuration = getText(dest.duration);

                return (
                  <div
                    key={destId}
                    className="group bg-base-100 dark:bg-base-200/40 rounded-2xl border border-base-300/70 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
                    onMouseEnter={() => setHoveredCard(destId)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden bg-base-300">
                      <img
                        src={dest.image}
                        alt={displayName}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = dest.fallbackImage || "/images/coxs-bazar.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>

                      {/* Top row: badge + bookmark */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold text-white shadow-sm ${
                            dest.badgeColor || "bg-emerald-600"
                          }`}
                        >
                          {displayTag}
                        </span>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleSavePlan(dest);
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-sm ${
                            isSaved
                              ? "bg-emerald-500 text-white scale-110"
                              : "bg-black/40 text-white hover:bg-black/70 hover:scale-110"
                          }`}
                          title={isSaved ? t.removeFromPlan : t.addToPlan}
                        >
                          <FiBookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
                        </button>
                      </div>

                      {/* Bottom: price + duration overlay */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                        {dest.price && (
                          <div className="backdrop-blur-md bg-black/40 px-2.5 py-1 rounded-lg">
                            <span className="text-white font-bold text-sm">
                              ৳{dest.price.toLocaleString()}
                            </span>
                            <span className="text-emerald-200 text-[10px] ml-0.5">{t.perPerson}</span>
                          </div>
                        )}
                        {displayDuration && (
                          <div className="backdrop-blur-md bg-black/40 px-2.5 py-1 rounded-lg flex items-center gap-1">
                            <FiClock className="w-3 h-3 text-emerald-300" />
                            <span className="text-white text-[11px] font-medium">{displayDuration}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <h3 className="text-base font-bold tracking-tight text-base-content group-hover:text-emerald-600 transition-colors line-clamp-1">
                            {displayName}
                          </h3>
                          <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 font-bold text-[11px] flex-shrink-0">
                            <FiStar className="w-3 h-3 fill-current" />
                            <span>{dest.rating || "5.0"}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-base-content/60 font-medium mb-2">
                          <FiMapPin className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                          <span>{displayLocation}</span>
                          {dest.reviews && (
                            <>
                              <span className="text-base-content/30 mx-1">•</span>
                              <span>
                                {dest.reviews.toLocaleString()} {language === "en" ? "reviews" : "মতামত"}
                              </span>
                            </>
                          )}
                        </div>

                        <p className="text-xs text-base-content/65 leading-relaxed line-clamp-2">
                          {displayDesc}
                        </p>
                      </div>

                      {/* Footer action */}
                      <div className="pt-3 border-t border-base-300/50">
                        <Link
                          href={`/all-destination/${destId}`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 group/link"
                        >
                          <span>{t.viewDetails}</span>
                          <FiArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ── List View ── */
            <div className="space-y-4">
              {filteredDestinations.map((dest) => {
                const destId = dest._id || dest.id;
                const isSaved = savedPlans.includes(destId);
                const displayName = getText(dest.name);
                const displayLocation = getText(dest.location);
                const displayDesc = getText(dest.description);
                const displayTag = getText(dest.tag) || dest.category || (language === "en" ? "Popular" : "জনপ্রিয়");
                const displayDuration = getText(dest.duration);

                return (
                  <div
                    key={destId}
                    className="group flex flex-col sm:flex-row bg-base-100 dark:bg-base-200/40 rounded-2xl border border-base-300/70 overflow-hidden shadow-sm hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-200"
                  >
                    {/* Image */}
                    <div className="relative w-full sm:w-72 h-48 sm:h-auto flex-shrink-0 overflow-hidden bg-base-300">
                      <img
                        src={dest.image}
                        alt={displayName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = dest.fallbackImage || "/images/coxs-bazar.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent sm:bg-gradient-to-r sm:from-transparent sm:to-transparent"></div>
                      <span
                        className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-md text-[10px] font-bold text-white shadow-sm ${
                          dest.badgeColor || "bg-emerald-600"
                        }`}
                      >
                        {displayTag}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h3 className="text-lg font-bold tracking-tight text-base-content group-hover:text-emerald-600 transition-colors">
                              {displayName}
                            </h3>
                            <div className="flex items-center gap-1.5 text-xs text-base-content/60 font-medium mt-0.5">
                              <FiMapPin className="w-3 h-3 text-emerald-500" />
                              <span>{displayLocation}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-500 font-bold text-xs">
                              <FiStar className="w-3 h-3 fill-current" />
                              <span>{dest.rating || "5.0"}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                toggleSavePlan(dest);
                              }}
                              className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-200 ${
                                isSaved
                                  ? "bg-emerald-500 border-emerald-500 text-white"
                                  : "border-base-300 text-base-content/50 hover:border-emerald-500 hover:text-emerald-500"
                              }`}
                              title={isSaved ? t.removeFromPlan : t.addToPlan}
                            >
                              <FiBookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-base-content/65 leading-relaxed line-clamp-2 mb-3">
                          {displayDesc}
                        </p>
                      </div>

                      {/* Meta + action row */}
                      <div className="flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-base-300/50">
                        <div className="flex items-center gap-3 text-[11px] text-base-content/50 font-medium">
                          {dest.price && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                              ৳{dest.price.toLocaleString()}
                              <span className="text-base-content/40 font-normal text-[10px] ml-0.5">{t.perPerson}</span>
                            </span>
                          )}
                          {displayDuration && (
                            <span className="inline-flex items-center gap-1">
                              <FiClock className="w-3 h-3" />
                              {displayDuration}
                            </span>
                          )}
                          {dest.reviews && (
                            <span>
                              {dest.reviews.toLocaleString()} {language === "en" ? "reviews" : "মতামত"}
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/all-destination/${destId}`}
                          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                        >
                          <span>{t.viewDetails}</span>
                          <FiArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

