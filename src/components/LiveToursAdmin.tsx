"use client";
/* eslint-disable @next/next/no-img-element -- QR data URLs are generated in the browser. */

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { liveTours } from "@/data/data";
import RatingsResponseModal from "@/components/RatingsResponseModal";

type LiveTour = (typeof liveTours)[number];
type TourModule = LiveTour["modules"][number];

export default function LiveToursAdmin({ role }: { role: "admin" | "guide" }) {
  const [tourId, setTourId] = useState(liveTours[0].id);
  const [qrModule, setQrModule] = useState<TourModule | null>(null);
  const [qrUrl, setQrUrl] = useState("");
  const [showResponses, setShowResponses] = useState(false);
  const [ratings, setRatings] = useState(() => Object.fromEntries(liveTours.flatMap((tour) => tour.modules.map((module) => [`${tour.id}/${module.id}`, { responses: module.responses, average: module.average, ratings: [...module.ratings] }]))));
  const visibleTours = role === "guide" ? liveTours.filter((item) => item.guideId === "KP-G001") : liveTours;
  const tour = visibleTours.find((item) => item.id === tourId) ?? visibleTours[0];

  useEffect(() => {
    if (!qrModule) return;
    const ratingUrl = `${window.location.origin}/rate/${tour.id}/${qrModule.id}`;
    QRCode.toDataURL(ratingUrl, { width: 300, margin: 2, color: { dark: "#153b49", light: "#fffaf0" } }).then(setQrUrl);
  }, [qrModule, tour.id]);

  const scoredModules = tour.modules.map((module) => ratings[`${tour.id}/${module.id}`]).filter((rating) => rating.responses > 0);
  const tourAverage = scoredModules.length ? scoredModules.reduce((sum, rating) => sum + rating.average, 0) / scoredModules.length : 0;

  const simulateRating = (module: TourModule) => {
    const key = `${tour.id}/${module.id}`;
    setRatings((current) => {
      const previous = current[key];
      const score = 4 + Math.round(Math.random());
      const nextResponses = previous.responses + 1;
      const nextRatings = [...previous.ratings];
      nextRatings[score - 1] += 1;
      return { ...current, [key]: { responses: nextResponses, average: ((previous.average * previous.responses) + score) / nextResponses, ratings: nextRatings } };
    });
  };

  return <div className={`live-role-${role}`}>
    <section className="admin-section-head"><div><p className="admin-eyebrow">Today’s operations</p><h2>{role === "guide" ? "My live tour" : "Live tour supervision"}</h2><p>{role === "guide" ? "Complete each module and share its rating QR when travellers return to the vehicle." : "Monitor every trip, module, response count, and traveller rating in real time."}</p></div><div className="live-indicator"><i /> Live updates</div></section>
    <div className="live-tour-tabs">{visibleTours.map((item) => <button className={item.id === tour.id ? "active" : ""} onClick={() => setTourId(item.id)} key={item.id}><span className={`tour-state state-${item.status.toLowerCase().replace(" ", "-")}`}>{item.status}</span><strong>{item.title}</strong><small>{item.time} · {item.guests} travellers</small></button>)}</div>

    <section className="live-tour-hero"><div><span className="tour-state state-live">{tour.status}</span><h2>{tour.title}</h2><p>{tour.bookingId} · {tour.date} · {tour.time}</p></div><div className="live-tour-facts"><span><small>TRIP COMPANION</small><strong>{tour.guide}</strong></span><span><small>TRANSPORT</small><strong>{tour.vehicle}</strong></span><span><small>LIVE RATING</small><strong>★ {tourAverage ? tourAverage.toFixed(1) : "—"}</strong></span></div><div className="tour-progress"><span style={{ width: `${tour.progress}%` }} /><small>{tour.progress}% complete</small></div></section>

    <div className="live-tour-layout"><section className="admin-card live-itinerary"><header><div><h3>Today’s itinerary</h3><p>Open a QR checkpoint when travellers return to the vehicle.</p></div></header>{tour.modules.map((module, index) => { const result = ratings[`${tour.id}/${module.id}`]; return <article className={`live-module module-${module.status.toLowerCase().replace(" ", "-")}`} key={module.id}><div className="module-sequence"><span>{index + 1}</span><i /></div><time>{module.time}</time><div className="module-copy"><span>{module.status}</span><h3>{module.title}</h3><p>{module.venue}</p></div><div className="module-score"><strong>{result.responses ? `★ ${result.average.toFixed(1)}` : "—"}</strong><small>{result.responses} responses</small></div><div className="module-actions"><button onClick={() => { setQrUrl(""); setQrModule(module); }}>▦ Show QR</button>{module.status === "Rating open" && <button className="simulate" onClick={() => simulateRating(module)}>＋ Demo response</button>}</div></article>; })}</section>
      <aside className="admin-card live-insights"><header><div><h3>Live feedback</h3><p>Ratings across completed stops</p></div></header>{tour.modules.filter((module) => ratings[`${tour.id}/${module.id}`].responses > 0).map((module) => { const result = ratings[`${tour.id}/${module.id}`]; const max = Math.max(...result.ratings, 1); return <article key={module.id}><div><h4>{module.title}</h4><strong>★ {result.average.toFixed(1)}</strong></div><p>{result.responses} of {tour.guests} travellers responded</p><div className="rating-bars">{[5,4,3,2,1].map((star) => <span key={star}><small>{star}★</small><i><b style={{ width: `${(result.ratings[star - 1] / max) * 100}%` }} /></i><em>{result.ratings[star - 1]}</em></span>)}</div></article>; })}<footer><span>Overall tour sentiment</span><strong>{tourAverage >= 4.5 ? "Excellent" : tourAverage ? "Good" : "Waiting for ratings"}</strong><p>Live data will sync across devices when the database is connected.</p></footer></aside>
    </div>

    {qrModule && <div className="qr-backdrop" onMouseDown={() => setQrModule(null)}><section className="qr-modal" role="dialog" aria-modal="true" aria-labelledby="qr-title" onMouseDown={(event) => event.stopPropagation()}><button className="qr-close" onClick={() => setQrModule(null)} aria-label="Close QR code">×</button><p className="admin-eyebrow">Rating checkpoint</p><h2 id="qr-title">How was<br />{qrModule.title}?</h2><p>Ask travellers to scan this code after returning to the vehicle. Their ratings will appear on the dashboard.</p><div className="qr-image">{qrUrl ? <img src={qrUrl} alt={`QR code to rate ${qrModule.title}`} /> : <span>Generating…</span>}</div><strong>{tour.title}</strong><small>{qrModule.venue} · {qrModule.time}</small><a href={`/rate/${tour.id}/${qrModule.id}`} target="_blank">Open rating page ↗</a></section></div>}
    <button className="responses-fab" onClick={() => setShowResponses(true)}>★ View ratings & individual responses</button>
    {showResponses && <RatingsResponseModal tourId={tour.id} onClose={() => setShowResponses(false)} />}
  </div>;
}
