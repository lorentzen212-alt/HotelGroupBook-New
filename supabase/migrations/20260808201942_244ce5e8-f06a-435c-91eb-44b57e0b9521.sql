DROP TABLE IF EXISTS public.page_content;
DROP TABLE IF EXISTS public.user_roles;
DROP POLICY IF EXISTS "Admins can read page images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload page images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update page images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete page images" ON storage.objects;
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP TYPE IF EXISTS public.app_role;