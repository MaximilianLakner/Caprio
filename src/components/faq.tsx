"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Wie miete ich eine Dachbox?",
    a: "Such über die Suche nach deinem Ort, wähle eine passende Box und schick eine unverbindliche Anfrage für deinen Reisezeitraum. Sobald der Vermieter bestätigt, zahlst du sicher über Stripe und holst die Box zum vereinbarten Termin ab.",
  },
  {
    q: "Was kostet das Mieten einer Dachbox?",
    a: "Den Tagespreis legt jede:r Vermieter:in selbst fest – meist ein kleiner Bruchteil vom Neukaufpreis. Du siehst den Gesamtpreis für deinen Zeitraum immer transparent, bevor du buchst.",
  },
  {
    q: "Ist meine Zahlung abgesichert?",
    a: "Ja. Alle Zahlungen laufen über Stripe und werden treuhänderisch gehalten. Das Geld wird erst nach der Übergabe an den Vermieter ausgezahlt – so sind beide Seiten geschützt.",
  },
  {
    q: "Kann ich meine eigene Dachbox vermieten?",
    a: "Klar! Erstelle ein kostenloses Inserat, leg Preis und Verfügbarkeit fest und bestimme selbst, an wen du vermietest. Deine Box steht im Schnitt 50 Wochen im Jahr ungenutzt herum – mach einen kleinen Nebenverdienst daraus.",
  },
  {
    q: "Was passiert bei einer Stornierung?",
    a: "Stornierst du rechtzeitig, bekommst du dein Geld automatisch zurückerstattet. Die genauen Bedingungen siehst du jeweils vor der Buchung.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line">
      {FAQS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="font-display text-lg font-bold text-ink sm:text-xl">
                {item.q}
              </span>
              <ChevronDown
                size={22}
                className={`shrink-0 text-ink transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-200 ${
                isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
              }`}
            >
              <p className="overflow-hidden text-sm leading-relaxed text-taupe-500 sm:text-base">
                {item.a}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
