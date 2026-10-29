"use client";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/i18n/translations";
import destinations from "@/data/destinations";
import { toast } from "react-toastify";
import {
  FiStar,
  FiMapPin,
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiBookmark,
  FiClock,
  FiCompass,
} from "react-icons/fi";
import Link from "next/link";

export default function FeaturedDestinations() {
  const { language } = useLanguage();
  const t = translations[language].featured;

  const [currentPage, setCurrentPage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [mouseStartX, setMouseStartX] = useState(0);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [savedPlans, setSavedPlans] = useState([]);

  const cardsPerPage = 3;
  const totalPages = Math.ceil(destinations.length / cardsPerPage);

  const getCurrentCards = () => {
    const start = currentPage * cardsPerPage;
    return destinations.slice(start, start + cardsPerPage);
  };

  const goToPage = (pageIdx) => {
    if (isAnimating || pageIdx === currentPage) return;
    setIsAnimating(true);
    setCurrentPage(pageIdx);
    setTimeout(() => setIsAnimating(false), 350);
  };

  const nextPage = () => {
    goToPage((currentPage + 1) % totalPages);
  };

  const prevPage = () => {
    goToPage((currentPage - 1 + totalPages) % totalPages);
  };

  // Touch Swipe Handlers (Mobile)
  const handleTouchStart = (e) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 35) {
      if (diff > 0) nextPage();
      else prevPage();
    }
  };

  // Mouse Drag Handlers (Desktop)
  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    setMouseStartX(e.clientX);
  };

  const handleMouseUp = (e) => {
    if (!isMouseDown) return;
    setIsMouseDown(false);
    const diff = mouseStartX - e.clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) nextPage();
      else prevPage();
    }
  };

  const toggleSavePlan = (dest) => {
    const isSaved = savedPlans.includes(dest.id);
    if (isSaved) {
      setSavedPlans(savedPlans.filter((id) => id !== dest.id));
      toast.info(
        language === "en"
          ? `Removed ${dest.name.en} from My Plan`
          : `${dest.name.bn} প্ল্যান থেকে সরানো হয়েছে`,
        { autoClose: 1800 }
      );
    } else {
      setSavedPlans([...savedPlans, dest.id]);
      toast.success(
        language === "en"
          ? `Added ${dest.name.en} to My Plan!`
          : `${dest.name.bn} ভ্রমণ তালিকায় যোগ হয়েছে!`,
        { autoClose: 1800 }
      );
    }
  };

  return (
    <section className="py-12 px-4 bg-base-100 text-base-content relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header - Scaled Down */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[11px] font-bold uppercase tracking-wider">
              <FiCompass className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>{t.sectionTag}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-base-content">
              {t.title}
            </h2>
            <p className="text-base-content/70 text-xs sm:text-sm">
              {t.subtitle}
            </p>
          </div>

          {/* Swipe & Navigation Controls */}
          <div className="flex items-center gap-2 self-start md:self-end">
            <span className="hidden sm:inline-block text-[11px] font-semibold text-base-content/50 pr-1">
              {language === "en" ? `Page ${currentPage + 1} of ${totalPages}` : `পৃষ্ঠা ${currentPage + 1} / ${totalPages}`}
            </span>
            <button
              onClick={prevPage}
              className="w-9 h-9 rounded-xl border border-base-300 bg-base-100 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:border-emerald-500 hover:text-emerald-600 flex items-center justify-center transition-all duration-200 shadow-sm"
              title="Previous 3"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextPage}
              className="w-9 h-9 rounded-xl border border-base-300 bg-base-100 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:border-emerald-500 hover:text-emerald-600 flex items-center justify-center transition-all duration-200 shadow-sm"
              title="Next 3"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Swipe Hint */}
        <div className="text-center sm:hidden mb-3">
          <span className="text-[10px] text-base-content/50 bg-base-200 px-2.5 py-0.5 rounded-full">
            👈 {t.swipeHint} 👉
          </span>
        </div>

        {/* Swipable Cards Carousel Area */}
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className="relative select-none cursor-grab active:cursor-grabbing pb-2"
        >
          <div
            className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 transition-all duration-300 transform ${
              isAnimating ? "opacity-40 scale-[0.99]" : "opacity-100 scale-100"
            }`}
          >
            {getCurrentCards().map((dest) => {
              const isSaved = savedPlans.includes(dest.id);
              return (
                <div
                  key={dest.id}
                  className="group bg-base-100 dark:bg-base-200/40 rounded-2xl border border-base-300/70 overflow-hidden shadow hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
                >
                  {/* Card Image */}
                  <div className="relative h-44 overflow-hidden bg-base-300">
                    <img
                      src={dest.image}
                      alt={dest.name[language]}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = dest.fallbackImage || "/images/coxs-bazar.jpg";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                    {/* Top Tag Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold text-white shadow-sm ${dest.badgeColor || "bg-emerald-600"}`}>
                        {dest.tag[language]}
                      </span>

                      {/* Bookmark button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleSavePlan(dest);
                        }}
                        className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 shadow-sm ${
                          isSaved
                            ? "bg-emerald-500 text-white"
                            : "bg-black/40 text-white hover:bg-black/70 hover:scale-110"
                        }`}
                        title={t.addToPlan}
                      >
                        <FiBookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                      </button>
                    </div>

                    {/* Price & Duration */}
                   
                  </div>

                  {/* Card Details */}
                  <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h3 className="text-base font-bold tracking-tight text-base-content group-hover:text-emerald-600 transition-colors">
                          {dest.name[language]}
                        </h3>
                        {/* Rating */}
                        <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold text-[11px]">
                          <FiStar className="w-3 h-3 fill-current" />
                          <span>{dest.rating}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-[11px] text-base-content/60 font-medium mb-2">
                        <FiMapPin className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                        <span>{dest.location[language]}</span>
                      </div>

                      <p className="text-xs text-base-content/70 leading-relaxed line-clamp-2">
                        {dest.description[language]}
                      </p>
                    </div>

                    {/* Action Footer */}
                    <div className="pt-2.5 border-t border-base-300/60 flex items-center justify-between">
                      <span className="text-[10px] text-base-content/50">
                        ({dest.reviews.toLocaleString()} {language === "en" ? "reviews" : "মতামত"})
                      </span>
                      <Link
                        href={`/destinations?place=${dest.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 group/link"
                      >
                        <span>{t.explore}</span>
                        <FiArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-5">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToPage(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentPage
                  ? "w-6 bg-emerald-600 dark:bg-emerald-500"
                  : "w-2 bg-base-300 hover:bg-emerald-300"
              }`}
              aria-label={`Go to page ${idx + 1}`}
            />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-7">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-xs sm:text-sm"
          >
            <span>{t.viewMore}</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
