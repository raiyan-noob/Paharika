"use client";
import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/i18n/translations";
import { FiStar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";

export default function Testimonials() {
  const { language } = useLanguage();
  const t = translations[language].testimonials;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % t.reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, t.reviews.length]);

  const next = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prev) => (prev + 1) % t.reviews.length);
  };

  const prev = () => {
    setIsAutoPlaying(false);
    setActiveIndex(
      (prev) => (prev - 1 + t.reviews.length) % t.reviews.length
    );
  };

  return (
    <section className="py-12 px-4 bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-950 relative overflow-hidden text-white">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-teal-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-8 space-y-2">
          <span className="inline-block px-3 py-1 bg-white/10 text-emerald-200 rounded-full text-[11px] font-bold tracking-wide border border-white/10">
            {t.sectionTag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            {t.title}
          </h2>
          <p className="text-white/60 max-w-xl mx-auto text-xs sm:text-sm">
            {t.subtitle}
          </p>
        </div>

        {/* Testimonial Cards - Scaled Down */}
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            {t.reviews.map((review, i) => (
              <div
                key={i}
                className={`transition-all duration-500 ${
                  i === activeIndex
                    ? "opacity-100 translate-y-0 scale-100"
                    : "opacity-0 absolute inset-0 translate-y-4 scale-95 pointer-events-none"
                }`}
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 sm:p-7 shadow-xl">
                  <FaQuoteLeft className="w-6 h-6 text-emerald-400/50 mb-3" />
                  <p className="text-white text-base sm:text-lg leading-relaxed mb-5 font-normal">
                    &ldquo;{review.text}&rdquo;
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow">
                        {review.avatar}
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-sm">
                          {review.name}
                        </h4>
                        <p className="text-white/50 text-xs">
                          {review.location}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <FiStar
                          key={si}
                          className={`w-3.5 h-3.5 ${
                            si < review.rating
                              ? "text-amber-400 fill-current"
                              : "text-white/20"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={prev}
              className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
              title="Previous review"
            >
              <FiChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-1.5">
              {t.reviews.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setActiveIndex(i);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-6 bg-emerald-400"
                      : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200"
              title="Next review"
            >
              <FiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
