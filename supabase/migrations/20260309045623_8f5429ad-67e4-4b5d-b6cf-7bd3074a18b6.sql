CREATE POLICY "Anyone can read profiles publicly"
ON public.profiles
FOR SELECT
TO anon, authenticated
USING (true);