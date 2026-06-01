-- Add DELETE policy for avatars bucket scoped to owner folder
CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Tighten page_views admin SELECT policy to authenticated role only
DROP POLICY IF EXISTS "Admins can view analytics" ON public.page_views;
CREATE POLICY "Admins can view analytics"
ON public.page_views
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));