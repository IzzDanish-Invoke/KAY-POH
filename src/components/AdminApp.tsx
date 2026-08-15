"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { dashboardMetrics, guideBookingRequests, members, monthlyBookings, packages, tourGuides } from "@/data/data";
import LiveToursAdmin from "@/components/LiveToursAdmin";
import type { TourGuide } from "@/types/tour-guide";
import type { TourPackage } from "@/types/tour-package";

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: "⌂", badge: undefined },
  { id: "live", label: "Live tours", icon: "◉", badge: "2" },
  { id: "members", label: "Members", icon: "♙", badge: undefined },
  { id: "guides", label: "Tour guides", icon: "◎", badge: "2" },
  { id: "packages", label: "Package CMS", icon: "▣", badge: undefined },
] as const;

type PageId = (typeof navigation)[number]["id"];
type BookingStatus = "Pending" | "Accepted" | "Declined" | "Completed";
type WorkspaceRole = "admin" | "guide";
type DeleteConfirmation = { title: string; message: string; confirmLabel: string; onConfirm: () => Promise<void> };

const DELETE_CONFIRMATION_EVENT = "kaypoh-admin-delete-confirmation";

function requestDeleteConfirmation(detail: DeleteConfirmation) {
  window.dispatchEvent(new CustomEvent<DeleteConfirmation>(DELETE_CONFIRMATION_EVENT, { detail }));
}

const money = (value: number | null | undefined) => `RM${Number.isFinite(value) ? Number(value).toLocaleString("en-MY") : "0"}`;

function Status({ children }: { children: string }) {
  return <span className={`admin-status status-${children.toLowerCase().replace(" ", "-")}`}>{children}</span>;
}

function AdminDeleteConfirmation() {
  const [confirmation, setConfirmation] = useState<DeleteConfirmation | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [confirmError, setConfirmError] = useState("");

  useEffect(() => {
    const open = (event: Event) => { setConfirmError(""); setConfirmation((event as CustomEvent<DeleteConfirmation>).detail); };
    window.addEventListener(DELETE_CONFIRMATION_EVENT, open);
    return () => window.removeEventListener(DELETE_CONFIRMATION_EVENT, open);
  }, []);

  if (!confirmation) return null;
  const confirm = async () => {
    setDeleting(true);
    try {
      await confirmation.onConfirm();
      setConfirmation(null);
    } catch (error) {
      setConfirmError(error instanceof Error ? error.message : "Unable to complete the deletion.");
    } finally {
      setDeleting(false);
    }
  };

  return <div className="admin-confirm-backdrop" onMouseDown={() => !deleting && setConfirmation(null)}><section className="admin-confirm-modal" role="alertdialog" aria-modal="true" aria-labelledby="admin-confirm-title" aria-describedby="admin-confirm-message" onMouseDown={(event) => event.stopPropagation()}><span className="admin-confirm-icon">!</span><p className="admin-eyebrow">Please confirm</p><h2 id="admin-confirm-title">{confirmation.title}</h2><p id="admin-confirm-message">{confirmation.message}</p>{confirmError && <p className="admin-confirm-error" role="alert">{confirmError}</p>}<footer><button type="button" disabled={deleting} onClick={() => setConfirmation(null)}>Cancel</button><button type="button" className="confirm-delete" disabled={deleting} onClick={confirm}>{deleting ? "Deleting…" : confirmation.confirmLabel}</button></footer></section></div>;
}

