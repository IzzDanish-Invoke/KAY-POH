"use client";
/* eslint-disable @next/next/no-img-element -- QR data URLs are generated in the browser. */
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { liveRatingResponses, liveTours } from "@/data/data";
import RatingsResponseModal from "@/components/RatingsResponseModal";
import type { LiveTour, LiveTourModule, RatingResponse } from "@/types/live-tour";

const initialTours = liveTours as LiveTour[];
const initialResponses = liveRatingResponses as RatingResponse[];
const resultFor = (responses: RatingResponse[], tourId: string, moduleId: string) => {
  const records = responses.filter((item) => item.tourId === tourId && item.moduleId === moduleId);
  const ratings = [1,2,3,4,5].map((star) => records.filter((item) => item.rating === star).length);
  return { responses: records.length, average: records.length ? records.reduce((sum, item) => sum + item.rating, 0) / records.length : 0, ratings };
};

export default function LiveToursAdmin({ role }: { role: "admin" | "guide" }) {
  const [tours, setTours] = useState<LiveTour[]>(initialTours);
  const [responses, setResponses] = useState<RatingResponse[]>(initialResponses);
  const [tourId, setTourId] = useState(initialTours[0]?.id ?? "");
  const [qrModule, setQrModule] = useState<LiveTourModule | null>(null);
  const [qrUrl, setQrUrl] = useState("");
  const [responseModuleId, setResponseModuleId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/live-tours", { cache: "no-store" }).then((result) => result.ok ? result.json() as Promise<LiveTour[]> : Promise.reject()),
      fetch("/api/rating-responses", { cache: "no-store" }).then((result) => result.ok ? result.json() as Promise<RatingResponse[]> : Promise.reject()),
    ]).then(([nextTours, nextResponses]) => { setTours(nextTours); setResponses(nextResponses); }).catch(() => undefined);
  }, []);

  const visibleTours = role === "guide" ? tours.filter((item) => item.guideId === "KP-G001") : tours;
  const tour = visibleTours.find((item) => item.id === tourId) ?? visibleTours[0];
  const bookingGroups = visibleTours.reduce<Record<string, LiveTour[]>>((groups, item) => {
    groups[item.bookingId] = [...(groups[item.bookingId] ?? []), item].sort((a, b) => (a.day ?? 1) - (b.day ?? 1));
    return groups;
  }, {});
  const activeBookingDays = tour ? bookingGroups[tour.bookingId] ?? [tour] : [];

  useEffect(() => {
    if (!qrModule || !tour) return;
    QRCode.toDataURL(`${window.location.origin}/rate/${tour.id}/${qrModule.id}`, { width: 300, margin: 2, color: { dark: "#153b49", light: "#fffaf0" } }).then(setQrUrl);
  }, [qrModule, tour]);

  if (!tour) return <p className="empty-state">No live tours are configured.</p>;
  const moduleResults = tour.modules.map((module) => resultFor(responses, tour.id, module.id));
  const scoredModules = moduleResults.filter((result) => result.responses > 0);
  const tourAverage = scoredModules.length ? scoredModules.reduce((sum, result) => sum + result.average, 0) / scoredModules.length : 0;

  const simulateRating = async (module: LiveTourModule) => {
    const payload = { tourId: tour.id, moduleId: module.id, rating: 5, tags: ["Demo response"], comment: "", anonymous: true };
    const result = await fetch("/api/rating-responses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    if (result.ok) {
      const saved = await result.json() as RatingResponse;
      setResponses((current) => [...current, saved]);
    }
  };

  return <div className={`live-role-${role}`}>
    <section className="admin-section-head"><div><p className="admin-eyebrow">Today’s operations</p><h2>{role === "guide" ? "My live tour" : "Live tour supervision"}</h2><p>{role === "guide" ? "Complete each module and share its rating QR when travellers return to the vehicle." : "Monitor every trip, module, response count, and traveller rating in real time."}</p></div><div className="live-indicator"><i /> Persistent live data</div></section>
    <div className="live-tour-tabs">{Object.entries(bookingGroups).map(([bookingId, days]) => { const activeDay = days.find((item) => item.status === "Live") ?? days[0]; const isActive = bookingId === tour.bookingId; return <button className={isActive ? "active" : ""} onClick={() => setTourId(activeDay.id)} key={bookingId}><span className={`tour-state state-${activeDay.status.toLowerCase().replace(" ", "-")}`}>{activeDay.status}</span><strong>{activeDay.title.replace(/ · Day \d+$/, "")}</strong><small>{bookingId} · {activeDay.guests} travellers · {days.length} days</small></button>; })}</div>
    {activeBookingDays.length > 1 && <div className="live-day-tabs" aria-label="Tour day">{activeBookingDays.map((dayTour) => <button className={dayTour.id === tour.id ? "active" : ""} onClick={() => { setTourId(dayTour.id); setResponseModuleId(null); setQrModule(null); }} key={dayTour.id}><strong>Day {dayTour.day ?? 1}</strong><span>{dayTour.date}</span><small>{dayTour.modules.length} stops</small></button>)}</div>}
    <section className="live-tour-hero"><div><span className={`tour-state state-${tour.status.toLowerCase().replace(" ", "-")}`}>{tour.status}</span><h2>{tour.title}</h2><p>{tour.bookingId} · {tour.date} · {tour.time}</p></div><div className="live-tour-facts"><span><small>REQUESTED BY</small><strong>{tour.requester ?? "Booking guest"}</strong>{tour.requesterEmail && <small>{tour.requesterEmail}</small>}</span><span><small>TRIP COMPANION</small><strong>{tour.guide}</strong></span><span><small>TRANSPORT</small><strong>{tour.vehicle}</strong></span><span><small>LIVE RATING</small><strong>★ {tourAverage ? tourAverage.toFixed(1) : "—"}</strong></span></div><div className="tour-progress"><span style={{ width: `${tour.progress}%` }} /><small>{tour.progress}% complete</small></div></section>
    <div className="live-tour-layout"><section className="admin-card live-itinerary"><header><div><h3>Today’s itinerary</h3><p>Open a checkpoint or inspect reviews for an individual stop.</p></div></header>{tour.modules.map((module, index) => { const result = moduleResults[index]; return <article className={`live-module module-${module.status.toLowerCase().replace(" ", "-")}`} key={module.id}><div className="module-sequence"><span>{index + 1}</span><i /></div><time>{module.time}</time><div className="module-copy"><span>{module.status}</span><h3>{module.title}</h3><p>{module.venue}</p></div><div className="module-score"><strong>{result.responses ? `★ ${result.average.toFixed(1)}` : "—"}</strong><small>{result.responses} responses</small></div><div className="module-actions"><button onClick={() => { setQrUrl(""); setQrModule(module); }}>▦ Show QR</button><button className="view-module-reviews" onClick={() => setResponseModuleId(module.id)}>★ Reviews</button>{module.status === "Rating open" && <button className="simulate" onClick={() => simulateRating(module)}>＋ Demo</button>}</div></article>; })}</section>
      <aside className="admin-card live-insights"><header><div><h3>Live feedback</h3><p>Select a stop to see every response</p></div></header>{tour.modules.filter((module) => resultFor(responses, tour.id, module.id).responses > 0).map((module) => { const result = resultFor(responses, tour.id, module.id); const max = Math.max(...result.ratings, 1); return <article className="insight-review-link" onClick={() => setResponseModuleId(module.id)} key={module.id}><div><h4>{module.title}</h4><strong>★ {result.average.toFixed(1)}</strong></div><p>{result.responses} of {tour.guests} travellers responded · View details →</p><div className="rating-bars">{[5,4,3,2,1].map((star) => <span key={star}><small>{star}★</small><i><b style={{ width: `${(result.ratings[star - 1] / max) * 100}%` }} /></i><em>{result.ratings[star - 1]}</em></span>)}</div></article>; })}<footer><span>Overall tour sentiment</span><strong>{tourAverage >= 4.5 ? "Excellent" : tourAverage ? "Good" : "Waiting for ratings"}</strong><p>Responses are stored persistently and refresh from the shared JSON API.</p></footer></aside>
    </div>
    {qrModule && <div className="qr-backdrop" onMouseDown={() => setQrModule(null)}><section className="qr-modal" role="dialog" aria-modal="true" aria-labelledby="qr-title" onMouseDown={(event) => event.stopPropagation()}><button className="qr-close" onClick={() => setQrModule(null)} aria-label="Close QR code">×</button><p className="admin-eyebrow">Rating checkpoint</p><h2 id="qr-title">How was<br />{qrModule.title}?</h2><p>Ask travellers to scan this code. Their response is saved to this specific stop.</p><div className="qr-image">{qrUrl ? <img src={qrUrl} alt={`QR code to rate ${qrModule.title}`} /> : <span>Generating…</span>}</div><strong>{tour.title}</strong><small>{qrModule.venue} · {qrModule.time}</small><a href={`/rate/${tour.id}/${qrModule.id}`} target="_blank">Open rating page ↗</a></section></div>}
    <button className="responses-fab" onClick={() => setResponseModuleId("")}>★ View all tour responses</button>
    {responseModuleId !== null && <RatingsResponseModal tour={tour} initialModuleId={responseModuleId || undefined} onClose={() => setResponseModuleId(null)} />}
  </div>;
}
