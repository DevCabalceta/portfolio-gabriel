"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { Dictionary } from "@/i18n/dictionaries";
import { profile } from "@/data/profile";
import { ArrowIcon } from "@/components/ui/arrow-icon";

type Currency = "USD" | "CRC";

function whatsappFor(message: string) {
  return `${profile.whatsapp}?text=${encodeURIComponent(message)}`;
}

function formatAmount(amount: number, currency: Currency, locale: "es" | "en") {
  const converted = currency === "CRC" ? amount * 500 : amount;
  const grouped = converted.toLocaleString("en-US").replaceAll(",", locale === "es" ? "." : ",");
  return `${currency === "CRC" ? "₡" : "$"}${grouped}`;
}

function AnimatedPrice({ amount, currency, locale }: { amount: number; currency: Currency; locale: "es" | "en" }) {
  const value = useRef<HTMLSpanElement>(null);
  const target = currency === "CRC" ? amount * 500 : amount;

  useLayoutEffect(() => {
    const node = value.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      node.textContent = formatAmount(amount, currency, locale);
      return;
    }

    const counter = { amount: 0 };
    node.textContent = formatAmount(0, currency, locale);
    const tween = gsap.to(counter, {
      amount: target,
      duration: 0.95,
      paused: true,
      ease: "power3.out",
      onUpdate: () => {
        const current = currency === "CRC" ? counter.amount / 500 : counter.amount;
        node.textContent = formatAmount(Math.round(current), currency, locale);
      },
      onComplete: () => { node.textContent = formatAmount(amount, currency, locale); },
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
  }, [amount, currency, locale, target]);

  return <span ref={value} data-service-amount data-currency={currency}>{formatAmount(amount, currency, locale)}</span>;
}

export function ServicePricing({ copy, locale }: { copy: Dictionary["services"]; locale: "es" | "en" }) {
  const [currency, setCurrency] = useState<Currency>("USD");

  return <div className="services-pricing">
    <div className="services-currency" data-services-control>
      <div>
        <p className="micro-label">{copy.currencyLabel}</p>
        <span>{copy.exchangeNote}</span>
      </div>
      <div className="currency-switch" data-currency={currency} role="group" aria-label={copy.currencyLabel}>
        <span className="currency-switch-indicator" aria-hidden="true" />
        {(["USD", "CRC"] as const).map((option) => <button type="button" key={option} aria-pressed={currency === option} onClick={() => setCurrency(option)}>{option}</button>)}
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
            {plan.amount > 0 ? <AnimatedPrice key={`${plan.title}-${currency}`} amount={plan.amount} currency={currency} locale={locale} /> : <span>{plan.customPrice}</span>}
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
        <a className="service-cta" data-service-part="cta" href={whatsappFor(copy.inquiry.replace("{plan}", plan.title))} target="_blank" rel="noopener noreferrer">
          <span>{plan.cta}</span><ArrowIcon />
        </a>
        <span className="service-plan-index" aria-hidden="true">0{index + 1}</span>
      </li>)}
    </ol>
  </div>;
}
