"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import translations from "@/i18n/translations";
import { toast } from "react-toastify";
import {
  FiSun,
  FiMoon,
  FiMenu,
  FiX,
  FiGlobe,
  FiMapPin,
  FiCompass,
  FiUser,
  FiCalendar,
  FiLogIn,
  FiUserPlus,
} from "react-icons/fi";
import { GiMountainRoad } from "react-icons/gi";

export default function Navbar() {
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const t = translations[language].nav;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLanguageChange = () => {
    const nextLang = language === "en" ? "bn" : "en";
    toggleLanguage();
    toast.info(
      nextLang === "bn" ? "ভাষা বাংলায় পরিবর্তন করা হয়েছে" : "Switched to English",
      { autoClose: 1800 }
    );
  };

  const handleThemeChange = () => {
    toggleTheme();
    const nextTheme = theme === "light" ? "dark" : "light";
    toast.success(
      nextTheme === "dark" ? t.themeToastDark : t.themeToastLight,
      { autoClose: 1800 }
    );
  };

  const navLinks = [
    { name: t.home, href: "/", icon: <FiCompass className="w-3.5 h-3.5" /> },
    {
      name: t.destinations,
      href: "/all-destination",
      icon: <FiMapPin className="w-3.5 h-3.5" />,
    },
    {
      name: t.myDestination || (language === "bn" ? "আমার গন্তব্য" : "My Destination"),
      href: "/my-destination",
      icon: <GiMountainRoad className="w-3.5 h-3.5" />,
    },
    {
      name: t.myPlan,
      href: "/my-plan",
      icon: <FiCalendar className="w-3.5 h-3.5" />,
    },
    {
      name: t.profile,
      href: "/profile",
      icon: <FiUser className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-base-100/90 dark:bg-base-100/95 backdrop-blur-md shadow-sm border-b border-base-300/60"
          : "bg-transparent text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo - Sleeker & Compact */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-all duration-200 shadow-sm shadow-emerald-500/20">
                <GiMountainRoad className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <span className={`text-lg sm:text-xl font-extrabold tracking-tight ${scrolled ? "bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent" : "text-white"}`}>
                {language === "bn" ? "পাহাড়িকা" : "Paharika"}
              </span>
              <span className={`hidden sm:block text-[9px] font-semibold tracking-wider uppercase -mt-0.5 ${scrolled ? "text-base-content/60" : "text-emerald-200"}`}>
                {language === "en" ? "Travel Planner" : "ভ্রমণ সহায়ক"}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links - Compact Pill */}
          <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full border border-base-300/30 bg-base-100/10 backdrop-blur-md">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  scrolled
                    ? "text-base-content/80 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                    : "text-white/90 hover:text-white hover:bg-white/15"
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-2">
            {/* Language Switcher */}
            <button
              onClick={handleLanguageChange}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 ${
                scrolled
                  ? "border-base-300 text-base-content/80 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30"
                  : "border-white/20 text-white hover:bg-white/15"
              }`}
              title={language === "en" ? "Switch to বাংলা" : "Switch to English"}
            >
              <FiGlobe className="w-3.5 h-3.5 text-emerald-500" />
              <div className="flex items-center gap-1 text-[11px]">
                <span className={language === "en" ? "font-extrabold text-emerald-600 dark:text-emerald-400" : "opacity-60"}>EN</span>
                <span className="opacity-40">|</span>
                <span className={language === "bn" ? "font-extrabold text-emerald-600 dark:text-emerald-400" : "opacity-60"}>বাংলা</span>
              </div>
            </button>

            {/* Theme Toggle: Sun for Light mode, Moon for Dark mode */}
            <button
              onClick={handleThemeChange}
              className={`p-2 rounded-lg border transition-all duration-200 ${
                scrolled
                  ? "border-base-300 text-base-content/80 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30"
                  : "border-white/20 text-white hover:bg-white/15"
              }`}
              title={theme === "light" ? "Light Mode (Click for Dark)" : "Dark Mode (Click for Light)"}
            >
              {theme === "light" ? (
                <FiSun className="w-4 h-4 text-amber-500" />
              ) : (
                <FiMoon className="w-4 h-4 text-indigo-400" />
              )}
            </button>

            {/* Auth Buttons Skeleton */}
            <div className="flex items-center gap-1.5 ml-1">
              <Link
                href="/login"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all duration-200 ${
                  scrolled
                    ? "text-base-content/80 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                    : "text-white/90 hover:text-white hover:bg-white/15"
                }`}
              >
                <FiLogIn className="w-3.5 h-3.5" />
                <span>{t.login}</span>
              </Link>

              <Link
                href="/signup"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-lg font-bold text-xs shadow-sm hover:shadow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                <FiUserPlus className="w-3.5 h-3.5" />
                <span>{t.signup}</span>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Controls */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={handleLanguageChange}
              className="px-2.5 py-1 rounded-md border border-white/20 text-xs font-bold"
            >
              {t.language}
            </button>
            <button
              onClick={handleThemeChange}
              className="p-1.5 rounded-md border border-white/20"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <FiSun className="w-4 h-4 text-amber-400" />
              ) : (
                <FiMoon className="w-4 h-4 text-indigo-300" />
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`p-1.5 rounded-lg transition-colors ${scrolled ? "text-base-content hover:bg-base-200" : "text-white hover:bg-white/20"}`}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-base-100 text-base-content border-b border-base-300 shadow-xl px-5 py-4 animate-fade-in-up">
          <div className="space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-semibold text-sm transition-colors"
              >
                <span className="text-emerald-600">{link.icon}</span>
                {link.name}
              </Link>
            ))}
            <div className="pt-2 border-t border-base-300 grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2 border border-base-300 rounded-lg font-bold text-xs hover:bg-base-200 transition-colors"
              >
                <FiLogIn className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.login}</span>
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-lg font-bold text-xs shadow"
              >
                <FiUserPlus className="w-3.5 h-3.5" />
                <span>{t.signup}</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
