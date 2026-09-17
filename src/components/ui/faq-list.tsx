"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionaries";

export function FaqList({ copy }: { copy: Dictionary["faq"] }) {
  const [open, setOpen] = useState<number | null>(0);

  return <div className="faq-questions" aria-label={copy.label}>
    {copy.items.map((item, index) => {
      const expanded = open === index;
      const answerId = `faq-answer-${index}`;
      return <article className="faq-item" data-open={expanded} key={item.question}>
        <button type="button" className="faq-question" aria-expanded={expanded} aria-controls={answerId} onClick={() => setOpen(expanded ? null : index)}>
          <span className="faq-question-number micro-label">{String(index + 1).padStart(2, "0")}</span>
          <span className="faq-question-text">{item.question}</span>
          <span className="faq-question-toggle" aria-hidden="true"><i /><i /></span>
        </button>
        <div id={answerId} className="faq-answer-shell" aria-hidden={!expanded} inert={!expanded}>
          <div className="faq-answer-inner"><p>{item.answer}</p></div>
        </div>
      </article>;
    })}
  </div>;
}
