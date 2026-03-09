
-- Add tags and allow_comments columns to blog_posts
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';
ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS allow_comments boolean NOT NULL DEFAULT true;
