'use client';

import Image from 'next/image';
import { useState } from 'react';
import Calculator from '@/components/Calculator';
import LeadForm from '@/components/LeadForm';
import { calculatePrice } from '@/lib/pricing';
import { translations } from '@/lib/translations';

export default function HomePage() {
  const [lang, setLang] = useState("en");
  const t = translations[lang];

  const [selection, setSelection] = useState({
    carType: 'Sedan',
    tintPercent: 20,
    price: calculatePrice('Sedan', 20)
  });

  return (
    <main className="relative px-4 py-10 sm:py-14 md:py-16 lg:py-20">

      {/* Language Toggle */}
      <div className="absolute top-6 right-6 flex gap-2 z-50">
        <button
          onClick={() => setLang("en")}
          className={`px-3 py-1 rounded-md text-sm font-semibold border ${
            lang === "en" ? "bg-brand-dark text-white" : "bg-white text-brand-dark"
          }`}
        >
          ENG
        </button>
        <button
          onClick={() => setLang("es")}
          className={`px-3 py-1 rounded-md text-sm font-semibold border ${
            lang === "es" ? "bg-brand-dark text-white" : "bg-white text-brand-dark"
          }`}
        >
          ESP
        </button>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-white/70">
        <div className="absolute inset-0 diagonal-glow opacity-70" aria-hidden />

        <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:grid lg:grid-cols-12 lg:items-center lg:gap-12 px-4 py-10 sm:py-12 relative">
          <div className="lg:col-span-6 xl:col-span-5 space-y-6 fade-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-red shadow-sm border border-brand-red/10">
              {t.heroBadge}
              <span className="h-2 w-2 rounded-full bg-brand-red animate-pulse" />
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-black leading-tight text-brand-dark">
                {t.heroTitle}
              </h1>
              <p className="text-lg text-gray-700">
                {t.heroSubtitle}
              </p>
            </div>

            <a
              href="#pricing"
              className="inline-flex items-center gap-3 rounded-xl bg-brand-red px-5 py-3 text-white font-semibold shadow-lg shadow-brand-red/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-red/40"
            >
              {t.heroCTA} <span className="text-xl">↓</span>
            </a>
          </div>

          <div className="lg:col-span-6 xl:col-span-7 relative fade-up">
            <div className="glass-card overflow-hidden rounded-3xl border border-white/70 shadow-2xl">
              <Image
                src="/car.jpg"
                alt="Sporty car ready for tint"
                width={1400}
                height={900}
                priority
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing" className="mx-auto mt-14 max-w-6xl space-y-6 px-1">
        <p className="text-sm uppercase tracking-wide text-gray-500">{t.transparentPricing}</p>

        <h2 className="text-3xl font-bold text-brand-dark">{t.buildTint}</h2>

        <p className="text-gray-600">{t.buildTintSub}</p>

        <div className="grid gap-6 lg:grid-cols-2">
          <Calculator lang={lang} onChange={setSelection} />
          <LeadForm
            lang={lang}
            carType={selection.carType}
            tintPercent={selection.tintPercent}
            price={selection.price}
          />
        </div>
      </section>
    </main>
  );
}
