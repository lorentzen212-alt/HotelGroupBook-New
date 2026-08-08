import { supabase } from "@/integrations/supabase/client";
import { upsertProfile, type ProfileFields } from "@/lib/auth-context";

export type BookingType = "leisure" | "me";

export type NewBookingInput = {
  bookingType: BookingType;
  name: string;
  destination: string;
  country?: string;
  city?: string;
  hotelName?: string;
  startDate: string;
  endDate: string;
  rooms?: number;
  guests?: number;
  delegates?: number;
  meetingSpaces?: number;
  notes?: string;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    companyName?: string;
    country?: string;
  };
};

const PENDING_KEY = "hgb:pending-request-v1";

export function savePendingRequest(input: NewBookingInput) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PENDING_KEY, JSON.stringify(input));
}

export function readPendingRequest(): NewBookingInput | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(PENDING_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as NewBookingInput;
  } catch {
    return null;
  }
}

export function clearPendingRequest() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(PENDING_KEY);
}

export function nightsBetween(start: string, end: string) {
  const a = new Date(start).getTime();
  const b = new Date(end).getTime();
  if (Number.isNaN(a) || Number.isNaN(b) || b <= a) return null;
  return Math.round((b - a) / 86_400_000);
}

/** Fills only blank profile fields — never overwrites what the user already has. */
export async function fillProfileBlanks(
  userId: string,
  existing: Record<string, unknown> | null,
  input: NewBookingInput,
) {
  const candidate: ProfileFields = {
    first_name: input.contact.firstName,
    last_name: input.contact.lastName,
    email: input.contact.email,
    phone: input.contact.phone ?? null,
    company_name: input.contact.companyName ?? null,
    country: input.contact.country ?? null,
  };
  const fields: ProfileFields = {};
  for (const [key, value] of Object.entries(candidate)) {
    if (!value) continue;
    if (existing && existing[key]) continue;
    (fields as Record<string, unknown>)[key] = value;
  }
  if (Object.keys(fields).length === 0) return;
  try {
    await upsertProfile(userId, fields);
  } catch (err) {
    console.error("[bookings] profile update failed", err);
  }
}

export async function createBooking(userId: string, input: NewBookingInput) {
  const { data, error } = await supabase
    .from("bookings")
    .insert({
      user_id: userId,
      booking_type: input.bookingType,
      status: "request_submitted",
      name: input.name,
      destination: input.destination,
      country: input.country ?? null,
      city: input.city ?? null,
      hotel_name: input.hotelName ?? null,
      start_date: input.startDate,
      end_date: input.endDate,
      nights: nightsBetween(input.startDate, input.endDate),
      rooms: input.rooms ?? null,
      guests: input.guests ?? null,
      delegates: input.delegates ?? null,
      meeting_spaces: input.meetingSpaces ?? null,
      contact: input.contact,
      request: input as unknown as Record<string, unknown>,
    })
    .select("id, reference")
    .single();
  if (error) throw error;
  clearPendingRequest();
  return data;
}