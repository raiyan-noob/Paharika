"use client";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/i18n/translations";
import { FiSearch, FiSliders, FiCheckCircle } from "react-icons/fi";

export default function HowItWorks() {
  const { language } = useLanguage();
  const t = translations[language].howItWorks;

  const icons = [
    <FiSearch key="search" className="w-5 h-5" />,
    <FiSliders key="sliders" className="w-5 h-5" />,
    <FiCheckCircle key="check" className="w-5 h-5" />,
  ];

  return (
    <section className="py-12 px-4 bg-base-100">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 space-y-2">
          <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-[11px] font-bold tracking-wide">
            {t.sectionTag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-base-content">
            {t.title}
          </h2>
          <p className="text-base-content/60 max-w-xl mx-auto text-xs sm:text-sm">
            {t.subtitle}
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-20"></div>

          {t.steps.map((step, i) => (
            <div key={i} className="relative text-center group">
              {/* Step Number with Icon */}
              <div className="relative inline-flex flex-col items-center mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-all duration-300">
                  {icons[i]}
                </div>
                <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-base-100 border-2 border-emerald-500 rounded-full flex items-center justify-center text-[10px] font-bold text-emerald-600 shadow-sm">
                  {i + 1}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-base font-bold text-base-content mb-1.5">
                {step.title}
              </h3>
              <p className="text-xs text-base-content/65 max-w-xs mx-auto leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
