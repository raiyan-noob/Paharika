"use client";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/i18n/translations";
import { GiMountainRoad } from "react-icons/gi";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiMapPin,
  FiPhone,
  FiMail,
  FiHeart,
  FiArrowUp,
} from "react-icons/fi";
import { useState, useEffect } from "react";

export default function Footer() {
  const { language } = useLanguage();
  const t = translations[language].footer;
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-base-200 border-t border-base-300/50">
      {/* Main Footer - Scaled Down */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-md shadow-emerald-500/20">
                <GiMountainRoad className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                {language === "bn" ? "পাহাড়িকা" : "Paharika"}
              </span>
            </Link>
            <p className="text-xs text-base-content/65 leading-relaxed">
              {t.description}
            </p>
            {/* Social Links */}
            <div>
              <p className="text-xs font-bold text-base-content/80 mb-2">
                {t.social}
              </p>
              <div className="flex items-center gap-2">
                {[
                  { icon: <FiFacebook className="w-4 h-4" />, href: "#" },
                  { icon: <FiInstagram className="w-4 h-4" />, href: "#" },
                  { icon: <FiTwitter className="w-4 h-4" />, href: "#" },
                  { icon: <FiYoutube className="w-4 h-4" />, href: "#" },
                ].map((social, i) => (
                  <a
                    key={i}
                    href={social.href}
                    className="w-8 h-8 bg-base-300/60 rounded-lg flex items-center justify-center text-base-content/60 hover:bg-emerald-600 hover:text-white transition-all duration-200"
                    aria-label="Social Link"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-base-content mb-3.5">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2">
              {Object.values(t.links).map((link, i) => (
                <li key={i}>
                  <Link
                    href="#"
                    className="text-xs text-base-content/65 hover:text-emerald-600 transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold text-base-content mb-3.5">
              {t.support}
            </h4>
            <ul className="space-y-2">
              {Object.values(t.supportLinks).map((link, i) => (
                <li key={i}>
                  <Link
                    href="#"
                    className="text-xs text-base-content/65 hover:text-emerald-600 transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-base-300/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-base-content/50 text-xs">{t.copyright}</p>
          <p className="text-base-content/50 text-xs flex items-center gap-1">
            {t.madeWith}{" "}
            
            {t.inBangladesh} 🇧🇩
          </p>
        </div>
      </div>

      {/* Compact Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-500 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 z-50 ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-3 pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <FiArrowUp className="w-4 h-4" />
      </button>
    </footer>
  );
}
