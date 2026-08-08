-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin','staff','customer');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

CREATE POLICY "read own roles or admin" ON public.user_roles
FOR SELECT TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- shared updated_at trigger fn
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROFILES
CREATE TABLE public.profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  email text,
  company_name text,
  phone text,
  country text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner manages own profile" ON public.profiles
FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "staff and admin read profiles" ON public.profiles
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'staff'));
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- BOOKINGS
CREATE TYPE public.booking_type AS ENUM ('leisure','me');
CREATE SEQUENCE public.booking_reference_seq;

CREATE OR REPLACE FUNCTION public.generate_booking_reference()
RETURNS text LANGUAGE sql VOLATILE SET search_path = public AS $$
  SELECT 'HGB-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.booking_reference_seq')::text, 5, '0');
$$;

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reference text UNIQUE NOT NULL DEFAULT public.generate_booking_reference(),
  booking_type public.booking_type NOT NULL DEFAULT 'leisure',
  status text NOT NULL DEFAULT 'request_submitted',
  status_note text,
  name text,
  destination text,
  country text,
  city text,
  hotel_name text,
  hotel_reference text,
  start_date date,
  end_date date,
  nights integer,
  rooms integer,
  guests integer,
  delegates integer,
  meeting_spaces integer,
  image_key text,
  contact jsonb NOT NULL DEFAULT '{}'::jsonb,
  request jsonb NOT NULL DEFAULT '{}'::jsonb,
  cancelled_at timestamptz,
  submitted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "owner manages own bookings" ON public.bookings
FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "staff and admin read bookings" ON public.bookings
FOR SELECT TO authenticated
USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'staff'));
CREATE POLICY "admin updates bookings" ON public.bookings
FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.owns_booking(_booking_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.bookings b WHERE b.id = _booking_id AND b.user_id = auth.uid());
$$;
REVOKE ALL ON FUNCTION public.owns_booking(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.owns_booking(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.can_read_booking(_booking_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.owns_booking(_booking_id)
     OR public.has_role(auth.uid(),'admin')
     OR public.has_role(auth.uid(),'staff');
$$;
REVOKE ALL ON FUNCTION public.can_read_booking(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.can_read_booking(uuid) TO authenticated, service_role;

-- CHILD TABLES
CREATE TABLE public.booking_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  room_type text,
  quantity integer,
  occupancy integer,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.booking_allocations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  label text,
  room_type text,
  quantity integer,
  allocated integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.booking_guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  email text,
  phone text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE public.booking_rooming_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  file_name text,
  status text,
  entries jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.booking_rooms, public.booking_allocations, public.booking_guests, public.booking_rooming_lists TO authenticated;
GRANT ALL ON public.booking_rooms, public.booking_allocations, public.booking_guests, public.booking_rooming_lists TO service_role;
ALTER TABLE public.booking_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_rooming_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner manages rooms" ON public.booking_rooms FOR ALL TO authenticated
USING (public.owns_booking(booking_id)) WITH CHECK (public.owns_booking(booking_id));
CREATE POLICY "staff reads rooms" ON public.booking_rooms FOR SELECT TO authenticated
USING (public.can_read_booking(booking_id));

CREATE POLICY "owner manages allocations" ON public.booking_allocations FOR ALL TO authenticated
USING (public.owns_booking(booking_id)) WITH CHECK (public.owns_booking(booking_id));
CREATE POLICY "staff reads allocations" ON public.booking_allocations FOR SELECT TO authenticated
USING (public.can_read_booking(booking_id));

CREATE POLICY "owner manages guests" ON public.booking_guests FOR ALL TO authenticated
USING (public.owns_booking(booking_id)) WITH CHECK (public.owns_booking(booking_id));
CREATE POLICY "staff reads guests" ON public.booking_guests FOR SELECT TO authenticated
USING (public.can_read_booking(booking_id));

CREATE POLICY "owner manages rooming lists" ON public.booking_rooming_lists FOR ALL TO authenticated
USING (public.owns_booking(booking_id)) WITH CHECK (public.owns_booking(booking_id));
CREATE POLICY "staff reads rooming lists" ON public.booking_rooming_lists FOR SELECT TO authenticated
USING (public.can_read_booking(booking_id));

CREATE TRIGGER booking_rooms_updated_at BEFORE UPDATE ON public.booking_rooms FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER booking_allocations_updated_at BEFORE UPDATE ON public.booking_allocations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER booking_guests_updated_at BEFORE UPDATE ON public.booking_guests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER booking_rooming_lists_updated_at BEFORE UPDATE ON public.booking_rooming_lists FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();