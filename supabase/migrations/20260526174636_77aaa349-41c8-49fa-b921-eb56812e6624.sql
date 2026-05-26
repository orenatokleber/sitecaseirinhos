
-- 1. Profiles: drop blanket public read; allow public read only for admin profiles
DROP POLICY IF EXISTS "Anyone can read profiles publicly" ON public.profiles;

CREATE POLICY "Public can read admin profiles"
ON public.profiles
FOR SELECT
TO anon, authenticated
USING (public.has_role(user_id, 'admin'::app_role));

-- 2. site_settings: remove email from public 'contact' value
UPDATE public.site_settings
SET value = value - 'email'
WHERE key = 'contact' AND value ? 'email';

-- 3. Storage: remove broad authenticated policies on site-images (admin-only remain)
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete images" ON storage.objects;

-- 4. Storage: remove redundant public SELECT policies that allow listing.
-- Files remain accessible via public bucket URLs (/storage/v1/object/public/...).
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view site images" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

-- 5. Lock down SECURITY DEFINER helper functions from direct client execution.
-- has_role is invoked from RLS expressions (runs as table owner) - clients don't need EXECUTE.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
-- Trigger function - never called directly.
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
