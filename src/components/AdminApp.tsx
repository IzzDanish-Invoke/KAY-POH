"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { dashboardMetrics, guideBookingRequests, members, monthlyBookings, packages, tourGuides } from "@/data/data";
import LiveToursAdmin from "@/components/LiveToursAdmin";

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

const money = (value: number) => `RM${value.toLocaleString("en-MY")}`;

function Status({ children }: { children: string }) {
  return <span className={`admin-status status-${children.toLowerCase().replace(" ", "-")}`}>{children}</span>;
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
  return <section id="performance" className="dashboard-performance">
    <section className="admin-section-head"><div><h2>Performance at a glance</h2><p>Track the combinations, people, and packages driving the business.</p></div><select value={period} onChange={(event) => setPeriod(event.target.value)}><option>8 months</option><option>30 days</option><option>This quarter</option></select></section>
    <section className="stats-highlight"><article><p>Total revenue</p><strong>RM137,800</strong><span>↑ 24.3% year to date</span></article><article><p>Booking conversion</p><strong>8.4%</strong><span>↑ 1.2% from last period</span></article><article><p>Repeat travellers</p><strong>31%</strong><span>102 returning members</span></article></section>
    <div className="admin-two-col stats-layout"><section className="admin-card"><header><div><h3>Revenue & bookings</h3><p>{period} performance</p></div><span className="chart-key"><i /> Revenue</span></header><div className="revenue-chart">{monthlyBookings.map((item) => <div key={item.month}><span>{money(item.revenue)}</span><i style={{ height: `${item.revenue / 160}px` }} /><small>{item.month}</small></div>)}</div></section><section className="admin-card ranking"><header><div><h3>Guide leaderboard</h3><p>By guest satisfaction</p></div></header>{tourGuides.map((guide, i) => <div className="rank-row" key={guide.id}><b>{i + 1}</b><span className={`guide-avatar avatar-${guide.color}`}>{guide.initials}</span><div><strong>{guide.name}</strong><small>{guide.tours} tours</small></div><span>★ {guide.rating}</span></div>)}</section></div>
    <section className="admin-card package-performance"><header><div><h3>Package performance</h3><p>Which products are converting best</p></div></header><div className="performance-grid">{packages.map((item, index) => <article key={item.id}><span className={`performance-art ${item.color}`}>{item.days}</span><div><h4>{item.title}</h4><p>{[62, 49, 37][index]} bookings · {money([24738, 22491, 25863][index])}</p><div><i style={{ width: `${[86, 73, 61][index]}%` }} /></div><small>{[86, 73, 61][index]}% capacity</small></div></article>)}</div></section>
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
  const [guideList, setGuideList] = useState([...tourGuides]);
  const [newGuide, setNewGuide] = useState({ name: "", email: "", title: "", languages: "English, Malay", specialties: "Mobility support", bio: "", status: "Available" });
  const pendingCount = Object.values(bookingStatuses).filter((status) => status === "Pending").length;

  const createGuide = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const initials = newGuide.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "NG";
    setGuideList((current) => [...current, {
      id: `KP-G${String(current.length + 1).padStart(3, "0")}`,
      name: newGuide.name,
      initials,
      title: newGuide.title,
      bio: newGuide.bio || "New KAYPOH trip companion profile.",
      languages: newGuide.languages.split(",").map((item) => item.trim()).filter(Boolean),
      specialties: newGuide.specialties.split(",").map((item) => item.trim()).filter(Boolean),
      rating: 0,
      reviews: 0,
      tours: 0,
      acceptance: 0,
      status: newGuide.status,
      color: "aqua",
    }]);
    setShowCreate(false);
    setNewGuide({ name: "", email: "", title: "", languages: "English, Malay", specialties: "Mobility support", bio: "", status: "Available" });
  };

  return <>
    <section className="admin-section-head"><div><h2>Tour guides & bookings</h2><p>Manage local companions and supervise their incoming booking requests.</p></div>{tab === "guides" && <button className="admin-primary" onClick={() => setShowCreate(true)}>＋ Add guide</button>}</section>
    <div className="module-tabs"><button className={tab === "guides" ? "active" : ""} onClick={() => setTab("guides")}>Tour guide directory</button><button className={tab === "requests" ? "active" : ""} onClick={() => setTab("requests")}>Booking requests <b>{pendingCount}</b></button></div>
    {tab === "guides" ? <div className="guide-grid">{guideList.map((guide) => <article className="guide-card" key={guide.id}><div className="guide-card-top"><span className={`guide-avatar large avatar-${guide.color}`}>{guide.initials}</span><Status>{guide.status}</Status></div><h3>{guide.name}</h3><p className="guide-title">{guide.title}</p><p className="guide-bio">{guide.bio}</p><div className="guide-tags">{guide.specialties.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="guide-numbers"><span><strong>{guide.reviews ? `★ ${guide.rating}` : "New"}</strong><small>{guide.reviews} reviews</small></span><span><strong>{guide.tours}</strong><small>Tours</small></span><span><strong>{guide.acceptance}%</strong><small>Accept rate</small></span></div><footer><span>{guide.languages.join(" · ")}</span><button>View profile →</button></footer></article>)}</div> : <section className="booking-request-list">{guideBookingRequests.map((booking) => <article className="booking-request" key={booking.id}><div className="request-date"><small>TRIP DATES</small><strong>{booking.date}</strong><span>{booking.guests} guest{booking.guests > 1 ? "s" : ""}</span></div><div className="request-main"><div><span className="booking-id">{booking.id}</span><h3>{booking.packageName}</h3><p>Requested by <strong>{booking.member}</strong> · Assigned to <strong>{booking.guide}</strong></p></div><strong>{money(booking.value)}</strong></div><div className="request-actions"><Status>{bookingStatuses[booking.id]}</Status></div></article>)}</section>}
    {showCreate && <div className="guide-modal-backdrop" onMouseDown={() => setShowCreate(false)}><section className="guide-create-modal" role="dialog" aria-modal="true" aria-labelledby="create-guide-title" onMouseDown={(event) => event.stopPropagation()}><header><div><p className="admin-eyebrow">New team member</p><h2 id="create-guide-title">Create tour guide</h2></div><button onClick={() => setShowCreate(false)} aria-label="Close create guide form">×</button></header><form onSubmit={createGuide}><div className="guide-form-grid"><label>Full name<input required value={newGuide.name} onChange={(event) => setNewGuide({ ...newGuide, name: event.target.value })} placeholder="e.g. Aina Rahman" /></label><label>Email address<input required type="email" value={newGuide.email} onChange={(event) => setNewGuide({ ...newGuide, email: event.target.value })} placeholder="aina@kaypoh.my" /></label><label className="form-wide">Guide title<input required value={newGuide.title} onChange={(event) => setNewGuide({ ...newGuide, title: event.target.value })} placeholder="e.g. Access-trained heritage companion" /></label><label>Languages<input value={newGuide.languages} onChange={(event) => setNewGuide({ ...newGuide, languages: event.target.value })} /><small>Separate with commas</small></label><label>Support specialties<input value={newGuide.specialties} onChange={(event) => setNewGuide({ ...newGuide, specialties: event.target.value })} /><small>Separate with commas</small></label><label className="form-wide">Short biodata<textarea rows={4} value={newGuide.bio} onChange={(event) => setNewGuide({ ...newGuide, bio: event.target.value })} placeholder="Training, experience, and approach to supporting OKU travellers…" /></label><label>Initial availability<select value={newGuide.status} onChange={(event) => setNewGuide({ ...newGuide, status: event.target.value })}><option>Available</option><option>Off duty</option></select></label></div><footer><button type="button" onClick={() => setShowCreate(false)}>Cancel</button><button className="admin-primary" type="submit">Create guide →</button></footer></form></section></div>}
  </>;
}

