import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import {
  createBooking,
  fillProfileBlanks,
  readPendingRequest,
  savePendingRequest,
  clearPendingRequest,
  nightsBetween,
  type BookingType,
  type NewBookingInput,
} from "@/lib/bookings";
import { cn } from "@/lib/utils";

const GOLD = "#C99322";

const inputClass =
  "w-full rounded-md border border-[rgba(201,147,34,0.35)] bg-[#0F1720] px-3 py-2.5 text-sm text-[#F5F3EE] placeholder:text-[#8B949E] focus:border-[#C99322] focus:outline-none";
const labelClass =
  "mb-1.5 block text-[11px] uppercase tracking-[0.18em] text-[#C99322]";

function emptyInput(bookingType: BookingType): NewBookingInput {
  return {
    bookingType,
    name: "",
    destination: "",
    country: "",
    city: "",
    hotelName: "",
    startDate: "",
    endDate: "",
    rooms: bookingType === "leisure" ? 5 : undefined,
    guests: bookingType === "leisure" ? 10 : undefined,
    delegates: bookingType === "me" ? 20 : undefined,
    meetingSpaces: bookingType === "me" ? 1 : undefined,
    notes: "",
    contact: { firstName: "", lastName: "", email: "", phone: "", companyName: "", country: "" },
  };
}

