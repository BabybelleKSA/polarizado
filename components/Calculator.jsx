'use client';

import { useEffect, useMemo, useState } from 'react';
import { calculatePrice } from '@/lib/pricing';
import { translations } from '@/lib/translations';

const carTypes = ['Sedan', 'Coupe', 'SUV', 'Truck'];
const tintSteps = [5, 20, 35, 50];

export default function Calculator({ lang, onChange }) {
  const t = translations[lang].calculator;
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
  }, [carType, tintPercent, price]);

  return (
    <div className="glass-card rounded-2xl p-6 shadow-lg flex flex-col gap-6 fade-up">
      <header>
        <p className="text-sm uppercase tracking-wide text-gray-500">{t.instantQuote}</p>
        <h2 className="text-2xl font-semibold text-brand-dark">{t.title}</h2>
      </header>

      {/* Car Types */}
      <div className="flex flex-col gap-2 text-sm font-medium text-brand-dark">
        <span>{t.carType}</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {carTypes.map((type) => {
            const active = type === carType;
            return (
              <button
                key={type}
                onClick={() => setCarType(type)}
                className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-brand-red text-white border-brand-red shadow-md"
                    : "bg-white text-brand-dark border-gray-200 hover:border-brand-red/80"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tint slider */}
      <div className="flex flex-col gap-3 text-sm font-medium text-brand-dark">
        <div className="flex items-center justify-between">
          <span>{t.tintPercent}</span>
          <span className="text-xs uppercase tracking-wide text-gray-500">{t.shade}</span>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="range"
            min="5"
            max="50"
            step="15"
            value={tintPercent}
            onChange={(e) => setTintPercent(Number(e.target.value))}
            className="w-full accent-brand-red"
          />

          <span className="min-w-[64px] rounded-full bg-brand-dark px-3 py-1 text-center text-white text-sm">
            {tintPercent}%
          </span>
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          {tintSteps.map((step) => (
            <span key={step}>{step}%</span>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="rounded-2xl bg-brand-dark text-white px-6 py-5 text-center shadow-xl">
        <p className="text-xs uppercase tracking-[0.2em] text-white/70">{t.estimatedPrice}</p>

        <div className={`text-5xl font-black leading-tight ${animate ? 'fade-up' : ''}`}>
          ${price}
        </div>

        <p className="text-sm text-white/80">{t.basedOn}</p>
      </div>
    </div>
  );
}
