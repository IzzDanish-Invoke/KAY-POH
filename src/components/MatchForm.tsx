"use client";

import { useEffect, useId, useState } from "react";
import {
  matchingQuestions,
  packages as initialPackages,
  tourGuides as initialTourGuides,
} from "@/data/data";
import { usePackages } from "@/hooks/usePackages";
import { useTourGuides } from "@/hooks/useTourGuides";
import type { Booking } from "@/types/booking";

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

const TRAVELLER_TYPES = [
  { id: "tourist", label: "Tourist" },
  { id: "disabled-person", label: "Disabled Person" },
  { id: "disabled-group", label: "Disabled Group (min 20 people)" },
] as const;

type TravellerType = (typeof TRAVELLER_TYPES)[number]["id"];

const DISABILITY_TYPES = [
  "Physical disability",
  "Visual impairment",
  "Hearing impairment",
  "Intellectual disability",
  "Learning disability",
  "Other",
];

const MIN_GROUP_SIZE = 10;

const DEFAULT_PLAN_ID =
  initialPackages.find((pkg) => pkg.tag === "Best first visit")?.id ??
  initialPackages[0].id;

const DEFAULT_GUIDE_ID = initialTourGuides[0].id;

const COUNTRY_CODES = ["+60", "+65", "+66", "+62", "+44", "+1"];

type Participant = {
  id: string;
  firstName: string;
  lastName: string;
  icNumber: string;
  disabilityType: string;
  countryCode: string;
  contact: string;
  email: string;
};

function emptyParticipant(id: string): Participant {
  return {
    id,
    firstName: "",
    lastName: "",
    icNumber: "",
    disabilityType: DISABILITY_TYPES[0],
    countryCode: COUNTRY_CODES[0],
    contact: "",
    email: "",
  };
}

