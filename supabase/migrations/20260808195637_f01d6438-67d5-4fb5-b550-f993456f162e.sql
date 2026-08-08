CREATE TYPE public.app_role AS ENUM ('admin', 'user');

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
CREATE POLICY "Users can read their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE TABLE public.page_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL,
  section_key text NOT NULL,
  content_key text NOT NULL,
  value text NOT NULL DEFAULT '',
  content_type text NOT NULL DEFAULT 'text',
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid,
  UNIQUE (page_key, section_key, content_key)
);
GRANT SELECT ON public.page_content TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.page_content TO authenticated;
GRANT ALL ON public.page_content TO service_role;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Page content is publicly readable" ON public.page_content FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins can insert page content" ON public.page_content FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update page content" ON public.page_content FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete page content" ON public.page_content FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.set_page_content_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
CREATE TRIGGER page_content_updated_at BEFORE UPDATE ON public.page_content
FOR EACH ROW EXECUTE FUNCTION public.set_page_content_updated_at();

CREATE POLICY "Admins can read page images" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'page-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can upload page images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'page-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update page images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'page-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete page images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'page-images' AND public.has_role(auth.uid(), 'admin'));