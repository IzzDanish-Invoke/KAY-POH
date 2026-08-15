"use client";

import Image from "next/image";
import { useState } from "react";

type RatingProps = {
  tour: { title: string; guide: string };
  module: { title: string; venue: string; time: string };
};

const quickFeedback = ["Comfortable pace", "Easy to access", "Helpful companion", "Enjoyable activity", "Good rest facilities", "Needs improvement"];

export default function RatingExperience({ tour, module }: RatingProps) {
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const toggleTag = (tag: string) => setTags((current) => current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]);

  if (submitted) return <main className="rating-page rating-thanks"><section><Image src="/brand/kaypoh-dark-outline.png" alt="Kay Poh" width={100} height={90} /><span>✓</span><h1>Thank you!</h1><p>Your feedback was sent to the trip companion and KAYPOH operations team.</p><strong>You can close this page.</strong></section></main>;

  return <main className="rating-page"><header><Image src="/brand/kaypoh-dark-outline.png" alt="Kay Poh" width={90} height={81} priority /><span>LIVE TRIP FEEDBACK</span></header><section className="rating-card"><p className="rating-eyebrow">{tour.title} · {module.time}</p><h1>How was<br /><em>{module.title}?</em></h1><p className="rating-venue">{module.venue}</p><div className="star-picker" role="radiogroup" aria-label="Overall rating">{[1,2,3,4,5].map((star) => <button key={star} role="radio" aria-checked={rating === star} aria-label={`${star} out of 5 stars`} className={star <= rating ? "selected" : ""} onClick={() => setRating(star)}>★</button>)}</div><p className="rating-prompt">{rating ? ["","Very poor","Could be better","It was okay","Good experience","Excellent!"][rating] : "Tap a star to rate this stop"}</p><div className="feedback-tags"><h2>What stood out?</h2><p>Select as many as you like.</p><div>{quickFeedback.map((tag) => <button className={tags.includes(tag) ? "selected" : ""} onClick={() => toggleTag(tag)} key={tag}>{tags.includes(tag) ? "✓ " : "+ "}{tag}</button>)}</div></div><label className="rating-comment">Anything you’d like us to know?<textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={4} placeholder="Tell us what worked well or what we can improve…" /></label><p className="rating-privacy">Your response is anonymous unless you choose to identify yourself.</p><button className="rating-submit" disabled={!rating} onClick={() => setSubmitted(true)}>Send my feedback <span>→</span></button><footer>Trip companion: {tour.guide} · Feedback is monitored live</footer></section></main>;
}
