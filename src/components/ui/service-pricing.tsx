"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/components/animations/gsap-runtime";
import type { Dictionary } from "@/i18n/dictionaries";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowIcon } from "@/components/ui/arrow-icon";

type Currency = "USD" | "CRC";
type ExchangeRate = { rate: number; date: string };

function formatAmount(amount: number, currency: Currency, locale: "es" | "en") {
  const grouped = Math.round(amount).toLocaleString("en-US").replaceAll(",", locale === "es" ? "." : ",");
  return `${currency === "CRC" ? "₡" : "$"}${grouped}`;
}

function AnimatedPrice({ amount, currency, locale, rate }: { amount: number; currency: Currency; locale: "es" | "en"; rate: number }) {
  const value = useRef<HTMLSpanElement>(null);
  const target = currency === "CRC" ? amount * rate : amount;

  useLayoutEffect(() => {
    const node = value.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      node.textContent = formatAmount(target, currency, locale);
      return;
    }

    const counter = { amount: 0 };
    node.textContent = formatAmount(0, currency, locale);
    const tween = gsap.to(counter, {
      amount: target,
      duration: 0.95,
      paused: true,
      ease: "power3.out",
      onUpdate: () => { node.textContent = formatAmount(counter.amount, currency, locale); },
      onComplete: () => { node.textContent = formatAmount(target, currency, locale); },
    });
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      tween.restart();
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(node);

    return () => {
      observer.disconnect();
      tween.kill();
    };
  }, [currency, locale, target]);

  return <span ref={value} data-service-amount data-currency={currency}>{formatAmount(target, currency, locale)}</span>;
}

export function ServicePricing({ copy, locale }: { copy: Dictionary["services"]; locale: "es" | "en" }) {
  const pricingRoot = useRef<HTMLDivElement>(null);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [rateFailed, setRateFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const loadRate = async () => {
      try {
        const response = await fetch("/api/exchange-rate", { cache: "no-store", signal: controller.signal });
        if (!response.ok) throw new Error("Exchange rate unavailable");
        const data = await response.json() as ExchangeRate;
        if (!Number.isFinite(data.rate) || data.rate <= 0 || !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
          throw new Error("Invalid exchange rate");
        }
        setExchangeRate(data);
      } catch {
        if (!controller.signal.aborted) setRateFailed(true);
      }
    };
    const element = pricingRoot.current;
    if (!element) return () => controller.abort();
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      void loadRate();
    }, { rootMargin: "1200px 0px", threshold: 0 });
    observer.observe(element);
    return () => { observer.disconnect(); controller.abort(); };
  }, []);

  const rateDate = exchangeRate?.date ? new Intl.DateTimeFormat(locale === "es" ? "es-CR" : "en-US", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${exchangeRate.date}T12:00:00Z`)) : "";
  const note = exchangeRate
    ? copy.exchangeNote.replace("{rate}", `₡${exchangeRate.rate.toLocaleString(locale === "es" ? "es-CR" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`).replace("{date}", rateDate)
    : rateFailed ? copy.exchangeUnavailable : copy.exchangeLoading;

  return <div ref={pricingRoot} className="services-pricing">
    <div className="services-currency" data-services-control>
      <div>
        <p className="micro-label">{copy.currencyLabel} <strong>{copy.currencyHint} <span aria-hidden="true">↔</span></strong></p>
        <span role="status">{note}</span>
      </div>
      <div className="currency-switch" data-currency={currency} role="group" aria-label={copy.currencyLabel}>
        <span className="currency-switch-indicator" aria-hidden="true" />
        {(["USD", "CRC"] as const).map((option) => <button type="button" key={option} disabled={option === "CRC" && !exchangeRate} aria-pressed={currency === option} aria-label={option} onClick={() => setCurrency(option)}><span aria-hidden="true">{option === "USD" ? "$" : "₡"}</span>{option}</button>)}
      </div>
    </div>

    <ol className="services-plans" aria-label={copy.label}>
      {copy.plans.map((plan, index) => <li className={`service-plan${plan.recommended ? " service-plan-recommended" : ""}`} key={plan.title}>
        <span className="service-plan-line" data-service-line aria-hidden="true" />
        <div className="service-plan-topline micro-label">
          <span data-service-part="number">{plan.number}</span>
          <span data-service-part="kind">{plan.kind}</span>
        </div>
        <div className="service-plan-heading">
          <div className="service-plan-title-mask"><h3 data-service-part="title">{plan.title}</h3></div>
          <p className="service-price" data-service-part="price">
            {plan.amount > 0 ? <AnimatedPrice key={`${plan.title}-${currency}-${exchangeRate?.rate ?? 0}`} amount={plan.amount} currency={currency} locale={locale} rate={exchangeRate?.rate ?? 0} /> : <span>{plan.customPrice}</span>}
            {plan.amount > 0 && <small>{currency}</small>}
          </p>
        </div>
        {plan.recommended && <p className="service-recommended micro-label" data-service-part="recommended"><span aria-hidden="true" />{copy.recommended}</p>}
        <p className="service-summary" data-service-part="summary">{plan.summary}</p>
        <div className="service-benefits">
          <p className="micro-label" data-service-part="benefits-label">{copy.includes}</p>
          <ul>
            {plan.features.map((feature, featureIndex) => <li data-service-benefit key={feature}><span>{String(featureIndex + 1).padStart(2, "0")}</span>{feature}</li>)}
          </ul>
        </div>
        <a className="service-cta" data-service-part="cta" href={getWhatsAppUrl(locale, copy.inquiry.replace("{plan}", plan.title))} target="_blank" rel="noopener noreferrer">
          <span>{plan.cta}</span><ArrowIcon />
        </a>
        <span className="service-plan-index" aria-hidden="true">0{index + 1}</span>
      </li>)}
    </ol>
  </div>;
}
