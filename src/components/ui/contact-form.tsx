"use client";

import { useRef, useState, type FormEvent } from "react";
import type { Dictionary } from "@/i18n/dictionaries";
import { getWhatsAppUrl } from "@/lib/whatsapp";
import { ArrowIcon } from "@/components/ui/arrow-icon";

export function ContactForm({ copy, locale }: { copy: Dictionary["contactSection"]; locale: "es" | "en" }) {
  type RequiredField = "name" | "type" | "details";
  const [invalidFields, setInvalidFields] = useState<Set<RequiredField>>(() => new Set());
  const toastId = useRef<string | null>(null);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const name = String(fields.get("name") ?? "").trim();
    const type = String(fields.get("type") ?? "").trim();
    const goal = String(fields.get("goal") ?? "").trim();
    const details = String(fields.get("details") ?? "").trim();
    const missing: RequiredField[] = [];
    if (!name) missing.push("name");
    if (!type) missing.push("type");
    if (!details) missing.push("details");
    if (missing.length) {
      setInvalidFields(new Set(missing));
      const { sileo } = await import("sileo");
      if (toastId.current) sileo.dismiss(toastId.current);
      const first = missing[0];
      toastId.current = sileo.error({
        title: copy.validationTitle,
        description: first === "name" ? copy.validationName : first === "type" ? copy.validationType : copy.validationDetails,
      });
      const field = form.elements.namedItem(first) as HTMLElement | null;
      field?.focus({ preventScroll: true });
      if (window.innerWidth < 900) field?.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
      return;
    }
    setInvalidFields(new Set());
    if (toastId.current) {
      const { sileo } = await import("sileo");
      sileo.dismiss(toastId.current);
    }
    toastId.current = null;

    const projectDetails = [
      copy.messageGreeting.replace("{name}", name),
      copy.messageType.replace("{type}", type),
      goal ? copy.messageGoal.replace("{goal}", goal) : null,
      copy.messageDetails.replace("{details}", details),
    ].filter(Boolean).join("\n");
    window.open(getWhatsAppUrl(locale, projectDetails), "_blank", "noopener,noreferrer");
  };

  return <form className="contact-form" noValidate onSubmit={submit} onChange={(event) => {
    const field = event.target;
    if (!(field instanceof HTMLInputElement || field instanceof HTMLSelectElement || field instanceof HTMLTextAreaElement)) return;
    if (!field.value.trim()) return;
    const name = field.name as RequiredField;
    setInvalidFields((current) => {
      if (!current.has(name)) return current;
      const next = new Set(current);
      next.delete(name);
      return next;
    });
  }}>
    <div className="contact-form-row">
      <label className="contact-field" data-contact-field>
        <span className="micro-label">{copy.nameLabel} <span aria-hidden="true">*</span></span>
        <input name="name" type="text" autoComplete="name" maxLength={80} placeholder={copy.namePlaceholder} aria-invalid={invalidFields.has("name")} required />
      </label>
      <label className="contact-field" data-contact-field>
        <span className="micro-label">{copy.typeLabel} <span aria-hidden="true">*</span></span>
        <select name="type" defaultValue="" aria-invalid={invalidFields.has("type")} required>
          <option value="" disabled>{copy.typePlaceholder}</option>
          {copy.types.map((type) => <option value={type} key={type}>{type}</option>)}
        </select>
      </label>
    </div>
    <label className="contact-field" data-contact-field>
      <span className="micro-label">{copy.goalLabel}</span>
      <input name="goal" type="text" maxLength={160} placeholder={copy.goalPlaceholder} />
    </label>
    <label className="contact-field" data-contact-field>
      <span className="micro-label">{copy.detailsLabel} <span aria-hidden="true">*</span></span>
      <textarea name="details" rows={4} maxLength={1200} placeholder={copy.detailsPlaceholder} aria-invalid={invalidFields.has("details")} required />
    </label>
    <button className="contact-submit" type="submit" data-contact-form="submit"><span>{copy.submit}</span><ArrowIcon /></button>
    <p className="contact-form-note" data-contact-form="note">{copy.note}</p>
  </form>;
}
