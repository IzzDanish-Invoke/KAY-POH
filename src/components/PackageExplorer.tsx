"use client";

import { useEffect, useState } from "react";
import { usePackages } from "@/hooks/usePackages";
import type { TourPackage } from "@/types/tour-package";

export default function PackageExplorer() {
  const packages = usePackages();
  const [selected, setSelected] = useState<TourPackage | null>(null);

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
          <article className={`package-card ${item.color}`} id={item.id} key={item.title}>
            <div className="package-visual"><span className="package-tag">{item.tag}</span><strong>{item.days}</strong><div className="package-landscape"><i /><i /><i /></div></div>
            <div className="package-body"><p className="package-kicker">KAYPOH! 2D1N package</p><h3>{item.title}</h3><p>{item.description}</p><div className="package-access">♿ {item.accessibility.mobility} · {item.accessibility.pace}</div><ul>{item.highlights.map((highlight) => <li key={highlight}>✓ {highlight}</li>)}</ul><div className="package-rates">{item.rates.map((rate) => <div key={rate.label}><span>{rate.label}</span><strong>{item.currency}{rate.price.toLocaleString("en-MY")}</strong></div>)}</div><div className="package-price"><span>From <strong>{item.currency}{item.price.toLocaleString("en-MY")}</strong> / pax</span><button onClick={() => setSelected(item)}>Full details ↗</button></div></div>
          </article>
        ))}
      </div>

      {selected && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelected(null)}>
          <section className={`itinerary-modal ${selected.color}-theme`} role="dialog" aria-modal="true" aria-labelledby="itinerary-title" onMouseDown={(event) => event.stopPropagation()}>
            <header className="modal-header">
              <div><p className="eyebrow"><span /> {selected.days} Ipoh package</p><h2 id="itinerary-title">{selected.title}</h2></div>
              <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close itinerary">×</button>
            </header>
            <div className="modal-summary"><div><p>{selected.description}</p><div className="modal-access"><span>♿ {selected.accessibility.mobility}</span><span>◷ {selected.accessibility.pace}</span><span>♥ {selected.accessibility.support}</span><span>◎ {selected.accessibility.venue}</span></div></div><div><small>Starting from</small><strong>{selected.currency}{selected.price.toLocaleString("en-MY")}</strong><span>per pax</span></div></div>
            <div className="modal-rate-list"><h3>Package rates</h3>{selected.rates.map((rate) => <div key={rate.label}><p><strong>{rate.label}</strong>{rate.note && <small>{rate.note}</small>}</p><b>{selected.currency}{rate.price.toLocaleString("en-MY")} <small>/ pax</small></b></div>)}</div>
            {selected.supportArrangement && <div className="modal-support"><strong>Standard support arrangement</strong><span>{selected.supportArrangement}</span></div>}
            {selected.itinerary.length > 0 && <div className="itinerary-days">
              {selected.itinerary.map((day) => (
                <article className="itinerary-day" key={day.day}>
                  <div className="day-heading"><span>{day.label}</span><h3>{day.title}</h3></div>
                  <div className="timeline">
                    {day.items.map((item) => <div className="timeline-item" key={`${item.time}-${item.activity}`}><time>{item.time}</time><div><h4>{item.activity}</h4>{item.note && <p>{item.note}</p>}</div></div>)}
                  </div>
                </article>
              ))}
            </div>}
            <div className="modal-package-details"><section><h3>Package includes</h3><ul>{selected.includes.map((item) => <li key={item}>✓ {item}</li>)}</ul></section><section><h3>Not included</h3><ul>{selected.notIncluded.map((item) => <li key={item}>× {item}</li>)}</ul></section></div>
            {selected.notices.length > 0 && <div className="modal-notices">{selected.notices.map((notice) => <p key={notice}>ⓘ {notice}</p>)}</div>}
            <footer className="modal-footer"><p><strong>Ready to plan your trip?</strong><span>Your final itinerary and any additional costs are confirmed before booking.</span></p><a className="button primary" href="#match" onClick={() => { window.dispatchEvent(new CustomEvent("kaypoh-select-package", { detail: selected.id })); setSelected(null); }}>Book this trip <span>→</span></a></footer>
          </section>
        </div>
      )}
    </>
  );
}
