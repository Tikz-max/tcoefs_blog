-- Editorial fields for the redesigned blog.
-- Safe to run more than once. Run in the Supabase SQL editor.
--
-- Until this has been applied the blog keeps working: the editor simply hides
-- drafts, author, tags and image captions, and every save publishes.

alter table public.articles
  add column if not exists status text not null default 'published'
    check (status in ('draft', 'published')),
  add column if not exists author text,
  add column if not exists author_role text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists image_caption text;

create index if not exists articles_status_published_date_idx
  on public.articles (status, published_date desc);

-- Readers must only ever see published stories. This assumes the existing
-- policy allows public SELECT; replace it with one that checks status, while
-- admins (role = 'admin' in user_metadata) can still read drafts.
-- Review the policy name below against your project before running.
--
-- drop policy if exists "Public can read articles" on public.articles;
-- create policy "Public can read published articles"
--   on public.articles for select
--   using (
--     status = 'published'
--     or (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
--   );
