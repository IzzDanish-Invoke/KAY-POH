"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { dashboardMetrics, guideBookingRequests, members, monthlyBookings, packages, tourGuides } from "@/data/data";

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: "⌂", badge: undefined },
  { id: "stats", label: "Stats & reports", icon: "↗", badge: undefined },
  { id: "members", label: "Members", icon: "♙", badge: undefined },
  { id: "guides", label: "Tour guides", icon: "◎", badge: "2" },
  { id: "packages", label: "Package CMS", icon: "▣", badge: undefined },
] as const;

type PageId = (typeof navigation)[number]["id"];
type BookingStatus = "Pending" | "Accepted" | "Declined" | "Completed";

const money = (value: number) => `RM${value.toLocaleString("en-MY")}`;

function Status({ children }: { children: string }) {
  return <span className={`admin-status status-${children.toLowerCase().replace(" ", "-")}`}>{children}</span>;
}

export default function AdminApp() {
  const [active, setActive] = useState<PageId>("dashboard");
  const [mobileNav, setMobileNav] = useState(false);
  const [bookingStatuses, setBookingStatuses] = useState<Record<string, BookingStatus>>(() => Object.fromEntries(guideBookingRequests.map((item) => [item.id, item.status as BookingStatus])));

  const pageName = navigation.find((item) => item.id === active)?.label ?? "Dashboard";

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${mobileNav ? "is-open" : ""}`}>
        <div className="admin-logo"><Image src="/brand/kaypoh-white-outline.png" alt="Kay Poh" width={90} height={81} /><span>ADMIN</span></div>
        <nav aria-label="Admin navigation">
          {navigation.map((item) => <button key={item.id} className={active === item.id ? "active" : ""} onClick={() => { setActive(item.id); setMobileNav(false); }}><span className="nav-symbol">{item.icon}</span>{item.label}{item.badge && <b>{item.badge}</b>}</button>)}
        </nav>
        <div className="sidebar-bottom"><Link href="/">← View website</Link><div className="admin-person"><span>BY</span><div><strong>Bunty</strong><small>Administrator</small></div><i>•••</i></div></div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar"><button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)} aria-label="Toggle menu">☰</button><div><p>Kay Poh workspace</p><h1>{pageName}</h1></div><div className="topbar-actions"><button aria-label="Notifications">♢<b>3</b></button><span>14 Aug 2026</span></div></header>
        <main className="admin-main">
          {active === "dashboard" && <Dashboard goTo={setActive} bookingStatuses={bookingStatuses} />}
          {active === "stats" && <Stats />}
          {active === "members" && <Members />}
          {active === "guides" && <Guides bookingStatuses={bookingStatuses} setBookingStatuses={setBookingStatuses} />}
          {active === "packages" && <PackageCms />}
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
      <section className="admin-card"><header><div><h3>Booking overview</h3><p>Monthly confirmed bookings</p></div><button onClick={() => goTo("stats")}>View report →</button></header><MiniChart /></section>
      <section className="admin-card attention-card"><header><div><h3>Needs attention</h3><p>Items waiting for action</p></div></header><button onClick={() => goTo("guides")}><span className="attention-icon red">◎</span><div><strong>{pending} guide requests</strong><small>Waiting to be accepted</small></div><b>→</b></button><button onClick={() => goTo("members")}><span className="attention-icon orange">♙</span><div><strong>5 new members</strong><small>Joined in the last 7 days</small></div><b>→</b></button><button onClick={() => goTo("packages")}><span className="attention-icon blue">▣</span><div><strong>1 draft package</strong><small>Not visible on the website</small></div><b>→</b></button></section>
    </div>
    <section className="admin-card dashboard-bookings"><header><div><h3>Recent bookings</h3><p>Latest customer activity</p></div><button onClick={() => goTo("guides")}>See all bookings →</button></header><BookingTable rows={guideBookingRequests.slice(0, 4)} statuses={bookingStatuses} /></section>
  </>;
}

function MiniChart() {
  const max = Math.max(...monthlyBookings.map((item) => item.bookings));
  return <div className="mini-chart">{monthlyBookings.map((item) => <div className="bar-column" key={item.month}><strong>{item.bookings}</strong><div style={{ height: `${(item.bookings / max) * 145}px` }} /><span>{item.month}</span></div>)}</div>;
}

function Stats() {
  const [period, setPeriod] = useState("8 months");
  return <>
    <section className="admin-section-head"><div><h2>Performance at a glance</h2><p>Track the combinations, people, and packages driving the business.</p></div><select value={period} onChange={(event) => setPeriod(event.target.value)}><option>8 months</option><option>30 days</option><option>This quarter</option></select></section>
    <section className="stats-highlight"><article><p>Total revenue</p><strong>RM137,800</strong><span>↑ 24.3% year to date</span></article><article><p>Booking conversion</p><strong>8.4%</strong><span>↑ 1.2% from last period</span></article><article><p>Repeat travellers</p><strong>31%</strong><span>102 returning members</span></article></section>
    <div className="admin-two-col stats-layout"><section className="admin-card"><header><div><h3>Revenue & bookings</h3><p>{period} performance</p></div><span className="chart-key"><i /> Revenue</span></header><div className="revenue-chart">{monthlyBookings.map((item) => <div key={item.month}><span>{money(item.revenue)}</span><i style={{ height: `${item.revenue / 160}px` }} /><small>{item.month}</small></div>)}</div></section><section className="admin-card ranking"><header><div><h3>Guide leaderboard</h3><p>By guest satisfaction</p></div></header>{tourGuides.map((guide, i) => <div className="rank-row" key={guide.id}><b>{i + 1}</b><span className={`guide-avatar avatar-${guide.color}`}>{guide.initials}</span><div><strong>{guide.name}</strong><small>{guide.tours} tours</small></div><span>★ {guide.rating}</span></div>)}</section></div>
    <section className="admin-card package-performance"><header><div><h3>Package performance</h3><p>Which products are converting best</p></div></header><div className="performance-grid">{packages.map((item, index) => <article key={item.id}><span className={`performance-art ${item.color}`}>{item.days}</span><div><h4>{item.title}</h4><p>{[62, 49, 37][index]} bookings · {money([24738, 22491, 25863][index])}</p><div><i style={{ width: `${[86, 73, 61][index]}%` }} /></div><small>{[86, 73, 61][index]}% capacity</small></div></article>)}</div></section>
  </>;
}

function Members() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => members.filter((member) => `${member.name} ${member.email} ${member.id}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <><section className="admin-section-head"><div><h2>Member management</h2><p>{members.length} travellers currently in your community.</p></div><button className="admin-primary">＋ Add member</button></section><div className="table-tools"><label>⌕<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search member, email, or ID" /></label><button>Filter ≡</button><button>Export ↓</button></div><section className="admin-card data-table-card"><table className="admin-table"><thead><tr><th>Member</th><th>Member ID</th><th>Joined</th><th>Bookings</th><th>Total spent</th><th>Status</th><th /></tr></thead><tbody>{filtered.map((member) => <tr key={member.id}><td><div className="member-cell"><span>{member.initials}</span><div><strong>{member.name}</strong><small>{member.email}</small></div></div></td><td>{member.id}</td><td>{member.joined}</td><td>{member.bookings}</td><td>{money(member.spent)}</td><td><Status>{member.status}</Status></td><td><button className="dots">•••</button></td></tr>)}</tbody></table>{filtered.length === 0 && <p className="empty-state">No members match “{query}”.</p>}</section></>;
}