function BookingTable({ rows, statuses }: { rows: typeof guideBookingRequests; statuses: Record<string, BookingStatus> }) {
  return <div className="table-scroll"><table className="admin-table compact"><thead><tr><th>Booking</th><th>Trip</th><th>Guide</th><th>Dates</th><th>Value</th><th>Status</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}><td><strong>{row.id}</strong><small>{row.member}</small></td><td>{row.packageName}</td><td>{row.guide}</td><td>{row.date}</td><td>{money(row.value)}</td><td><Status>{statuses[row.id]}</Status></td></tr>)}</tbody></table></div>;
}

function PackageCms() {
  const [selected, setSelected] = useState(packages[0]);
  const [published, setPublished] = useState<Record<string, boolean>>(() => Object.fromEntries(packages.map((item) => [item.id, true])));
  return <><section className="admin-section-head"><div><h2>Tour package CMS</h2><p>Control what travellers see and book on the Kay Poh website.</p></div><button className="admin-primary">＋ Create package</button></section><div className="cms-layout"><section className="admin-card package-list"><header><div><h3>All packages</h3><p>{packages.length} package records</p></div></header>{packages.map((item) => <button className={selected.id === item.id ? "active" : ""} onClick={() => setSelected(item)} key={item.id}><span className={`cms-thumb ${item.color}`}>{item.days}</span><div><strong>{item.title}</strong><small>{item.currency}{item.price} per person</small></div><Status>{published[item.id] ? "Published" : "Draft"}</Status></button>)}</section><section className="admin-card cms-editor"><header><div><p className="admin-eyebrow">Editing package</p><h3>{selected.title}</h3></div><button className="dots">•••</button></header><div className="editor-preview"><span className={`cms-hero ${selected.color}`}>{selected.days}</span><div><label>Package name<input value={selected.title} readOnly /></label><div className="editor-row"><label>Price<input value={`${selected.currency}${selected.price}`} readOnly /></label><label>Duration<input value={selected.days} readOnly /></label></div><label>Short description<textarea value={selected.description} readOnly rows={3} /></label></div></div><div className="cms-itinerary"><h4>Itinerary structure</h4>{selected.itinerary.map((day) => <div key={day.day}><span>{day.label}</span><strong>{day.title}</strong><small>{day.items.length} activities</small><button>✎</button></div>)}</div><footer><label className="publish-toggle"><input type="checkbox" checked={published[selected.id]} onChange={(event) => setPublished((current) => ({ ...current, [selected.id]: event.target.checked }))} /><span /> {published[selected.id] ? "Published on website" : "Saved as draft"}</label><button className="admin-primary">Save changes</button></footer></section></div></>;
}