export default function AdminApp() {
  const [active, setActive] = useState<PageId>("dashboard");
  const [role, setRole] = useState<WorkspaceRole>("admin");
  const [mobileNav, setMobileNav] = useState(false);
  const [bookingStatuses, setBookingStatuses] = useState<Record<string, BookingStatus>>(() => Object.fromEntries(guideBookingRequests.map((item) => [item.id, item.status as BookingStatus])));

  const visibleNavigation = role === "admin" ? navigation : navigation.filter((item) => ["dashboard", "live", "guides"].includes(item.id));
  const guideLabels: Partial<Record<PageId, string>> = { dashboard: "My overview", live: "My live tour", guides: "My bookings" };
  const pageName = role === "guide" ? guideLabels[active] ?? "My overview" : navigation.find((item) => item.id === active)?.label ?? "Dashboard";
  const switchRole = (nextRole: WorkspaceRole) => { setRole(nextRole); setActive("dashboard"); setMobileNav(false); };

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${mobileNav ? "is-open" : ""}`}>
        <div className="admin-logo"><Image src="/brand/kaypoh-white-outline.png" alt="Kay Poh" width={90} height={81} /><span>{role === "admin" ? "ADMIN" : "GUIDE"}</span></div>
        <nav aria-label="Admin navigation">
          {visibleNavigation.map((item) => <button key={item.id} className={active === item.id ? "active" : ""} onClick={() => { setActive(item.id); setMobileNav(false); }}><span className="nav-symbol">{item.icon}</span>{role === "guide" ? guideLabels[item.id] : item.label}{item.badge && <b>{item.badge}</b>}</button>)}
        </nav>
        <div className="sidebar-bottom"><Link href="/">← View website</Link><div className="admin-person"><span>{role === "admin" ? "BY" : "ML"}</span><div><strong>{role === "admin" ? "Bunty" : "Mei Ling Tan"}</strong><small>{role === "admin" ? "Supervisor" : "Trip companion"}</small></div><i>•••</i></div></div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar"><button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle menu">☰</button><div><p>{role === "admin" ? "Supervisor workspace" : "Tour guide workspace"}</p><h1>{pageName}</h1></div><div className="topbar-actions"><div className="role-switch" aria-label="Demo workspace role"><button className={role === "admin" ? "active" : ""} onClick={() => switchRole("admin")}>Admin</button><button className={role === "guide" ? "active" : ""} onClick={() => switchRole("guide")}>Tour guide</button></div><button aria-label="Notifications">♢<b>3</b></button><span>15 Aug 2026</span></div></header>
        <main className="admin-main">
          {active === "dashboard" && (role === "admin" ? <><Dashboard goTo={setActive} bookingStatuses={bookingStatuses} /><Stats /></> : <GuideDashboard goTo={setActive} bookingStatuses={bookingStatuses} />)}
          {active === "live" && <LiveToursAdmin role={role} />}
          {active === "members" && role === "admin" && <Members />}
          {active === "guides" && (role === "admin" ? <div className="supervisor-readonly"><Guides bookingStatuses={bookingStatuses} /></div> : <GuideBookings bookingStatuses={bookingStatuses} setBookingStatuses={setBookingStatuses} />)}
          {active === "packages" && role === "admin" && <PackageCms />}
        </main>
      </div>
      {mobileNav && <button className="sidebar-scrim" aria-label="Close menu" onClick={() => setMobileNav(false)} />}
      <AdminDeleteConfirmation />
    </div>
  );
}

function Dashboard({ goTo, bookingStatuses }: { goTo: (page: PageId) => void; bookingStatuses: Record<string, BookingStatus> }) {
  const pending = Object.values(bookingStatuses).filter((status) => status === "Pending").length;
  return <>
    <section className="admin-welcome"><div><p className="admin-eyebrow">Friday, 14 August</p><h2>Selamat petang, Bunty!</h2><p>Here’s what’s happening across Kay Poh today.</p></div><button className="admin-primary" onClick={() => goTo("packages")}>＋ New package</button></section>
    <section className="metric-grid">{dashboardMetrics.map((item, index) => <article key={item.id}><div className={`metric-icon metric-${index}`}>{["RM", "▤", "♙", "★"][index]}</div><p>{item.label}</p><strong>{item.value}</strong><span>↑ {item.change} <small>vs last month</small></span></article>)}</section>
    <div className="admin-two-col">
      <section className="admin-card"><header><div><h3>Booking overview</h3><p>Monthly confirmed bookings</p></div><button onClick={() => document.getElementById("performance")?.scrollIntoView({ behavior: "smooth" })}>Detailed analytics ↓</button></header><MiniChart /></section>
      <section className="admin-card attention-card"><header><div><h3>Needs attention</h3><p>Items waiting for action</p></div></header><button onClick={() => goTo("guides")}><span className="attention-icon red">◎</span><div><strong>{pending} guide requests</strong><small>Waiting to be accepted</small></div><b>→</b></button><button onClick={() => goTo("members")}><span className="attention-icon orange">♙</span><div><strong>5 new members</strong><small>Joined in the last 7 days</small></div><b>→</b></button><button onClick={() => goTo("packages")}><span className="attention-icon blue">▣</span><div><strong>1 draft package</strong><small>Not visible on the website</small></div><b>→</b></button></section>
    </div>
    <section className="admin-card dashboard-bookings"><header><div><h3>Recent bookings</h3><p>Latest customer activity</p></div><button onClick={() => goTo("guides")}>See all bookings →</button></header><BookingTable rows={guideBookingRequests.slice(0, 4)} statuses={bookingStatuses} /></section>
  </>;
}

function MiniChart() {
  const max = Math.max(...monthlyBookings.map((item) => item.bookings));
  return <div className="mini-chart">{monthlyBookings.map((item) => <div className="bar-column" key={item.month}><strong>{item.bookings}</strong><div style={{ height: `${(item.bookings / max) * 145}px` }} /><span>{item.month}</span></div>)}</div>;
}

function GuideDashboard({ goTo, bookingStatuses }: { goTo: (page: PageId) => void; bookingStatuses: Record<string, BookingStatus> }) {
  const myBookings = guideBookingRequests.filter((item) => item.guideId === "KP-G001");
  const pending = myBookings.filter((item) => bookingStatuses[item.id] === "Pending").length;
  return <>
    <section className="admin-welcome"><div><p className="admin-eyebrow">Your guide workspace</p><h2>Selamat petang, Mei Ling!</h2><p>Your next guests arrive soon. Here’s everything you need for today.</p></div><button className="admin-primary" onClick={() => goTo("live")}>Open live tour →</button></section>
    <section className="guide-overview-grid"><article><span>◉</span><p>Current tour</p><strong>KAYPOH Plus · Ipoh</strong><small>8 travellers · 42% complete</small><button onClick={() => goTo("live")}>Manage modules & QR →</button></article><article><span>▤</span><p>Pending requests</p><strong>{pending}</strong><small>Needs your response</small><button onClick={() => goTo("guides")}>Review bookings →</button></article><article><span>★</span><p>Your rating</p><strong>4.95</strong><small>128 traveller reviews</small></article></section>
    <section className="admin-card dashboard-bookings"><header><div><h3>My assigned bookings</h3><p>Only bookings assigned to your guide account</p></div><button onClick={() => goTo("guides")}>Manage bookings →</button></header><BookingTable rows={myBookings} statuses={bookingStatuses} /></section>
    <section className="guide-role-note"><strong>Tour guide permissions</strong><span>✓ Accept your bookings</span><span>✓ Manage your tour modules</span><span>✓ Generate rating QR codes</span><span>— No access to members, CMS, or company analytics</span></section>
  </>;
}

function Stats() {
  const [period, setPeriod] = useState("8 months");
  const packagePerformance = [
    { bookings: 62, revenue: 24738, capacity: 86 },
    { bookings: 49, revenue: 22491, capacity: 73 },
    { bookings: 37, revenue: 25863, capacity: 61 },
  ];
  return <section id="performance" className="dashboard-performance">
    <section className="admin-section-head"><div><h2>Performance at a glance</h2><p>Track the combinations, people, and packages driving the business.</p></div><select value={period} onChange={(event) => setPeriod(event.target.value)}><option>8 months</option><option>30 days</option><option>This quarter</option></select></section>
    <section className="stats-highlight"><article><p>Total revenue</p><strong>RM137,800</strong><span>↑ 24.3% year to date</span></article><article><p>Booking conversion</p><strong>8.4%</strong><span>↑ 1.2% from last period</span></article><article><p>Repeat travellers</p><strong>31%</strong><span>102 returning members</span></article></section>
    <div className="admin-two-col stats-layout"><section className="admin-card"><header><div><h3>Revenue & bookings</h3><p>{period} performance</p></div><span className="chart-key"><i /> Revenue</span></header><div className="revenue-chart">{monthlyBookings.map((item) => <div key={item.month}><span>{money(item.revenue)}</span><i style={{ height: `${item.revenue / 160}px` }} /><small>{item.month}</small></div>)}</div></section><section className="admin-card ranking"><header><div><h3>Guide leaderboard</h3><p>By guest satisfaction</p></div></header>{tourGuides.map((guide, i) => <div className="rank-row" key={guide.id}><b>{i + 1}</b><span className={`guide-avatar avatar-${guide.color}`}>{guide.initials}</span><div><strong>{guide.name}</strong><small>{guide.tours} tours</small></div><span>★ {guide.rating}</span></div>)}</section></div>
    <section className="admin-card package-performance"><header><div><h3>Package performance</h3><p>Which products are converting best</p></div></header><div className="performance-grid">{packages.map((item, index) => { const performance = packagePerformance[index] ?? { bookings: 0, revenue: 0, capacity: 0 }; return <article key={item.id}><span className={`performance-art ${item.color}`}>{item.days}</span><div><h4>{item.title}</h4><p>{performance.bookings} bookings · {money(performance.revenue)}</p><div><i style={{ width: `${performance.capacity}%` }} /></div><small>{performance.capacity}% capacity</small></div></article>; })}</div></section>
  </section>;
}

function Members() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => members.filter((member) => `${member.name} ${member.email} ${member.id}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <><section className="admin-section-head"><div><h2>Member management</h2><p>{members.length} travellers currently in your community.</p></div><button className="admin-primary">＋ Add member</button></section><div className="table-tools"><label>⌕<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search member, email, or ID" /></label><button>Filter ≡</button><button>Export ↓</button></div><section className="admin-card data-table-card"><table className="admin-table"><thead><tr><th>Member</th><th>Member ID</th><th>Joined</th><th>Bookings</th><th>Total spent</th><th>Status</th><th /></tr></thead><tbody>{filtered.map((member) => <tr key={member.id}><td><div className="member-cell"><span>{member.initials}</span><div><strong>{member.name}</strong><small>{member.email}</small></div></div></td><td>{member.id}</td><td>{member.joined}</td><td>{member.bookings}</td><td>{money(member.spent)}</td><td><Status>{member.status}</Status></td><td><button className="dots">•••</button></td></tr>)}</tbody></table>{filtered.length === 0 && <p className="empty-state">No members match “{query}”.</p>}</section></>;
}

