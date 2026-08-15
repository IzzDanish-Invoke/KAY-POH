import Link from "next/link";
import Image from "next/image";
import PackageExplorer from "@/components/PackageExplorer";
import MatchForm from "@/components/MatchForm";
import TourGuides from "@/components/TourGuides";
import { experiences } from "@/data/data";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12h14M14 7l5 5-5 5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <main>
      <section className="hero" id="home">
        <nav className="nav shell" aria-label="Main navigation">
          <a
            className="brand brand-logo"
            href="#home"
            aria-label="Kay Poh home"
          >
            <Image
              src="/brand/kaypoh-dark-outline.png"
              alt="Kay Poh"
              width={105}
              height={94}
              priority
            />
          </a>
          <div className="nav-links">
            <a href="#packages">Packages</a>
            <a href="#experiences">Experiences</a>
            <a href="#guides">Guides</a>
            <a href="#about">Our story</a>
          </div>
          <div className="nav-actions">
            <Link className="login-link" href="/login">
              <span className="login-icon">↳</span> Login
            </Link>
            <Link className="nav-cta" href="/booking">
              Book now
            </Link>
          </div>
        </nav>

        <div className="hero-grid shell">
          <div className="hero-copy">
            <p className="eyebrow">
              <span /> Ipoh, Perak · Malaysia
            </p>
            <div className="access-badge">♿ OKU-first travel in Ipoh</div>
            <h1>
              Ipoh, without
              <br />
              <em>the barriers.</em>
            </h1>
            <p className="intro">
              More comfort. More support. More confidence. Accessible Ipoh
              travel designed around OKU travellers from the very beginning.
            </p>
            <div className="hero-actions">
              <a className="button primary" href="#packages">
                Choose your support <ArrowIcon />
              </a>
              <a className="text-link" href="#experiences">
                Just here for the day? <span>↘</span>
              </a>
            </div>
            <div className="hero-trust">
              <span>✓ Access checked</span>
              <span>✓ Support included</span>
              <span>✓ OKU-led partners</span>
            </div>
          </div>
          <div
            className="hero-art"
            aria-label="Illustration of Ipoh's limestone hills and heritage town"
          >
            <div className="sun" />
            <div className="cloud cloud-one" />
            <div className="cloud cloud-two" />
            <div className="hill hill-back" />
            <div className="hill hill-front" />
            <div className="shop shop-one">
              <span>怡保</span>
            </div>
            <div className="shop shop-two">
              <span>KOPI</span>
            </div>
            <div className="shop shop-three" />
            <div className="road" />
            <div className="scooter">
              ●<i />◉
            </div>
            <div className="postcard-note">
              Travel with
              <br />
              confidence,
              <br />
              not compromise.
            </div>
          </div>
        </div>
        <div className="hero-footer shell">
          <span>↓ Scroll to wander</span>
          <div className="rating">
            <strong>4.9</strong> ★★★★★ <small>from happy wanderers</small>
          </div>
        </div>
      </section>

      <section className="matcher" id="match">
        <div className="shell matcher-inner">
          <div className="matcher-copy">
            <p className="eyebrow light">
              <span /> Start here
            </p>
            <h2>
              What kind of <em>kay poh</em> are you?
            </h2>
            <p>
              Tell us a little about your trip and we’ll point you to the right
              Ipoh experience.
            </p>
          </div>
          <MatchForm />
        </div>
      </section>

      <section className="access-promise shell">
        <div className="access-heading">
          <p className="eyebrow">
            <span /> Our OKU-first promise
          </p>
          <h2>
            Support at every
            <br />
            <em>part of the journey.</em>
          </h2>
        </div>
        <div className="access-grid">
          <article>
            <span>01</span>
            <h3>Access before arrival</h3>
            <p>
              We check routes, entrances, toilets, seating, transport, and
              accommodation—not just whether a venue uses the word “accessible.”
            </p>
          </article>
          <article>
            <span>02</span>
            <h3>People, not assumptions</h3>
            <p>
              Tell us the support you want. Your pace, communication needs,
              mobility, sensory needs, and companion arrangements shape the
              itinerary.
            </p>
          </article>
          <article>
            <span>03</span>
            <h3>Inclusive local impact</h3>
            <p>
              We prioritise OKU-run businesses and inclusive employers, and
              label every partner clearly so you know who your trip supports.
            </p>
          </article>
        </div>
      </section>

      <section className="packages shell" id="packages">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span /> KAYPOH service levels
            </p>
            <h2>
              Choose the support
              <br />
              <em>that fits you.</em>
            </h2>
          </div>
          <p>
            Every level meets the same accessibility standard. Higher levels add
            more personal attention, flexibility, and control—not “more
            accessibility.”
          </p>
        </div>
        <PackageExplorer />
        <div className="custom-trip">
          <div>
            <span className="custom-icon">✦</span>
            <div>
              <h3>Nothing quite fits?</h3>
              <p>
                Mix stays, guides, and experiences into a trip that’s completely
                yours.
              </p>
            </div>
          </div>
          <a className="button outline" href="#contact">
            Build my own trip <ArrowIcon />
          </a>
        </div>
      </section>

      <section className="positioning">
        <div className="shell positioning-inner">
          <div className="positioning-heading">
            <p className="eyebrow light">
              <span /> The Premium Economy mindset
            </p>
            <h2>
              We spend on what
              <br />
              <em>actually helps.</em>
            </h2>
            <p>
              A reasonable premium for preparation, access, comfort, and peace
              of mind—not marble lobbies or luxury extras.
            </p>
          </div>
          <div className="compare-grid">
            <article>
              <small>STANDARD TOUR</small>
              <h3>Traveller adapts</h3>
              <ul>
                <li>Large groups</li>
                <li>Fixed, faster itinerary</li>
                <li>Limited access planning</li>
                <li>Lowest possible price</li>
              </ul>
            </article>
            <article className="featured">
              <span>OUR DIFFERENCE</span>
              <small>KAYPOH · PREMIUM ECONOMY</small>
              <h3>Journey adapts</h3>
              <ul>
                <li>Manageable groups</li>
                <li>Verified access</li>
                <li>Advance coordination</li>
                <li>Support and backup plans</li>
              </ul>
            </article>
            <article>
              <small>LUXURY / VIP</small>
              <h3>Luxury extras</h3>
              <ul>
                <li>Private concierge</li>
                <li>Luxury accommodation</li>
                <li>Premium extras</li>
                <li>Very high price</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="tours shell" id="experiences">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span /> Only have a few hours?
            </p>
            <h2>
              Small tours.
              <br />
              <em>Big Ipoh energy.</em>
            </h2>
          </div>
          <p>
            Shorter access-checked activities for day visitors. Each one shows
            its mobility profile, pace, and whether stops are OKU-friendly or
            OKU-led.
          </p>
        </div>
        <div className="tour-grid">
          {experiences.map((tour) => (
            <article className={`tour-card ${tour.color}`} key={tour.id}>
              <div className="card-top">
                <span>{tour.number}</span>
                <span className="mini-arrow">↗</span>
              </div>
              <div className="card-pattern" aria-hidden="true">
                <i />
                <i />
                <i />
              </div>
              <div className="access-label">
                ♿ {tour.accessibility} · {tour.venue}
              </div>
              <h3>{tour.title}</h3>
              <p>{tour.description}</p>
              <footer>
                <span>
                  {tour.duration} · From {tour.currency}
                  {tour.price}
                </span>
                <Link href="/booking">Book ↗</Link>
              </footer>
            </article>
          ))}
        </div>
      </section>

      <TourGuides />

      <section className="steps">
        <div className="shell">
          <div className="steps-heading">
            <p className="eyebrow">
              <span /> Easy from hello to Ipoh
            </p>
            <h2>
              Three steps.
              <br />
              <em>Zero travel stress.</em>
            </h2>
          </div>
          <div className="steps-grid">
            <article>
              <span>1</span>
              <h3>Share your needs</h3>
              <p>
                Tell us about mobility, communication, sensory, dietary,
                personal care, and companion needs.
              </p>
            </article>
            <article>
              <span>2</span>
              <h3>Review your access plan</h3>
              <p>
                We match suitable places, transport, pace, and trained support
                into one clear itinerary.
              </p>
            </article>
            <article>
              <span>3</span>
              <h3>Travel with confidence</h3>
              <p>
                Your trip companion confirms every detail and stays available
                from arrival to departure.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="story" id="about">
        <div className="shell story-inner">
          <p className="story-quote">
            Being disabled should not mean seeing <em>less of Ipoh.</em>
          </p>
          <div className="story-copy">
            <span className="seal">
              OKU
              <br />
              FIRST
            </span>
            <p>
              Kay Poh is built around dignity, choice, and real access. We work
              with the traveller—not assumptions—to create support that feels
              natural and empowering.
            </p>
            <a href="#contact">Talk to our access team →</a>
          </div>
        </div>
      </section>

      <section className="contact shell" id="contact">
        <p className="eyebrow">
          <span /> Your Ipoh story starts here
        </p>
        <h2>
          Ready to be a little <em>kay poh?</em>
        </h2>
        <p className="contact-intro">
          Choose a ready-made getaway or let us shape one around you.
        </p>
        <div className="contact-actions">
          <a className="button primary" href="#packages">
            Browse packages <ArrowIcon />
          </a>
          <a className="button outline" href="mailto:hello@kaypoh.tours">
            Talk to a local
          </a>
        </div>
        <footer>
          <strong>KAY POH</strong>
          <span>Local trips · Ipoh, Perak</span>
          <span>hello@kaypoh.tours</span>
        </footer>
      </section>
    </main>
  );
}
