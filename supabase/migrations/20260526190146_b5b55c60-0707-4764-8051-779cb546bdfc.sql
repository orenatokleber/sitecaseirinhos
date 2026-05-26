DROP POLICY IF EXISTS "Admins can upload site images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update site images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete site images" ON storage.objects;

CREATE POLICY "Admins can upload site images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update site images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete site images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can select site images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'site-images' AND public.has_role(auth.uid(), 'admin'::public.app_role));