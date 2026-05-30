GRANT SELECT, INSERT ON public.reviews TO anon, authenticated;
GRANT ALL ON public.reviews TO service_role;

CREATE POLICY "Anyone can submit reviews"
ON public.reviews
FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'approved');