export function BookingWizard({
  bookingType,
  title,
  intro,
}: {
  bookingType: BookingType;
  title: string;
  intro: string;
}) {
  const navigate = useNavigate();
  const { session, user, profile, refreshProfile } = useAuth();
  const [step, setStep] = useState(0);
  const [input, setInput] = useState<NewBookingInput>(() => emptyInput(bookingType));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  // Restore a request the visitor built before signing in.
  useEffect(() => {
    const pending = readPendingRequest();
    if (pending && pending.bookingType === bookingType) {
      setInput(pending);
      setStep(2);
    }
  }, [bookingType]);

  // Prefill contact details from the signed-in profile.
  useEffect(() => {
    if (!profile) return;
    setInput((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        firstName: prev.contact.firstName || profile.first_name || "",
        lastName: prev.contact.lastName || profile.last_name || "",
        email: prev.contact.email || profile.email || "",
        phone: prev.contact.phone || profile.phone || "",
        companyName: prev.contact.companyName || profile.company_name || "",
        country: prev.contact.country || profile.country || "",
      },
    }));
  }, [profile]);

  const set = <K extends keyof NewBookingInput>(key: K, value: NewBookingInput[K]) =>
    setInput((prev) => ({ ...prev, [key]: value }));
  const setContact = (key: keyof NewBookingInput["contact"], value: string) =>
    setInput((prev) => ({ ...prev, contact: { ...prev.contact, [key]: value } }));

  const submit = async () => {
    setError(null);
    if (!input.destination || !input.startDate || !input.endDate) {
      setError("Please fill in destination and dates.");
      setStep(0);
      return;
    }
    if (!input.contact.firstName || !input.contact.lastName || !input.contact.email) {
      setError("Please fill in your name and email.");
      return;
    }
    setSubmitting(true);
    try {
      let activeSession = session;
      if (!activeSession) {
        const { data } = await supabase.auth.getSession();
        activeSession = data.session;
      }
      if (!activeSession?.user) {
        savePendingRequest(input);
        await navigate({ to: "/auth", search: { next: "/manage-bookings", mode: "signup" } });
        return;
      }
      const uid = activeSession.user.id;
      await fillProfileBlanks(uid, profile as unknown as Record<string, unknown> | null, input);
      const booking = await createBooking(uid, input);
      clearPendingRequest();
      await refreshProfile();
      setReference(booking.reference);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-submit once the visitor comes back signed in with a pending request.
  useEffect(() => {
    if (!user || reference || submitting) return;
    const pending = readPendingRequest();
    if (!pending || pending.bookingType !== bookingType) return;
    void submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const nights = nightsBetween(input.startDate, input.endDate);

  if (reference) {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-[rgba(201,147,34,0.4)] bg-[#111C26] p-8 text-center">
        <h2 className="font-[Cormorant_Garamond] text-3xl text-[#F5F3EE]">Request received</h2>
        <p className="mt-3 text-sm text-[#B9C2CC]">
          Our team is collecting offers from hotels now. Your reference is
        </p>
        <p className="mt-2 text-2xl tracking-[0.12em]" style={{ color: GOLD }}>
          {reference}
        </p>
        <Link
          to="/manage-bookings"
          className="mt-6 inline-flex rounded-md bg-[#C99322] px-5 py-2.5 text-sm font-medium text-[#121C26]"
        >
          View my bookings
        </Link>
      </div>
    );
  }

  const steps = ["Trip", bookingType === "me" ? "Delegates" : "Rooms", "Your details"];

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-[Cormorant_Garamond] text-4xl text-[#F5F3EE] sm:text-5xl">{title}</h1>
      <p className="mt-3 max-w-xl text-sm text-[#B9C2CC]">{intro}</p>

      <ol className="mt-8 flex gap-2">
        {steps.map((label, i) => (
          <li key={label} className="flex-1">
            <button
              type="button"
              onClick={() => setStep(i)}
              className={cn(
                "w-full rounded-md border px-3 py-2 text-[11px] uppercase tracking-[0.16em] transition-colors",
                i === step
                  ? "border-[#C99322] text-[#F1D77A]"
                  : "border-[rgba(201,147,34,0.25)] text-[#8B949E]",
              )}
            >
              {i + 1}. {label}
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-xl border border-[rgba(201,147,34,0.3)] bg-[#111C26] p-6">
        {step === 0 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="name">Request name</label>
              <input id="name" className={inputClass} value={input.name}
                placeholder="Sales kick-off 2026"
                onChange={(e) => set("name", e.target.value)} />
            </div>
            <div>
              <label className={labelClass} htmlFor="destination">Destination</label>
              <input id="destination" className={inputClass} value={input.destination}
                placeholder="Bergen" onChange={(e) => set("destination", e.target.value)} />
            </div>
            <div>
              <label className={labelClass} htmlFor="country">Country</label>
              <input id="country" className={inputClass} value={input.country ?? ""}
                placeholder="Norway" onChange={(e) => set("country", e.target.value)} />
            </div>
            <div>
              <label className={labelClass} htmlFor="start">Arrival</label>
              <input id="start" type="date" className={inputClass} value={input.startDate}
                onChange={(e) => set("startDate", e.target.value)} />
            </div>
            <div>
              <label className={labelClass} htmlFor="end">Departure</label>
              <input id="end" type="date" className={inputClass} value={input.endDate}
                onChange={(e) => set("endDate", e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="hotel">Preferred hotel (optional)</label>
              <input id="hotel" className={inputClass} value={input.hotelName ?? ""}
                onChange={(e) => set("hotelName", e.target.value)} />
            </div>
            {nights ? (
              <p className="sm:col-span-2 text-xs text-[#8B949E]">{nights} night{nights === 1 ? "" : "s"}</p>
            ) : null}
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {bookingType === "leisure" ? (
              <>
                <div>
                  <label className={labelClass} htmlFor="rooms">Rooms</label>
                  <input id="rooms" type="number" min={1} className={inputClass}
                    value={input.rooms ?? ""} onChange={(e) => set("rooms", Number(e.target.value) || undefined)} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="guests">Guests</label>
                  <input id="guests" type="number" min={1} className={inputClass}
                    value={input.guests ?? ""} onChange={(e) => set("guests", Number(e.target.value) || undefined)} />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className={labelClass} htmlFor="delegates">Delegates</label>
                  <input id="delegates" type="number" min={1} className={inputClass}
                    value={input.delegates ?? ""} onChange={(e) => set("delegates", Number(e.target.value) || undefined)} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="spaces">Meeting spaces</label>
                  <input id="spaces" type="number" min={0} className={inputClass}
                    value={input.meetingSpaces ?? ""} onChange={(e) => set("meetingSpaces", Number(e.target.value) || undefined)} />
                </div>
                <div>
                  <label className={labelClass} htmlFor="rooms">Rooms needed</label>
                  <input id="rooms" type="number" min={0} className={inputClass}
                    value={input.rooms ?? ""} onChange={(e) => set("rooms", Number(e.target.value) || undefined)} />
                </div>
              </>
            )}
            <div className="sm:col-span-2">
              <label className={labelClass} htmlFor="notes">Anything else we should know?</label>
              <textarea id="notes" rows={4} className={inputClass} value={input.notes ?? ""}
                onChange={(e) => set("notes", e.target.value)} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor="fn">First name</label>
              <input id="fn" className={inputClass} value={input.contact.firstName}
                onChange={(e) => setContact("firstName", e.target.value)} />
            </div>
            <div>
              <label className={labelClass} htmlFor="ln">Last name</label>
              <input id="ln" className={inputClass} value={input.contact.lastName}
                onChange={(e) => setContact("lastName", e.target.value)} />
            </div>
            <div>
              <label className={labelClass} htmlFor="email">Email</label>
              <input id="email" type="email" className={inputClass} value={input.contact.email}
                onChange={(e) => setContact("email", e.target.value)} />
            </div>
            <div>
              <label className={labelClass} htmlFor="phone">Phone</label>
              <input id="phone" className={inputClass} value={input.contact.phone ?? ""}
                onChange={(e) => setContact("phone", e.target.value)} />
            </div>
            <div>
              <label className={labelClass} htmlFor="company">Company</label>
              <input id="company" className={inputClass} value={input.contact.companyName ?? ""}
                onChange={(e) => setContact("companyName", e.target.value)} />
            </div>
            <div>
              <label className={labelClass} htmlFor="ccountry">Country</label>
              <input id="ccountry" className={inputClass} value={input.contact.country ?? ""}
                onChange={(e) => setContact("country", e.target.value)} />
            </div>
            {!session && (
              <p className="sm:col-span-2 text-xs text-[#8B949E]">
                You'll be asked to create an account when you submit — your request is saved and sent
                automatically once you're signed in.
              </p>
            )}
          </div>
        )}

        {error && <p className="mt-4 text-sm text-[#E4776B]">{error}</p>}

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="rounded-md border border-[rgba(201,147,34,0.35)] px-4 py-2 text-sm text-[#F5F3EE] disabled:opacity-40"
          >
            Back
          </button>
          {step < 2 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(2, s + 1))}
              className="rounded-md bg-[#C99322] px-5 py-2.5 text-sm font-medium text-[#121C26]"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={() => void submit()}
              className="rounded-md bg-[#C99322] px-5 py-2.5 text-sm font-medium text-[#121C26] disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Submit request"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
