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
    contactMethod: 'Either',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const computedPrice = useMemo(
    () => calculatePrice(carType, tintPercent),
    [carType, tintPercent]
  );

  const displayPrice = price ?? computedPrice;

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = `${t.name} is required`;
    const phoneClean = form.phone.replace(/[^\d+]/g, '');
    if (!form.phone.trim()) {
      errs.phone = `${t.phone} is required`;
    } else if (!/^(\+?\d{7,15})$/.test(phoneClean)) {
      errs.phone = "Invalid phone number.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!validate()) return;

    setSubmitting(true);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          preferredTime: form.preferredTime.trim(),
          contactMethod: form.contactMethod,
          carType,
          tintPercent,
          price: displayPrice,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setMessage({ type: "error", text: data?.message || "Error sending request" });
      } else {
        setMessage({
          type: "success",
          text: `${t.success} ${carType} · ${tintPercent}% · $${displayPrice}`,
        });
        setForm({
          name: "",
          phone: "",
          preferredTime: "",
          contactMethod: "Either",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 shadow-lg fade-up relative overflow-hidden">
      {message?.type === "success" && (
        <div className="absolute inset-x-0 top-0 bg-green-500 text-white text-sm font-semibold px-4 py-2 text-center shadow-md">
          {message.text}
        </div>
      )}

      <div className="space-y-1 pb-2">
        <p className="text-sm uppercase tracking-wide text-gray-500">{t.bookSlot}</p>
        <h2 className="text-2xl font-semibold text-brand-dark">{t.requestTint}</h2>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-brand-dark">{t.estimate}</span>
          <span className="text-lg font-bold text-brand-red">${displayPrice}</span>
        </div>
        <p className="text-xs text-gray-500">
          {carType} · {tintPercent}%
        </p>
      </div>

      <form className="flex flex-col gap-4 pt-2" onSubmit={handleSubmit}>
        {/* NAME */}
        <label className="flex flex-col gap-2 text-sm font-medium text-brand-dark">
          {t.name}
          <input
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className={`rounded-xl border px-3 py-2 ${
              errors.name ? "border-red-400" : "border-gray-200"
            } focus:outline-none focus:ring-2 focus:ring-brand-red/20`}
          />
          {errors.name && <span className="text-xs text-red-600">{errors.name}</span>}
        </label>

        {/* PHONE */}
        <label className="flex flex-col gap-2 text-sm font-medium text-brand-dark">
          {t.phone}
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className={`rounded-xl border px-3 py-2 ${
              errors.phone ? "border-red-400" : "border-gray-200"
            } focus:outline-none focus:ring-2 focus:ring-brand-red/20`}
          />
          {errors.phone && <span className="text-xs text-red-600">{errors.phone}</span>}
        </label>

        {/* TIME */}
        <label className="flex flex-col gap-2 text-sm font-medium text-brand-dark">
          {t.preferredTime}
          <input
            value={form.preferredTime}
            onChange={(e) => handleChange("preferredTime", e.target.value)}
            className="rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red/20"
          />
        </label>

        {/* CONTACT METHOD */}
        <div className="flex flex-col gap-2 text-sm font-medium text-brand-dark">
          <span>{t.contactMethod}</span>
          <div className="grid grid-cols-3 gap-2">
            {contactOptions.map((opt) => {
              const active = form.contactMethod === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleChange("contactMethod", opt)}
                  className={`rounded-full border px-3 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-brand-red text-white border-brand-red"
                      : "bg-white text-brand-dark border-gray-200 hover:border-brand-red/80"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* SUBMIT */}
        <button
          disabled={submitting}
          className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-brand-red px-4 py-3 text-white font-semibold shadow-lg shadow-brand-red/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-red/40 disabled:opacity-70"
        >
          {submitting ? "…" : t.send}
        </button>

        {message?.type === "error" && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}