function GuideBookings({ bookingStatuses, setBookingStatuses }: { bookingStatuses: Record<string, BookingStatus>; setBookingStatuses: React.Dispatch<React.SetStateAction<Record<string, BookingStatus>>> }) {
  const myBookings = guideBookingRequests.filter((item) => item.guideId === "KP-G001");
  const changeStatus = (id: string, status: BookingStatus) => setBookingStatuses((current) => ({ ...current, [id]: status }));
  return <><section className="admin-section-head"><div><p className="admin-eyebrow">Mei Ling Tan · KP-G001</p><h2>My booking requests</h2><p>Review only trips assigned to you. The supervisor can monitor decisions but cannot respond on your behalf.</p></div></section><section className="booking-request-list">{myBookings.map((booking) => <article className="booking-request" key={booking.id}><div className="request-date"><small>TRIP DATES</small><strong>{booking.date}</strong><span>{booking.guests} guest{booking.guests > 1 ? "s" : ""}</span></div><div className="request-main"><div><span className="booking-id">{booking.id}</span><h3>{booking.packageName}</h3><p>Requested by <strong>{booking.member}</strong></p></div><strong>{money(booking.value)}</strong></div><div className="request-actions"><Status>{bookingStatuses[booking.id]}</Status>{bookingStatuses[booking.id] === "Pending" && <><button className="decline" onClick={() => changeStatus(booking.id, "Declined")}>Decline</button><button className="accept" onClick={() => changeStatus(booking.id, "Accepted")}>Accept booking</button></>}</div></article>)}</section></>;
}

