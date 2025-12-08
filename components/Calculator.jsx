'use client';

import { useEffect, useMemo, useState } from 'react';
import { calculatePrice } from '@/lib/pricing';
import { translations } from '@/lib/translations';

const carTypes = ['Sedan', 'Coupe', 'SUV', 'Truck'];
const tintSteps = [5, 20, 35, 50];

export default function Calculator({ lang, onChange }) {
  const tAll = translations[lang];
  const t = tAll.calculator;
  const vehicles = tAll.vehicles;
  const [carType, setCarType] = useState('Sedan');
  const [tintPercent, setTintPercent] = useState(20);
  const [animate, setAnimate] = useState(false);

  const price = useMemo(() => calculatePrice(carType, tintPercent), [carType, tintPercent]);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => setAnimate(false), 250);
    return () => clearTimeout(timer);
  }, [price]);

  useEffect(() => {
    onChange?.({ carType, tintPercent, price });
  }, [carType, tintPercent, price, onChange]);

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-[0_24px_80px_rgba(0,0,0,0.55)] flex flex-col gap-6 fade-up border border-white/10">
      <header className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-[0.32em] text-white/60">{t.instantQuote}</p>
          <h2 className="text-2xl font-semibold text-white">{t.title}</h2>
        </div>
        <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-brand-red to-black text-white grid place-items-center font-bold shadow-[0_16px_40px_rgba(229,9,20,0.4)] border border-white/15">
          $
        </div>
      </header>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2 text-sm font-semibold text-white/80">
          <span className="text-white">{t.carType}</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {carTypes.map((type) => {
              const isActive = type === carType;
              return (
                <button
                  key={type}
                  onClick={() => setCarType(type)}
                  className={`pill rounded-full px-3.5 py-2 text-[13px] uppercase tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-red/30 ${
                    isActive ? 'active text-white' : 'text-white/80 hover:border-brand-red/40 hover:text-white'
                  }`}
                >
                  {vehicles[type.toLowerCase()]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-3 text-sm font-semibold text-white/80">
          <div className="flex items-center justify-between">
            <span className="text-white">{t.tintPercent}</span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-white/50">{t.shade}</span>
          </div>
          <div className="flex items-center gap-3">
            <input
              aria-label="Tint percentage"
              type="range"
              min="5"
              max="50"
              step="15"
              value={tintPercent}
              onChange={(e) => setTintPercent(Number(e.target.value))}
              className="w-full accent-brand-red [&::-webkit-slider-runnable-track]:bg-white/10 [&::-webkit-slider-thumb]:shadow-[0_0_0_6px_rgba(229,9,20,0.35)]"
            />
            <span className="min-w-[72px] rounded-full bg-white/10 px-3 py-1 text-center text-white text-sm border border-white/15">
              {tintPercent}%
            </span>
          </div>
          <div className="flex justify-between text-[11px] uppercase tracking-[0.16em] text-white/40">
            {tintSteps.map((step) => (
              <span key={step}>{step}%</span>
            ))}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-br from-black via-white/5 to-black px-6 py-6 flex flex-col items-center text-center gap-2 soft-border">
        <div className="absolute inset-0 bg-brand-red/5 blur-3xl" aria-hidden />
        <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">{t.estimatedPrice}</p>
        <div
          className={`text-5xl sm:text-6xl font-black leading-tight chrome-text glow-pulse drop-shadow-[0_16px_40px_rgba(229,9,20,0.35)] ${
            animate ? 'fade-up' : ''
          }`}
        >
          ${price}
        </div>
        <p className="text-sm text-white/70">{t.basedOn}</p>
      </div>
    </div>
  );
}
