"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { accessibilityNeeds, bookingAddOns, experiences, packages as initialPackages, tourGuides as initialTourGuides } from "@/data/data";
import { usePackages } from "@/hooks/usePackages";
import { useTourGuides } from "@/hooks/useTourGuides";

type BookingType = "package" | "experience";

export default function BookingFlow() {
  const tourGuides = useTourGuides();
  const packages = usePackages();
  const [type, setType] = useState<BookingType>("package");
  const [productId, setProductId] = useState(initialPackages[0].id);
  const [guideId, setGuideId] = useState(initialTourGuides[0].id);
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(2);
  const [addOns, setAddOns] = useState<string[]>([]);
  const [supportNeeds, setSupportNeeds] = useState<string[]>([]);
  const [supportNotes, setSupportNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const products = type === "package" ? packages : experiences;
  const selected = products.find((item) => item.id === productId) ?? products[0];
  const guide = tourGuides.find((item) => item.id === guideId) ?? tourGuides[0];
  const availableAddOns = bookingAddOns.filter((item) => item.appliesTo.includes(type));
  const addOnTotal = bookingAddOns.filter((item) => addOns.includes(item.id)).reduce((sum, item) => sum + item.price, 0);
  const subtotal = selected.price * guests;
  const total = subtotal + addOnTotal;

  const switchType = (next: BookingType) => {
    setType(next); setProductId(next === "package" ? (packages[0]?.id ?? initialPackages[0].id) : experiences[0].id); setAddOns([]); setSubmitted(false);
  };
  const toggleAddOn = (id: string) => setAddOns((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleSupport = (need: string) => setSupportNeeds((current) => current.includes(need) ? current.filter((item) => item !== need) : [...current, need]);
  const duration = "days" in selected ? selected.days : selected.duration;
  if (submitted) return <main className="booking-success"><div><Image src="/brand/kaypoh-dark-outline.png" alt="Kay Poh" width={105} height={94} /><span className="success-mark">✓</span><p className="booking-kicker">Booking request received</p><h1>Your Ipoh story<br /><em>starts here.</em></h1><p>We’ve reserved your request for <strong>{selected.title}</strong> with <strong>{guide.name}</strong>. A confirmation and payment link will be sent after the guide accepts.</p><div className="success-reference"><span>REFERENCE</span><strong>KP-B2050</strong></div><Link className="booking-primary" href="/">Back to Kay Poh <span>→</span></Link></div></main>;

  return <main className="booking-page">
    <header className="booking-header"><Link href="/" aria-label="Kay Poh home"><Image src="/brand/kaypoh-dark-outline.png" alt="Kay Poh" width={82} height={74} priority /></Link><div className="booking-progress"><span className="active">1 <i>Choose</i></span><b /><span className="active">2 <i>Personalise</i></span><b /><span>3 <i>Confirm</i></span></div><Link href="/">Close ×</Link></header>
    <div className="booking-layout">
      <section className="booking-content">
        <div className="booking-intro"><p className="booking-kicker">OKU-first booking</p><h1>Travel designed<br /><em>around you.</em></h1><p>Choose a complete getaway or shorter experience, then tell us what access and personal support will make it work for you.</p></div>

        <section className="booking-step"><header><span>01</span><div><h2>Choose your trip type</h2><p>Choose end-to-end support or join an access-checked activity for a few hours.</p></div></header><div className="type-options"><button className={type === "package" ? "active" : ""} onClick={() => switchType("package")}><span>▣</span><div><strong>Service levels</strong><small>Essential, Plus, or Private support</small></div><i>{type === "package" ? "●" : "○"}</i></button><button className={type === "experience" ? "active" : ""} onClick={() => switchType("experience")}><span>◎</span><div><strong>Experiences</strong><small>Access-checked activities from 3 hours</small></div><i>{type === "experience" ? "●" : "○"}</i></button></div></section>

        <section className="booking-step"><header><span>02</span><div><h2>Pick your {type}</h2><p>{type === "package" ? "Stay, itinerary, transfers, and guide bundled together." : "Perfect for day visitors or as an add-on to your own plans."}</p></div></header><div className="product-options">{products.map((item) => <button className={productId === item.id ? "active" : ""} onClick={() => setProductId(item.id)} key={item.id}><div className={`product-swatch ${"color" in item ? item.color : ""}`}><span>{"days" in item ? item.days : item.number}</span></div><div><strong>{item.title}</strong><p>{item.description}</p><small>{"days" in item ? item.days : item.duration} · From {item.currency}{item.price} / person</small></div><i>{productId === item.id ? "●" : "○"}</i></button>)}</div></section>

        <section className="booking-step"><header><span>03</span><div><h2>Set the details</h2><p>Availability will be confirmed with your selected guide.</p></div></header><div className="detail-grid"><label>Preferred start date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><label>Number of travellers<select value={guests} onChange={(event) => setGuests(Number(event.target.value))}>{[1,2,3,4,5,6,7,8].map((count) => <option value={count} key={count}>{count} {count === 1 ? "traveller" : "travellers"}</option>)}</select></label></div></section>

        <section className="booking-step"><header><span>04</span><div><h2>Tell us what support helps</h2><p>Select anything relevant. We will confirm the exact access plan privately before your booking is final.</p></div></header><div className="support-options">{accessibilityNeeds.map((need) => <label key={need}><input type="checkbox" checked={supportNeeds.includes(need)} onChange={() => toggleSupport(need)} /><span>✓</span>{need}</label>)}</div><label className="support-notes">Anything else we should plan for?<textarea value={supportNotes} onChange={(event) => setSupportNotes(event.target.value)} placeholder="For example: transfer method, mobility equipment dimensions, communication preferences, carer arrangements, sensory triggers, medication timing…" rows={4} /></label><p className="privacy-note">🔒 Your support information is only used to plan your trip and will be shared only with the team members who need it.</p></section>

        <section className="booking-step"><header><span>05</span><div><h2>Choose your trip companion</h2><p>Your request goes to a trained local companion who will confirm the support plan and their availability.</p></div></header><div className="booking-guide-grid">{tourGuides.map((item) => <button className={guideId === item.id ? "active" : ""} onClick={() => setGuideId(item.id)} key={item.id}><span className={`booking-avatar avatar-${item.color}`}>{item.initials}</span><div><strong>{item.name}</strong><small>{item.title}</small><p>★ {item.rating} <i>({item.reviews})</i> · {item.languages.slice(0,2).join(" / ")}</p></div><b>{guideId === item.id ? "Selected ✓" : "Choose"}</b></button>)}</div></section>

        <section className="booking-step"><header><span>06</span><div><h2>Add a little extra</h2><p>Optional touches to make the trip work better for you.</p></div></header><div className="addon-list">{availableAddOns.map((item) => <label key={item.id}><input type="checkbox" checked={addOns.includes(item.id)} onChange={() => toggleAddOn(item.id)} /><span /><div><strong>{item.name}</strong><small>{item.description}</small></div><b>+RM{item.price}</b></label>)}</div></section>
      </section>

      <aside className="booking-summary"><div className="summary-card"><p className="booking-kicker">Your booking</p><div className={`summary-art ${"color" in selected ? selected.color : ""}`}><span>{duration}</span><small>OKU-FIRST {type === "package" ? "GETAWAY" : "EXPERIENCE"}</small></div><h2>{selected.title}</h2><div className="summary-guide"><span className={`booking-avatar avatar-${guide.color}`}>{guide.initials}</span><div><small>Your trip companion</small><strong>{guide.name}</strong></div><span>★ {guide.rating}</span></div><dl><div><dt>Date</dt><dd>{date || "Choose a date"}</dd></div><div><dt>Travellers</dt><dd>{guests}</dd></div><div><dt>Support needs shared</dt><dd>{supportNeeds.length || "None yet"}</dd></div><div><dt>Base price</dt><dd>{selected.currency}{selected.price} × {guests}</dd></div>{addOns.length > 0 && <div><dt>Add-ons</dt><dd>RM{addOnTotal}</dd></div>}</dl><div className="summary-total"><span>Total estimate<small>Taxes included</small></span><strong>RM{total.toLocaleString("en-MY")}</strong></div><button className="booking-primary" disabled={!date} onClick={() => setSubmitted(true)}>Request access review <span>→</span></button>{!date && <p className="date-reminder">Choose a preferred date to continue.</p>}<p className="booking-assurance">No payment yet. We confirm your access plan first.</p></div><div className="summary-help"><span>?</span><div><strong>Need help before booking?</strong><p>Talk to our access team.</p></div><a href="mailto:hello@kaypoh.tours">Get help →</a></div></aside>
    </div>
  </main>;
}
