"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  guideBookingRequests,
  liveRatingResponses as initialRatingResponses,
  liveTours as initialLiveTours,
  members as initialMembers,
  packages,
  tourGuides,
} from "@/data/data";
import LiveToursAdmin from "@/components/LiveToursAdmin";
import type { TourGuide } from "@/types/tour-guide";
import type { TourPackage } from "@/types/tour-package";
import type { Member } from "@/types/member";
import type { Booking, BookingStatus } from "@/types/booking";
import type { LiveTour, RatingResponse } from "@/types/live-tour";

const navigation = [
  { id: "dashboard", label: "Dashboard", icon: "⌂", badge: undefined },
  { id: "live", label: "Live tours", icon: "◉", badge: "2" },
  { id: "members", label: "Members", icon: "♙", badge: undefined },
  { id: "guides", label: "Tour guides", icon: "◎", badge: "2" },
  { id: "packages", label: "Package CMS", icon: "▣", badge: undefined },
] as const;

type PageId = (typeof navigation)[number]["id"];
type WorkspaceRole = "admin" | "guide";
type DeleteConfirmation = {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => Promise<void>;
};

const DELETE_CONFIRMATION_EVENT = "kaypoh-admin-delete-confirmation";

function requestDeleteConfirmation(detail: DeleteConfirmation) {
  window.dispatchEvent(
    new CustomEvent<DeleteConfirmation>(DELETE_CONFIRMATION_EVENT, { detail }),
  );
}

const money = (value: number | null | undefined) =>
  `RM${Number.isFinite(value) ? Number(value).toLocaleString("en-MY") : "0"}`;

function Status({ children }: { children: string }) {
  return (
    <span
      className={`admin-status status-${children.toLowerCase().replace(" ", "-")}`}
    >
      {children}
    </span>
  );
}

