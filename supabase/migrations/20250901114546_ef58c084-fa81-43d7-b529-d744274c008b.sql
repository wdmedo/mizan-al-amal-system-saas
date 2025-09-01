-- Secure sensitive data in pending_customers by enabling RLS and restricting access to authenticated users only
ALTER TABLE public.pending_customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view pending customers"
ON public.pending_customers
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can insert pending customers"
ON public.pending_customers
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update pending customers"
ON public.pending_customers
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete pending customers"
ON public.pending_customers
FOR DELETE
TO authenticated
USING (true);
