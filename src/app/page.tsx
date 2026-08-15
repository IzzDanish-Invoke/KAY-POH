import Link from "next/link";
import Image from "next/image";
import PackageExplorer from "@/components/PackageExplorer";
import MatchForm from "@/components/MatchForm";
import TourGuides from "@/components/TourGuides";
import { experiences } from "@/data/data";

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export default function Home() {
  return (
    <main>
      <section className="hero" id="home">
        <nav className="nav shell" aria-label="Main navigation">
          <a className="brand brand-logo" href="#home" aria-label="Kay Poh home"><Image src="/brand/kaypoh-dark-outline.png" alt="Kay Poh" width={105} height={94} priority /></a>
          <div className="nav-links">
            <a href="#packages">Packages</a><a href="#experiences">Experiences</a><a href="#guides">Guides</a><a href="#about">Our story</a>
          </div>
          <div className="nav-actions">
            <Link className="login-link" href="/login"><span className="login-icon">↳</span> Login</Link>
            <Link className="nav-cta" href="/booking">Book now</Link>
          </div>
        </nav>

        <div className="hero-grid shell">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Ipoh, Perak · Malaysia</p>
            <h1>Come curious.<br /><em>Leave local.</em></h1>
            <p className="intro">Complete Ipoh getaways and small local experiences, matched to the way you like to travel.</p>
            <div className="hero-actions">
              <a className="button primary" href="#packages">Find your package <ArrowIcon /></a>
              <a className="text-link" href="#experiences">Just here for the day? <span>↘</span></a>
            </div>
            <div className="hero-trust"><span>✓ Local guides</span><span>✓ Flexible plans</span><span>✓ One simple booking</span></div>
          </div>
          <div className="hero-art" aria-label="Illustration of Ipoh's limestone hills and heritage town">
            <div className="sun" /><div className="cloud cloud-one" /><div className="cloud cloud-two" /><div className="hill hill-back" /><div className="hill hill-front" />
            <div className="shop shop-one"><span>怡保</span></div><div className="shop shop-two"><span>KOPI</span></div><div className="shop shop-three" /><div className="road" /><div className="scooter">●<i />◉</div>
            <div className="postcard-note">Your whole<br />Ipoh trip,<br />in one place.</div>
          </div>
        </div>
        <div className="hero-footer shell"><span>↓ Scroll to wander</span><div className="rating"><strong>4.9</strong> ★★★★★ <small>from happy wanderers</small></div></div>
      </section>

      <section className="matcher" id="match">
        <div className="shell matcher-inner">
          <div className="matcher-copy"><p className="eyebrow light"><span /> Start here</p><h2>What kind of <em>kay poh</em> are you?</h2><p>Tell us a little about your trip and we’ll point you to the right Ipoh experience.</p></div>
          <MatchForm />
        </div>
      </section>

      <section className="packages shell" id="packages">
        <div className="section-heading">
          <div><p className="eyebrow"><span /> Stay a little longer</p><h2>Your whole trip,<br /><em>beautifully bundled.</em></h2></div>
          <p>Stay, transport, local guide, and the best bits of Ipoh—thoughtfully packaged so you can spend less time planning and more time wandering.</p>
        </div>
        <PackageExplorer />
        <div className="custom-trip"><div><span className="custom-icon">✦</span><div><h3>Nothing quite fits?</h3><p>Mix stays, guides, and experiences into a trip that’s completely yours.</p></div></div><a className="button outline" href="#contact">Build my own trip <ArrowIcon /></a></div>
      </section>

      <section className="tours shell" id="experiences">
        <div className="section-heading">
          <div><p className="eyebrow"><span /> Only have a few hours?</p><h2>Small tours.<br /><em>Big Ipoh energy.</em></h2></div>
          <p>Add one to your package or book it on its own. No flag-following and no rehearsed scripts—just small groups and genuinely local stories.</p>
        </div>
        <div className="tour-grid">
          {experiences.map((tour) => <article className={`tour-card ${tour.color}`} key={tour.id}><div className="card-top"><span>{tour.number}</span><span className="mini-arrow">↗</span></div><div className="card-pattern" aria-hidden="true"><i /><i /><i /></div><h3>{tour.title}</h3><p>{tour.description}</p><footer><span>{tour.duration} · From {tour.currency}{tour.price}</span><Link href="/booking">Book ↗</Link></footer></article>)}
        </div>
      </section>

      <TourGuides />

      <section className="steps">
        <div className="shell"><div className="steps-heading"><p className="eyebrow"><span /> Easy from hello to Ipoh</p><h2>Three steps.<br /><em>Zero travel stress.</em></h2></div>
          <div className="steps-grid"><article><span>1</span><h3>Tell us your style</h3><p>Share your dates, group, budget, and what makes a holiday great for you.</p></article><article><span>2</span><h3>Meet your match</h3><p>We recommend a package, then let you adjust the stay and experiences.</p></article><article><span>3</span><h3>Book it together</h3><p>One checkout covers your itinerary. Your local guide handles the rest.</p></article></div>
        </div>
      </section>

      <section className="story" id="about"><div className="shell story-inner"><p className="story-quote">“Kay poh” means being <em>delightfully curious.</em> Around here, we think that’s the best way to travel.</p><div className="story-copy"><span className="seal">LOCAL<br />LED</span><p>We’re Ipoh locals, storytellers, and enthusiastic eaters. Every trip supports trusted local guides and independent businesses.</p><a href="#contact">Meet our local guides →</a></div></div></section>

      <section className="contact shell" id="contact"><p className="eyebrow"><span /> Your Ipoh story starts here</p><h2>Ready to be a little <em>kay poh?</em></h2><p className="contact-intro">Choose a ready-made getaway or let us shape one around you.</p><div className="contact-actions"><a className="button primary" href="#packages">Browse packages <ArrowIcon /></a><a className="button outline" href="mailto:hello@kaypoh.tours">Talk to a local</a></div><footer><strong>KAY POH</strong><span>Local trips · Ipoh, Perak</span><span>hello@kaypoh.tours</span></footer></section>
    </main>
  );
}