function AdminDeleteConfirmation() {
  const [confirmation, setConfirmation] = useState<DeleteConfirmation | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);
  const [confirmError, setConfirmError] = useState("");

  useEffect(() => {
    const open = (event: Event) => {
      setConfirmError("");
      setConfirmation((event as CustomEvent<DeleteConfirmation>).detail);
    };
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
      setConfirmError(
        error instanceof Error
          ? error.message
          : "Unable to complete the deletion.",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className="admin-confirm-backdrop"
      onMouseDown={() => !deleting && setConfirmation(null)}
    >
      <section
        className="admin-confirm-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="admin-confirm-title"
        aria-describedby="admin-confirm-message"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <span className="admin-confirm-icon">!</span>
        <p className="admin-eyebrow">Please confirm</p>
        <h2 id="admin-confirm-title">{confirmation.title}</h2>
        <p id="admin-confirm-message">{confirmation.message}</p>
        {confirmError && (
          <p className="admin-confirm-error" role="alert">
            {confirmError}
          </p>
        )}
        <footer>
          <button
            type="button"
            disabled={deleting}
            onClick={() => setConfirmation(null)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="confirm-delete"
            disabled={deleting}
            onClick={confirm}
          >
            {deleting ? "Deleting…" : confirmation.confirmLabel}
          </button>
        </footer>
      </section>
    </div>
  );
}

export default function AdminApp() {
  const [active, setActive] = useState<PageId>("dashboard");
  const [role, setRole] = useState<WorkspaceRole>("admin");
  const [mobileNav, setMobileNav] = useState(false);
  const [bookingStatuses, setBookingStatuses] = useState<
    Record<string, BookingStatus>
  >(() =>
    Object.fromEntries(
      guideBookingRequests.map((item) => [
        item.id,
        item.status as BookingStatus,
      ]),
    ),
  );
  const [bookings, setBookings] = useState<Booking[]>(guideBookingRequests as Booking[]);
  const [memberRecords, setMemberRecords] = useState<Member[]>(initialMembers as Member[]);
  const [ratingResponses, setRatingResponses] = useState<RatingResponse[]>(initialRatingResponses as RatingResponse[]);
  const [liveTourRecords, setLiveTourRecords] = useState<LiveTour[]>(initialLiveTours as LiveTour[]);
  useEffect(() => { const controller = new AbortController(); Promise.all([
    fetch("/api/bookings", { cache: "no-store", signal: controller.signal }).then((response) => response.ok ? response.json() as Promise<Booking[]> : Promise.reject()),
    fetch("/api/members", { cache: "no-store", signal: controller.signal }).then((response) => response.ok ? response.json() as Promise<Member[]> : Promise.reject()),
    fetch("/api/rating-responses", { cache: "no-store", signal: controller.signal }).then((response) => response.ok ? response.json() as Promise<RatingResponse[]> : Promise.reject()),
    fetch("/api/live-tours", { cache: "no-store", signal: controller.signal }).then((response) => response.ok ? response.json() as Promise<LiveTour[]> : Promise.reject()),
  ]).then(([nextBookings, nextMembers, nextResponses, nextTours]) => { setBookings(nextBookings); setBookingStatuses(Object.fromEntries(nextBookings.map((item) => [item.id, item.status]))); setMemberRecords(nextMembers); setRatingResponses(nextResponses); setLiveTourRecords(nextTours); }).catch(() => undefined); return () => controller.abort(); }, []);

  const visibleNavigation =
    role === "admin"
      ? navigation
      : navigation.filter((item) =>
          ["dashboard", "live", "guides"].includes(item.id),
        );
  const guideLabels: Partial<Record<PageId, string>> = {
    dashboard: "My overview",
    live: "My live tour",
    guides: "My bookings",
  };
  const pageName =
    role === "guide"
      ? (guideLabels[active] ?? "My overview")
      : (navigation.find((item) => item.id === active)?.label ?? "Dashboard");
  const switchRole = (nextRole: WorkspaceRole) => {
    setRole(nextRole);
    setActive("dashboard");
    setMobileNav(false);
  };
  const pendingRequests = Object.values(bookingStatuses).filter((status) => status === "Pending").length;
  const activeTourCount = new Set(liveTourRecords.filter((tour) => ["Live", "Starting soon"].includes(tour.status)).map((tour) => tour.bookingId)).size;
  const notificationCount = pendingRequests + activeTourCount;
  const todayLabel = new Intl.DateTimeFormat("en-MY", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kuala_Lumpur" }).format(new Date());

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${mobileNav ? "is-open" : ""}`}>
        <div className="admin-logo">
          <Image
            src="/brand/kaypoh-white-outline.png"
            alt="Kay Poh"
            width={90}
            height={81}
          />
          <span>{role === "admin" ? "ADMIN" : "GUIDE"}</span>
        </div>
        <nav aria-label="Admin navigation">
          {visibleNavigation.map((item) => (
            <button
              key={item.id}
              className={active === item.id ? "active" : ""}
              onClick={() => {
                setActive(item.id);
                setMobileNav(false);
              }}
            >
              <span className="nav-symbol">{item.icon}</span>
              {role === "guide" ? guideLabels[item.id] : item.label}
              {(item.id === "live" ? activeTourCount : item.id === "guides" ? pendingRequests : 0) > 0 && <b>{item.id === "live" ? activeTourCount : pendingRequests}</b>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Link href="/">← View website</Link>
          <div className="admin-person">
            <span>{role === "admin" ? "BY" : "ML"}</span>
            <div>
              <strong>{role === "admin" ? "Bunty" : "Mei Ling Tan"}</strong>
              <small>
                {role === "admin" ? "Supervisor" : "Trip companion"}
              </small>
            </div>
            <i>•••</i>
          </div>
        </div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <button
            className="mobile-menu"
            onClick={() => setMobileNav(!mobileNav)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <div>
            <p>
              {role === "admin"
                ? "Supervisor workspace"
                : "Tour guide workspace"}
            </p>
            <h1>{pageName}</h1>
          </div>
          <div className="topbar-actions">
            <div className="role-switch" aria-label="Demo workspace role">
              <button
                className={role === "admin" ? "active" : ""}
                onClick={() => switchRole("admin")}
              >
                Admin
              </button>
              <button
                className={role === "guide" ? "active" : ""}
                onClick={() => switchRole("guide")}
              >
                Tour guide
              </button>
            </div>
            <button aria-label="Notifications">
              ♢{notificationCount > 0 && <b>{notificationCount}</b>}
            </button>
            <span>{todayLabel}</span>
          </div>
        </header>
        <main className="admin-main">
          {active === "dashboard" &&
            (role === "admin" ? (
              <>
                <Dashboard goTo={setActive} bookings={bookings} bookingStatuses={bookingStatuses} members={memberRecords} responses={ratingResponses} tours={liveTourRecords} />
                <Stats bookings={bookings} bookingStatuses={bookingStatuses} members={memberRecords} responses={ratingResponses} tours={liveTourRecords} />
              </>
            ) : (
              <GuideDashboard
                goTo={setActive}
                bookings={bookings}
                bookingStatuses={bookingStatuses}
              />
            ))}
          {active === "live" && <LiveToursAdmin role={role} />}
          {active === "members" && role === "admin" && <Members />}
          {active === "guides" &&
            (role === "admin" ? (
              <div className="supervisor-readonly">
                <Guides bookings={bookings} bookingStatuses={bookingStatuses} />
              </div>
            ) : (
              <GuideBookings
                bookings={bookings}
                bookingStatuses={bookingStatuses}
                setBookingStatuses={setBookingStatuses}
                setBookings={setBookings}
              />
            ))}
          {active === "packages" && role === "admin" && <PackageCms />}
        </main>
      </div>
      {mobileNav && (
        <button
          className="sidebar-scrim"
          aria-label="Close menu"
          onClick={() => setMobileNav(false)}
        />
      )}
      <AdminDeleteConfirmation />
    </div>
  );
}

function Dashboard({
  goTo,
  bookings,
  bookingStatuses,
  members,
  responses,
  tours,
}: {
  goTo: (page: PageId) => void;
  bookings: Booking[];
  bookingStatuses: Record<string, BookingStatus>;
  members: Member[];
  responses: RatingResponse[];
  tours: LiveTour[];
}) {
  const [renderTimestamp] = useState(() => Date.now());
  const pending = Object.values(bookingStatuses).filter(
    (status) => status === "Pending",
  ).length;
  const statusOf = (booking: Booking) => bookingStatuses[booking.id] ?? booking.status;
  const confirmed = bookings.filter((booking) => ["Accepted", "Completed"].includes(statusOf(booking)));
  const latestTimestamp = Math.max(...bookings.map((booking) => Date.parse(booking.createdAt) || 0), renderTimestamp);
  const latestDate = new Date(latestTimestamp);
  const currentMonth = confirmed.filter((booking) => { const date = new Date(booking.createdAt); return date.getUTCFullYear() === latestDate.getUTCFullYear() && date.getUTCMonth() === latestDate.getUTCMonth(); });
  const monthRevenue = currentMonth.reduce((sum, booking) => sum + booking.value, 0);
  const activeTravellers = confirmed.filter((booking) => statusOf(booking) === "Accepted").reduce((sum, booking) => sum + booking.guests, 0);
  const averageRating = responses.length ? responses.reduce((sum, response) => sum + response.rating, 0) / responses.length : 0;
  const metrics = [
    { id: "revenue", label: "Confirmed revenue this month", value: money(monthRevenue), note: `${currentMonth.length} confirmed bookings` },
    { id: "bookings", label: "Total booking requests", value: String(bookings.length), note: `${pending} awaiting guides` },
    { id: "travellers", label: "Upcoming travellers", value: String(activeTravellers), note: `${confirmed.length} confirmed tours` },
    { id: "rating", label: "Average tour rating", value: averageRating ? averageRating.toFixed(2) : "—", note: `${responses.length} responses` },
  ];
  const sevenDaysAgo = latestTimestamp - 7 * 86400000;
  const newMembers = members.filter((member) => (Date.parse(member.joined) || 0) >= sevenDaysAgo).length;
  const draftPackages = (packages as TourPackage[]).filter((item) => !item.published).length;
  const activeTours = new Set(tours.filter((tour) => ["Live", "Starting soon"].includes(tour.status)).map((tour) => tour.bookingId)).size;
  return (
    <>
      <section className="admin-welcome">
        <div>
          <p className="admin-eyebrow">Friday, 14 August</p>
          <h2>Selamat petang, Bunty!</h2>
          <p>Here’s what’s happening across Kay Poh today.</p>
        </div>
        <button className="admin-primary" onClick={() => goTo("packages")}>
          ＋ New package
        </button>
      </section>
      <section className="metric-grid">
        {metrics.map((item, index) => (
          <article key={item.id}>
            <div className={`metric-icon metric-${index}`}>
              {["RM", "▤", "♙", "★"][index]}
            </div>
            <p>{item.label}</p>
            <strong>{item.value}</strong>
            <span>{item.note}</span>
          </article>
        ))}
      </section>
      <div className="admin-two-col">
        <section className="admin-card">
          <header>
            <div>
              <h3>Booking overview</h3>
              <p>Monthly confirmed bookings</p>
            </div>
            <button
              onClick={() =>
                document
                  .getElementById("performance")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Detailed analytics ↓
            </button>
          </header>
          <MiniChart bookings={bookings} bookingStatuses={bookingStatuses} />
        </section>
        <section className="admin-card attention-card">
          <header>
            <div>
              <h3>Needs attention</h3>
              <p>Items waiting for action</p>
            </div>
          </header>
          <button onClick={() => goTo("guides")}>
            <span className="attention-icon red">◎</span>
            <div>
              <strong>{pending} guide requests</strong>
              <small>Waiting to be accepted</small>
            </div>
            <b>→</b>
          </button>
          <button onClick={() => goTo("members")}>
            <span className="attention-icon orange">♙</span>
            <div>
              <strong>{newMembers} new members</strong>
              <small>Joined in the last 7 days</small>
            </div>
            <b>→</b>
          </button>
          <button onClick={() => goTo("packages")}>
            <span className="attention-icon blue">▣</span>
            <div>
              <strong>{draftPackages} draft packages</strong>
              <small>Not visible on the website</small>
            </div>
            <b>→</b>
          </button>
          <button onClick={() => goTo("live")}>
            <span className="attention-icon blue">◉</span>
            <div><strong>{activeTours} tours active soon</strong><small>Live or starting soon</small></div><b>→</b>
          </button>
        </section>
      </div>
      <section className="admin-card dashboard-bookings">
        <header>
          <div>
            <h3>Recent bookings</h3>
            <p>Latest customer activity</p>
          </div>
          <button onClick={() => goTo("guides")}>See all bookings →</button>
        </header>
        <BookingTable
          rows={bookings.slice(0, 4)}
          statuses={bookingStatuses}
        />
      </section>
    </>
  );
}

function bookingMonths(bookings: Booking[], count = 8) {
  const anchorValue = Math.max(...bookings.map((item) => Date.parse(item.createdAt) || 0), 0);
  const anchor = new Date(anchorValue); anchor.setUTCDate(1);
  return Array.from({ length: count }, (_, index) => { const date = new Date(Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth() - (count - index - 1), 1)); return { key: `${date.getUTCFullYear()}-${date.getUTCMonth()}`, month: new Intl.DateTimeFormat("en-MY", { month: "short", timeZone: "UTC" }).format(date), bookings: 0, revenue: 0 }; });
}

function MiniChart({ bookings, bookingStatuses }: { bookings: Booking[]; bookingStatuses: Record<string, BookingStatus> }) {
  const months = bookingMonths(bookings);
  bookings.filter((item) => ["Accepted", "Completed"].includes(bookingStatuses[item.id] ?? item.status)).forEach((booking) => { const date = new Date(booking.createdAt); const month = months.find((item) => item.key === `${date.getUTCFullYear()}-${date.getUTCMonth()}`); if (month) month.bookings += 1; });
  const max = Math.max(...months.map((item) => item.bookings), 1);
  return (
    <div className="mini-chart">
      {months.map((item) => (
        <div className="bar-column" key={item.key}>
          <strong>{item.bookings}</strong>
          <div style={{ height: `${(item.bookings / max) * 145}px` }} />
          <span>{item.month}</span>
        </div>
      ))}
    </div>
  );
}

function GuideDashboard({
  goTo,
  bookings,
  bookingStatuses,
}: {
  goTo: (page: PageId) => void;
  bookings: Booking[];
  bookingStatuses: Record<string, BookingStatus>;
}) {
  const myBookings = bookings.filter(
    (item) => item.guideId === "KP-G001",
  );
  const pending = myBookings.filter(
    (item) => bookingStatuses[item.id] === "Pending",
  ).length;
  const activeBooking = myBookings.find((item) => ["Accepted", "Completed"].includes(bookingStatuses[item.id])) ?? myBookings[0];
  const currentGuide = (tourGuides as TourGuide[]).find((item) => item.id === "KP-G001");
  return (
    <>
      <section className="admin-welcome">
        <div>
          <p className="admin-eyebrow">Your guide workspace</p>
          <h2>Selamat petang, Mei Ling!</h2>
          <p>
            Your next guests arrive soon. Here’s everything you need for today.
          </p>
        </div>
        <button className="admin-primary" onClick={() => goTo("live")}>
          Open live tour →
        </button>
      </section>
      <section className="guide-overview-grid">
        <article>
          <span>◉</span>
          <p>Current tour</p>
          <strong>{activeBooking?.packageName ?? "No assigned tour"}</strong>
          <small>{activeBooking ? `${activeBooking.guests} travellers · ${activeBooking.date}` : "Accepted bookings appear here"}</small>
          <button onClick={() => goTo("live")}>Manage modules & QR →</button>
        </article>
        <article>
          <span>▤</span>
          <p>Pending requests</p>
          <strong>{pending}</strong>
          <small>Needs your response</small>
          <button onClick={() => goTo("guides")}>Review bookings →</button>
        </article>
        <article>
          <span>★</span>
          <p>Your rating</p>
          <strong>{currentGuide?.rating ?? "—"}</strong>
          <small>{currentGuide?.reviews ?? 0} traveller reviews</small>
        </article>
      </section>
      <GuidePerformance bookings={myBookings} bookingStatuses={bookingStatuses} />
      <section className="admin-card dashboard-bookings">
        <header>
          <div>
            <h3>My assigned bookings</h3>
            <p>Only bookings assigned to your guide account</p>
          </div>
          <button onClick={() => goTo("guides")}>Manage bookings →</button>
        </header>
        <BookingTable rows={myBookings} statuses={bookingStatuses} />
      </section>
      <section className="guide-role-note">
        <strong>Tour guide permissions</strong>
        <span>✓ Accept your bookings</span>
        <span>✓ Manage your tour modules</span>
        <span>✓ Generate rating QR codes</span>
        <span>— No access to members, CMS, or company analytics</span>
      </section>
    </>
  );
}

function GuidePerformance({
  bookings,
  bookingStatuses,
}: {
  bookings: Booking[];
  bookingStatuses: Record<string, BookingStatus>;
}) {
  const statusOf = (booking: Booking) => bookingStatuses[booking.id] ?? booking.status;
  const confirmed = bookings.filter((booking) => ["Accepted", "Completed"].includes(statusOf(booking)));
  const completed = bookings.filter((booking) => statusOf(booking) === "Completed");
  const pending = bookings.filter((booking) => statusOf(booking) === "Pending");
  const decided = bookings.filter((booking) => statusOf(booking) !== "Pending");
  const revenue = confirmed.reduce((sum, booking) => sum + booking.value, 0);
  const completedRevenue = completed.reduce((sum, booking) => sum + booking.value, 0);
  const pendingRevenue = pending.reduce((sum, booking) => sum + booking.value, 0);
  const travellers = confirmed.reduce((sum, booking) => sum + booking.guests, 0);
  const acceptanceRate = decided.length ? Math.round((confirmed.length / decided.length) * 100) : 0;
  const averageValue = confirmed.length ? revenue / confirmed.length : 0;
  const byPackage = Object.values(confirmed.reduce<Record<string, { name: string; revenue: number; tours: number; travellers: number }>>((groups, booking) => {
    const group = groups[booking.packageId] ?? { name: booking.packageName, revenue: 0, tours: 0, travellers: 0 };
    group.revenue += booking.value; group.tours += 1; group.travellers += booking.guests; groups[booking.packageId] = group; return groups;
  }, {})).sort((a, b) => b.revenue - a.revenue);
  const maxPackageRevenue = Math.max(...byPackage.map((item) => item.revenue), 1);

  return <section className="guide-performance">
    <header><div><p className="admin-eyebrow">My performance</p><h2>Statistics & revenue</h2><p>Calculated from your persistent booking requests and their current statuses.</p></div><span>Confirmed booking value</span></header>
    <div className="guide-stat-grid">
      <article className="guide-stat-revenue"><small>Confirmed revenue</small><strong>{money(revenue)}</strong><span>{money(completedRevenue)} from completed tours</span></article>
      <article><small>Confirmed tours</small><strong>{confirmed.length}</strong><span>{completed.length} completed</span></article>
      <article><small>Travellers served</small><strong>{travellers}</strong><span>Across accepted tours</span></article>
      <article><small>Acceptance rate</small><strong>{acceptanceRate}%</strong><span>{decided.length} decided requests</span></article>
      <article><small>Average booking</small><strong>{money(Math.round(averageValue))}</strong><span>Per confirmed tour</span></article>
      <article><small>Pending pipeline</small><strong>{money(pendingRevenue)}</strong><span>{pending.length} awaiting response</span></article>
    </div>
    <div className="guide-revenue-breakdown admin-card"><header><div><h3>Revenue by package</h3><p>Accepted and completed bookings assigned to you</p></div></header>{byPackage.length ? <div>{byPackage.map((item) => <article key={item.name}><div><strong>{item.name}</strong><small>{item.tours} tour{item.tours === 1 ? "" : "s"} · {item.travellers} travellers</small></div><i><b style={{ width: `${(item.revenue / maxPackageRevenue) * 100}%` }} /></i><strong>{money(item.revenue)}</strong></article>)}</div> : <p className="empty-state">Revenue will appear after a booking is accepted.</p>}</div>
  </section>;
}

function Stats({ bookings, bookingStatuses, members, responses, tours }: { bookings: Booking[]; bookingStatuses: Record<string, BookingStatus>; members: Member[]; responses: RatingResponse[]; tours: LiveTour[] }) {
  const [period, setPeriod] = useState("8 months");
  const [renderTimestamp] = useState(() => Date.now());
  const anchor = Math.max(...bookings.map((item) => Date.parse(item.createdAt) || 0), renderTimestamp);
  const periodStart = new Date(anchor);
  if (period === "30 days") periodStart.setUTCDate(periodStart.getUTCDate() - 30); else periodStart.setUTCMonth(periodStart.getUTCMonth() - (period === "This quarter" ? 3 : 8));
  const periodBookings = bookings.filter((item) => (Date.parse(item.createdAt) || 0) >= periodStart.getTime());
  const confirmed = periodBookings.filter((item) => ["Accepted", "Completed"].includes(bookingStatuses[item.id] ?? item.status));
  const totalRevenue = confirmed.reduce((sum, item) => sum + item.value, 0);
  const conversion = periodBookings.length ? Math.round((confirmed.length / periodBookings.length) * 100) : 0;
  const repeatMembers = members.filter((member) => member.bookings > 1).length;
  const repeatRate = members.length ? Math.round((repeatMembers / members.length) * 100) : 0;
  const monthCount = period === "30 days" ? 2 : period === "This quarter" ? 3 : 8;
  const monthly = bookingMonths(bookings, monthCount);
  confirmed.forEach((booking) => { const date = new Date(booking.createdAt); const month = monthly.find((item) => item.key === `${date.getUTCFullYear()}-${date.getUTCMonth()}`); if (month) { month.bookings += 1; month.revenue += booking.value; } });
  const maxRevenue = Math.max(...monthly.map((item) => item.revenue), 1);
  const packagePerformance = (packages as TourPackage[]).map((pkg) => { const records = confirmed.filter((booking) => booking.packageId === pkg.id); return { package: pkg, bookings: records.length, revenue: records.reduce((sum, booking) => sum + booking.value, 0), share: confirmed.length ? Math.round((records.length / confirmed.length) * 100) : 0 }; });
  const guidePerformance = (tourGuides as TourGuide[]).map((guide) => { const records = confirmed.filter((booking) => booking.guideId === guide.id); const tourIds = new Set(tours.filter((tour) => tour.guideId === guide.id).map((tour) => tour.id)); const guideResponses = responses.filter((response) => tourIds.has(response.tourId)); return { guide, tours: records.length, revenue: records.reduce((sum, booking) => sum + booking.value, 0), rating: guideResponses.length ? guideResponses.reduce((sum, response) => sum + response.rating, 0) / guideResponses.length : guide.rating }; }).sort((a, b) => b.revenue - a.revenue || b.rating - a.rating);
  return (
    <section id="performance" className="dashboard-performance">
      <section className="admin-section-head">
        <div>
          <h2>Performance at a glance</h2>
          <p>
            Track the combinations, people, and packages driving the business.
          </p>
        </div>
        <select
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
        >
          <option>8 months</option>
          <option>30 days</option>
          <option>This quarter</option>
        </select>
      </section>
      <section className="stats-highlight">
        <article>
          <p>Total revenue</p>
          <strong>{money(totalRevenue)}</strong>
          <span>{confirmed.length} confirmed bookings</span>
        </article>
        <article>
          <p>Booking confirmation rate</p>
          <strong>{conversion}%</strong>
          <span>{confirmed.length} of {periodBookings.length} requests confirmed</span>
        </article>
        <article>
          <p>Repeat travellers</p>
          <strong>{repeatRate}%</strong>
          <span>{repeatMembers} returning members</span>
        </article>
      </section>
      <div className="admin-two-col stats-layout">
        <section className="admin-card">
          <header>
            <div>
              <h3>Revenue & bookings</h3>
              <p>{period} performance</p>
            </div>
            <span className="chart-key">
              <i /> Revenue
            </span>
          </header>
          <div className="revenue-chart">
            {monthly.map((item) => (
              <div key={item.key}>
                <span>{money(item.revenue)}</span>
                <i style={{ height: `${Math.max((item.revenue / maxRevenue) * 180, item.revenue ? 8 : 0)}px` }} />
                <small>{item.month}</small>
              </div>
            ))}
          </div>
        </section>
        <section className="admin-card ranking">
          <header>
            <div>
              <h3>Guide leaderboard</h3>
              <p>By guest satisfaction</p>
            </div>
          </header>
          {guidePerformance.map(({ guide, tours: guideTours, revenue, rating }, i) => (
            <div className="rank-row" key={guide.id}>
              <b>{i + 1}</b>
              <span className={`guide-avatar avatar-${guide.color}`}>
                {guide.initials}
              </span>
              <div>
                <strong>{guide.name}</strong>
                <small>{guideTours} tours · {money(revenue)}</small>
              </div>
              <span>{rating ? `★ ${rating.toFixed(1)}` : "No ratings"}</span>
            </div>
          ))}
        </section>
      </div>
      <section className="admin-card package-performance">
        <header>
          <div>
            <h3>Package performance</h3>
            <p>Which products are converting best</p>
          </div>
        </header>
        <div className="performance-grid">
          {packagePerformance.map(({ package: item, bookings: packageBookings, revenue, share }) => {
            return (
              <article key={item.id}>
                <span className={`performance-art ${item.color}`}>
                  {item.days}
                </span>
                <div>
                  <h4>{item.title}</h4>
                  <p>
                    {packageBookings} bookings · {money(revenue)}
                  </p>
                  <div>
                    <i style={{ width: `${share}%` }} />
                  </div>
                  <small>{share}% of confirmed bookings</small>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </section>
  );
}

function Members() {
  const [query, setQuery] = useState("");
  const [memberRecords, setMemberRecords] = useState<Member[]>(initialMembers as Member[]);
  useEffect(() => { const controller = new AbortController(); fetch("/api/members", { cache: "no-store", signal: controller.signal }).then((response) => response.ok ? response.json() as Promise<Member[]> : Promise.reject()).then(setMemberRecords).catch(() => undefined); return () => controller.abort(); }, []);
  const filtered = useMemo(
    () =>
      memberRecords.filter((member) =>
        `${member.name} ${member.email} ${member.id}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [memberRecords, query],
  );
  return (
    <>
      <section className="admin-section-head">
        <div>
          <h2>Member management</h2>
          <p>{memberRecords.length} travellers currently in your community.</p>
        </div>
        <button className="admin-primary">＋ Add member</button>
      </section>
      <div className="table-tools">
        <label>
          ⌕
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search member, email, or ID"
          />
        </label>
        <button>Filter ≡</button>
        <button>Export ↓</button>
      </div>
      <section className="admin-card data-table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Member</th>
              <th>Member ID</th>
              <th>Joined</th>
              <th>Bookings</th>
              <th>Total spent</th>
              <th>Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {filtered.map((member) => (
              <tr key={member.id}>
                <td>
                  <div className="member-cell">
                    <span>{member.initials}</span>
                    <div>
                      <strong>{member.name}</strong>
                      <small>{member.email}</small>
                    </div>
                  </div>
                </td>
                <td>{member.id}</td>
                <td>{member.joined}</td>
                <td>{member.bookings}</td>
                <td>{money(member.spent)}</td>
                <td>
                  <Status>{member.status}</Status>
                </td>
                <td>
                  <button className="dots">•••</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="empty-state">No members match “{query}”.</p>
        )}
      </section>
    </>
  );
}

function GuideBookings({
  bookings,
  bookingStatuses,
  setBookingStatuses,
  setBookings,
}: {
  bookings: Booking[];
  bookingStatuses: Record<string, BookingStatus>;
  setBookingStatuses: React.Dispatch<
    React.SetStateAction<Record<string, BookingStatus>>
  >;
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}) {
  const myBookings = bookings.filter(
    (item) => item.guideId === "KP-G001",
  );
  const changeStatus = async (id: string, status: BookingStatus) => {
    const response = await fetch(`/api/bookings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    const result = await response.json() as Booking | { error?: string };
    if (!response.ok) return;
    const booking = result as Booking;
    setBookingStatuses((current) => ({ ...current, [id]: booking.status }));
    setBookings((current) => current.map((item) => item.id === id ? booking : item));
  };
  return (
    <>
      <section className="admin-section-head">
        <div>
          <p className="admin-eyebrow">Mei Ling Tan · KP-G001</p>
          <h2>My booking requests</h2>
          <p>
            Review only trips assigned to you. The supervisor can monitor
            decisions but cannot respond on your behalf.
          </p>
        </div>
      </section>
      <section className="booking-request-list">
        {myBookings.map((booking) => (
          <article className="booking-request" key={booking.id}>
            <div className="request-date">
              <small>TRIP DATES</small>
              <strong>{booking.date}</strong>
              <span>
                {booking.guests} guest{booking.guests > 1 ? "s" : ""}
              </span>
            </div>
            <div className="request-main">
              <div>
                <span className="booking-id">{booking.id}</span>
                <h3>{booking.packageName}</h3>
                <p>
                  Requested by <strong>{booking.member}</strong>
                </p>
              </div>
              <strong>{money(booking.value)}</strong>
            </div>
            <div className="request-actions">
              <Status>{bookingStatuses[booking.id]}</Status>
              {bookingStatuses[booking.id] === "Pending" && (
                <>
                  <button
                    className="decline"
                    onClick={() => changeStatus(booking.id, "Declined")}
                  >
                    Decline
                  </button>
                  <button
                    className="accept"
                    onClick={() => changeStatus(booking.id, "Accepted")}
                  >
                    Accept booking
                  </button>
                </>
              )}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

function Guides({
  bookings,
  bookingStatuses,
}: {
  bookings: Booking[];
  bookingStatuses: Record<string, BookingStatus>;
}) {
  const [tab, setTab] = useState<"guides" | "requests">("guides");
  const [showCreate, setShowCreate] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<TourGuide | null>(null);
  const [editingGuide, setEditingGuide] = useState<TourGuide | null>(null);
  const [guideList, setGuideList] = useState<TourGuide[]>(
    tourGuides as TourGuide[],
  );
  const emptyGuide = {
    name: "",
    email: "",
    title: "",
    languages: "English, Malay",
    specialties: "Mobility support",
    bio: "",
    status: "Available",
    licensed: true,
    yearsExperience: "",
    expertise: "",
    perks: "",
  };
  const [newGuide, setNewGuide] = useState(emptyGuide);
  const [savingGuide, setSavingGuide] = useState(false);
  const [guideError, setGuideError] = useState("");
  const pendingCount = Object.values(bookingStatuses).filter(
    (status) => status === "Pending",
  ).length;
  const bookingStatsFor = (guideId: string) => {
    const assigned = bookings.filter((booking) => booking.guideId === guideId);
    const confirmed = assigned.filter((booking) => ["Accepted", "Completed"].includes(bookingStatuses[booking.id] ?? booking.status));
    return { tours: confirmed.length, revenue: confirmed.reduce((sum, booking) => sum + booking.value, 0), travellers: confirmed.reduce((sum, booking) => sum + booking.guests, 0) };
  };

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/tour-guides", { cache: "no-store", signal: controller.signal })
      .then((response) =>
        response.ok
          ? (response.json() as Promise<TourGuide[]>)
          : Promise.reject(),
      )
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
      languages: newGuide.languages
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      specialties: newGuide.specialties
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      status: newGuide.status,
      licensed: newGuide.licensed,
      yearsExperience: Number(newGuide.yearsExperience) || 0,
      expertise: newGuide.expertise || "Profile expertise pending review.",
      perks: newGuide.perks
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    try {
      const response = await fetch("/api/tour-guides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as TourGuide | { error?: string };
      if (!response.ok)
        throw new Error(
          "error" in result ? result.error : "Unable to create guide.",
        );
      setGuideList((current) => [...current, result as TourGuide]);
      setShowCreate(false);
      setNewGuide(emptyGuide);
    } catch (error) {
      setGuideError(
        error instanceof Error ? error.message : "Unable to create guide.",
      );
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
      const response = await fetch(
        `/api/tour-guides/${encodeURIComponent(editingGuide.id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingGuide),
        },
      );
      const result = (await response.json()) as TourGuide | { error?: string };
      if (!response.ok)
        throw new Error(
          "error" in result ? result.error : "Unable to update guide.",
        );
      const updated = result as TourGuide;
      setGuideList((current) =>
        current.map((guide) => (guide.id === updated.id ? updated : guide)),
      );
      setSelectedGuide((current) =>
        current?.id === updated.id ? updated : current,
      );
      setEditingGuide(null);
    } catch (error) {
      setGuideError(
        error instanceof Error ? error.message : "Unable to update guide.",
      );
    } finally {
      setSavingGuide(false);
    }
  };

  const removeGuide = (guide: TourGuide) => {
    requestDeleteConfirmation({
      title: `Delete ${guide.name}?`,
      message:
        "This permanently removes the guide from the admin directory, landing page, and booking forms.",
      confirmLabel: "Delete guide",
      onConfirm: async () => {
        setGuideError("");
        const response = await fetch(
          `/api/tour-guides/${encodeURIComponent(guide.id)}`,
          { method: "DELETE" },
        );
        if (!response.ok) {
          const result = (await response.json()) as { error?: string };
          setGuideError(result.error || "Unable to delete guide.");
          throw new Error(result.error || "Unable to delete guide.");
        }
        setGuideList((current) =>
          current.filter((item) => item.id !== guide.id),
        );
        setSelectedGuide((current) =>
          current?.id === guide.id ? null : current,
        );
      },
    });
  };

  return (
    <>
      <section className="admin-section-head">
        <div>
          <h2>Tour guides & bookings</h2>
          <p>
            Manage local companions and supervise their incoming booking
            requests.
          </p>
        </div>
        {tab === "guides" && (
          <button className="admin-primary" onClick={() => setShowCreate(true)}>
            ＋ Add guide
          </button>
        )}
      </section>
      <div className="module-tabs">
        <button
          className={tab === "guides" ? "active" : ""}
          onClick={() => setTab("guides")}
        >
          Tour guide directory
        </button>
        <button
          className={tab === "requests" ? "active" : ""}
          onClick={() => setTab("requests")}
        >
          Booking requests <b>{pendingCount}</b>
        </button>
      </div>
      {guideError && !showCreate && !editingGuide && (
        <p className="guide-page-error" role="alert">
          {guideError}
        </p>
      )}
      {tab === "guides" ? (
        <div className="guide-grid">
          {guideList.map((guide) => { const statistics = bookingStatsFor(guide.id); return (
            <article className="guide-card" key={guide.id}>
              <div className="guide-card-top">
                <span className={`guide-avatar large avatar-${guide.color}`}>
                  {guide.initials}
                </span>
                <Status>{guide.status}</Status>
              </div>
              <h3>{guide.name}</h3>
              <p className="guide-title">{guide.title}</p>
              <div className="guide-credentials">
                <span>
                  {guide.licensed ? "✓ MOTAC licensed" : "Licence pending"}
                </span>
                <span>{guide.yearsExperience}+ years in Ipoh</span>
              </div>
              <p className="guide-bio">{guide.bio}</p>
              <div className="guide-tags">
                {guide.specialties.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="guide-numbers">
                <span>
                  <strong>{guide.reviews ? `★ ${guide.rating}` : "New"}</strong>
                  <small>{guide.reviews} reviews</small>
                </span>
                <span>
                  <strong>{statistics.tours}</strong>
                  <small>Confirmed tours</small>
                </span>
                <span>
                  <strong>{guide.acceptance}%</strong>
                  <small>Accept rate</small>
                </span>
                <span>
                  <strong>{money(statistics.revenue)}</strong>
                  <small>{statistics.travellers} travellers</small>
                </span>
              </div>
              <footer>
                <span>{guide.languages.join(" · ")}</span>
                <div className="guide-card-actions">
                  <button type="button" onClick={() => setSelectedGuide(guide)}>
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGuideError("");
                      setEditingGuide(guide);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete"
                    type="button"
                    onClick={() => removeGuide(guide)}
                  >
                    Delete
                  </button>
                </div>
              </footer>
            </article>
          ); })}
        </div>
      ) : (
        <section className="booking-request-list">
          {bookings.map((booking) => (
            <article className="booking-request" key={booking.id}>
              <div className="request-date">
                <small>TRIP DATES</small>
                <strong>{booking.date}</strong>
                <span>
                  {booking.guests} guest{booking.guests > 1 ? "s" : ""}
                </span>
              </div>
              <div className="request-main">
                <div>
                  <span className="booking-id">{booking.id}</span>
                  <h3>{booking.packageName}</h3>
                  <p>
                    Requested by <strong>{booking.member}</strong> · Assigned to{" "}
                    <strong>{booking.guide}</strong>
                  </p>
                </div>
                <strong>{money(booking.value)}</strong>
              </div>
              <div className="request-actions">
                <Status>{bookingStatuses[booking.id]}</Status>
              </div>
            </article>
          ))}
        </section>
      )}
      {selectedGuide && (
        <div
          className="guide-modal-backdrop"
          onMouseDown={() => setSelectedGuide(null)}
        >
          <section
            className="guide-create-modal guide-profile-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="guide-profile-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <p className="admin-eyebrow">
                  {selectedGuide.id} · Public profile
                </p>
                <h2 id="guide-profile-title">{selectedGuide.name}</h2>
              </div>
              <button
                onClick={() => setSelectedGuide(null)}
                aria-label="Close guide profile"
              >
                ×
              </button>
            </header>
            <div className="guide-profile-body">
              <div className="guide-profile-lead">
                <span
                  className={`guide-avatar large avatar-${selectedGuide.color}`}
                >
                  {selectedGuide.initials}
                </span>
                <div>
                  <p className="guide-title">{selectedGuide.title}</p>
                  <div className="guide-credentials">
                    <span>
                      {selectedGuide.licensed
                        ? "✓ MOTAC licensed guide"
                        : "Licence pending"}
                    </span>
                    <span>
                      {selectedGuide.yearsExperience}+ years guiding Ipoh
                    </span>
                  </div>
                </div>
                <Status>{selectedGuide.status}</Status>
              </div>
              <section>
                <small>BIODATA</small>
                <p>{selectedGuide.bio}</p>
              </section>
              <section>
                <small>SPECIALIZES IN</small>
                <p>{selectedGuide.expertise}</p>
              </section>
              <section>
                <small>SPECIAL ACCESS & PERKS</small>
                <ul>
                  {selectedGuide.perks.map((perk) => (
                    <li key={perk}>✓ {perk}</li>
                  ))}
                </ul>
              </section>
              <div className="guide-profile-columns">
                <section>
                  <small>LANGUAGES</small>
                  <p>{selectedGuide.languages.join(" · ")}</p>
                </section>
                <section>
                  <small>SPECIALTIES</small>
                  <div className="guide-tags">
                    {selectedGuide.specialties.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </section>
              </div>
              <section>
                <small>GUEST TESTIMONIALS</small>
                {selectedGuide.testimonials.length ? (
                  selectedGuide.testimonials.map((testimonial) => (
                    <blockquote key={testimonial.guest}>
                      “{testimonial.quote}”<cite>— {testimonial.guest}</cite>
                    </blockquote>
                  ))
                ) : (
                  <p>No testimonials yet.</p>
                )}
              </section>
              <div className="guide-numbers">
                <span>
                  <strong>
                    {selectedGuide.reviews
                      ? `★ ${selectedGuide.rating}`
                      : "New"}
                  </strong>
                  <small>{selectedGuide.reviews} reviews</small>
                </span>
                <span>
                  <strong>{bookingStatsFor(selectedGuide.id).tours}</strong>
                  <small>Confirmed tours</small>
                </span>
                <span>
                  <strong>{selectedGuide.acceptance}%</strong>
                  <small>Accept rate</small>
                </span>
                <span>
                  <strong>{money(bookingStatsFor(selectedGuide.id).revenue)}</strong>
                  <small>{bookingStatsFor(selectedGuide.id).travellers} travellers</small>
                </span>
              </div>
            </div>
          </section>
        </div>
      )}
      {editingGuide && (
        <div
          className="guide-modal-backdrop"
          onMouseDown={() => !savingGuide && setEditingGuide(null)}
        >
          <section
            className="guide-create-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-guide-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <p className="admin-eyebrow">{editingGuide.id}</p>
                <h2 id="edit-guide-title">Edit tour guide</h2>
              </div>
              <button
                disabled={savingGuide}
                onClick={() => setEditingGuide(null)}
                aria-label="Close edit guide form"
              >
                ×
              </button>
            </header>
            <form onSubmit={saveEditedGuide}>
              <div className="guide-form-grid">
                <label>
                  Full name
                  <input
                    required
                    value={editingGuide.name}
                    onChange={(event) =>
                      setEditingGuide({
                        ...editingGuide,
                        name: event.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Email address
                  <input
                    type="email"
                    value={editingGuide.email ?? ""}
                    onChange={(event) =>
                      setEditingGuide({
                        ...editingGuide,
                        email: event.target.value,
                      })
                    }
                  />
                </label>
                <label className="form-wide">
                  Guide title
                  <input
                    required
                    value={editingGuide.title}
                    onChange={(event) =>
                      setEditingGuide({
                        ...editingGuide,
                        title: event.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Years guiding Ipoh
                  <input
                    required
                    min="0"
                    type="number"
                    value={editingGuide.yearsExperience}
                    onChange={(event) =>
                      setEditingGuide({
                        ...editingGuide,
                        yearsExperience: Number(event.target.value),
                      })
                    }
                  />
                </label>
                <label>
                  Availability
                  <select
                    value={editingGuide.status}
                    onChange={(event) =>
                      setEditingGuide({
                        ...editingGuide,
                        status: event.target.value as TourGuide["status"],
                      })
                    }
                  >
                    <option>Available</option>
                    <option>On tour</option>
                    <option>Off duty</option>
                  </select>
                </label>
                <label className="guide-license">
                  <input
                    type="checkbox"
                    checked={editingGuide.licensed}
                    onChange={(event) =>
                      setEditingGuide({
                        ...editingGuide,
                        licensed: event.target.checked,
                      })
                    }
                  />
                  <span>MOTAC licensed guide</span>
                </label>
                <label>
                  Languages
                  <input
                    value={editingGuide.languages.join(", ")}
                    onChange={(event) =>
                      setEditingGuide({
                        ...editingGuide,
                        languages: event.target.value
                          .split(",")
                          .map((item) => item.trim()),
                      })
                    }
                  />
                  <small>Separate with commas</small>
                </label>
                <label>
                  Support specialties
                  <input
                    value={editingGuide.specialties.join(", ")}
                    onChange={(event) =>
                      setEditingGuide({
                        ...editingGuide,
                        specialties: event.target.value
                          .split(",")
                          .map((item) => item.trim()),
                      })
                    }
                  />
                  <small>Separate with commas</small>
                </label>
                <label className="form-wide">
                  Short biodata
                  <textarea
                    rows={3}
                    value={editingGuide.bio}
                    onChange={(event) =>
                      setEditingGuide({
                        ...editingGuide,
                        bio: event.target.value,
                      })
                    }
                  />
                </label>
                <label className="form-wide">
                  Detailed expertise
                  <textarea
                    required
                    rows={3}
                    value={editingGuide.expertise}
                    onChange={(event) =>
                      setEditingGuide({
                        ...editingGuide,
                        expertise: event.target.value,
                      })
                    }
                  />
                </label>
                <label className="form-wide">
                  Special access & perks
                  <textarea
                    rows={3}
                    value={editingGuide.perks.join("\n")}
                    onChange={(event) =>
                      setEditingGuide({
                        ...editingGuide,
                        perks: event.target.value.split("\n"),
                      })
                    }
                  />
                  <small>One item per line</small>
                </label>
                {guideError && (
                  <p className="guide-form-error" role="alert">
                    {guideError}
                  </p>
                )}
              </div>
              <footer>
                <button
                  type="button"
                  disabled={savingGuide}
                  onClick={() => setEditingGuide(null)}
                >
                  Cancel
                </button>
                <button
                  className="admin-primary"
                  disabled={savingGuide}
                  type="submit"
                >
                  {savingGuide ? "Saving…" : "Save changes →"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
      {showCreate && (
        <div
          className="guide-modal-backdrop"
          onMouseDown={() => !savingGuide && setShowCreate(false)}
        >
          <section
            className="guide-create-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-guide-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <p className="admin-eyebrow">New team member</p>
                <h2 id="create-guide-title">Create tour guide</h2>
              </div>
              <button
                disabled={savingGuide}
                onClick={() => setShowCreate(false)}
                aria-label="Close create guide form"
              >
                ×
              </button>
            </header>
            <form onSubmit={createGuide}>
              <div className="guide-form-grid">
                <label>
                  Full name
                  <input
                    required
                    value={newGuide.name}
                    onChange={(event) =>
                      setNewGuide({ ...newGuide, name: event.target.value })
                    }
                    placeholder="e.g. Aina Rahman"
                  />
                </label>
                <label>
                  Email address
                  <input
                    required
                    type="email"
                    value={newGuide.email}
                    onChange={(event) =>
                      setNewGuide({ ...newGuide, email: event.target.value })
                    }
                    placeholder="aina@kaypoh.my"
                  />
                </label>
                <label className="form-wide">
                  Guide title
                  <input
                    required
                    value={newGuide.title}
                    onChange={(event) =>
                      setNewGuide({ ...newGuide, title: event.target.value })
                    }
                    placeholder="e.g. Access-trained heritage companion"
                  />
                </label>
                <label>
                  Years guiding Ipoh
                  <input
                    required
                    min="0"
                    type="number"
                    value={newGuide.yearsExperience}
                    onChange={(event) =>
                      setNewGuide({
                        ...newGuide,
                        yearsExperience: event.target.value,
                      })
                    }
                  />
                </label>
                <label>
                  Initial availability
                  <select
                    value={newGuide.status}
                    onChange={(event) =>
                      setNewGuide({ ...newGuide, status: event.target.value })
                    }
                  >
                    <option>Available</option>
                    <option>On tour</option>
                    <option>Off duty</option>
                  </select>
                </label>
                <label className="guide-license">
                  <input
                    type="checkbox"
                    checked={newGuide.licensed}
                    onChange={(event) =>
                      setNewGuide({
                        ...newGuide,
                        licensed: event.target.checked,
                      })
                    }
                  />
                  <span>MOTAC licensed guide</span>
                </label>
                <label>
                  Languages
                  <input
                    value={newGuide.languages}
                    onChange={(event) =>
                      setNewGuide({
                        ...newGuide,
                        languages: event.target.value,
                      })
                    }
                  />
                  <small>Separate with commas</small>
                </label>
                <label>
                  Support specialties
                  <input
                    value={newGuide.specialties}
                    onChange={(event) =>
                      setNewGuide({
                        ...newGuide,
                        specialties: event.target.value,
                      })
                    }
                  />
                  <small>Separate with commas</small>
                </label>
                <label className="form-wide">
                  Short biodata
                  <textarea
                    rows={3}
                    value={newGuide.bio}
                    onChange={(event) =>
                      setNewGuide({ ...newGuide, bio: event.target.value })
                    }
                    placeholder="Training, experience, and approach to supporting travellers…"
                  />
                </label>
                <label className="form-wide">
                  Detailed expertise
                  <textarea
                    required
                    rows={3}
                    value={newGuide.expertise}
                    onChange={(event) =>
                      setNewGuide({
                        ...newGuide,
                        expertise: event.target.value,
                      })
                    }
                    placeholder="The Ipoh routes and experiences this guide knows best…"
                  />
                </label>
                <label className="form-wide">
                  Special access & perks
                  <textarea
                    rows={3}
                    value={newGuide.perks}
                    onChange={(event) =>
                      setNewGuide({ ...newGuide, perks: event.target.value })
                    }
                    placeholder={
                      "One perk per line\nReserved venue access\nSpecial equipment provided"
                    }
                  />
                  <small>
                    One item per line. These appear on the public guide profile.
                  </small>
                </label>
                {guideError && (
                  <p className="guide-form-error" role="alert">
                    {guideError}
                  </p>
                )}
              </div>
              <footer>
                <button
                  type="button"
                  disabled={savingGuide}
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </button>
                <button
                  className="admin-primary"
                  disabled={savingGuide}
                  type="submit"
                >
                  {savingGuide ? "Saving…" : "Create guide →"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </>
  );
}

function BookingTable({
  rows,
  statuses,
}: {
  rows: Booking[];
  statuses: Record<string, BookingStatus>;
}) {
  return (
    <div className="table-scroll">
      <table className="admin-table compact">
        <thead>
          <tr>
            <th>Booking</th>
            <th>Trip</th>
            <th>Guide</th>
            <th>Dates</th>
            <th>Value</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <td>
                <strong>{row.id}</strong>
                <small>{row.member}</small>
              </td>
              <td>{row.packageName}</td>
              <td>{row.guide}</td>
              <td>{row.date}</td>
              <td>{money(row.value)}</td>
              <td>
                <Status>{statuses[row.id]}</Status>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PackageCms() {
  const initial = packages as TourPackage[];
  const [packageList, setPackageList] = useState<TourPackage[]>(initial);
  const [selected, setSelected] = useState<TourPackage | null>(
    initial[0] ?? null,
  );
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/packages", { cache: "no-store", signal: controller.signal })
      .then((response) =>
        response.ok
          ? (response.json() as Promise<TourPackage[]>)
          : Promise.reject(),
      )
      .then((records) => {
        setPackageList(records);
        setSelected(
          (current) =>
            records.find((item) => item.id === current?.id) ??
            records[0] ??
            null,
        );
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);

  const choosePackage = (item: TourPackage) => {
    setSelected(item);
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
    setIsNew(true);
    setError("");
  };

  const savePackage = async () => {
    if (!selected) return;
    setSaving(true);
    setError("");
    try {
      const payload = selected;
      const response = await fetch(
        isNew
          ? "/api/packages"
          : `/api/packages/${encodeURIComponent(selected.id)}`,
        {
          method: isNew ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const result = (await response.json()) as
        | TourPackage
        | { error?: string };
      if (!response.ok)
        throw new Error(
          "error" in result ? result.error : "Unable to save package.",
        );
      const saved = result as TourPackage;
      setPackageList((current) =>
        isNew
          ? [...current, saved]
          : current.map((item) => (item.id === saved.id ? saved : item)),
      );
      setSelected(saved);
      setIsNew(false);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Unable to save package.",
      );
    } finally {
      setSaving(false);
    }
  };

  const removePackage = () => {
    if (!selected || isNew) return;
    const packageToDelete = selected;
    requestDeleteConfirmation({
      title: `Delete ${packageToDelete.title}?`,
      message:
        "This permanently removes the package from the CMS, landing page, matching form, and booking page.",
      confirmLabel: "Delete package",
      onConfirm: async () => {
        setSaving(true);
        setError("");
        try {
          const response = await fetch(
            `/api/packages/${encodeURIComponent(packageToDelete.id)}`,
            { method: "DELETE" },
          );
          if (!response.ok) throw new Error("Unable to delete package.");
          const next = packageList.filter(
            (item) => item.id !== packageToDelete.id,
          );
          setPackageList(next);
          setSelected(next[0] ?? null);
        } catch (deleteError) {
          setError(
            deleteError instanceof Error
              ? deleteError.message
              : "Unable to delete package.",
          );
          throw deleteError;
        } finally {
          setSaving(false);
        }
      },
    });
  };

  const update = (changes: Partial<TourPackage>) =>
    setSelected((current) => (current ? { ...current, ...changes } : current));
  const updateAccess = (
    key: keyof TourPackage["accessibility"],
    value: string,
  ) =>
    setSelected((current) =>
      current
        ? {
            ...current,
            accessibility: { ...current.accessibility, [key]: value },
          }
        : current,
    );
  const updateItinerary = (itinerary: TourPackage["itinerary"]) =>
    update({ itinerary });
  const addDay = () => {
    if (!selected) return;
    const day = selected.itinerary.length + 1;
    updateItinerary([
      ...selected.itinerary,
      { day, label: `Day ${day}`, title: "New day", items: [] },
    ]);
  };
  const updateDay = (
    dayIndex: number,
    changes: Partial<TourPackage["itinerary"][number]>,
  ) => {
    if (!selected) return;
    updateItinerary(
      selected.itinerary.map((day, index) =>
        index === dayIndex ? { ...day, ...changes } : day,
      ),
    );
  };
  const removeDay = (dayIndex: number) => {
    if (!selected) return;
    updateItinerary(
      selected.itinerary
        .filter((_, index) => index !== dayIndex)
        .map((day, index) => ({
          ...day,
          day: index + 1,
          label: `Day ${index + 1}`,
        })),
    );
  };
  const moveDay = (dayIndex: number, direction: -1 | 1) => {
    if (!selected) return;
    const target = dayIndex + direction;
    if (target < 0 || target >= selected.itinerary.length) return;
    const itinerary = [...selected.itinerary];
    [itinerary[dayIndex], itinerary[target]] = [
      itinerary[target],
      itinerary[dayIndex],
    ];
    updateItinerary(
      itinerary.map((day, index) => ({
        ...day,
        day: index + 1,
        label: `Day ${index + 1}`,
      })),
    );
  };
  const addItineraryItem = (dayIndex: number) => {
    if (!selected) return;
    updateDay(dayIndex, {
      items: [
        ...selected.itinerary[dayIndex].items,
        { time: "9:00 AM", activity: "New activity", note: "" },
      ],
    });
  };
  const updateItineraryItem = (
    dayIndex: number,
    itemIndex: number,
    changes: Partial<TourPackage["itinerary"][number]["items"][number]>,
  ) => {
    if (!selected) return;
    updateDay(dayIndex, {
      items: selected.itinerary[dayIndex].items.map((item, index) =>
        index === itemIndex ? { ...item, ...changes } : item,
      ),
    });
  };
  const removeItineraryItem = (dayIndex: number, itemIndex: number) => {
    if (!selected) return;
    updateDay(dayIndex, {
      items: selected.itinerary[dayIndex].items.filter(
        (_, index) => index !== itemIndex,
      ),
    });
  };
  const moveItineraryItem = (
    dayIndex: number,
    itemIndex: number,
    direction: -1 | 1,
  ) => {
    if (!selected) return;
    const items = [...selected.itinerary[dayIndex].items];
    const target = itemIndex + direction;
    if (target < 0 || target >= items.length) return;
    [items[itemIndex], items[target]] = [items[target], items[itemIndex]];
    updateDay(dayIndex, { items });
  };

  return (
    <>
      <section className="admin-section-head">
        <div>
          <h2>Tour package CMS</h2>
          <p>Control what travellers see and book on the Kay Poh website.</p>
        </div>
        <button className="admin-primary" onClick={createPackage}>
          ＋ Create package
        </button>
      </section>
      <div className="cms-layout">
        <section className="admin-card package-list">
          <header>
            <div>
              <h3>All packages</h3>
              <p>{packageList.length} package records</p>
            </div>
          </header>
          {packageList.map((item) => (
            <button
              className={!isNew && selected?.id === item.id ? "active" : ""}
              onClick={() => choosePackage(item)}
              key={item.id}
            >
              <span className={`cms-thumb ${item.color}`}>{item.days}</span>
              <div>
                <strong>{item.title}</strong>
                <small>
                  {item.currency}
                  {item.price} per person
                </small>
              </div>
              <Status>{item.published ? "Published" : "Draft"}</Status>
            </button>
          ))}
        </section>
        {selected ? (
          <section className="admin-card cms-editor">
            <header>
              <div>
                <p className="admin-eyebrow">
                  {isNew ? "Creating package" : `Editing ${selected.id}`}
                </p>
                <h3>{selected.title}</h3>
              </div>
              {!isNew && (
                <button
                  className="cms-delete"
                  onClick={removePackage}
                  disabled={saving}
                >
                  Delete
                </button>
              )}
            </header>
            <div className="editor-preview">
              <span className={`cms-hero ${selected.color}`}>
                {selected.days}
              </span>
              <div>
                <label>
                  Package name
                  <input
                    value={selected.title}
                    onChange={(event) => update({ title: event.target.value })}
                  />
                </label>
                <div className="editor-row">
                  <label>
                    Price (RM)
                    <input
                      type="number"
                      min="0"
                      value={selected.price}
                      onChange={(event) =>
                        update({ price: Number(event.target.value) })
                      }
                    />
                  </label>
                  <label>
                    Duration
                    <input
                      value={selected.days}
                      onChange={(event) => update({ days: event.target.value })}
                    />
                  </label>
                </div>
                <label>
                  Card tag
                  <input
                    value={selected.tag}
                    onChange={(event) => update({ tag: event.target.value })}
                  />
                </label>
                <label>
                  Colour
                  <select
                    value={selected.color}
                    onChange={(event) => update({ color: event.target.value })}
                  >
                    <option>package-coral</option>
                    <option>package-gold</option>
                    <option>package-sage</option>
                  </select>
                </label>
                <label>
                  Short description
                  <textarea
                    value={selected.description}
                    onChange={(event) =>
                      update({ description: event.target.value })
                    }
                    rows={3}
                  />
                </label>
              </div>
            </div>
            <div className="cms-fields">
              <label>
                Highlights
                <input
                  value={selected.highlights.join(", ")}
                  onChange={(event) =>
                    update({
                      highlights: event.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    })
                  }
                />
                <small>Separate with commas</small>
              </label>
              <label>
                Package includes
                <input
                  value={selected.includes.join(", ")}
                  onChange={(event) =>
                    update({
                      includes: event.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter(Boolean),
                    })
                  }
                />
                <small>Separate with commas</small>
              </label>
              <div className="cms-access-grid">
                <label>
                  Mobility
                  <input
                    value={selected.accessibility.mobility}
                    onChange={(event) =>
                      updateAccess("mobility", event.target.value)
                    }
                  />
                </label>
                <label>
                  Pace
                  <input
                    value={selected.accessibility.pace}
                    onChange={(event) =>
                      updateAccess("pace", event.target.value)
                    }
                  />
                </label>
                <label>
                  Support
                  <input
                    value={selected.accessibility.support}
                    onChange={(event) =>
                      updateAccess("support", event.target.value)
                    }
                  />
                </label>
                <label>
                  Venue standard
                  <input
                    value={selected.accessibility.venue}
                    onChange={(event) =>
                      updateAccess("venue", event.target.value)
                    }
                  />
                </label>
              </div>
              <section className="itinerary-builder">
                <div className="itinerary-builder-heading">
                  <div>
                    <h4>Itinerary</h4>
                    <p>Build the public day-by-day schedule.</p>
                  </div>
                  <button type="button" onClick={addDay}>＋ Add day</button>
                </div>
                {selected.itinerary.length === 0 && (
                  <div className="itinerary-empty">
                    <span>☷</span>
                    <strong>No itinerary days yet</strong>
                    <p>Add a day, then build its schedule one activity at a time.</p>
                    <button type="button" onClick={addDay}>Create Day 1</button>
                  </div>
                )}
                <div className="itinerary-day-editor-list">
                  {selected.itinerary.map((day, dayIndex) => (
                    <article className="itinerary-day-editor" key={`${day.day}-${dayIndex}`}>
                      <header>
                        <span>Day {dayIndex + 1}</span>
                        <input aria-label={`Day ${dayIndex + 1} title`} value={day.title} onChange={(event) => updateDay(dayIndex, { title: event.target.value })} />
                        <div>
                          <button type="button" aria-label="Move day up" disabled={dayIndex === 0} onClick={() => moveDay(dayIndex, -1)}>↑</button>
                          <button type="button" aria-label="Move day down" disabled={dayIndex === selected.itinerary.length - 1} onClick={() => moveDay(dayIndex, 1)}>↓</button>
                          <button className="itinerary-delete" type="button" onClick={() => removeDay(dayIndex)}>Delete day</button>
                        </div>
                      </header>
                      <div className="itinerary-column-labels"><span>Time</span><span>Activity</span><span>Optional note</span><span /></div>
                      <div className="itinerary-row-list">
                        {day.items.map((item, itemIndex) => (
                          <div className="itinerary-edit-row" key={`${dayIndex}-${itemIndex}`}>
                            <input aria-label="Activity time" value={item.time} onChange={(event) => updateItineraryItem(dayIndex, itemIndex, { time: event.target.value })} placeholder="9:00 AM" />
                            <input aria-label="Activity name" value={item.activity} onChange={(event) => updateItineraryItem(dayIndex, itemIndex, { activity: event.target.value })} placeholder="Activity name" />
                            <input aria-label="Optional activity note" value={item.note} onChange={(event) => updateItineraryItem(dayIndex, itemIndex, { note: event.target.value })} placeholder="Optional details" />
                            <div className="itinerary-row-actions">
                              <button type="button" aria-label="Move activity up" disabled={itemIndex === 0} onClick={() => moveItineraryItem(dayIndex, itemIndex, -1)}>↑</button>
                              <button type="button" aria-label="Move activity down" disabled={itemIndex === day.items.length - 1} onClick={() => moveItineraryItem(dayIndex, itemIndex, 1)}>↓</button>
                              <button className="itinerary-delete" type="button" aria-label="Delete activity" onClick={() => removeItineraryItem(dayIndex, itemIndex)}>×</button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="itinerary-add-row" type="button" onClick={() => addItineraryItem(dayIndex)}>＋ Add schedule row</button>
                    </article>
                  ))}
                </div>
              </section>
              {error && (
                <p className="guide-form-error" role="alert">
                  {error}
                </p>
              )}
            </div>
            <footer>
              <label className="publish-toggle">
                <input
                  type="checkbox"
                  checked={selected.published}
                  onChange={(event) =>
                    update({ published: event.target.checked })
                  }
                />
                <span />{" "}
                {selected.published ? "Published on website" : "Saved as draft"}
              </label>
              <div className="cms-footer-actions">
                {isNew && (
                  <button
                    onClick={() => choosePackage(packageList[0])}
                    disabled={!packageList.length || saving}
                  >
                    Cancel
                  </button>
                )}
                <button
                  className="admin-primary"
                  onClick={savePackage}
                  disabled={saving}
                >
                  {saving
                    ? "Saving…"
                    : isNew
                      ? "Create package"
                      : "Save changes"}
                </button>
              </div>
            </footer>
          </section>
        ) : (
          <section className="admin-card cms-empty">
            Create your first package to begin.
          </section>
        )}
      </div>
    </>
  );
}
