
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  city TEXT NOT NULL,
  comment TEXT NOT NULL,
  rating SMALLINT NOT NULL,
  status TEXT NOT NULL DEFAULT 'approved',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT rating_range CHECK (rating BETWEEN 1 AND 5),
  CONSTRAINT status_values CHECK (status IN ('approved','rejected','pending'))
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public can read only approved reviews
CREATE POLICY "Anyone can view approved reviews"
ON public.reviews FOR SELECT
USING (status = 'approved');

-- No direct inserts from clients; only server (service role) can insert.
-- (Service role bypasses RLS, so we don't need an INSERT policy.)

CREATE INDEX reviews_created_at_idx ON public.reviews (created_at DESC);
CREATE INDEX reviews_rating_idx ON public.reviews (rating);

-- Enable extensions for scheduled cleanup
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule: every day at 03:00 UTC, delete reviews with rating <= 2 older than 7 days
SELECT cron.schedule(
  'delete-low-rating-reviews',
  '0 3 * * *',
  $$
  DELETE FROM public.reviews
  WHERE rating <= 2 AND created_at < (now() - INTERVAL '7 days');
  $$
);
