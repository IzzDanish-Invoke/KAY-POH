"use client";

import { useState } from "react";
import { tourGuides } from "@/data/data";

const STATUS_CLASS: Record<string, string> = {
  Available: "available",
  "On tour": "on-tour",
  "Off duty": "off-duty",
};

export default function TourGuides() {
  const [selectedGuideId, setSelectedGuideId] = useState<string | null>(null);

  return (
    <section className="guides shell" id="guides">
      <div className="section-heading">
        <div>
          <p className="eyebrow"><span /> Meet the people</p>
          <h2>Pick your <em>local guide.</em></h2>
        </div>
        <p>Every trip is led by a licensed local guide who actually lives here. Browse their credentials and specialties and pick whoever feels like the right fit.</p>
      </div>

      <div className="tour-guide-grid">
        {tourGuides.map((guide) => {
          const isAvailable = guide.status === "Available";
          const isSelected = selectedGuideId === guide.id;
          return (
            <article
              key={guide.id}
              id={guide.id}
              className={`tour-guide-card${isSelected ? " selected" : ""}${!isAvailable ? " unavailable" : ""}`}
            >
              <div className="tour-guide-card-top">
                <span className={`tour-guide-avatar ${guide.color}`}>{guide.initials}</span>
                <span className={`tour-guide-status ${STATUS_CLASS[guide.status] ?? ""}`}>{guide.status}</span>
              </div>
              <h3>{guide.name}</h3>
              <p className="tour-guide-title">{guide.title}</p>

              <div className="tour-guide-credentials">
                {guide.licensed && <span>✓ MOTAC licensed guide</span>}
                <span>{guide.yearsExperience}+ years guiding Ipoh</span>
              </div>

              <p className="tour-guide-bio">{guide.bio}</p>

              <div className="tour-guide-expertise">
                <strong>Specializes in</strong>
                {guide.expertise}
              </div>

              <ul className="tour-guide-perks">
                {guide.perks.map((perk) => <li key={perk}>✓ {perk}</li>)}
              </ul>

              {guide.testimonials.map((testimonial) => (
                <blockquote className="tour-guide-quote" key={testimonial.guest}>
                  “{testimonial.quote}”
                  <cite>— {testimonial.guest}</cite>
                </blockquote>
              ))}

              <div className="tour-guide-tags">
                {guide.specialties.map((specialty) => <span key={specialty}>{specialty}</span>)}
              </div>
              <p className="tour-guide-languages">{guide.languages.join(" · ")}</p>
              <div className="tour-guide-meta">
                <span>★ {guide.rating}</span>
                <span>{guide.reviews} reviews</span>
                <span>{guide.tours} tours</span>
              </div>
              <button
                type="button"
                className="tour-guide-choose"
                disabled={!isAvailable}
                onClick={() => setSelectedGuideId(guide.id)}
              >
                {isSelected ? "✓ Selected" : isAvailable ? "Choose this guide" : "Currently unavailable"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