function Guides({ bookingStatuses }: { bookingStatuses: Record<string, BookingStatus> }) {
  const [tab, setTab] = useState<"guides" | "requests">("guides");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<TourGuide | null>(null);
  const [editingGuide, setEditingGuide] = useState<TourGuide | null>(null);
  const [guideList, setGuideList] = useState<TourGuide[]>(tourGuides as TourGuide[]);
  const emptyGuide = { name: "", email: "", title: "", languages: "English, Malay", specialties: "Mobility support", bio: "", status: "Available", licensed: true, yearsExperience: "", expertise: "", perks: "" };
  const [newGuide, setNewGuide] = useState(emptyGuide);
  const [savingGuide, setSavingGuide] = useState(false);
  const [guideError, setGuideError] = useState("");
  const pendingCount = Object.values(bookingStatuses).filter((status) => status === "Pending").length;

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/tour-guides", { cache: "no-store", signal: controller.signal })
      .then((response) => response.ok ? response.json() as Promise<TourGuide[]> : Promise.reject())
      .then(setGuideList)
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const createGuide = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSavingGuide(true);
    setGuideError("");
    const payload = {
      name: newGuide.name,
      email: newGuide.email,
      title: newGuide.title,
      bio: newGuide.bio || "New KAYPOH trip companion profile.",
      languages: newGuide.languages.split(",").map((item) => item.trim()).filter(Boolean),
      specialties: newGuide.specialties.split(",").map((item) => item.trim()).filter(Boolean),
      status: newGuide.status,
      licensed: newGuide.licensed,
      yearsExperience: Number(newGuide.yearsExperience) || 0,
      expertise: newGuide.expertise || "Profile expertise pending review.",
      perks: newGuide.perks.split("\n").map((item) => item.trim()).filter(Boolean),
    };

    try {
      const response = await fetch("/api/tour-guides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as TourGuide | { error?: string };
      if (!response.ok) throw new Error("error" in result ? result.error : "Unable to create guide.");
      setGuideList((current) => [...current, result as TourGuide]);
      setShowCreate(false);
      setNewGuide(emptyGuide);
    } catch (error) {
      setGuideError(error instanceof Error ? error.message : "Unable to create guide.");
    } finally {
      setSavingGuide(false);
    }
  };

  const saveEditedGuide = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingGuide) return;
    setSavingGuide(true);
    setGuideError("");
    try {
      const response = await fetch(`/api/tour-guides/${encodeURIComponent(editingGuide.id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingGuide),
      });
      const result = await response.json() as TourGuide | { error?: string };
      if (!response.ok) throw new Error("error" in result ? result.error : "Unable to update guide.");
      const updated = result as TourGuide;
      setGuideList((current) => current.map((guide) => guide.id === updated.id ? updated : guide));
      setSelectedGuide((current) => current?.id === updated.id ? updated : current);
      setEditingGuide(null);
    } catch (error) {
      setGuideError(error instanceof Error ? error.message : "Unable to update guide.");
    } finally {
      setSavingGuide(false);
    }
  };

  const removeGuide = (guide: TourGuide) => {
    requestDeleteConfirmation({
      title: `Delete ${guide.name}?`,
      message: "This permanently removes the guide from the admin directory, landing page, and booking forms.",
      confirmLabel: "Delete guide",
      onConfirm: async () => {
        setGuideError("");
        const response = await fetch(`/api/tour-guides/${encodeURIComponent(guide.id)}`, { method: "DELETE" });
        if (!response.ok) {
          const result = await response.json() as { error?: string };
          setGuideError(result.error || "Unable to delete guide.");
          throw new Error(result.error || "Unable to delete guide.");
        }
        setGuideList((current) => current.filter((item) => item.id !== guide.id));
        setSelectedGuide((current) => current?.id === guide.id ? null : current);
      },
    });
  };

  return <>
    <section className="admin-section-head"><div><h2>Tour guides & bookings</h2><p>Manage local companions and supervise their incoming booking requests.</p></div>{tab === "guides" && <button className="admin-primary" onClick={() => setShowCreate(true)}>＋ Add guide</button>}</section>
    <div className="module-tabs"><button className={tab === "guides" ? "active" : ""} onClick={() => setTab("guides")}>Tour guide directory</button><button className={tab === "requests" ? "active" : ""} onClick={() => setTab("requests")}>Booking requests <b>{pendingCount}</b></button></div>
    {guideError && !showCreate && !editingGuide && <p className="guide-page-error" role="alert">{guideError}</p>}
    {tab === "guides" ? <div className="guide-grid">{guideList.map((guide) => <article className="guide-card" key={guide.id}><div className="guide-card-top"><span className={`guide-avatar large avatar-${guide.color}`}>{guide.initials}</span><Status>{guide.status}</Status></div><h3>{guide.name}</h3><p className="guide-title">{guide.title}</p><div className="guide-credentials"><span>{guide.licensed ? "✓ MOTAC licensed" : "Licence pending"}</span><span>{guide.yearsExperience}+ years in Ipoh</span></div><p className="guide-bio">{guide.bio}</p><div className="guide-tags">{guide.specialties.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="guide-numbers"><span><strong>{guide.reviews ? `★ ${guide.rating}` : "New"}</strong><small>{guide.reviews} reviews</small></span><span><strong>{guide.tours}</strong><small>Tours</small></span><span><strong>{guide.acceptance}%</strong><small>Accept rate</small></span></div><footer><span>{guide.languages.join(" · ")}</span><div className="guide-card-actions"><button type="button" onClick={() => setSelectedGuide(guide)}>View</button><button type="button" onClick={() => { setGuideError(""); setEditingGuide(guide); }}>Edit</button><button className="delete" type="button" onClick={() => removeGuide(guide)}>Delete</button></div></footer></article>)}</div> : <section className="booking-request-list">{guideBookingRequests.map((booking) => <article className="booking-request" key={booking.id}><div className="request-date"><small>TRIP DATES</small><strong>{booking.date}</strong><span>{booking.guests} guest{booking.guests > 1 ? "s" : ""}</span></div><div className="request-main"><div><span className="booking-id">{booking.id}</span><h3>{booking.packageName}</h3><p>Requested by <strong>{booking.member}</strong> · Assigned to <strong>{booking.guide}</strong></p></div><strong>{money(booking.value)}</strong></div><div className="request-actions"><Status>{bookingStatuses[booking.id]}</Status></div></article>)}</section>}
    {selectedGuide && <div className="guide-modal-backdrop" onMouseDown={() => setSelectedGuide(null)}><section className="guide-create-modal guide-profile-modal" role="dialog" aria-modal="true" aria-labelledby="guide-profile-title" onMouseDown={(event) => event.stopPropagation()}><header><div><p className="admin-eyebrow">{selectedGuide.id} · Public profile</p><h2 id="guide-profile-title">{selectedGuide.name}</h2></div><button onClick={() => setSelectedGuide(null)} aria-label="Close guide profile">×</button></header><div className="guide-profile-body"><div className="guide-profile-lead"><span className={`guide-avatar large avatar-${selectedGuide.color}`}>{selectedGuide.initials}</span><div><p className="guide-title">{selectedGuide.title}</p><div className="guide-credentials"><span>{selectedGuide.licensed ? "✓ MOTAC licensed guide" : "Licence pending"}</span><span>{selectedGuide.yearsExperience}+ years guiding Ipoh</span></div></div><Status>{selectedGuide.status}</Status></div><section><small>BIODATA</small><p>{selectedGuide.bio}</p></section><section><small>SPECIALIZES IN</small><p>{selectedGuide.expertise}</p></section><section><small>SPECIAL ACCESS & PERKS</small><ul>{selectedGuide.perks.map((perk) => <li key={perk}>✓ {perk}</li>)}</ul></section><div className="guide-profile-columns"><section><small>LANGUAGES</small><p>{selectedGuide.languages.join(" · ")}</p></section><section><small>SPECIALTIES</small><div className="guide-tags">{selectedGuide.specialties.map((tag) => <span key={tag}>{tag}</span>)}</div></section></div><section><small>GUEST TESTIMONIALS</small>{selectedGuide.testimonials.length ? selectedGuide.testimonials.map((testimonial) => <blockquote key={testimonial.guest}>“{testimonial.quote}”<cite>— {testimonial.guest}</cite></blockquote>) : <p>No testimonials yet.</p>}</section><div className="guide-numbers"><span><strong>{selectedGuide.reviews ? `★ ${selectedGuide.rating}` : "New"}</strong><small>{selectedGuide.reviews} reviews</small></span><span><strong>{selectedGuide.tours}</strong><small>Tours</small></span><span><strong>{selectedGuide.acceptance}%</strong><small>Accept rate</small></span></div></div></section></div>}
    {editingGuide && <div className="guide-modal-backdrop" onMouseDown={() => !savingGuide && setEditingGuide(null)}><section className="guide-create-modal" role="dialog" aria-modal="true" aria-labelledby="edit-guide-title" onMouseDown={(event) => event.stopPropagation()}><header><div><p className="admin-eyebrow">{editingGuide.id}</p><h2 id="edit-guide-title">Edit tour guide</h2></div><button disabled={savingGuide} onClick={() => setEditingGuide(null)} aria-label="Close edit guide form">×</button></header><form onSubmit={saveEditedGuide}><div className="guide-form-grid"><label>Full name<input required value={editingGuide.name} onChange={(event) => setEditingGuide({ ...editingGuide, name: event.target.value })} /></label><label>Email address<input type="email" value={editingGuide.email ?? ""} onChange={(event) => setEditingGuide({ ...editingGuide, email: event.target.value })} /></label><label className="form-wide">Guide title<input required value={editingGuide.title} onChange={(event) => setEditingGuide({ ...editingGuide, title: event.target.value })} /></label><label>Years guiding Ipoh<input required min="0" type="number" value={editingGuide.yearsExperience} onChange={(event) => setEditingGuide({ ...editingGuide, yearsExperience: Number(event.target.value) })} /></label><label>Availability<select value={editingGuide.status} onChange={(event) => setEditingGuide({ ...editingGuide, status: event.target.value as TourGuide["status"] })}><option>Available</option><option>On tour</option><option>Off duty</option></select></label><label className="guide-license"><input type="checkbox" checked={editingGuide.licensed} onChange={(event) => setEditingGuide({ ...editingGuide, licensed: event.target.checked })} /><span>MOTAC licensed guide</span></label><label>Languages<input value={editingGuide.languages.join(", ")} onChange={(event) => setEditingGuide({ ...editingGuide, languages: event.target.value.split(",").map((item) => item.trim()) })} /><small>Separate with commas</small></label><label>Support specialties<input value={editingGuide.specialties.join(", ")} onChange={(event) => setEditingGuide({ ...editingGuide, specialties: event.target.value.split(",").map((item) => item.trim()) })} /><small>Separate with commas</small></label><label className="form-wide">Short biodata<textarea rows={3} value={editingGuide.bio} onChange={(event) => setEditingGuide({ ...editingGuide, bio: event.target.value })} /></label><label className="form-wide">Detailed expertise<textarea required rows={3} value={editingGuide.expertise} onChange={(event) => setEditingGuide({ ...editingGuide, expertise: event.target.value })} /></label><label className="form-wide">Special access & perks<textarea rows={3} value={editingGuide.perks.join("\n")} onChange={(event) => setEditingGuide({ ...editingGuide, perks: event.target.value.split("\n") })} /><small>One item per line</small></label>{guideError && <p className="guide-form-error" role="alert">{guideError}</p>}</div><footer><button type="button" disabled={savingGuide} onClick={() => setEditingGuide(null)}>Cancel</button><button className="admin-primary" disabled={savingGuide} type="submit">{savingGuide ? "Saving…" : "Save changes →"}</button></footer></form></section></div>}
    {showCreate && <div className="guide-modal-backdrop" onMouseDown={() => !savingGuide && setShowCreate(false)}><section className="guide-create-modal" role="dialog" aria-modal="true" aria-labelledby="create-guide-title" onMouseDown={(event) => event.stopPropagation()}><header><div><p className="admin-eyebrow">New team member</p><h2 id="create-guide-title">Create tour guide</h2></div><button disabled={savingGuide} onClick={() => setShowCreate(false)} aria-label="Close create guide form">×</button></header><form onSubmit={createGuide}><div className="guide-form-grid"><label>Full name<input required value={newGuide.name} onChange={(event) => setNewGuide({ ...newGuide, name: event.target.value })} placeholder="e.g. Aina Rahman" /></label><label>Email address<input required type="email" value={newGuide.email} onChange={(event) => setNewGuide({ ...newGuide, email: event.target.value })} placeholder="aina@kaypoh.my" /></label><label className="form-wide">Guide title<input required value={newGuide.title} onChange={(event) => setNewGuide({ ...newGuide, title: event.target.value })} placeholder="e.g. Access-trained heritage companion" /></label><label>Years guiding Ipoh<input required min="0" type="number" value={newGuide.yearsExperience} onChange={(event) => setNewGuide({ ...newGuide, yearsExperience: event.target.value })} /></label><label>Initial availability<select value={newGuide.status} onChange={(event) => setNewGuide({ ...newGuide, status: event.target.value })}><option>Available</option><option>On tour</option><option>Off duty</option></select></label><label className="guide-license"><input type="checkbox" checked={newGuide.licensed} onChange={(event) => setNewGuide({ ...newGuide, licensed: event.target.checked })} /><span>MOTAC licensed guide</span></label><label>Languages<input value={newGuide.languages} onChange={(event) => setNewGuide({ ...newGuide, languages: event.target.value })} /><small>Separate with commas</small></label><label>Support specialties<input value={newGuide.specialties} onChange={(event) => setNewGuide({ ...newGuide, specialties: event.target.value })} /><small>Separate with commas</small></label><label className="form-wide">Short biodata<textarea rows={3} value={newGuide.bio} onChange={(event) => setNewGuide({ ...newGuide, bio: event.target.value })} placeholder="Training, experience, and approach to supporting travellers…" /></label><label className="form-wide">Detailed expertise<textarea required rows={3} value={newGuide.expertise} onChange={(event) => setNewGuide({ ...newGuide, expertise: event.target.value })} placeholder="The Ipoh routes and experiences this guide knows best…" /></label><label className="form-wide">Special access & perks<textarea rows={3} value={newGuide.perks} onChange={(event) => setNewGuide({ ...newGuide, perks: event.target.value })} placeholder={'One perk per line\nReserved venue access\nSpecial equipment provided'} /><small>One item per line. These appear on the public guide profile.</small></label>{guideError && <p className="guide-form-error" role="alert">{guideError}</p>}</div><footer><button type="button" disabled={savingGuide} onClick={() => setShowCreate(false)}>Cancel</button><button className="admin-primary" disabled={savingGuide} type="submit">{savingGuide ? "Saving…" : "Create guide →"}</button></footer></form></section></div>}
  </>;
}

function BookingTable({ rows, statuses }: { rows: typeof guideBookingRequests; statuses: Record<string, BookingStatus> }) {
  return <div className="table-scroll"><table className="admin-table compact"><thead><tr><th>Booking</th><th>Trip</th><th>Guide</th><th>Dates</th><th>Value</th><th>Status</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><strong>{row.id}</strong><small>{row.member}</small></td><td>{row.packageName}</td><td>{row.guide}</td><td>{row.date}</td><td>{money(row.value)}</td><td><Status>{statuses[row.id]}</Status></td></tr>)}</tbody></table></div>;
}

function PackageCms() {
  const initial = packages as TourPackage[];
  const [packageList, setPackageList] = useState<TourPackage[]>(initial);
  const [selected, setSelected] = useState<TourPackage | null>(initial[0] ?? null);
  const [isNew, setIsNew] = useState(false);
  const [itineraryText, setItineraryText] = useState(() => JSON.stringify(initial[0]?.itinerary ?? [], null, 2));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/packages", { cache: "no-store", signal: controller.signal })
      .then((response) => response.ok ? response.json() as Promise<TourPackage[]> : Promise.reject())
      .then((records) => {
        setPackageList(records);
        setSelected((current) => records.find((item) => item.id === current?.id) ?? records[0] ?? null);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const choosePackage = (item: TourPackage) => {
    setSelected(item);
    setItineraryText(JSON.stringify(item.itinerary, null, 2));
    setIsNew(false);
    setError("");
  };

  const createPackage = () => {
    const draft: TourPackage = {
      id: "",
      tag: "New accessible package",
      days: "2D1N",
      title: "Untitled package",
      color: "package-gold",
      price: 0,
      currency: "RM",
      rates: [],
      description: "",
      highlights: [],
      includes: [],
      notIncluded: [],
      notices: [],
      accessibility: { mobility: "", pace: "", support: "", venue: "" },
      itinerary: [],
      published: false,
    };
    setSelected(draft);
    setItineraryText("[]");
    setIsNew(true);
    setError("");
  };

  const savePackage = async () => {
    if (!selected) return;
    setSaving(true);
    setError("");
    try {
      const itinerary = JSON.parse(itineraryText) as TourPackage["itinerary"];
      if (!Array.isArray(itinerary)) throw new Error("Itinerary must be a JSON array.");
      const payload = { ...selected, itinerary };
      const response = await fetch(isNew ? "/api/packages" : `/api/packages/${encodeURIComponent(selected.id)}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as TourPackage | { error?: string };
      if (!response.ok) throw new Error("error" in result ? result.error : "Unable to save package.");
      const saved = result as TourPackage;
      setPackageList((current) => isNew ? [...current, saved] : current.map((item) => item.id === saved.id ? saved : item));
      setSelected(saved);
      setItineraryText(JSON.stringify(saved.itinerary, null, 2));
      setIsNew(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save package.");
    } finally {
      setSaving(false);
    }
  };

  const removePackage = () => {
    if (!selected || isNew) return;
    const packageToDelete = selected;
    requestDeleteConfirmation({
      title: `Delete ${packageToDelete.title}?`,
      message: "This permanently removes the package from the CMS, landing page, matching form, and booking page.",
      confirmLabel: "Delete package",
      onConfirm: async () => {
        setSaving(true);
        setError("");
        try {
          const response = await fetch(`/api/packages/${encodeURIComponent(packageToDelete.id)}`, { method: "DELETE" });
          if (!response.ok) throw new Error("Unable to delete package.");
          const next = packageList.filter((item) => item.id !== packageToDelete.id);
          setPackageList(next);
          setSelected(next[0] ?? null);
          setItineraryText(JSON.stringify(next[0]?.itinerary ?? [], null, 2));
        } catch (deleteError) {
          setError(deleteError instanceof Error ? deleteError.message : "Unable to delete package.");
          throw deleteError;
        } finally {
          setSaving(false);
        }
      },
    });
  };

  const update = (changes: Partial<TourPackage>) => setSelected((current) => current ? { ...current, ...changes } : current);
  const updateAccess = (key: keyof TourPackage["accessibility"], value: string) => setSelected((current) => current ? { ...current, accessibility: { ...current.accessibility, [key]: value } } : current);

  return <><section className="admin-section-head"><div><h2>Tour package CMS</h2><p>Control what travellers see and book on the Kay Poh website.</p></div><button className="admin-primary" onClick={createPackage}>＋ Create package</button></section><div className="cms-layout"><section className="admin-card package-list"><header><div><h3>All packages</h3><p>{packageList.length} package records</p></div></header>{packageList.map((item) => <button className={!isNew && selected?.id === item.id ? "active" : ""} onClick={() => choosePackage(item)} key={item.id}><span className={`cms-thumb ${item.color}`}>{item.days}</span><div><strong>{item.title}</strong><small>{item.currency}{item.price} per person</small></div><Status>{item.published ? "Published" : "Draft"}</Status></button>)}</section>{selected ? <section className="admin-card cms-editor"><header><div><p className="admin-eyebrow">{isNew ? "Creating package" : `Editing ${selected.id}`}</p><h3>{selected.title}</h3></div>{!isNew && <button className="cms-delete" onClick={removePackage} disabled={saving}>Delete</button>}</header><div className="editor-preview"><span className={`cms-hero ${selected.color}`}>{selected.days}</span><div><label>Package name<input value={selected.title} onChange={(event) => update({ title: event.target.value })} /></label><div className="editor-row"><label>Price (RM)<input type="number" min="0" value={selected.price} onChange={(event) => update({ price: Number(event.target.value) })} /></label><label>Duration<input value={selected.days} onChange={(event) => update({ days: event.target.value })} /></label></div><label>Card tag<input value={selected.tag} onChange={(event) => update({ tag: event.target.value })} /></label><label>Colour<select value={selected.color} onChange={(event) => update({ color: event.target.value })}><option>package-coral</option><option>package-gold</option><option>package-sage</option></select></label><label>Short description<textarea value={selected.description} onChange={(event) => update({ description: event.target.value })} rows={3} /></label></div></div><div className="cms-fields"><label>Highlights<input value={selected.highlights.join(", ")} onChange={(event) => update({ highlights: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} /><small>Separate with commas</small></label><label>Package includes<input value={selected.includes.join(", ")} onChange={(event) => update({ includes: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} /><small>Separate with commas</small></label><div className="cms-access-grid"><label>Mobility<input value={selected.accessibility.mobility} onChange={(event) => updateAccess("mobility", event.target.value)} /></label><label>Pace<input value={selected.accessibility.pace} onChange={(event) => updateAccess("pace", event.target.value)} /></label><label>Support<input value={selected.accessibility.support} onChange={(event) => updateAccess("support", event.target.value)} /></label><label>Venue standard<input value={selected.accessibility.venue} onChange={(event) => updateAccess("venue", event.target.value)} /></label></div><label>Itinerary JSON<textarea className="cms-json" value={itineraryText} onChange={(event) => setItineraryText(event.target.value)} rows={12} spellCheck={false} /></label><small>Each day needs day, label, title, and an items array containing time, activity, and note.</small>{error && <p className="guide-form-error" role="alert">{error}</p>}</div><footer><label className="publish-toggle"><input type="checkbox" checked={selected.published} onChange={(event) => update({ published: event.target.checked })} /><span /> {selected.published ? "Published on website" : "Saved as draft"}</label><div className="cms-footer-actions">{isNew && <button onClick={() => choosePackage(packageList[0])} disabled={!packageList.length || saving}>Cancel</button>}<button className="admin-primary" onClick={savePackage} disabled={saving}>{saving ? "Saving…" : isNew ? "Create package" : "Save changes"}</button></div></footer></section> : <section className="admin-card cms-empty">Create your first package to begin.</section>}</div></>;
}
