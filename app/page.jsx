'use client';

import Image from 'next/image';
import { useState } from 'react';
import Calculator from '@/components/Calculator';
import LeadForm from '@/components/LeadForm';
import { calculatePrice } from '@/lib/pricing';
import { translations } from '@/lib/translations';

export default function HomePage() {
  const [lang, setLang] = useState('en');
  const t = translations[lang];

  const [selection, setSelection] = useState({
    carType: 'Sedan',
    tintPercent: 20,
    price: calculatePrice('Sedan', 20)
  });

  return (
    <main className="min-h-screen bg-luxury-black text-white px-4 py-12 sm:py-16 lg:py-20">
      <section className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] border border-white/5 bg-gradient-to-br from-luxury-black via-luxury-graphite to-black px-5 py-12 sm:px-10 lg:px-12 shadow-[0_34px_120px_rgba(0,0,0,0.65)] hero-panel">
        <div className="absolute top-6 right-6 z-50 flex gap-2">
          <button
            onClick={() => setLang('en')}
            className={`px-3 py-1 rounded-md text-sm font-semibold border ${
              lang === 'en' ? "bg-brand-dark text-white" : "bg-white text-brand-dark"
            }`}
          >
            ENG
          </button>
          <button
            onClick={() => setLang('es')}
            className={`px-3 py-1 rounded-md text-sm font-semibold border ${
              lang === 'es' ? "bg-brand-dark text-white" : "bg-white text-brand-dark"
            }`}
          >
            ESP
          </button>
        </div>
        <div className="absolute -left-12 top-6 h-52 w-52 rounded-full bg-brand-red/20 blur-3xl" aria-hidden />
        <div className="absolute -right-24 -bottom-10 h-64 w-64 rounded-full bg-white/5 blur-[90px]" aria-hidden />
        <div className="relative grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center lg:gap-10 xl:gap-14 mx-auto">
          <div className="lg:col-span-6 xl:col-span-5 space-y-6 fade-up relative">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/80 border border-white/15 shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
              {t.heroBadge}
              <span className="h-2 w-2 rounded-full bg-brand-red animate-pulse shadow-[0_0_0_6px_rgba(229,9,20,0.35)]" />
            </div>
            <div className="space-y-3 headline-glow">
              <p className="text-xs uppercase tracking-[0.32em] text-white/60">{t.pricing.premiumAutomotive}</p>
              <div className="relative sweep">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white relative z-10">
                  {t.heroTitle}
                  <br />
                </h1>
              </div>
              <p className="text-lg text-white/70 max-w-xl">
                {t.heroSubtitle}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-5">
              <a
                href="#pricing"
                className="relative inline-flex items-center gap-3 rounded-full border border-white/30 bg-white/5 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition-all duration-300 shadow-[0_10px_40px_rgba(229,9,20,0.35)] hover:-translate-y-0.5 hover:shadow-[0_16px_55px_rgba(229,9,20,0.5)] before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500"
              >
                {t.heroCTA}
                <span className="text-lg">{'>'}</span>
              </a>
              <a
                href="#packages"
                className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white/80 backdrop-blur transition-all duration-300 hover:border-brand-red/60 hover:text-white hover:-translate-y-0.5"
              >
                {t.pricing.viewPackages}
                <span className="h-2 w-2 rounded-full bg-white/50" />
              </a>
            </div>
            <div className="flex flex-wrap gap-3 pt-2 text-[12px] uppercase tracking-[0.16em] text-white/70">
              {[
                t.pricing.lifetimeWarranty,
                t.pricing.professionalInstaller,
                t.pricing.sameDayService
              ].map((badge) => (
                <div
                  key={badge}
                  className="lux-card rounded-full px-4 py-2 backdrop-blur border border-white/10"
                >
                  {badge}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 xl:col-span-7 relative fade-up">
            <div className="absolute -left-16 top-10 h-28 w-28 rounded-full bg-brand-red/25 blur-3xl" aria-hidden />
            <div className="absolute -right-10 bottom-6 h-32 w-32 rounded-full bg-white/15 blur-3xl" aria-hidden />
            <div className="car-frame rounded-[28px] overflow-hidden bg-gradient-to-br from-black via-luxury-graphite to-black hero-parallax">
              <Image
                src="/car.jpg"
                alt="Sporty car ready for tint"
                width={1400}
                height={900}
                priority
                className="h-full w-full object-cover scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto mt-16 max-w-6xl space-y-8 px-1">
        <div className="flex flex-col gap-2 fade-up">
          <p className="text-sm uppercase tracking-[0.28em] text-white/60">{t.pricingHeader}</p>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {t.pricingTitle}
          </h2>
          <p className="text-white/70 max-w-3xl">
            {t.pricingText}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Calculator lang={lang} onChange={setSelection} />
          <LeadForm
            lang={lang}
            carType={selection.carType}
            tintPercent={selection.tintPercent}
            price={selection.price}
          />
        </div>

        <div id="packages" className="grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3 fade-up">
          {[
            {
              title: t.packages.basic.title,
              price: '$199 - $299',
              perks: [t.packages.basic.subtitle1, t.packages.basic.subtitle2]
            },
            {
              title: t.packages.premiumCeramic.title,
              price: '$349 - $499',
              perks: [t.packages.premiumCeramic.subtitle1, 'Signal-friendly', 'Factory-match shade options']
            },
            {
              title: t.packages.ultraCeramic.title,
              price: '$549 - $799',
              perks: [t.packages.ultraCeramic.subtitle1, 'Maximum clarity', 'Lifetime, transferable warranty']
            }
          ].map((pkg) => (
            <div
              key={pkg.title}
              className="lux-card rounded-2xl border border-white/10 bg-white/5 px-4 py-5 backdrop-blur"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-lg font-semibold text-white">{pkg.title}</h3>
                <span className="text-[11px] uppercase tracking-[0.2em] text-brand-red">Premium</span>
              </div>
              <p className="text-xl font-bold chrome-text glow-pulse">{pkg.price}</p>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                {pkg.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-brand-red shadow-[0_0_0_4px_rgba(229,9,20,0.15)]" />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto mt-16 max-w-6xl rounded-2xl border border-white/5 bg-black/60 px-6 py-6 text-sm text-white/70 backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-semibold tracking-wide text-white">Diaz Polarizado - {t.footer.studio}</div>
          <div className="flex flex-wrap gap-4 text-white/80">
            <span className="font-semibold text-white">Call/Text: (555) 321-8899</span>
            <span className="text-xs uppercase tracking-[0.16em] text-white/50">{t.footer.appointmentOnly}</span>
          </div>
        </div>
        <p className="mt-2 text-xs text-white/50">
          {t.footer.disclaimer}
        </p>
      </footer>
    </main>
  );
}
