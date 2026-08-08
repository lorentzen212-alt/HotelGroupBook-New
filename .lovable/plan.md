# Accounts, sign-in, and saved booking requests

Visitors can build a full group-booking request without an account. Sign-in is only required at the final submit step — and nothing they typed is lost along the way.

## What gets built

**1. Fix the current build break**
The homepage menu already links to `/book-leisure`, `/book-meetings-events` and `/manage-bookings`, which don't exist yet — that's why the last build failed. Those pages are created as part of this work. The backend client library also needs to be installed.

**2. Sign-in and accounts**
- A dark navy + champagne-gold `/auth` page matching the site's look, with four modes on one card: sign in, create account, magic link, and forgot password.
- Google sign-in, plus email + password.
- A `/reset-password` page for setting a new password.
- Global session state so the header can show the signed-in user and a sign-out action.
- Profiles: first/last name, email, company, phone, country — created automatically on first sign-in.

**3. Booking request pages**
- `/book-leisure` and `/book-meetings-events`: a multi-step wizard (destination, dates, rooms/delegates, extras, contact details) held in local state.
- On submit: if signed out, the finished request is stashed in the browser and the user is sent to `/auth`; the moment they sign in it submits automatically. If signed in, it saves straight away and shows a confirmation with a reference like `HGB-2026-00001`.
- `/manage-bookings`: the user's own requests with Active / Cancelled / All filters, and a cancel action.

**4. Data + access rules**
- Tables: `profiles`, `bookings`, and child tables for rooms, allocations, guests and rooming lists, plus a separate `user_roles` table with an `admin` / `staff` / `customer` role enum.
- Every table has row-level security: people can only read and change their own data; staff can read all; admins can also update.
- `Lorentzen212@gmail.com` is granted the admin role once that account exists (roles live in their own table, never on the profile, to prevent privilege escalation).

## Technical notes

- Auth state via an `AuthProvider` context (`onAuthStateChange` + one `getSession()` restore) mounted in `src/routes/__root.tsx`, exposing `loading, session, user, isAuthenticated, userId, profile, profileLoading, refreshProfile, signOut`, with `useAuth()` and `upsertProfile()` helpers.
- Migration order per table: CREATE TABLE → GRANT → ENABLE RLS → policies. `has_role(_user_id, _role)`, `owns_booking(id)`, `can_read_booking(id)` are SECURITY DEFINER, `search_path = public`, EXECUTE revoked from PUBLIC/anon.
- `bookings.reference` defaults from `generate_booking_reference()` backed by a sequence, format `HGB-YYYY-00001`. `updated_at` triggers on profiles, bookings and all child tables.
- Pending-request helpers (`savePendingRequest` / `readPendingRequest` / `clearPendingRequest`) over `localStorage` key `hgb:pending-request-v1`, typed as `NewBookingInput`.
- `/auth` reads a sanitised `?next=` param (must start with `/`, not `//`; default `/manage-bookings`). Google OAuth `redirect_uri` is `window.location.origin` (public route), then it navigates to the saved destination after the session hydrates.
- Booking reads/writes go through the browser Supabase client under the user's session, so RLS enforces ownership; `attachSupabaseAuth` is already registered in `src/start.ts` for any protected server functions.
- Google auth provider gets configured in the same step so first sign-in doesn't error.
- Route-level `head()` metadata (unique title/description/OG) added for each new page.

## Not included

The separate "Instant Edits" on-page visual editor from the earlier message is not part of this plan — it can follow once accounts and the admin role exist, since publishing edits depends on the admin role created here.