function Guides({ bookingStatuses, setBookingStatuses }: { bookingStatuses: Record<string, BookingStatus>; setBookingStatuses: React.Dispatch<React.SetStateAction<Record<string, BookingStatus>>> }) {
  const [tab, setTab] = useState<"guides" | "requests">("requests");
  const changeStatus = (id: string, status: BookingStatus) => setBookingStatuses((current) => ({ ...current, [id]: status }));
  return <><section className="admin-section-head"><div><h2>Tour guides & bookings</h2><p>Manage your local experts and their incoming trip requests.</p></div><button className="admin-primary">＋ Add guide</button></section><div className="module-tabs"><button className={tab === "requests" ? "active" : ""} onClick={() => setTab("requests")}>Booking requests <b>{Object.values(bookingStatuses).filter((s) => s === "Pending").length}</b></button><button className={tab === "guides" ? "active" : ""} onClick={() => setTab("guides")}>Guide directory</button></div>
    {tab === "requests" ? <section className="booking-request-list">{guideBookingRequests.map((booking) => <article className="booking-request" key={booking.id}><div className="request-date"><small>TRIP DATES</small><strong>{booking.date}</strong><span>{booking.guests} guest{booking.guests > 1 ? "s" : ""}</span></div><div className="request-main"><div><span className="booking-id">{booking.id}</span><h3>{booking.packageName}</h3><p>Requested by <strong>{booking.member}</strong> · Assigned to <strong>{booking.guide}</strong></p></div><strong>{money(booking.value)}</strong></div><div className="request-actions"><Status>{bookingStatuses[booking.id]}</Status>{bookingStatuses[booking.id] === "Pending" && <><button className="decline" onClick={() => changeStatus(booking.id, "Declined")}>Decline</button><button className="accept" onClick={() => changeStatus(booking.id, "Accepted")}>Accept booking</button></>}</div></article>)}</section> : <div className="guide-grid">{tourGuides.map((guide) => <article className="guide-card" key={guide.id}><div className="guide-card-top"><span className={`guide-avatar large avatar-${guide.color}`}>{guide.initials}</span><Status>{guide.status}</Status></div><h3>{guide.name}</h3><p className="guide-title">{guide.title}</p><p className="guide-bio">{guide.bio}</p><div className="guide-tags">{guide.specialties.map((tag) => <span key={tag}>{tag}</span>)}</div><div className="guide-numbers"><span><strong>★ {guide.rating}</strong><small>{guide.reviews} reviews</small></span><span><strong>{guide.tours}</strong><small>Tours</small></span><span><strong>{guide.acceptance}%</strong><small>Accept rate</small></span></div><footer><span>{guide.languages.join(" · ")}</span><button>View profile →</button></footer></article>)}</div>}
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
