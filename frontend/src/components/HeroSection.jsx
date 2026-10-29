"use client";
import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/i18n/translations";
import { toast } from "react-toastify";
import {
  FiMapPin,
  FiUsers,
  FiStar,
  FiHeadphones,
  FiArrowRight,
  FiSearch,
  FiCalendar,
  FiCompass,
} from "react-icons/fi";
import { GiMountainRoad, GiPalmTree, GiSunrise } from "react-icons/gi";
import Link from "next/link";

export default function HeroSection() {
  const { language } = useLanguage();
  const t = translations[language].hero;

  const [searchDestination, setSearchDestination] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchTravelers, setSearchTravelers] = useState("2");

  const stats = [
    { value: "150+", label: t.stats.destinations, icon: <FiMapPin className="w-4 h-4" /> },
    { value: "50K+", label: t.stats.travelers, icon: <FiUsers className="w-4 h-4" /> },
    { value: "4.9/5", label: t.stats.rating, icon: <FiStar className="w-4 h-4 text-amber-300" /> },
    { value: "24/7", label: t.stats.support, icon: <FiHeadphones className="w-4 h-4" /> },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchDestination || (language === "en" ? "Top spots" : "সেরা স্থানসমূহ");
    toast.info(
      language === "en"
        ? `Searching tours for "${query}" with ${searchTravelers} travelers...`
        : `"${query}" এর জন্য ${searchTravelers} জন ভ্রমণকারীর প্যাকেজ খোঁজা হচ্ছে...`,
      { autoClose: 2200 }
    );
  };

  return (
    <section className="relative min-h-[82vh] flex flex-col justify-between pt-20 pb-10 overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 text-white">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-72 h-72 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-teal-500/10 rounded-full blur-[110px] pointer-events-none"></div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.35) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      ></div>

      {/* Watermarks */}
      <GiMountainRoad className="absolute top-20 right-10 w-32 h-32 text-white/[0.03] hidden lg:block pointer-events-none" />
      <GiPalmTree className="absolute bottom-20 left-8 w-28 h-28 text-white/[0.03] hidden lg:block pointer-events-none" />

      {/* Main hero content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-auto w-full">
        <div className="grid lg:grid-cols-12 gap-8 items-center pt-4">
          {/* Left Column: Headlines & Callouts */}
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/30 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-emerald-200 uppercase">
                {t.tagline}
              </span>
            </div>

            {/* Main Headline - Compact and punchy */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]">
              {t.title}
              <br />
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                {t.titleHighlight}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-emerald-100/75 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {t.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <Link
                href="/destinations"
                className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <span>{t.exploreCta}</span>
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/my-plan"
                className="flex items-center gap-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 backdrop-blur-md transition-all duration-200 hover:scale-[1.02]"
              >
                <FiCompass className="w-4 h-4 text-emerald-300" />
                <span>{t.planCta}</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative hidden sm:flex justify-center">
            <div className="relative w-full max-w-sm">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl blur-lg opacity-25"></div>

              {/* Glass Card Showcase */}
              <div className="relative bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-200 tracking-wider uppercase">
                    {language === "en" ? "Trending in Bangladesh" : "জনপ্রিয় স্পট"}
                  </span>
                </div>

                {/* Mini place cards */}
                {[
                  {
                    name: language === "en" ? "Sajek Valley" : "সাজেক ভ্যালি",
                    type: language === "en" ? "Cloud Hills & Cottages" : "মেঘ ও কটেজ",
                    rating: "4.8",
                    
                    tag: "⛰️",
                  },
                  {
                    name: language === "en" ? "Cox's Bazar" : "কক্সবাজার",
                    type: language === "en" ? "120km Sandy Beach" : "দীর্ঘতম সৈকত",
                    rating: "4.8",
                    
                    tag: "🏖️",
                  },
                  {
                    name: language === "en" ? "Sundarbans" : "সুন্দরবন",
                    type: language === "en" ? "Mangrove & Royal Tigers" : "ম্যানগ্রোভ ও বাঘ",
                    rating: "4.7",
                    
                    tag: "🐅",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-sm">
                        {item.tag}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs group-hover:text-emerald-300 transition-colors">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-white/60">{item.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-300 text-xs">{item.price}</span>
                      <div className="flex items-center justify-end gap-0.5 text-[10px] text-amber-300">
                        <FiStar className="fill-current w-2.5 h-2.5" />
                        <span>{item.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Compact Quick Search Bar Widget */}
        <div className="mt-8 bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl p-3 shadow-xl">
          <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 items-center">
            {/* Destination Input */}
            <div className="space-y-0.5 px-2 py-0.5">
              <label className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                <FiMapPin className="w-3 h-3 text-emerald-400" />
                {t.searchBar.destinationLabel}
              </label>
              <input
                type="text"
                value={searchDestination}
                onChange={(e) => setSearchDestination(e.target.value)}
                placeholder={t.searchBar.destinationPlaceholder}
                className="w-full bg-transparent border-0 text-white placeholder-white/40 text-xs focus:outline-none font-medium"
              />
            </div>

            {/* Date Input */}
            <div className="space-y-0.5 px-2 py-0.5 border-t sm:border-t-0 sm:border-l border-white/10">
              <label className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                <FiCalendar className="w-3 h-3 text-emerald-400" />
                {t.searchBar.dateLabel}
              </label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="w-full bg-transparent border-0 text-white text-xs focus:outline-none font-medium cursor-pointer"
              />
            </div>

            {/* Travelers Input */}
            <div className="space-y-0.5 px-2 py-0.5 border-t lg:border-t-0 lg:border-l border-white/10">
              <label className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                <FiUsers className="w-3 h-3 text-emerald-400" />
                {t.searchBar.travelersLabel}
              </label>
              <select
                value={searchTravelers}
                onChange={(e) => setSearchTravelers(e.target.value)}
                className="w-full bg-transparent border-0 text-white text-xs focus:outline-none font-medium cursor-pointer [&>option]:text-black"
              >
                <option value="1">1 {language === "en" ? "Solo Traveler" : "একক ভ্রমণকারী"}</option>
                <option value="2">2 {language === "en" ? "Travelers (Couple)" : "ভ্রমণকারী (যুগল)"}</option>
                <option value="4">4 {language === "en" ? "Travelers (Family)" : "ভ্রমণকারী (পরিবার)"}</option>
                <option value="6+">6+ {language === "en" ? "Group Tour" : "দলবদ্ধ ভ্রমণ"}</option>
              </select>
            </div>

            {/* Search Button */}
            <div>
              <button
                type="submit"
                className="w-full h-10 flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold rounded-xl shadow shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 text-xs"
              >
                <FiSearch className="w-3.5 h-3.5" />
                <span>{t.searchBar.searchBtn}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Compact Highlight Stats Strip */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                {item.icon}
              </div>
              <div>
                <p className="text-sm sm:text-base font-extrabold text-white leading-tight">{item.value}</p>
                <p className="text-[10px] text-emerald-100/70 font-medium">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
