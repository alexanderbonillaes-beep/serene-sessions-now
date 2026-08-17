-- The migration in 20260530010952 granted anon/authenticated direct INSERT
-- access on public.reviews with WITH CHECK (status = 'approved'). Because the
-- publishable/anon key is embedded in every client bundle, this let anyone
-- POST straight to /rest/v1/reviews as an approved review, completely
-- bypassing the submit-review edge function's injection filter, AI
-- moderation, and duplicate check.
--
-- All review submissions must go through the submit-review edge function,
-- which inserts using the service role key (service_role bypasses RLS, so no
-- INSERT policy is needed for it). Restore the original client-side model:
-- reads are public, writes only via the trusted server path.

DROP POLICY IF EXISTS "Anyone can submit reviews" ON public.reviews;
REVOKE INSERT ON public.reviews FROM anon, authenticated;
