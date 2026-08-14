"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { packages } from "@/data/data";

type Package = (typeof packages)[number];

export default function PackageExplorer() {
  const [selected, setSelected] = useState<Package | null>(null);

  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && setSelected(null);
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", closeOnEscape); document.body.style.overflow = ""; };
  }, [selected]);

  return (
    <>
      <div className="package-grid">
        {packages.map((item) => (
          <article className={`package-card ${item.color}`} key={item.title}>
            <div className="package-visual"><span className="package-tag">{item.tag}</span><strong>{item.days}</strong><div className="package-landscape"><i /><i /><i /></div></div>
            <div className="package-body"><p className="package-kicker">Curated getaway</p><h3>{item.title}</h3><p>{item.description}</p><ul>{item.highlights.map((highlight) => <li key={highlight}>✓ {highlight}</li>)}</ul><div className="package-price"><span>From <strong>{item.currency}{item.price}</strong> / person</span><button onClick={() => setSelected(item)}>View itinerary ↗</button></div></div>
          </article>
        ))}
      </div>

      {selected && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}>
          <section className="itinerary-modal" role="dialog" aria-modal="true" aria-labelledby="itinerary-title" onMouseDown={(event) => event.stopPropagation()}>
            <header className="modal-header">
              <div><p className="eyebrow"><span /> {selected.days} curated getaway</p><h2 id="itinerary-title">{selected.title}</h2></div>
              <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close itinerary">×</button>
            </header>
            <div className="modal-summary"><p>{selected.description}</p><div><small>Starting from</small><strong>{selected.currency}{selected.price}</strong><span>per person</span></div></div>
            <div className="itinerary-days">
              {selected.itinerary.map((day) => (
                <article className="itinerary-day" key={day.day}>
                  <div className="day-heading"><span>{day.label}</span><h3>{day.title}</h3></div>
                  <div className="timeline">
                    {day.items.map((item) => <div className="timeline-item" key={`${item.time}-${item.activity}`}><time>{item.time}</time><div><h4>{item.activity}</h4><p>{item.note}</p></div></div>)}
                  </div>
                </article>
              ))}
            </div>
            <div className="modal-includes"><strong>Package includes</strong>{selected.includes.map((item) => <span key={item}>✓ {item}</span>)}</div>
            <footer className="modal-footer"><p><strong>Like this trip?</strong><span>Dates and activities can be adjusted.</span></p><Link className="button primary" href="/booking">Book this trip <span>→</span></Link></footer>
          </section>
        </div>
      )}
    </>
  );
}
