CREATE TABLE public.blog_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES public.blog_posts(id) ON DELETE CASCADE NOT NULL,
  author_name text NOT NULL,
  content text NOT NULL,
  is_approved boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved comments
CREATE POLICY "Anyone can read approved comments"
ON public.blog_comments
FOR SELECT
USING (is_approved = true);

-- Anyone can insert comments
CREATE POLICY "Anyone can insert comments"
ON public.blog_comments
FOR INSERT
WITH CHECK (true);

-- Admins can manage all comments
CREATE POLICY "Admins can manage comments"
ON public.blog_comments
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));