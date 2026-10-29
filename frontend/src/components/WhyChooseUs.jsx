"use client";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/i18n/translations";
import {
  FiAward,
  FiDollarSign,
  FiHeadphones,
  FiShield,
  FiUsers,
  FiRefreshCw,
} from "react-icons/fi";

export default function WhyChooseUs() {
  const { language } = useLanguage();
  const t = translations[language].whyChoose;

  const icons = [
    <FiAward key="award" className="w-5 h-5" />,
    <FiDollarSign key="dollar" className="w-5 h-5" />,
    <FiHeadphones key="headphones" className="w-5 h-5" />,
    <FiShield key="shield" className="w-5 h-5" />,
    <FiUsers key="users" className="w-5 h-5" />,
    <FiRefreshCw key="refresh" className="w-5 h-5" />,
  ];

  const colors = [
    "from-emerald-500 to-teal-500",
    "from-blue-500 to-indigo-500",
    "from-purple-500 to-pink-500",
    "from-amber-500 to-orange-500",
    "from-cyan-500 to-blue-500",
    "from-rose-500 to-red-500",
  ];

  const bgColors = [
    "bg-emerald-50 dark:bg-emerald-900/30",
    "bg-blue-50 dark:bg-blue-900/30",
    "bg-purple-50 dark:bg-purple-900/30",
    "bg-amber-50 dark:bg-amber-900/30",
    "bg-cyan-50 dark:bg-cyan-900/30",
    "bg-rose-50 dark:bg-rose-900/30",
  ];

  const textColors = [
    "text-emerald-600 dark:text-emerald-400",
    "text-blue-600 dark:text-blue-400",
    "text-purple-600 dark:text-purple-400",
    "text-amber-600 dark:text-amber-400",
    "text-cyan-600 dark:text-cyan-400",
    "text-rose-600 dark:text-rose-400",
  ];

  return (
    <section className="py-12 px-4 bg-base-200/50">
      <div className="max-w-7xl mx-auto">
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

        {/* Grid - Scaled Down */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.reasons.map((reason, i) => (
            <div
              key={i}
              className="group relative bg-base-100 rounded-2xl p-5 border border-base-300/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
            >
              {/* Gradient accent on hover */}
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${colors[i]} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
              ></div>

              {/* Icon */}
              <div
                className={`w-10 h-10 ${bgColors[i]} rounded-xl flex items-center justify-center mb-3.5 ${textColors[i]} group-hover:scale-105 transition-transform duration-200`}
              >
                {icons[i]}
              </div>

              {/* Content */}
              <h3 className="text-base font-bold text-base-content mb-1.5 group-hover:text-emerald-600 transition-colors">
                {reason.title}
              </h3>
              <p className="text-xs text-base-content/65 leading-relaxed">
                {reason.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