export default function MatchForm() {
  const idPrefix = useId();
  const packages = usePackages();
  const tourGuides = useTourGuides();
  const [travellerType, setTravellerType] = useState<TravellerType>("tourist");
  const [disabilityType, setDisabilityType] = useState(DISABILITY_TYPES[0]);
  const [buddyOption, setBuddyOption] = useState<"with" | "without">("with");
  const [groupDisabilityMode, setGroupDisabilityMode] = useState<
    "same" | "different"
  >("same");
  const [groupDisabilityType, setGroupDisabilityType] = useState(
    DISABILITY_TYPES[0],
  );
  const [participants, setParticipants] = useState<Participant[]>([
    emptyParticipant(`${idPrefix}-1`),
  ]);
  const [selectedPlanId, setSelectedPlanId] = useState(DEFAULT_PLAN_ID);
  const [selectedGuideId, setSelectedGuideId] = useState(DEFAULT_GUIDE_ID);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<Booking | null>(null);
  const [startDate, setStartDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    const selectPackage = (event: Event) => { const packageId = (event as CustomEvent<string>).detail; if (packageId) setSelectedPlanId(packageId); };
    window.addEventListener("kaypoh-select-package", selectPackage);
    return () => window.removeEventListener("kaypoh-select-package", selectPackage);
  }, []);

  const selectTravellerType = (type: TravellerType) => {
    setTravellerType(type);
    setShowBookingDetails(false);
    setBookingConfirmed(null);
    const packageId = type === "tourist" ? "kaypoh-normal" : type === "disabled-person" ? "kaypoh-oku" : "kaypoh-oku-group";
    if (packages.some((item) => item.id === packageId)) setSelectedPlanId(packageId);
  };

  const addParticipant = () =>
    setParticipants((current) => [
      ...current,
      emptyParticipant(`${idPrefix}-${current.length + 1}-${Date.now()}`),
    ]);
  const removeParticipant = (id: string) =>
    setParticipants((current) => current.filter((p) => p.id !== id));
  const updateParticipant = (
    id: string,
    field: keyof Omit<Participant, "id">,
    value: string,
  ) =>
    setParticipants((current) =>
      current.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );

  const groupIsBelowMinimum =
    travellerType === "disabled-group" && participants.length < MIN_GROUP_SIZE;

  const handleContinue = () => setShowBookingDetails(true);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const selectedPackage = packages.find((item) => item.id === selectedPlanId);
    const selectedGuide = tourGuides.find((item) => item.id === selectedGuideId);
    if (!selectedPackage || !selectedGuide || !startDate) { setBookingError("Please choose a package, guide, and preferred date."); return; }
    const groupPreference = String(form.get("group") ?? "");
    const guestCount = travellerType === "disabled-group" ? participants.length : travellerType === "disabled-person" ? (buddyOption === "with" ? 2 : 1) : ({ "Solo traveller": 1, "A couple": 2, Family: 4, Friends: 4, "Corporate group": 10 }[groupPreference] ?? 1);
    const lead = travellerType === "disabled-group" ? { name: `${participants[0]?.firstName ?? ""} ${participants[0]?.lastName ?? ""}`.trim(), email: participants[0]?.email ?? "", contact: `${participants[0]?.countryCode ?? ""} ${participants[0]?.contact ?? ""}`.trim() } : { name: `${form.get("firstName") ?? ""} ${form.get("lastName") ?? ""}`.trim(), email: String(form.get("email") ?? ""), contact: `${form.get("countryCode") ?? ""} ${form.get("contact") ?? ""}`.trim() };
    const preferredRate = selectedPackage.rates.find((rate) => travellerType === "disabled-person" ? rate.label.includes("OKU Final") : travellerType === "disabled-group" ? rate.label === "Local" : rate.label === "Local Traveller") ?? selectedPackage.rates[0];
    const preferences = Object.fromEntries(matchingQuestions.map((question) => [question.id, String(form.get(question.id) ?? question.defaultValue)]));
    const supportNeeds = travellerType === "tourist" ? [] : travellerType === "disabled-person" ? [disabilityType, buddyOption === "with" ? "Travelling with a buddy" : "Travelling without a buddy"] : [...new Set(participants.map((item) => groupDisabilityMode === "same" ? groupDisabilityType : item.disabilityType))];
    setSubmitting(true); setBookingError("");
    try {
      const response = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ member: lead.name, email: lead.email, contact: lead.contact, identityDocument: travellerType === "disabled-group" ? participants[0]?.icNumber : String(form.get("icNumber") ?? ""), packageId: selectedPackage.id, packageName: selectedPackage.title, guideId: selectedGuide.id, guide: selectedGuide.name, startDate, guests: guestCount, value: (preferredRate?.price ?? selectedPackage.price) * guestCount, rateLabel: preferredRate?.label ?? "Standard rate", addOns: [], supportNeeds, supportNotes: `Landing-page match: ${Object.values(preferences).join(" · ")}`, travellerType, preferences, participants: travellerType === "disabled-group" ? participants.map((item) => ({ name: `${item.firstName} ${item.lastName}`.trim(), email: item.email, contact: `${item.countryCode} ${item.contact}`.trim(), identityDocument: item.icNumber, disabilityType: groupDisabilityMode === "same" ? groupDisabilityType : item.disabilityType })) : [] }) });
      const result = await response.json() as Booking | { error?: string };
      if (!response.ok) throw new Error("error" in result ? result.error : "Unable to create booking.");
      setBookingConfirmed(result as Booking);
    } catch (error) { setBookingError(error instanceof Error ? error.message : "Unable to create booking."); } finally { setSubmitting(false); }
  };

  return (
    <form className="match-form" action="#packages" onSubmit={handleSubmit}>
      <div className="traveller-type-field">
        <span className="field-label">I&apos;m booking as</span>
        <div
          className="traveller-type-tabs"
          role="tablist"
          aria-label="Traveller type"
        >
          {TRAVELLER_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              role="tab"
              aria-selected={travellerType === type.id}
              className={travellerType === type.id ? "active" : ""}
              onClick={() => selectTravellerType(type.id)}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {matchingQuestions.map((question) => (
        <label key={question.id}>
          {question.label}
          <select name={question.id} defaultValue={question.defaultValue}>
            {question.options.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      ))}

      <div className="plan-field">
        <span className="field-label">Choose a plan</span>
        <div className="plan-picker">
          <select
            value={selectedPlanId}
            onChange={(event) => setSelectedPlanId(event.target.value)}
          >
            {packages.map((pkg) => (
              <option key={pkg.id} value={pkg.id}>
                {pkg.title} — {pkg.tag}
              </option>
            ))}
          </select>
          <a className="show-plan" href={`#${selectedPlanId}`}>
            Show
          </a>
        </div>
      </div>

      <div className="plan-field">
        <span className="field-label">Choose a tour guide</span>
        <div className="plan-picker">
          <select
            value={selectedGuideId}
            onChange={(event) => setSelectedGuideId(event.target.value)}
          >
            {tourGuides.map((guide) => (
              <option key={guide.id} value={guide.id}>
                {guide.name} — {guide.title}
              </option>
            ))}
          </select>
          <a className="show-plan" href={`#${selectedGuideId}`}>
            Show
          </a>
        </div>
      </div>

      {travellerType === "disabled-person" && (
        <div className="buddy-field">
          <label className="disability-select-field">
            Type of disability
            <select
              value={disabilityType}
              onChange={(event) => setDisabilityType(event.target.value)}
            >
              {DISABILITY_TYPES.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>

          <span className="field-label">Travelling companion</span>
          <button
            type="button"
            role="switch"
            aria-checked={buddyOption === "with"}
            className={`buddy-toggle ${buddyOption === "with" ? "on" : "off"}`}
            onClick={() =>
              setBuddyOption(buddyOption === "with" ? "without" : "with")
            }
          >
            <span className="buddy-toggle-track">
              <span className="buddy-toggle-knob" />
            </span>
            <span className="buddy-toggle-label">
              {buddyOption === "with" ? "With a buddy" : "Without a buddy"}
            </span>
          </button>
          <input type="hidden" name="buddy" value={buddyOption} />
          <p className="buddy-remark">
            *A travel buddy is a companion who accompanies you on the trip to
            help with mobility, communication, or day-to-day needs.
          </p>
        </div>
      )}

      {!showBookingDetails && (
        <button type="button" className="match-button" onClick={handleContinue}>
          Continue with booking <ArrowIcon />
        </button>
      )}

      {showBookingDetails && !bookingConfirmed && (
        <div className="booking-details">
          <span className="field-label">Trip date</span>
          <div className="booking-details-grid"><label>Preferred start date<input required type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></label></div>
        </div>
      )}

      {showBookingDetails &&
        !bookingConfirmed &&
        travellerType === "disabled-group" && (
          <div className="participant-field">
            <div className="participant-field-heading">
              <span className="field-label">Group participants</span>
              <span
                className={`participant-count${groupIsBelowMinimum ? " below-minimum" : ""}`}
              >
                {participants.length} / {MIN_GROUP_SIZE} minimum
              </span>
            </div>
            <div className="group-disability-field">
              <label className="disability-select-field">
                Type of disability
                <select
                  value={groupDisabilityType}
                  disabled={groupDisabilityMode !== "same"}
                  onChange={(event) =>
                    setGroupDisabilityType(event.target.value)
                  }
                >
                  {DISABILITY_TYPES.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                role="switch"
                aria-checked={groupDisabilityMode === "same"}
                className={`buddy-toggle ${groupDisabilityMode === "same" ? "on" : "off"}`}
                onClick={() =>
                  setGroupDisabilityMode(
                    groupDisabilityMode === "same" ? "different" : "same",
                  )
                }
              >
                <span className="buddy-toggle-track">
                  <span className="buddy-toggle-knob" />
                </span>
                <span className="buddy-toggle-label">
                  {groupDisabilityMode === "same"
                    ? "Same disability"
                    : "Different disabilities"}
                </span>
              </button>
            </div>

            <div className="participant-list">
              {participants.map((participant, index) => (
                <div className="participant-card" key={participant.id}>
                  <div className="participant-card-header">
                    <span>Participant {index + 1}</span>
                    <button
                      type="button"
                      className="remove-participant"
                      onClick={() => removeParticipant(participant.id)}
                      disabled={participants.length === 1}
                      aria-label={`Remove participant ${index + 1}`}
                    >
                      ×
                    </button>
                  </div>
                  <div className="participant-card-grid">
                    <label>
                      First name
                      <input
                        required
                        placeholder="First name"
                        value={participant.firstName}
                        onChange={(event) =>
                          updateParticipant(
                            participant.id,
                            "firstName",
                            event.target.value,
                          )
                        }
                      />
                    </label>
                    <label>
                      Last name
                      <input
                        required
                        placeholder="Last name"
                        value={participant.lastName}
                        onChange={(event) =>
                          updateParticipant(
                            participant.id,
                            "lastName",
                            event.target.value,
                          )
                        }
                      />
                    </label>
                    <label>
                      IC / Passport no.
                      <input
                        required
                        placeholder="IC / Passport no."
                        value={participant.icNumber}
                        onChange={(event) =>
                          updateParticipant(
                            participant.id,
                            "icNumber",
                            event.target.value,
                          )
                        }
                      />
                    </label>
                    <label>
                      Type of disability
                      <select
                        value={
                          groupDisabilityMode === "same"
                            ? groupDisabilityType
                            : participant.disabilityType
                        }
                        disabled={groupDisabilityMode === "same"}
                        onChange={(event) =>
                          updateParticipant(
                            participant.id,
                            "disabilityType",
                            event.target.value,
                          )
                        }
                      >
                        {DISABILITY_TYPES.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Email
                      <input
                        required
                        type="email"
                        placeholder="you@example.com"
                        value={participant.email}
                        onChange={(event) =>
                          updateParticipant(
                            participant.id,
                            "email",
                            event.target.value,
                          )
                        }
                      />
                    </label>
                    <label className="contact-field">
                      Contact no.
                      <div className="contact-input">
                        <select
                          value={participant.countryCode}
                          onChange={(event) =>
                            updateParticipant(
                              participant.id,
                              "countryCode",
                              event.target.value,
                            )
                          }
                        >
                          {COUNTRY_CODES.map((code) => (
                            <option key={code} value={code}>
                              {code}
                            </option>
                          ))}
                        </select>
                        <input
                          required
                          type="tel"
                          placeholder="12-345 6789"
                          value={participant.contact}
                          onChange={(event) =>
                            updateParticipant(
                              participant.id,
                              "contact",
                              event.target.value,
                            )
                          }
                        />
                      </div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="add-participant"
              onClick={addParticipant}
            >
              + Add participant
            </button>
            {groupIsBelowMinimum && (
              <p className="group-note">
                Disabled Group bookings need at least {MIN_GROUP_SIZE}{" "}
                participants listed before matching.
              </p>
            )}
            <button
              className="match-button"
              type="submit"
              disabled={groupIsBelowMinimum || submitting || !startDate}
            >
              {submitting ? "Sending request…" : "Request booking"} <ArrowIcon />
            </button>
          </div>
        )}

      {showBookingDetails &&
        !bookingConfirmed &&
        travellerType !== "disabled-group" && (
          <div className="booking-details">
            <span className="field-label">Your details</span>
            <div className="booking-details-grid">
              <label>
                First name
                <input required name="firstName" placeholder="First name" />
              </label>
              <label>
                Last name
                <input required name="lastName" placeholder="Last name" />
              </label>
              <label>
                IC / Passport no.
                <input
                  required
                  name="icNumber"
                  placeholder="IC / Passport no."
                />
              </label>
              <label>
                Email
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                />
              </label>
              <label className="contact-field">
                Contact no.
                <div className="contact-input">
                  <select name="countryCode" defaultValue="+60">
                    {COUNTRY_CODES.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </select>
                  <input
                    required
                    type="tel"
                    name="contact"
                    placeholder="12-345 6789"
                  />
                </div>
              </label>
            </div>
            <button className="match-button" type="submit" disabled={submitting || !startDate}>
              {submitting ? "Sending request…" : "Request booking"} <ArrowIcon />
            </button>
          </div>
        )}

      {bookingConfirmed && (
        <div className="booking-confirmed">
          <strong>✓ Booking request received.</strong>
          <span>Reference {bookingConfirmed.id}. {bookingConfirmed.guide} will review your request, and an accepted trip will appear automatically in upcoming tours.</span>
        </div>
      )}
      {bookingError && <div className="booking-confirmed" role="alert"><strong>We couldn&apos;t send this request.</strong><span>{bookingError}</span></div>}
    </form>
  );
}
