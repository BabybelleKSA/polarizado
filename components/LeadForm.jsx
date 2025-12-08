'use client';

import { useMemo, useState } from 'react';
import { calculatePrice } from '@/lib/pricing';
import { translations } from '@/lib/translations';

const contactOptions = ['Call', 'Text', 'Either'];

export default function LeadForm({ lang, carType, tintPercent, price }) {
  const t = translations[lang].form;
  const [form, setForm] = useState({
    name: '',
    phone: '',
    preferredTime: '',
    contactMethod: 'Either'
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const computedPrice = useMemo(() => calculatePrice(carType, tintPercent), [carType, tintPercent]);
  const displayPrice = price ?? computedPrice;

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required.';
    const phoneClean = form.phone.replace(/[^\d+]/g, '');
    if (!form.phone.trim()) {
      nextErrors.phone = 'Phone is required.';
    } else if (!/^(\+?\d{7,15})$/.test(phoneClean)) {
      nextErrors.phone = 'Use a valid phone number.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);
    if (!validate()) return;

    setSubmitting(true);

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          preferredTime: form.preferredTime.trim(),
          contactMethod: form.contactMethod,
          carType,
          tintPercent,
          price: displayPrice
        })
      });

      const data = await response.json();
      if (!response.ok) {
        const text = data?.errors?.join(', ') || data?.message || 'Could not save your request.';
        setMessage({ type: 'error', text });
      } else {
        setMessage({
          type: 'success',
          text: `${t.successPrefix} ${carType} | ${tintPercent}% | $${displayPrice}`
        });
        setForm({ name: '', phone: '', preferredTime: '', contactMethod: 'Either' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 shadow-[0_24px_80px_rgba(0,0,0,0.55)] fade-up relative overflow-hidden border border-white/10">
      {message?.type === 'success' && (
        <div className="absolute inset-x-4 top-4 z-10 rounded-xl bg-[#00B982] text-white text-sm font-semibold px-4 py-3 text-center shadow-[0_20px_40px_rgba(0,185,130,0.4)]">
          {message.text}
        </div>
      )}
      <div className="space-y-1 pb-2">
        <p className="text-xs uppercase tracking-[0.3em] text-white/60">{t.bookSlot}</p>
        <h2 className="text-2xl font-semibold text-white">{t.requestTint}</h2>
      </div>

      <div className="mb-4 text-sm text-white/70">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-white">{t.estimate}</span>
          <span className="text-lg font-bold text-brand-red">${displayPrice}</span>
        </div>
        <p className="text-xs text-white/50">
          {carType} | {tintPercent}% tint
        </p>
      </div>

      <form className="flex flex-col gap-4 pt-2" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-sm font-semibold text-white/80">
          {t.name}
          <div className="input-shell">
            <span className="input-icon">👤</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full rounded-2xl border bg-white/5 px-3 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red/60 ${
                errors.name ? 'border-red-400' : 'border-white/15'
              }`}
              placeholder="Your name"
              required
            />
          </div>
          {errors.name && <span className="text-xs text-red-400">{errors.name}</span>}
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-white/80">
          {t.phone}
          <div className="input-shell">
            <span className="input-icon">📱</span>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={`w-full rounded-2xl border bg-white/5 px-3 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-brand-red/30 focus:border-brand-red/60 ${
                errors.phone ? 'border-red-400' : 'border-white/15'
              }`}
              placeholder="(555) 123-4567"
              required
            />
          </div>
          {errors.phone && <span className="text-xs text-red-400">{errors.phone}</span>}
        </label>

        <label className="flex flex-col gap-2 text-sm font-semibold text-white/80">
          {t.preferredTime}
          <div className="input-shell">
            <span className="input-icon">⏱️</span>
            <input
              type="text"
              value={form.preferredTime}
              onChange={(e) => handleChange('preferredTime', e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-3 py-3 text-white placeholder:text-white/40 focus:border-brand-red/60 focus:outline-none focus:ring-2 focus:ring-brand-red/30"
              placeholder="e.g. Friday after 3pm (optional)"
            />
          </div>
        </label>

        <div className="flex flex-col gap-2 text-sm font-semibold text-white/80">
          <span className="text-white">{t.contactMethod}</span>
          <div className="grid grid-cols-3 gap-2">
            {contactOptions.map((option) => {
              const isActive = option === form.contactMethod;
              return (
                <button
                  type="button"
                  key={option}
                  onClick={() => handleChange('contactMethod', option)}
                  className={`pill rounded-full px-3 py-2 text-[13px] uppercase tracking-wide transition focus:outline-none focus:ring-2 focus:ring-brand-red/30 ${
                    isActive ? 'active text-white' : 'text-white/80 hover:border-brand-red/40 hover:text-white'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-gradient-to-r from-brand-red to-black px-5 py-3 text-white font-semibold uppercase tracking-[0.14em] shadow-[0_18px_50px_rgba(229,9,20,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(229,9,20,0.55)] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting && (
            <span className="h-4 w-4 rounded-full border-2 border-white/60 border-t-transparent spin" />
          )}
          {submitting ? 'Sending...' : t.send}
        </button>

        {message && message.type === 'error' && (
          <div className="rounded-2xl border border-red-400/50 bg-red-500/10 px-3 py-3 text-sm text-red-300">
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}
